import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsAdminComponent } from './metrics-admin.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    MetricsAdminComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    IonicModule,
    MetricsAdminComponent
  ],
})
export class MetricsAdminModule { }
