import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { MetricsService, type Metric } from '@app/metrics/metrics.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css'],
})
export class MetricsComponent implements OnInit {
  metrics: Metric[] = [];

  constructor(
    private metricsService: MetricsService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.metricsService.getMetrics(true).subscribe(
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
