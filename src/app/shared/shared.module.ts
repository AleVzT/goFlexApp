import { NgModule } from '@angular/core';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { EmptyStateComponent } from './pages/empty-state-page/empty-state-page.component';



@NgModule({
  declarations: [
    NotFoundPageComponent,
    EmptyStateComponent
  ],
  exports: [NotFoundPageComponent, EmptyStateComponent]
})
export class SharedModule { }
