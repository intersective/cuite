import { Component, OnInit } from '@angular/core';
import { Metric, MetricAssessment, MetricsService } from '../metrics.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { first } from 'rxjs';

@Component({
  selector: 'app-metric-configure',
  templateUrl: './metric-configure.component.html',
  styleUrls: ['./metric-configure.component.css']
})
export class MetricConfigureComponent implements OnInit {
  assessments: MetricAssessment[] = [];
  metric: Metric; // pass from modal controller
  configureForm: FormGroup;

  constructor(
    private metricsService: MetricsService,
    private fb: FormBuilder,
    private modalController: ModalController,
  ) {
    this.configureForm = this.fb.group({
      questionId: [''],
    });
  }

  ngOnInit() {
    this.metricsService.assessments$.subscribe((assessments) => {
      this.assessments = assessments;
    });
    this.configureForm.get('questionId').setValue(this.metric.dataSourceId);
  }

  configure(questionId, event) {
    this.metricsService.configure(this.metric.uuid, questionId).subscribe((res) => {
      this.modalController.dismiss({ 
        dismissed: true,
        data: res,
      });
    });
  }

  selectedText(assessment) {
    return this.configureForm.get('questionId').value === assessment;
  }
}
