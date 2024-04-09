import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsComponent } from './metrics.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MetricComponent } from './metric/metric.component';
import { MetricsAdminComponent } from './metrics-admin/metrics-admin.component';
import { UpdateMetricComponent } from './update-metric/update-metric.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MetricDetailComponent } from './metric-detail/metric-detail.component';


@NgModule({
  declarations: [
    MetricsComponent,
    MetricComponent,
    MetricsAdminComponent,
    UpdateMetricComponent,
    MetricDetailComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: MetricsComponent
      },
      {
        path: 'admin',
        component: MetricsAdminComponent,
      }
    ])
  ],
  exports: [
    MetricsComponent,
    IonicModule,
    ReactiveFormsModule,
  ]
})
export class MetricsModule { }
