import {Component, Input, OnInit} from '@angular/core';
import {Template} from '../../template-library/template-library.service';

@Component({
  selector: 'app-template-card',
  templateUrl: './template-card.component.html',
  styleUrls: ['./template-card.component.scss'],
})
export class TemplateCardComponent {

  @Input() template: Template;
  @Input() skeleton = false;

  constructor() { }

}
