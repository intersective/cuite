import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-resource-download-card',
  templateUrl: './resource-download-card.component.html',
  styleUrls: ['./resource-download-card.component.scss'],
})
export class ResourceDownloadCardComponent {

  @Input() skeleton = false;
  @Input() prompt: string;
  @Input() leadImage: string;
  @Input() src: string;

  constructor() { }

}
