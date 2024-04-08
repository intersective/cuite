import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MetricsService } from '../metrics.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-update-metric',
  templateUrl: './update-metric.component.html',
  styleUrls: ['./update-metric.component.css']
})
export class UpdateMetricComponent implements AfterViewInit {
  metric: any; // metric object from ModelController
  metricForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private metricsService: MetricsService,
    private modalController: ModalController,
  ) {
    this.metricForm = this.formBuilder.group({
      name: [''],
      description: [''],
      dataSource: [''],
      aggregation: [''],
      filterType: [''],
      filterValue: [''],
      isPublic: [false],
    });
    
  }

  ngAfterViewInit() {
    console.log(this.metric);
    
    // Assuming `metric` is the data you pass when opening this modal
    const metric = this.modalController.getTop().then(modal => {
      if (modal && modal.componentProps && modal.componentProps.metric) {
        this.metricForm.patchValue(modal.componentProps.metric);
      }
    });
  }

  saveMetric() {
    if (this.metricForm.valid) {
      this.metricsService.saveMetric(this.metricForm.value).subscribe(() => {
        this.dismissModal();
      });
    }
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
