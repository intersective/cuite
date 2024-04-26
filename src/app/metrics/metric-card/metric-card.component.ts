import { MetricsService } from '@app/metrics/metrics.service';
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
  @Input() from: 'experience' | 'institution' | 'library' | null; // indicate metric category 

  constructor(
    private modalController: ModalController,
    private metricsService: MetricsService,
  ) { }

  async openModal() {
    const modal = await this.modalController.create({
      component: MetricDetailComponent,
      backdropDismiss: false,
      cssClass: 'metric-detail-view-popup',
      animated: true,
      componentProps: {
        metric: this.data,
        from: this.from,
      },
    });

    await modal.present();
  }

  getRequirementIndicatorColor(): string {
    return this.metricsService.color(this.data.requirement);
  }

  getConfigarationStatusClass() {
    if (this.data.dataSourceId) {
      return "danger";
    } else {
      return "NOT CONFIGURED";
    }
  }
}
