import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MetricsService } from '../metrics.service';
import { Subject, first } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-metrics-library',
  templateUrl: './metrics-library.component.html',
  styleUrls: ['./metrics-library.component.scss']
})
export class MetricsLibraryComponent implements OnInit, OnDestroy {
  metrics: any[];
  $unsubcribed = new Subject<void>();
  isLoading = false;

  constructor(
    private metricsService: MetricsService,
    private router: Router,
    private toastController: ToastController,
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

  async fetchMetrics() {
    this.isLoading = true;
    
    // Library metrics: publicOnly = true
    this.metricsService.getMetrics(true).pipe(first()).subscribe({
      error: async (_error) => {
        const toast = await this.toastController.create({
          color: 'warning',
          message: 'Failed to load metrics, please refresh and try again.',
          duration: 2000
        });
        await toast.present();        
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['metrics', 'institution']);
  }
}