import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-empty-results',
  templateUrl: './empty-results.component.html',
  styleUrls: ['./empty-results.component.scss'],
})
export class EmptyResultsComponent {

  @Input() emptyResultsString = 'Could not find any templates';

  constructor() { }

}
