import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { UpdateMetricComponent } from '../update-metric/update-metric.component';
import { Metric, MetricsService } from '../metrics.service';
import { first } from 'rxjs';
import { MetricConfigureComponent } from '../metric-configure/metric-configure.component';

@Component({
  selector: 'app-metric-detail',
  templateUrl: './metric-detail.component.html',
  styleUrls: ['./metric-detail.component.scss']
})
export class MetricDetailComponent implements OnInit {
  from: 'institution' | 'experience' | 'library' | null = null;
  metric: Metric;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private metricsService: MetricsService,
  ) { }

  ngOnInit() {
    if (this.from === 'experience') {
      this.metricsService.getAssessments().pipe(first()).subscribe();
    }
  }

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
      });
    });
  }

  useMetric(requirement) {
    this.metricsService.useMetric(this.metric, requirement).subscribe({
      complete: () => {
        this.dismissModal();
        this.metricsService.getMetrics(this.from === 'library').pipe(first()).subscribe();
      }
    });
  }

  archiveMetric() {
  }

  async configureMetric() {
    const configureModal = await this.modalController.create({
      component: MetricConfigureComponent,
      componentProps: {
        metric: this.metric,
        from: this.from,
      },
    });

    configureModal.present();
    configureModal.onDidDismiss().then(async (res) => {
      const toast = await this.toastController.create({
        message: 'Metric configured successfully.',
        duration: 1500,
        position: 'top',
        color: 'success',
      });

      await toast.present();

      if (res?.data?.configureMetric?.success === true) {
        this.metricsService.getMetrics(this.from === 'library').pipe(first()).subscribe();
      }
    });
  }

  calculateMetric() {
  }
}
