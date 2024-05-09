import { Component, Input, OnInit } from '@angular/core';
import { Metric, MetricAssessment, MetricsService } from '../metrics.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-metric-configure',
  templateUrl: './metric-configure.component.html',
  styleUrls: ['./metric-configure.component.css']
})
export class MetricConfigureComponent implements OnInit {
  assessments: MetricAssessment[] = [];
  normalisedAsmt = {};
  questions: any[] = [];

  @Input() metric: Metric; // pass from modal controller
  configureForm: FormGroup;
  assessmentSelection = {
    header: 'Assessments',
    subHeader: 'Select an assessment',
  };
  questionSelection = {
    header: 'Questions',
    subHeader: 'Select a question to link',
    message: 'Choose one',
  };
  isQuestionDisabled = true;

  constructor(
    private metricsService: MetricsService,
    private fb: FormBuilder,
    private modalController: ModalController,
  ) {
    this.configureForm = this.fb.group({
      assessmentId: [''],
      questionId: ['', { disabled: true }],
    });
  }

  ngOnInit() {
    this.metricsService.assessments$.subscribe((assessments) => {
      this.assessments = assessments;
      this.normalisedAsmt = assessments.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {});
    });
    if (this.metric.dataSourceId) {
      this.configureForm.get('questionId').setValue(this.metric.dataSourceId);
    }

    this.configureForm.get('assessmentId').valueChanges.subscribe(assessmentId => {
      const questionControl = this.configureForm.get('questionId');
      
      if (!assessmentId) {
        questionControl.setValue('');
        questionControl.disable();
        this.isQuestionDisabled = true;
      } else {
        this.questions = this.normalisedAsmt[assessmentId].questions;
        questionControl.enable();
        this.isQuestionDisabled = false;
      }
    });
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
