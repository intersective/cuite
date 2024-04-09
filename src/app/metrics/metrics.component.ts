import { Component, OnInit } from '@angular/core';
import { MetricDetailComponent } from './metric-detail/metric-detail.component';
import { ModalController } from '@ionic/angular';
import { Metric, MetricsService } from './metrics.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css']
})
export class MetricsComponent implements OnInit {
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

  // Inside your component class
  async openMetricDetailModal(metric) {
    const modal = await this.modalController.create({
      component: MetricDetailComponent,
      componentProps: { metric: metric }
    });
    return await modal.present();
  }
}
