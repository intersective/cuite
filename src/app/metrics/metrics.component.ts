import { Component, OnInit } from '@angular/core';
import { MetricsService, type Metric } from '@app/metrics/metrics.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css'],
})
export class MetricsComponent implements OnInit {
  metrics: Metric[] = [];
  unsubscribe$ = new Subject<void>();

  constructor(private metricService: MetricsService) {}

  ngOnInit() {
    this.fetchData();
    this.metricService.metrics$.pipe(takeUntil(this.unsubscribe$)).subscribe((metrics) => {
      this.metrics = metrics;
    });
  }

  fetchData() {
    this.metricService.getMetrics(true).pipe(takeUntil(this.unsubscribe$)).subscribe();
  }
}
