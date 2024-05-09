import { Component, OnInit } from '@angular/core';
import { MetricsService, type Metric } from '@app/metrics/metrics.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { UpdateMetricComponent } from '../update-metric/update-metric.component';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, distinctUntilChanged, filter, takeUntil } from 'rxjs';
import { PopupService } from '@shared/popup/popup.service';

@Component({
  selector: 'app-metrics-institute',
  templateUrl: './metrics-institute.component.html',
  styleUrls: ['./metrics-institute.component.scss']
})
export class MetricsInstituteComponent implements OnInit {
  metrics: Metric[] = [];
  unsubscribe$: Subject<void> = new Subject<void>();
  loading = false;

  constructor(
    private metricsService: MetricsService,
    private modalController: ModalController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private popupService: PopupService
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
    this.loading = true;
    const loading = await this.loadingCtrl.create({
      message: 'Loading metrics...',
    });
    await loading.present();

    // Institution metrics: publicOnly = false
    this.metricsService.getMetrics(false).subscribe({
      error: (error) => {
        console.error('Error fetching data:', error);
        loading.dismiss();
      },
      complete: () => {
        loading.dismiss();
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

  async openStatusInfoPopover(e: Event) {
    this.popupService.openMetricStatusInfoPopover(e);
  }
}
