import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { RatingModule } from 'primeng/primeng';
import { NgxLoadingModule } from 'ngx-loading';
import { MultiSelectModule } from 'primeng/components/multiselect/multiselect';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { NgxMaskModule } from 'ngx-mask'




import {
    BsDropdownModule,
} from 'ngx-bootstrap';

import {
    ConfirmDialogModule,
    ConfirmationService
} from 'primeng/primeng';

import { UserLayoutRoutingModule } from "../layout/userlayout-routing.module";
import { UserLayoutComponent } from "../layout/userlayout.component";
import { HeaderComponent } from "../layout/components/header/header.component";
import { SidebarComponent } from "../layout/components/sidebar/sidebar.component";
import { FooterComponent } from "../layout/components/footer/footer.component";
import { HomeComponent } from "../../../app/user/modules/home/home.component";
import { TaskComponent } from "../../../app/user/modules/task/task.component";
import { ProfileComponent } from "../modules/profile/profile.component";
import { DetailComponent } from "../../../app/user/modules/detail/detail.component";
import { BiddetailComponent } from "../modules/biddetail/biddetail.component";
import { BidsComponent } from "../modules/bids/bids.component";
import { NotificationComponent } from "../modules/notification/notification.component";
import { AppointmentComponent } from "../modules/appointment/appointment.component";
import { SendRequestComponent } from "../modules/sendrequest/sendrequest.component";
import { ReviewComponent } from "../modules/review/review.component";




@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        BsDropdownModule.forRoot(),
        CommonModule,
        NgxLoadingModule,
        MultiSelectModule,
        ShowHidePasswordModule.forRoot(),
        RouterModule,
        RatingModule,
        ConfirmDialogModule,
        UserLayoutRoutingModule,
        NgxMaskModule.forRoot(),

        NgbModule,
        CalendarModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyCfDowxVEY_M1smR33y_-ykWcZ0x5S3ac8'
        }),
        NgbModule
    ],
    declarations: [
        UserLayoutComponent,
        HeaderComponent,
        SidebarComponent,
        FooterComponent,
        HomeComponent,
        TaskComponent,
        ProfileComponent,
        DetailComponent,
        BiddetailComponent,
        SendRequestComponent,
        BidsComponent,
        ReviewComponent,
        NotificationComponent,
        AppointmentComponent
    ],
    providers: [
        ConfirmationService,
    ]
})
export class UserLayoutModule {

}