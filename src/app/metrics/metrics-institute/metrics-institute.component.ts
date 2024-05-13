import { UtilsService } from './../../shared/services/utils.service';
import { Component, OnInit } from '@angular/core';
import { MetricsService, type Metric } from '@app/metrics/metrics.service';
import { ModalController } from '@ionic/angular';
import { UpdateMetricComponent } from '../update-metric/update-metric.component';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { PopupService } from '@shared/popup/popup.service';

@Component({
  selector: 'app-metrics-institute',
  templateUrl: './metrics-institute.component.html',
  styleUrls: ['./metrics-institute.component.scss']
})
export class MetricsInstituteComponent implements OnInit {
  metrics: Metric[] = [];
  unsubscribe$: Subject<void> = new Subject<void>();
  isLoading = false;
  isDownloading = false;

  constructor(
    private metricsService: MetricsService,
    private modalController: ModalController,
    private router: Router,
    private popupService: PopupService,
    private utilService: UtilsService,
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
        await this.popupService.showToast(
          'Failed to load metrics, please refresh and try again.',
          { color: 'warning' },
        );
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

  async openStatusInfoPopover(e: Event) {
    this.popupService.openMetricStatusInfoPopover(e);
  }

  async download() {
    this.isDownloading = true;
    this.metricsService.downloadInstitution().subscribe({
      next: (response) => {
        const metrics = response.metrics;
        const headers = ['Metric', 'Description', 'Agg Method'];
        const experienceNames = new Set<string>();

        // Collect unique experience names for dynamic columns
        metrics.forEach(metric => {
          metric.experiencesRecords.forEach(record => {
            experienceNames.add(record.experienceName);
          });
        });

        // Add experience names as headers
        experienceNames.forEach(name => {
          headers.push(`${name}\tValue`, `${name}\tCount`);
        });

        const output = metrics.map(metric => {
          const row = {
            'Metric': metric.name,
            'Description': metric.description,
            'Agg Method': metric.aggregation,
          };

          // Initialize columns for each experience
          experienceNames.forEach(name => {
            row[`${name}\tValue`] = 0;
            row[`${name}\tCount`] = 0;
          });

          // Aggregate values from metric records
          metric.experiencesRecords.forEach(record => {
            row[`${record.experienceName}\tValue`] += parseFloat(record.value);
            row[`${record.experienceName}\tCount`] += record.count;
          });

          return row;
        });

        this.utilService.generateXLSX(output, headers, 'institution_metrics_report.xlsx');
        this.isDownloading = false;
      },
      error: async (_error) => {
        await this.popupService.showToast('Failed to download metrics, please try again.', { color: 'warning' });
        this.isDownloading = false;
      }
    });
  }
}
