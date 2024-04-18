import { Component, Input } from '@angular/core';
import type { Metric } from '../metrics.service';
import { ModalController } from '@ionic/angular';
import { MetricModalViewComponent } from '../modal-view/modal-view.component';
@Component({
  selector: 'app-metric-card',
  templateUrl: './metric-card.component.html',
  styleUrls: ['./metric-card.component.scss'],
})
export class MetricComponent {
  @Input() data: Metric;
  @Input() index: number;

  constructor(private modalController: ModalController) { }

  async openModal() {
    const modal = await this.modalController.create({
      component: MetricModalViewComponent,
      backdropDismiss: false,
      cssClass: 'metric-detail-view-popup',
      animated: true,
      componentProps: {
        data: this.data,
      },
    });

    await modal.present();
  }

  getRequirementIndicatorColor(requirement: string): string {
    switch (requirement) {
      case 'required':
        return 'danger';
      case 'recommanded':
        return 'warning';
      case 'not required':
        return 'medium';
      default:
        return 'danger';
    }
  }
}
