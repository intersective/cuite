import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Metric, MetricsService } from '../metrics.service';
import { ModalController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-update-metric',
  templateUrl: './update-metric.component.html',
  styleUrls: ['./update-metric.component.css']
})
export class UpdateMetricComponent implements AfterViewInit, OnDestroy {
  metric: Metric; // metric object from ModelController
  metricForm: FormGroup;
  unsubscribe$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private metricsService: MetricsService,
    private modalController: ModalController,
  ) {
    this.metricForm = this.formBuilder.group({
      id: [''],
      uuid: [''],
      name: [''],
      description: [''],
      dataSource: [''],
      aggregation: [''],
      dataType: [''],
      filterType: ['role'],
      filterValue: [''],
      isPublic: [false],
      requirement: [''],
      status: ['']
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit() {
    console.log(this.metric);
    
    if (this.metric) {
      this.metricForm.patchValue(this.metric);
    }
  }

  saveMetric() {
    if (this.metricForm.valid) {
      if (this.metricForm.value.uuid) {
        return this.metricsService.saveMetric(this.metricForm.value).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
          this.dismissModal();
        });
      }

      return this.metricsService.createMetric(this.metricForm.value).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
        this.dismissModal();
      });
    }
  }

  dismissModal() {
    this.metricsService.getMetrics().pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.modalController.dismiss();
    });
  }
}
