import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Template } from '@app/onboarding/onboarding.service';
import { AnalyticsService } from '@app/shared/services/analytics.service';

import { UtilsService } from '@services/utils.service';

@Component({
  selector: 'app-onboarding-template-detail',
  templateUrl: './onboarding-template-detail.component.html',
  styleUrls: ['./onboarding-template-detail.component.scss'],
})
export class OnboardingTemplateDetailComponent{

  @Input() template: Template;
  @Output() durationChange = new EventEmitter();
  projectIndex = 0;
  durationIndex = 0;

  constructor(
    public utils: UtilsService,
    private analytics: AnalyticsService
  ) { }

  get briefsCount() {
    if (!this.template ||
        !this.template.projects ||
        !this.template.projects[this.projectIndex]) {
      return 0;
    }
    return this.template.projects[this.projectIndex].briefsCount || 0;
  }

  changeDuration() {
    this.analytics.track('Change', {
      category: `OBG - Learning Design Duration`,
      label: this.template.projects[this.durationIndex].duration
    });
    this.durationChange.emit(this.durationIndex);
  }

}
