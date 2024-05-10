import { Component, OnDestroy, OnInit } from '@angular/core';
import { MetricsService, type Metric } from '@app/metrics/metrics.service';
import { Subject, takeUntil, map, first, filter, distinctUntilChanged } from 'rxjs';
import { UpdateMetricComponent } from './update-metric/update-metric.component';
import { ModalController } from '@ionic/angular';
import { UtilsService } from '@app/shared/services/utils.service';
import { NavigationEnd, Router } from '@angular/router';
import { PopupService } from '@shared/popup/popup.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss'],
})
export class MetricsComponent implements OnInit, OnDestroy {
  metrics: Metric[] = [];
  unsubscribe$ = new Subject<void>();
  isLoading = false;

  constructor(
    private metricsService: MetricsService,
    private modalController: ModalController,
    private utils: UtilsService,
    private router: Router,
    private popupService: PopupService
  ) {
    // subscribe to router and once this route activated will trigger fetch
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      filter((event: NavigationEnd) => event.urlAfterRedirects === '/metrics/institute'),
      takeUntil(this.unsubscribe$),
    ).subscribe((e) => {
      this.fetchData();
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    this.fetchData();
    this.metricsService.metrics$
    .subscribe((metrics) => {
      this.metrics = metrics;
    });
  }

  async fetchData() {
    this.isLoading = true;
      
    this.metricsService.getMetrics(false).pipe(takeUntil(this.unsubscribe$)).subscribe({
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
        from: 'experience',
      },
    }).then(modal => {
      modal.present();
      modal.onDidDismiss().then(() => {
        this.fetchData();
      });
    });
  }

  calculateAll() {
    // should only calculate “active” “configured” metrics.
    // can't calculate not configured onces.
    const metricsUuids = this.metrics.map((metric) => {
      if(metric.status === 'active' && metric.dataSourceId) {
        return metric.uuid;
      }
    });
    this.metricsService.calculate(metricsUuids).pipe(first()).subscribe({
      next: async res => {
        await this.popupService.showToast(
          res?.calculateMetrics?.message || 'Metric calculated.',
          { color: 'primary' },
        );
        this.metricsService.getMetrics(false).pipe(first()).subscribe();
      },
      error: async error => {
        await this.popupService.showToast(
          error.message,
          { color: 'danger' },
        );
      }
    });
  }

  private _formatDate(timestamp) {
    const date = new Date(parseInt(timestamp));
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }
  
  // Capitalize the first letter of a string
  private _ucFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // generate a CSV file for download
  download() {
    this.metricsService.download().pipe(first()).subscribe({
      next: response => {
        const metrics = response.metrics.filter(m => m.dataSourceId);

        const allDates = new Set();
        metrics.forEach(metric => {
          metric.records.forEach(record => {
            const date = this._formatDate(record.created);
            allDates.add(date);
          });
        });

        const sortedDates = Array.from(allDates).sort((a: any, b: any) => {
          return new Date(a).getTime() - new Date(b).getTime();
        });
        const headers = ['Metric', 'Description', 'Agg Method'];
        sortedDates.forEach(date => {
          headers.push(`${date}\nValue`);
          headers.push(`${date}\nCount`);
        });

        const output = metrics.map(metric => {
          const row = {
            'Metric': metric.name,
            'Description': metric.description,
            'Agg Method': this._ucFirst(metric.aggregation),
          };

          // Initialize each date with default values
          sortedDates.forEach(date => {
            row[`${date}\nValue`] = '';
            row[`${date}\nCount`] = '';
          });

          // group data by date
          metric.records.forEach(record => {
            const date = this._formatDate(record.created);
            row[`${date}\nValue`] += record.value;
            row[`${date}\nCount`] += record.count;
          });

          return row;
        });

        return this.utils.generateXLSX(output, headers);
      }
    });
  }

  async openStatusInfoPopover(e: Event) {
    this.popupService.openMetricStatusInfoPopover(e);
  }
}

