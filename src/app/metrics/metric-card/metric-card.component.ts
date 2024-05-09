import { MetricsService } from '@app/metrics/metrics.service';
import { Component, Input } from '@angular/core';
import { first } from 'rxjs';
import type { Metric } from '../metrics.service';
import { ModalController } from '@ionic/angular';
import { MetricDetailComponent } from '../metric-detail/metric-detail.component';
import { Router } from '@angular/router';
import { UtilsService } from '@services/utils.service';
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
    private router: Router,
    private utill: UtilsService
  ) { }

  async openModal() {
    const modal = await this.modalController.create({
      component: MetricDetailComponent,
      backdropDismiss: false,
      cssClass: 'non-fullscreen-modal',
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

  useMetric() {
    this.metricsService.useMetric(this.data, 'not_required').subscribe({
      complete: () => {
        this.metricsService.getMetrics(this.from === 'library').pipe(first()).subscribe();
        this.router.navigate(['metrics', 'institution']);
      }
    });
  }

  calculatePercentage() {
    return this.utill.calculateMetricValuePercentage(this.data.lastRecord.value, this.data.maxValue);
  }

  getStatusIcon(status: string): string {
    return this.utill.getMetricStatusIcon(status);
  }

}
