import { Component, OnInit } from '@angular/core';
import { MetricsService, type Metric } from '@app/metrics/metrics.service';

@Component({
  selector: 'app-metrics-institute',
  templateUrl: './metrics-institute.component.html',
  styleUrls: ['./metrics-institute.component.scss']
})
export class MetricsInstituteComponent implements OnInit {
  metrics: Metric[] = [];

  constructor(private metricService: MetricsService) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.metricService.getMetrics(true).subscribe(
      (response) => {
        this.metrics = response;
      },
      (error) => {
        console.error('Error fetching data:', error);
        // Handle the error
      }
    );
  }
}
