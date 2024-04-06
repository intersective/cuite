import { Component, OnInit } from '@angular/core';
import { Metric, MetricsService } from '../metrics.service';

@Component({
  selector: 'app-metrics-admin',
  templateUrl: './metrics-admin.component.html',
  styleUrls: ['./metrics-admin.component.scss']
})
export class MetricsAdminComponent implements OnInit {
  metrics: Metric[] = [];
  constructor(
    private metricsService: MetricsService
  ) { }

  ngOnInit() {
    this.getMetrics();
  }

  getMetrics() {
    this.metricsService.getMetrics(true).subscribe((response: any) => {
      this.metrics = response;
    });
  }

  addMetric() {
    throw new Error('Method not implemented.');
  }

  editMetric(data: Metric) {
    throw new Error('Method not implemented.');
  }

  deleteMetric(data: Metric) {
    throw new Error('Method not implemented.');
  }
}
