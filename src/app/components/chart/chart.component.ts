import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @Input() type: string;
  @Input() data: any[];
  @Input() legendTitle: string;
  constructor() { }

  ngOnInit() {
  }

}
