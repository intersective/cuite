import { Component, OnInit } from '@angular/core';
import { MetricsService, type Metric } from '@app/metrics/metrics.service';
import { ModalController, ToastController } from '@ionic/angular';
import { UpdateMetricComponent } from '../update-metric/update-metric.component';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, distinctUntilChanged, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-metrics-institute',
  templateUrl: './metrics-institute.component.html',
  styleUrls: ['./metrics-institute.component.scss']
})
export class MetricsInstituteComponent implements OnInit {
  metrics: Metric[] = [];
  unsubscribe$: Subject<void> = new Subject<void>();
  isLoading = false;

  constructor(
    private metricsService: MetricsService,
    private modalController: ModalController,
    private router: Router,
    private toastController: ToastController
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      filter((event: NavigationEnd) => event.urlAfterRedirects === '/metrics/institution'),
      takeUntil(this.unsubscribe$),
    ).subscribe((e) => {
      this.fetchData();
    });
  }

  ngOnInit() {
    this.metricsService.metrics$.subscribe((metrics) => {
      this.metrics = metrics;
    });
    this.fetchData();
  }

  async fetchData() {
    this.isLoading = true;

    // Institution metrics: publicOnly = false
    this.metricsService.getMetrics(false).subscribe({
      error: async (_error) => {
        const toast = await this.toastController.create({
          color: 'warning',
          message: 'Failed to load metrics, please refresh and try again.',
          duration: 2000
        });
        await toast.present();
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  addNew() {
    this.modalController.create({
      component: UpdateMetricComponent,
      componentProps: {
        from: 'institution',
      },
    }).then(modal => {
      modal.present();
      modal.onDidDismiss().then(() => {
        this.fetchData();
      });
    });
  }

  goToLibrary() {
    this.router.navigate(['/metrics/library']);
  }
}
