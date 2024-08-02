import { Component, OnInit, Input } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import * as shape from 'd3-shape';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent {
  @Input() type: string;
  @Input() maxHeight: string;
  @Input() data: any[];
  @Input() xAxisTicks: any[];
  @Input() yAxisTicks: any[];
  @Input() legendTitle: string;
  @Input() yScaleMax: number;
  curve = shape.curveBasis;
  colorScheme: Color = {
    name: '',
    domain: [
      '#2bbfd4'
    ],
    selectable: null,
    group: ScaleType.Ordinal,
  };
  constructor() { }

}
