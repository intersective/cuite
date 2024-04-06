import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MetricsService } from '../metrics.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-update-metric',
  templateUrl: './update-metric.component.html',
  styleUrls: ['./update-metric.component.css']
})
export class UpdateMetricComponent {
  metricForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private metricsService: MetricsService,
    private modalController: ModalController,
  ) {
    this.metricForm = this.formBuilder.group({
      metricTitle: [''],
      metricDescription: [''],
      metricDataType: [''],
      metricAggregationTechnique: [''],
      metricFilter: [''],
      metricCalculationFrequency: [''],
      metricIsRequired: [false],
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
