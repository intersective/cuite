import { Component, OnDestroy, OnInit } from '@angular/core';
import { MetricsService, type Metric } from '@app/metrics/metrics.service';
import { Subject, takeUntil, map } from 'rxjs';
import { UpdateMetricComponent } from './update-metric/update-metric.component';
import { ModalController } from '@ionic/angular';

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
    private modalController: ModalController,) {}

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

  addMetric() {
    this.modalController.create({
      component: UpdateMetricComponent,
    }).then(modal => {
      modal.present();
    });
  }
}

