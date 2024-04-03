import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsComponent } from './metrics.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MetricComponent } from './metric/metric.component';



@NgModule({
  declarations: [
    MetricsComponent,
    MetricComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forRoot([
      {
        path: '',
        component: MetricsComponent
      },
      {
        path: 'admin',
        loadChildren: () => import('./metrics-admin/metrics-admin.module').then(m => m.MetricsAdminModule),
      }
    ])
  ],
  exports: [
    MetricsComponent,
    IonicModule,
  ]
})
export class MetricsModule { }
