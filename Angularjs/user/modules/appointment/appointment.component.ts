import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  searchText: any;
  previousCount: number;
  searchTextActive: any;
  activeList: any;
  activeCount: number;
  page: number = 1;
  previousList: any;
  isActive: boolean;
  type: any;
  userId: any;

  constructor(
    private toaster: ToastrService,
    private utills: Utills,
    private tmpStorage: TmpStorage,
    private config: AppConfig,
    private user: UserService,
    private shop: ShopService,
    private appoint: AppointmentService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) { }
  // function to get user appointment history
  getUserBidRequestHistory() {
    let appoint = {
      userId: this.userId,
      page: this.page,
      searchText: this.searchText
    }
    this.appoint.getUserBidRequestHistory(appoint).subscribe((res: any) => {
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
  getUserBidRequest() {
    let appoint = {
      userId: this.userId,
      page: this.page.toString(),
      searchText: this.searchTextActive
    }
    this.appoint.getUserBidRequest(appoint).subscribe((res: any) => {
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
    this.getUserBidRequestHistory();
  }
  pageChangeActive(pages: number): void {
    this.page = pages;
    this.getUserBidRequest();
  }

  // delete appointment detail
  deleteBidRequest(Id: string, rowIndex: number) {
    Swal({
      title: 'Are you sure?',
      text: 'You want to delete the bid detail!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.appoint.userBidRequestDelete({ bidId: Id }).subscribe((res: any) => {
          if (!res.auth) {
            this.toaster.error(res.message);
          }
          else {
            Swal(
              'Deleted!',
              'Your bid detail has been deleted.',
              'success'
            )
            this.getUserBidRequest();
            this.activeList.splice(rowIndex, 1);
            this.changeDetectorRef.detectChanges();
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
        this.getUserBidRequest();
      }
      else {
        this.isActive = false;
        this.getUserBidRequestHistory();
      }
    });
  }

}
