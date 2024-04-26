import { Component, OnInit } from '@angular/core';
import { MetricsService, type Metric } from '@app/metrics/metrics.service';
import { ModalController, ToastController } from '@ionic/angular';
import { UpdateMetricComponent } from '../update-metric/update-metric.component';
import { first } from 'rxjs';

@Component({
  selector: 'app-metrics-institute',
  templateUrl: './metrics-institute.component.html',
  styleUrls: ['./metrics-institute.component.scss']
})
export class MetricsInstituteComponent implements OnInit {
  metrics: Metric[] = [];

  constructor(
    private metricsService: MetricsService,
    private modalController: ModalController,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.metricsService.metrics$.subscribe((metrics) => {
      this.metrics = metrics;
    });
    this.fetchData();
  }

  fetchData() {
    // Institution metrics: publicOnly = false
    this.metricsService.getMetrics(false).subscribe({
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }

  addNew() {
    this.modalController.create({
      component: UpdateMetricComponent,
      componentProps: {
        from: 'institution',
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
    // this.metricsService.downloadMetrics();
  }
}
