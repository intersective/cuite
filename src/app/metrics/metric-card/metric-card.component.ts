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
  @Input() isInstitute: boolean = false;

  constructor(private modalController: ModalController) { }

  async openModal() {
    const modal = await this.modalController.create({
      component: MetricDetailComponent,
      backdropDismiss: false,
      cssClass: 'metric-detail-view-popup',
      animated: true,
      componentProps: {
        metric: this.data,
      },
    });

    await modal.present();
  }

  getRequirementIndicatorColor(): string {
    switch (this.data.requirement) {
      case 'required':
        return 'danger';
      case 'recommanded':
        return 'warning';
      case 'not_required':
        return 'medium';
      default:
        return 'danger';
    }
  }
  getConfigarationStatusClass() {
    if(this.data.dataSourceId) {
      return "danger";
    } else {
      return "NOT CONFIGURED";
    }
  }
}
