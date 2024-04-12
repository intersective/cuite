import { Component, Input } from '@angular/core';
import type { Metric } from '../metrics.service';
import { ModalController } from '@ionic/angular';
import { MetricModalViewComponent } from '../modal-view/modal-view.component';
@Component({
  selector: 'app-metric',
  templateUrl: './metric.component.html',
  styleUrls: ['./metric.component.css'],
})
export class MetricComponent {
  @Input() data: Metric;
  @Input() index: number;

  constructor(private modalController: ModalController) {}

  async openModal() {
    const modal = await this.modalController.create({
      component: MetricModalViewComponent,
      componentProps: {
        data: this.data,
      },
    });

    await modal.present();
  }
}
