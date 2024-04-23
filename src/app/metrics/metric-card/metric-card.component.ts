import { Component, Input } from '@angular/core';
import type { Metric } from '../metrics.service';
import { ModalController } from '@ionic/angular';
import { MetricDetailComponent } from '../metric-detail/metric-detail.component';
@Component({
  selector: 'app-metric-card',
  templateUrl: './metric-card.component.html',
  styleUrls: ['./metric-card.component.scss'],
})
export class MetricComponent {
  @Input() data: Metric;
  @Input() index: number;
  @Input() from: 'experience' | 'institution' | null; // indicate metric category 

  constructor(private modalController: ModalController) { }

  async openModal(data) {
    const modal = await this.modalController.create({
      component: MetricDetailComponent,
      backdropDismiss: false,
      cssClass: 'metric-detail-view-popup',
      animated: true,
      componentProps: {
        metric: data,
        from: this.from,
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
