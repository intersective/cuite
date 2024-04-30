import { Component, OnDestroy, OnInit } from '@angular/core';
import { MetricsService, type Metric } from '@app/metrics/metrics.service';
import { Subject, takeUntil, map, first } from 'rxjs';
import { UpdateMetricComponent } from './update-metric/update-metric.component';
import { ModalController, ToastController } from '@ionic/angular';
import { UtilsService } from '@app/shared/services/utils.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss'],
})
export class MetricsComponent implements OnInit, OnDestroy {
  metrics: Metric[] = [];
  unsubscribe$ = new Subject<void>();

  constructor(
    private metricsService: MetricsService,
    private modalController: ModalController,
    private toastController: ToastController,
    private utils: UtilsService,
  ) {}

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    this.fetchData();
    this.metricsService.metrics$.pipe(
      map((metrics) => metrics.filter((metric) => metric.status === 'active')),
      takeUntil(this.unsubscribe$)
    )
    .subscribe((metrics) => {
      this.metrics = metrics;
    });
  }

  fetchData() {
    this.metricsService.getMetrics(false).pipe(takeUntil(this.unsubscribe$)).subscribe({
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }

  addNew() {
    this.modalController.create({
      component: UpdateMetricComponent,
      componentProps: {
        from: 'experience',
      },
    }).then(modal => {
      modal.present();
      modal.onDidDismiss().then(() => {
        this.fetchData();
      });
    });
  }

  calculateAll() {
    const metricsUuids = this.metrics.map((metric) => metric.uuid);
    this.metricsService.calculate(metricsUuids).pipe(first()).subscribe({
      next: res => {
        this.toastController.create({
          message: res?.calculateMetrics?.message || 'Metric calculated.',
          duration: 1500,
          position: 'top',
        }).then(toast => toast.present());
        this.metricsService.getMetrics(false).pipe(first()).subscribe();
      },
      error: error => {
        this.toastController.create({
          message: error.message,
          duration: 1500,
          position: 'top',
          color: 'danger',
        }).then(toast => toast.present());
      }
    });
  }
  
  download() {
    this.metricsService.download().pipe(first()).subscribe({
      next: response => {
        const metrics = response.metrics;

        const headers = [
          "Metric ID", "UUID", "Metric Name", "Description", "Public Status",
          "Aggregation Method", "Requirement Level", "Current Status", "Roles", "Status Filters",
          "Data Source Type", "Data Source ID", "Assessment ID", "Assessment Name",
          "Question ID", "Question Name"
        ];

        const dataRows = metrics.map(metric => ([
          metric.id,
          metric.uuid,
          metric.name,
          metric.description,
          metric.isPublic ? "Yes" : "No",
          metric.aggregation,
          metric.requirement,
          metric.status,
          metric.filterRole.join(';'), // Combine arrays into a single string
          metric.filterStatus.join(';'),
          metric.dataSource,
          metric.dataSourceId,
          metric.assessment ? metric.assessment.id : "",
          metric.assessment ? metric.assessment.name : "",
          metric.assessment && metric.assessment.question ? metric.assessment.question.id : "",
          metric.assessment && metric.assessment.question ? metric.assessment.question.name : ""
        ]));

        const formattedData = [headers, ...dataRows];
        return this.utils.generateXLSX(formattedData);
      }
    });
  }
}

