import { Component, OnInit } from '@angular/core';
import { Metric, MetricsService } from '../metrics.service';
import { UpdateMetricComponent } from '../update-metric/update-metric.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-metrics-admin',
  templateUrl: './metrics-admin.component.html',
  styleUrls: ['./metrics-admin.component.scss']
})
export class MetricsAdminComponent implements OnInit {
  metrics: Metric[] = [];
  constructor(
    private metricsService: MetricsService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.getMetrics();
  }

  getMetrics() {
    this.metricsService.getMetrics(true).subscribe((response: any) => {
      this.metrics = response;
    });
  }

  addMetric() {
    this.modalController.create({
      component: UpdateMetricComponent,
    }).then(modal => {
      modal.present();
    });
  }

  editMetric(data: Metric) {
    this.modalController.create({
      component: UpdateMetricComponent,
      componentProps: {
        metric: data
      }
    }).then(modal => {
      modal.present();
    });
  }

  deleteMetric(data: Metric) {
    throw new Error('Method not implemented.');
  }
}
