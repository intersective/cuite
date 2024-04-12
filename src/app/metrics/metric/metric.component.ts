import { Component, Input } from '@angular/core';
import type { Metric } from '../metrics.service';
import { ModalController } from '@ionic/angular';
import { MetricDetailComponent } from '../metric-detail/metric-detail.component';
@Component({
  selector: 'app-metric',
  templateUrl: './metric.component.html',
  styleUrls: ['./metric.component.css'],
})
export class MetricComponent {
  @Input() data: Metric;
  @Input() index: number;

  constructor(private modalController: ModalController) {}

  async openMetricDetailModal(metric: Metric) {
    const modal = await this.modalController.create({
      component: MetricDetailComponent,
      componentProps: { metric }
    });
    return await modal.present();
  }
}
