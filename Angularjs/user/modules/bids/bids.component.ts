import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'
import { AppConfig } from '../../../core/config/app.config';
import { Utills } from '../../../core/utility/utills';
import { TmpStorage } from '../../../core/utility/temp.storage';
import { AuthService } from "../../../core/services/auth.service";
import { UserService } from "../../../core/services/user.service";
import { requiredTrim } from "../../../core/validators/validators";
import { ShopService } from "../../../core/services/shop.service";
import { AppointmentService } from "../../../core/services/appointment.service";
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-bids',
  templateUrl: './bids.component.html',
  styleUrls: ['./bids.component.css']
})
export class BidsComponent implements OnInit {
  searchTextActive: any;
  isActive: boolean = false;
  type: any;
  activeCount: any;
  activeList: any;
  previousCount: number;
  previousList: any;
  searchText: any;
  userId: any;
  page: number = 1
  constructor(
    private toaster: ToastrService,
    private utills: Utills,
    private tmpStorage: TmpStorage,
    private config: AppConfig,
    private user: UserService,
    private shop: ShopService,
    private appoint: AppointmentService,
    private route: ActivatedRoute,
  ) { }

  // function to get user appointment history
  userAppointmentHistoryList() {
    let appoint = {
      userId: this.userId,
      page: this.page,
      searchText: this.searchText
    }
    this.appoint.userAppointmentHistoryList(appoint).subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        if (res.code == 200) {
          this.previousList = res.data.data;
          this.previousCount = res.data.totalCount;
        }
        else {
          this.previousCount = 0;
        }
      }
    });
  }

  // function to get user appointment history
  userAppointmentList() {
    let appoint = {
      userId: this.userId,
      page: this.page.toString(),
      searchText: this.searchTextActive
    }

    this.appoint.userAppointmentList(appoint).subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        if (res.code == 200) {
          this.activeList = res.data.data;
          this.activeCount = res.data.totalCount;
        }
        else {
          this.activeCount = 0;
        }
      }
    });
  }

  // function page change
  pageChange(pages: number): void {
    this.page = pages;
    this.userAppointmentHistoryList();
  }
  pageChangeActive(pages: number): void {
    this.page = pages;
    this.userAppointmentList();
  }

  // delete appointment detail
  deleteAppointment(Id: string, rowIndex: number) {
    Swal({
      title: 'Are you sure?',
      text: 'You want to delete the appointment detail!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.appoint.userAppointmentDelete({ appointmentId: Id }).subscribe((res: any) => {
          if (!res.auth) {
            this.toaster.error(res.message);
          }
          else {
            Swal(
              'Deleted!',
              'Your appointmert detail has been deleted.',
              'success'
            )
            this.activeList.splice(rowIndex, 1);
            this.userAppointmentList();
          }
        })

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'Cancelled',
          'Your appointment detail not deleted.',
          'error'
        )
      }
    });
  }

  ngOnInit() {
    let UsersLocal = JSON.parse(localStorage.getItem("erSuperAdminUser"));
    this.userId = UsersLocal.value._id;
    this.route.params.subscribe(params => {
      this.type = params.id;
      if (this.type == 'active') {
        this.isActive = true;
        this.userAppointmentList();
      }
      else {
        this.isActive = false;
        this.userAppointmentHistoryList();
      }
    });

  }

}
