import { Component, OnInit } from '@angular/core';
import { MetricsService, type Metric } from '@app/metrics/metrics.service';
import { ModalController } from '@ionic/angular';
import { UpdateMetricComponent } from '../update-metric/update-metric.component';

@Component({
  selector: 'app-metrics-institute',
  templateUrl: './metrics-institute.component.html',
  styleUrls: ['./metrics-institute.component.scss']
})
export class MetricsInstituteComponent implements OnInit {
  metrics: Metric[] = [];

  constructor(
    private metricService: MetricsService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.metricService.metrics$.subscribe((metrics) => {
      this.metrics = metrics;
    });
    this.fetchData();
  }

  fetchData() {
    // Institution metrics: publicOnly = false
    this.metricService.getMetrics(false).subscribe({
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }

  addNew() {
    this.modalController.create({
      component: UpdateMetricComponent,
      componentProps: {
        from: 'institution',
      },
    }).then(modal => {
      modal.present();
      modal.onDidDismiss().then(() => {
        this.fetchData();
      });
    });
  }

  calculate() {
    // this.metricsService.calculateMetrics();
  }

  download() {
    // this.metricsService.downloadMetrics();
  }
}
