import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsComponent } from './metrics.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MetricComponent } from './metric/metric.component';
import { MetricsAdminComponent } from './metrics-admin/metrics-admin.component';
import { UpdateMetricComponent } from './update-metric/update-metric.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MetricsInstituteComponent } from './metrics-institute/metrics-institute.component';
import { NoSymbolsPipe } from '@app/metrics/pipes/no-symbols.pipe';
import { SharedModule } from '@app/shared/shared.module';
import { MetricDetailComponent } from './metric-detail/metric-detail.component';
import { MetricConfigureComponent } from './metric-configure/metric-configure.component';

@NgModule({
  declarations: [
    MetricsComponent,
    MetricComponent,
    MetricsAdminComponent,
    UpdateMetricComponent,
    MetricsInstituteComponent,
    NoSymbolsPipe,
    MetricDetailComponent,
    MetricConfigureComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: MetricsComponent,
      },
      {
        path: 'experience',
        component: MetricsComponent,
      },
      {
        path: 'institution',
        component: MetricsInstituteComponent,
      },
      {
        path: 'admin',
        component: MetricsAdminComponent,
      },
    ]),
  ],
  exports: [
    NoSymbolsPipe,
    MetricsComponent,
    IonicModule,
    ReactiveFormsModule,
  ],
})
export class MetricsModule {}