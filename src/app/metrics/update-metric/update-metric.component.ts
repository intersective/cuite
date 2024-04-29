import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Metric, MetricsService } from '../metrics.service';
import { ModalController, ToastController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'app-update-metric',
  templateUrl: './update-metric.component.html',
  styleUrls: ['./update-metric.component.scss']
})
export class UpdateMetricComponent implements AfterViewInit, OnDestroy {
  metric: Metric; // metric object from ModelController
  metricForm: FormGroup;
  filterRolesFormGroup: FormGroup;
  filterStatusesFormGroup: FormGroup;
  unsubscribe$ = new Subject<void>();

  filterRoles = ['participant', 'mentor', 'admin', 'coordinator'];
  filterStatuses = ['active', 'dropped'];
  statuses = ['draft', 'active', 'archived'];
  requirements = ['required', 'recommended', 'not_required'];
  aggregations = ['count', 'sum', 'average'];

  // from modal properties
  from: 'institution' | 'experience' | null = null;
  
  constructor(
    private formBuilder: FormBuilder,
    private metricsService: MetricsService,
    private modalController: ModalController,
    private notificationService: NotificationService,
    private toastController: ToastController,
  ) {
    this.metricForm = this.formBuilder.group({
      id: [''],
      uuid: [''],
      name: ['', Validators.required],
      description: [''],
      dataSource: [''],
      aggregation: ['', Validators.required],
      filterRole: [[]],
      filterStatus: [[]],
      isPublic: [false],
      requirement: ['', Validators.required],
      status: ['']
    });

    this.filterRolesFormGroup = this.formBuilder.group(this.filterRoles.reduce((acc, role) => {
      acc[role] = [false];
      return acc;
    }, {}));

    // this.filterStatuses values
    this.filterStatusesFormGroup = this.formBuilder.group(this.filterStatuses.reduce((acc, status) => {
      acc[status] = [false];
      return acc;
    }, {}));
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit() {
    if (this.metric) {
      this.metricForm.patchValue(this.metric);
      this.filterRoles.forEach(role => {
        if (this.metric.filterRole.includes(role)) {
          this.filterRolesFormGroup.get(role).patchValue(true);
        }
      });
      this.filterStatuses.forEach(status => {
        if (this.metric.filterStatus.includes(status)) {
          this.filterStatusesFormGroup.get(status).patchValue(true);
        }
      });
    }
  }

  saveMetric() {
    if (this.metricForm.valid) {
      const roles = Object.keys(this.filterRolesFormGroup.value).filter(key => this.filterRolesFormGroup.value[key]);
      const statuses = Object.keys(this.filterStatusesFormGroup.value).filter(key => this.filterStatusesFormGroup.value[key]);
      this.metricForm.patchValue({
        filterRole: roles,
        filterStatus: statuses,
      });
      
      if (this.metricForm.value.uuid) {

        return this.metricsService.saveMetric(this.metricForm.value)
        .pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
          this.dismissModal();
          this.toastController.create({
            message: 'Metric added successfully.',
            duration: 1500,
            position: 'top',
            color: 'success',
          }).then(toast => toast.present());
        });
      }

      return this.metricsService.createMetric(this.metricForm.value).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
        this.dismissModal();

        this.toastController.create({
          message: 'Metric updated successfully.',
          duration: 1500,
          position: 'top',
          color: 'success',
        }).then(toast => toast.present());
      });
    }

    return this.notificationService.alert({
      header: 'Invalid Form',
      message: 'Please fill out all required fields',
      buttons: ['OK']
    });
  }

  async dismissModal() {
    await this.modalController.dismiss();
  }
}
