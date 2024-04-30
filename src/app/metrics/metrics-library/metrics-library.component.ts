import { Component, OnInit } from '@angular/core';
import { MetricsService } from '../metrics.service';
import { first } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-metrics-library',
  templateUrl: './metrics-library.component.html',
  styleUrls: ['./metrics-library.component.scss']
})
export class MetricsLibraryComponent implements OnInit {
  metrics: any[];

  constructor(
    private metricsService: MetricsService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.metricsService.metrics$.subscribe((metrics) => {
      this.metrics = metrics;
    });
    this.fetchMetrics();
  }

  fetchMetrics() {
    // Library metrics: publicOnly = true
    this.metricsService.getMetrics(true).pipe(first()).subscribe();
  }

  goBack() {
    this.router.navigate(['metrics', 'institution']);
  }
}