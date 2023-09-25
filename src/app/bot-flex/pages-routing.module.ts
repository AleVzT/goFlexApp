import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { BoardPageComponent } from './pages/board-page/board-page.component';
import { ControllerPageComponent } from './pages/controller-page/controller-page.component';


// localhost:4200/pages
const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: 'admin', component: AdminPageComponent },
      { path: 'board', component: BoardPageComponent },
      { path: 'controller', component: ControllerPageComponent },
      { path: '**', redirectTo: 'board' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }