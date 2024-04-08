import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Metric, MetricsService } from '../metrics.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-update-metric',
  templateUrl: './update-metric.component.html',
  styleUrls: ['./update-metric.component.css']
})
export class UpdateMetricComponent implements AfterViewInit {
  metric: Metric; // metric object from ModelController
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
      dataType: [''],
      filterType: [''],
      filterValue: [''],
      isPublic: [false],
      isRequired: [''], // requirement
      calculationFrequency: [''],  // metricCalculationFrequency
      status: ['']
    });
    
  }

  ngAfterViewInit() {
    console.log(this.metric);
    
    if (this.metric) {
      this.metricForm.patchValue(this.metric);
    }
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
