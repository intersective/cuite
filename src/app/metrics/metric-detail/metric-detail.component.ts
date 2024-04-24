import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UpdateMetricComponent } from '../update-metric/update-metric.component';
import { Metric, MetricsService } from '../metrics.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-metric-detail',
  templateUrl: './metric-detail.component.html',
  styleUrls: ['./metric-detail.component.scss']
})
export class MetricDetailComponent {
  from: 'institution' | 'experience' | null = null;
  metric: Metric;

  constructor(
    private modalController: ModalController,
    private metricsService: MetricsService,
  ) { }

  dismissModal() {
    this.modalController.dismiss();
  }

  getColor(status: string) {
    return this.metricsService.color(status);
  }

  action(action: string) {
    switch (action) {
      case 'edit':
        this.editMetric();
        break;
      case 'calculate':
        this.calculateMetric();
        break;
      case 'archive':
        this.archiveMetric();
        break;
      case 'configure':
        this.configureMetric();
        break;
      default:
        console.log('Action not recognized');
    }
  }

  editMetric() {
    this.modalController.create({
      component: UpdateMetricComponent,
      componentProps: {
        metric: this.metric,
        from: this.from,
      },
    }).then(modal => {
      modal.present();
      modal.onDidDismiss().then(() => {
        this.dismissModal();
        this.metricsService.getMetrics().pipe(first()).subscribe();
      });
    });
  }

  archiveMetric() {
  }

  configureMetric() {
  }

  calculateMetric() {
  }
}
