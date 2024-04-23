import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UpdateMetricComponent } from '../update-metric/update-metric.component';
import { Metric } from '../metrics.service';

@Component({
  selector: 'app-metric-detail',
  templateUrl: './metric-detail.component.html',
  styleUrls: ['./metric-detail.component.scss']
})
export class MetricDetailComponent {
  from: 'institution' | 'experience' | null = null;
  metric: Metric;

  constructor(private modalController: ModalController) { }

  dismissModal() {
    this.modalController.dismiss();
  }

  async onSelectAction(event: any) {
    const action = event.detail.value;
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
