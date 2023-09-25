import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { MaterialModule } from '../material/material.module';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { BoardPageComponent } from './pages/board-page/board-page.component';
import { CardComponent } from './components/card/card.component';
import { RightModalComponent } from './components/right-modal/right-modal.component';
import { ControllerPageComponent } from './pages/controller-page/controller-page.component';
import { CardBlockComponent } from './components/card-block/card-block.component';
import { CurrencyPipe } from "./pipes/currency.pipe";
import { DatePipe } from './pipes/date.pipe';
import { TimePipe } from './pipes/time.pipe';
import { TimeDifferencePipe } from './pipes/timeDifference.pipe';
import { CustomDatePipe } from './pipes/customDate.pipe';
import { SharedModule } from "../shared/shared.module";
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
    declarations: [
        AdminPageComponent,
        LayoutPageComponent,
        BoardPageComponent,
        ControllerPageComponent,
        CardComponent,
        CardBlockComponent,
        RightModalComponent,
        CurrencyPipe,
        DatePipe,
        TimePipe,
        TimeDifferencePipe,
        CustomDatePipe,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        PagesRoutingModule,
        MaterialModule,
        NgxSkeletonLoaderModule,
        SharedModule
    ]
})
export class PagesModule { }
