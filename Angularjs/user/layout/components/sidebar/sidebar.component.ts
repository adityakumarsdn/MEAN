import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { WebStorage } from '../../../../core/utility/web.storage';
import { AppConfig } from "../../../../core/config/app.config";
import { AuthService } from "../../../../core/services/auth.service";
import { UserService } from '../../../../core/services/user.service';
import { CommonService } from "../../../../core/services/common.service";

@Component({
    selector: 'sidebar-component',
    preserveWhitespaces: false,
    templateUrl: './view/sidebar.component.html',
    styleUrls: ['./css/sidebar.css']
})
export class SidebarComponent {

    public user: any;
    public userId: string;
    public userName: string;
    image: any;
    userImage: string;

    constructor(
        public auth: AuthService,
        private userService: UserService,
        private storage: WebStorage,
        private config: AppConfig,
        private router: Router,
        private common: CommonService
    ) { }
    message: string;

    receiveMessage($event) {
        this.message = $event;
        this.image = this.message;
    }
    newMessage() {
        this.common.changeMessage("Hello from Sibling")
    }

    ngOnInit() {
        // this.user = this.storage.get(this.config.token.userKey);
        let UsersLocal = JSON.parse(localStorage.getItem("erSuperAdminUser"));
        this.userId = UsersLocal.value._id;
        this.userName = UsersLocal.value.firstname + ' ' + UsersLocal.value.lastname;
        this.image = UsersLocal.value.profile_image;
        if (this.image == '') {
            this.userImage = "assets/dist/img/images.jpg";
        }
        else {
            this.userImage = this.config.serverImageUrls + "uploads/" + this.image;
        }
        this.common.currentMessage.subscribe(message => {
            this.message = message
        })
        this.getMechanicDetails();
    }
    public getMechanicDetails() {
        this.common.getMechanicPic().subscribe(response => {
            this.userImage = this.config.serverImageUrls + "uploads/" + response;
        })
    }
}