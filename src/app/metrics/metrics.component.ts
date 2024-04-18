import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { MetricsService, type Metric } from './metrics.service';
import { UpdateMetricComponent } from './update-metric/update-metric.component';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss'],
})
export class MetricsComponent implements OnInit {
  metrics: Metric[] = [];

  constructor(
    private metricService: MetricsService,
    private modalController: ModalController) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.metricService.getMetrics(true).subscribe(
      (response) => {
        console.log(response);
        this.metrics = response;
      },
      (error) => {
        console.error('Error fetching data:', error);
        // Handle the error
      }
    );
  }

  addMetric() {
    this.modalController.create({
      component: UpdateMetricComponent,
    }).then(modal => {
      modal.present();
    });
  }
}
