import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ElsaGhostComponent } from '@components/elsa-ghost/elsa-ghost.component';
import { ElsaTodoListComponent } from './elsa-todo-list.component';

@NgModule({
    imports: [
        SharedModule,
        NgxDatatableModule
    ],
    exports: [
        ElsaTodoListComponent
    ],
    declarations: [
        ElsaTodoListComponent,
        ElsaGhostComponent
    ]
})
export class ElsaTodoListModule { }
