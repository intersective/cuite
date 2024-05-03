import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MetricsService } from '../metrics.service';
import { Subject, first } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-metrics-library',
  templateUrl: './metrics-library.component.html',
  styleUrls: ['./metrics-library.component.scss']
})
export class MetricsLibraryComponent implements OnInit, OnDestroy {
  metrics: any[];
  $unsubcribed = new Subject<void>();

  constructor(
    private metricsService: MetricsService,
    private router: Router,
  ) { 
    // subscribe to router and once this route activated will trigger fetch
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      filter((event: NavigationEnd) => event.urlAfterRedirects === '/metrics/library'),
      takeUntil(this.$unsubcribed),
    ).subscribe((e) => {
      this.fetchMetrics();
    });
  }

  ngOnInit() {
    this.metricsService.metrics$.pipe(takeUntil(this.$unsubcribed)).subscribe((metrics) => {
      this.metrics = metrics;
    });
    this.fetchMetrics();
  }

  ngOnDestroy(): void {
    this.$unsubcribed.next();
    this.$unsubcribed.complete();
  }

  fetchMetrics() {
    // Library metrics: publicOnly = true
    this.metricsService.getMetrics(true).pipe(first()).subscribe();
  }

  goBack() {
    this.router.navigate(['metrics', 'institution']);
  }
}