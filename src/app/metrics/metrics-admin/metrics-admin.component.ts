import { Component, OnInit } from '@angular/core';
import { MetricsService } from '../metrics.service';

@Component({
  selector: 'app-metrics-admin',
  templateUrl: './metrics-admin.component.html',
  styleUrls: ['./metrics-admin.component.scss']
})
export class MetricsAdminComponent implements OnInit {
  metrics: any[] = [];
  constructor(
    private metricsService: MetricsService
  ) { }

  ngOnInit() {
    this.getMetrics();
  }

  getMetrics() {
    this.metricsService.getMetrics(true).subscribe((response: any) => {
      this.metrics = response.data.metrics;
    });
  }
}
