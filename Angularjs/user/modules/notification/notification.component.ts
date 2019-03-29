import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { AuthService } from "../../../core/services/auth.service";
import { UserService } from "../../../core/services/user.service";
import { WebStorage } from "../../../core/utility/web.storage";
import { AppConfig } from "../../../core/config/app.config";
import { NotificationService } from "../../../core/services/notification.service";
import Swal from 'sweetalert2'
import * as io from 'socket.io-client';
import * as Rx from 'rxjs/Rx';
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  socket: any;
  page: number = 1;
  searchText: any;
  totalCount: any;
  notificationList: any;
  userId: any;

  constructor(
    public auth: AuthService,
    private userService: UserService,
    private storage: WebStorage,
    private config: AppConfig,
    private router: Router,
    private toastr: ToastrService,
    private notify: NotificationService
  ) { }

  // function track by
  trackByFn(index, item) {
    return item.id;
  }

  // list all notifications
  listNotifications() {
    this.notificationList = []
    let user = {
      userId: this.userId,
      page: this.page,
      searchText: this.searchText,
    }
    this.notify.listNotifications(user).subscribe((res: any) => {
      if (!res.auth) {
        this.toastr.error(res.message);
      }
      else {
        if (res.code == 200) {
          this.totalCount = res.data.totalCount;
          this.notificationList = res.data.data;
        }
        else {
          this.totalCount = 0;
        }
      }
    })
  }

  // function delete notification
  deleteNotification(Id: string, rowIndex: number) {
    Swal({
      title: 'Are you sure?',
      text: 'You want to delete the notification!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.notify.deleteNotification({ notificationId: Id }).subscribe((res: any) => {
          if (!res.auth) {
            this.toastr.error(res.message);
          }
          else {
            Swal(
              'Deleted!',
              'Your notification has been deleted.',
              'success'
            )
            this.listNotifications()
            this.notificationList.splice(rowIndex, 1);
          }
        })

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'Cancelled',
          'Your notification not deleted.',
          'error'
        )
      }
    });
  }
  pageChange(pages: number): void {
    this.page = pages;
    this.listNotifications();
  }

  ngOnInit() {
    let UsersLocal = JSON.parse(localStorage.getItem("erSuperAdminUser"));
    this.userId = UsersLocal.value._id;
    this.listNotifications();
  }

}
