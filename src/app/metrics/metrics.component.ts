import { Component, OnDestroy, OnInit } from '@angular/core';
import { MetricsService, type Metric } from '@app/metrics/metrics.service';
import { Subject, takeUntil, map, first } from 'rxjs';
import { UpdateMetricComponent } from './update-metric/update-metric.component';
import { ModalController, ToastController } from '@ionic/angular';
import { UtilsService } from '@app/shared/services/utils.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss'],
})
export class MetricsComponent implements OnInit, OnDestroy {
  metrics: Metric[] = [];
  unsubscribe$ = new Subject<void>();

  constructor(
    private metricsService: MetricsService,
    private modalController: ModalController,
    private toastController: ToastController,
    private utils: UtilsService,
  ) {}

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    this.fetchData();
    this.metricsService.metrics$.pipe(
      map((metrics) => metrics.filter((metric) => metric.status === 'active')),
      takeUntil(this.unsubscribe$)
    )
    .subscribe((metrics) => {
      this.metrics = metrics;
    });
  }

  fetchData() {
    this.metricsService.getMetrics(false).pipe(takeUntil(this.unsubscribe$)).subscribe({
      error: (error) => {
        console.error('Error fetching data:', error);
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
    const metricsUuids = this.metrics.map((metric) => metric.uuid);
    this.metricsService.calculate(metricsUuids).pipe(first()).subscribe({
      next: res => {
        this.toastController.create({
          message: res?.calculateMetrics?.message || 'Metric calculated.',
          duration: 1500,
          position: 'top',
        }).then(toast => toast.present());
        this.metricsService.getMetrics(false).pipe(first()).subscribe();
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

  private _formatDate(timestamp) {
    const date = new Date(parseInt(timestamp));
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  private _processRecords(records) {
    const dateMap = {}; // Key: date, Value: { valueSum, countSum }
    records.forEach(record => {
      const date = this._formatDate(record.created);
      if (!dateMap[date]) {
        dateMap[date] = { value: '', count: '' };
      }
      dateMap[date].value += record.value;
      dateMap[date].count += record.count;
    });
    return dateMap;
  }

  private _ucFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
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
}

