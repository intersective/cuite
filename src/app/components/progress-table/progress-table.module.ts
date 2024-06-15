import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProgressPopoverComponent } from '@components/progress-popover/progress-popover.component';
import { ProgressTableComponent } from './progress-table.component';

@NgModule({
    imports: [
        SharedModule,
        NgxDatatableModule
    ],
    exports: [
        ProgressTableComponent
    ],
    declarations: [
        ProgressPopoverComponent,
        ProgressTableComponent
    ]
})
export class ProgressTableModule { }
