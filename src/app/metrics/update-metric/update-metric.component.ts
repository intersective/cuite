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
  filterRolesFormGroup: FormGroup;
  filterStatusesFormGroup: FormGroup;
  unsubscribe$ = new Subject<void>();

  filterRoles = ['participant', 'mentor', 'admin', 'coordinator'];
  filterStatuses = ['active', 'inactive', 'pending'];


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
      filterRole: this.formBuilder.array([]),
      filterStatus: this.formBuilder.array([]),
      isPublic: [false],
      requirement: [''],
      status: ['']
    });

    this.filterRolesFormGroup = this.formBuilder.group({
      participant: [false],
      mentor: [false],
      admin: [false],
      coordinator: [false]
    });

    this.filterStatusesFormGroup = this.formBuilder.group({
      active: [false],
      inactive: [false],
      pending: [false]
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

  onValueChanges(event) {
    // console.log(event);
    console.log(this.filterRolesFormGroup.value);
    console.log(Object.keys(this.filterRolesFormGroup.value).filter(key => this.filterRolesFormGroup.value[key]));

    // console.log(Object.keys(this.filterStatusesFormGroup.value).filter(key => this.filterStatusesFormGroup.value[key]));

    // this.formBuilder.control(Object.keys(this.filterRolesFormGroup.value).filter(key => this.filterRolesFormGroup.value[key]));
  }

  saveMetric() {
    if (this.metricForm.valid) {
      if (this.metricForm.value.uuid) {
        const roles = Object.keys(this.filterRolesFormGroup.value).filter(key => this.filterRolesFormGroup.value[key]);
        const statuses = Object.keys(this.filterStatusesFormGroup.value).filter(key => this.filterStatusesFormGroup.value[key]);
        this.metricForm.patchValue({
          filterRole: roles,
          filterStatus: statuses,
        });

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
