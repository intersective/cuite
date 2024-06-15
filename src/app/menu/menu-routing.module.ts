import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu.component';
import { AuthGuard } from '@app/auth/auth.guard';

const routes: Routes = [{
  path: '',
  component: MenuComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: 'dashboard',
      loadChildren: () => import('../home/home.module').then(m => m.HomeModule)
    },
    {
      path: 'progress',
      loadChildren: () => import('../progress/progress.module').then(m => m.ProgressModule)
    },
    {
      path: 'message',
      loadChildren: () => import('../message/message.module').then(m => m.MessageModule)
    },
    {
      path: '',
      redirectTo: '/error'
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
