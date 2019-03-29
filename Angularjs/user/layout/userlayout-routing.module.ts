import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../../../app/core/guards/auth.guard";
import { UserLayoutComponent } from "../../../app/user/layout/userlayout.component";
import { HomeComponent } from "../../../app/user/modules/home/home.component";
import { TaskComponent } from "../../../app/user/modules/task/task.component";
import { ProfileComponent } from "../../../app/user/modules/profile/profile.component";
import { DetailComponent } from "../../../app/user/modules/detail/detail.component";
import { BiddetailComponent } from "../modules/biddetail/biddetail.component";
import { BidsComponent } from "../modules/bids/bids.component";
import { NotificationComponent } from "../modules/notification/notification.component";
import { AppointmentComponent } from "../modules/appointment/appointment.component";
import { SendRequestComponent } from "../modules/sendrequest/sendrequest.component";
import { ReviewComponent } from "../modules/review/review.component";



const routes: Routes = [
    {
        path: '',
        component: UserLayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                component: HomeComponent
            },
            {
                path: 'repair',
                component: TaskComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'detail/:id',
                component: DetailComponent
            },
            {
                path: 'request/:id',
                component: BidsComponent
            },
            {
                path: 'biddetail/:id',
                component: BiddetailComponent
            },
            {
                path: 'notification',
                component: NotificationComponent
            },
            {
                path: 'appointment/:id',
                component: AppointmentComponent
            },
            {
                path: 'sendrequest',
                component: SendRequestComponent
            },
            {
                path: 'review',
                component: ReviewComponent
            },
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserLayoutRoutingModule {

}