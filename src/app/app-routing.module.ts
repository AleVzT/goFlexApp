import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NotFoundPageComponent } from './shared/pages/not-found-page/not-found-page.component';
import { isNotAuthenticatedGuard } from './auth/guards/public.guard';
import { isAuthenticatedGuard } from './auth/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule ),
    canActivate: [isNotAuthenticatedGuard],
  },
  {
    path: 'pages',
    loadChildren: () => import('./bot-flex/pages.module').then( m => m.PagesModule ),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: '404',
    component: NotFoundPageComponent,
  },
  {
    path: '',
    redirectTo: 'pages',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '404',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
