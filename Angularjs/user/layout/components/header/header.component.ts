import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

import { WebStorage } from '../../../../core/utility/web.storage';
import { AppConfig } from "../../../../core/config/app.config";
import { AuthService } from "../../../../core/services/auth.service";
import { UserService } from '../../../../core/services/user.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { MessageService } from "../../../../core/services/message.services";
import { CommonService } from "../../../../core/services/common.service";

@Component({
    selector: 'header-component',
    preserveWhitespaces: false,
    templateUrl: './view/header.component.html',
    providers: [
        UserService
    ]
})
export class HeaderComponent {
    notification: any;
    notificationCount: any;
    image: any;
    isShowPanel: boolean = false;
    isVerified: any;

    public user: any;
    public notifications: any = [];
    public userId: string;
    public userName: string;
    public userDetail: string;
    public userImage: string;
    constructor(
        public auth: AuthService,
        private userService: UserService,
        private storage: WebStorage,
        private config: AppConfig,
        private router: Router,
        private toastr: ToastrService,
        private notify: NotificationService,
        private message: MessageService,
        private common: CommonService

    ) { }

    public logout() {
        this.auth.logout().subscribe((res: any) => {
            localStorage.removeItem('role');
            // this.message.disconnect(this.userId);
            this.router.navigate(['/']);
        });
    }

    showPanel() {
        this.isShowPanel = !this.isShowPanel
    }

    // function to get notification count
    unreadNotificationCount() {
        var user = {
            userId: this.userId
        }
        this.notify.unreadNotificationCount(user).subscribe((res: any) => {
            if (!res.auth) {
                this.toastr.error(res.message);
            }
            else {
                if (res.code == 200) {
                    this.notificationCount = res.data.totalCount;
                    this.notification = res.data.data;
                }
                else {
                    this.notificationCount = 0;

                }
            }
        })
    }

    // function read notification
    readNotification(Id) {
        var notify = {
            notificationId: Id
        }
        this.notify.readNotification(notify).subscribe((res: any) => {
            if (!res.auth) {
                this.toastr.error(res.message);
            }
            else {
                this.router.navigate(["/user/notification"]);
                this.unreadNotificationCount();
            }
        })
    }

    private ngOnInit() {
        this.user = this.storage.get("User");
        let UsersLocal = JSON.parse(localStorage.getItem("erSuperAdminUser"));
        this.image = UsersLocal.value.profile_image;
        if (this.image == '') {
            this.userImage = "assets/dist/img/images.jpg";
        }
        else {
            this.userImage = this.config.serverImageUrls + "uploads/" + this.image;
        }
        this.isVerified = UsersLocal.value.isVerified;
        this.userId = UsersLocal.value._id;
        this.userName = UsersLocal.value.firstname + ' ' + UsersLocal.value.lastname;
        this.unreadNotificationCount();
        this.getMechanicDetails();

    }
    public getMechanicDetails() {
        this.common.getMechanicPic().subscribe(response => {
            this.userImage = this.config.serverImageUrls + "uploads/" + response;
        })
    }
}