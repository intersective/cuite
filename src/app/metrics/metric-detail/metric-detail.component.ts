import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { UpdateMetricComponent } from '../update-metric/update-metric.component';
import { Metric, MetricStatus, MetricsService } from '../metrics.service';
import { first } from 'rxjs';
import { MetricConfigureComponent } from '../metric-configure/metric-configure.component';
import { UtilsService } from '@services/utils.service';

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
    private utill: UtilsService,
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
        this.setStatus('archived');
        break;
      case 'configure':
        this.configureMetric();
        break;
      case 'unarchive':
        this.setStatus('active');
        break;
      case 'unlink':
        this.unLinkMetric();
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

  fetchMetrics() {
    this.metricsService.getMetrics(this.from === 'library').pipe(first()).subscribe({
      next: (metrics: Metric[]) => {
        this.metric = metrics.find(metric => metric.uuid === this.metric.uuid);
      },
    });
  }

  setStatus(status: string) {
    this.metricsService.setStatus(this.metric.uuid, MetricStatus[status]).pipe(first()).subscribe({
      next: res => {
        this.toastController.create({
          message: res?.updateMetric?.message || `Metric set to ${status}.`,
          duration: 1500,
          position: 'top',
        }).then(toast => toast.present());
        this.fetchMetrics();
      }
    });
  }

  async configureMetric() {
    const configureModal = await this.modalController.create({
      component: MetricConfigureComponent,
      cssClass: 'non-fullscreen-modal',
      componentProps: {
        metric: this.metric,
        from: this.from,
      },
    });

    configureModal.present();
    configureModal.onDidDismiss().then(async (res) => {
      if (res?.data?.data?.configureMetric?.success === true) {
        const toast = await this.toastController.create({
          message: 'Metric configured successfully.',
          duration: 1500,
          position: 'top',
          color: 'success',
        });
        await toast.present();

        this.fetchMetrics();
      }
    });
  }

  calculateMetric() {
    this.metricsService.calculate([this.metric.uuid]).pipe(first()).subscribe({
      next: res => {
        this.toastController.create({
          message: res?.calculateMetrics?.message || 'Metric calculated.',
          duration: 1500,
          position: 'top',
        }).then(toast => toast.present());
        this.fetchMetrics();
      },
      error: error => {
        this.toastController.create({
          message: error.message,
          duration: 1500,
          position: 'top',
          color: 'danger',
        }).then(toast => toast.present());
      }
    });
  }

  unLinkMetric() {
    this.metricsService.unLinkMetric(this.metric.uuid).pipe(first()).subscribe({
      next: res => {
        this.toastController.create({
          message: 'Metric unlinked from the assessment.',
          duration: 1500,
          position: 'top',
        }).then(toast => toast.present());
        this.fetchMetrics();
        this.dismissModal();
      },
      error: error => {
        this.toastController.create({
          message: error.message,
          duration: 1500,
          position: 'top',
          color: 'danger',
        }).then(toast => toast.present());
      }
    });
  }

  getStatusIcon(status: string): string {
    return this.utill.getMetricStatusIcon(status);
  }

  calculatePercentage() {
    return this.utill.calculateMetricValuePercentage(this.metric.lastRecord.value, this.metric.maxValue);
  }
}
