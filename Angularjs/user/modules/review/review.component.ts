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
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  appointmentId: any;
  shopId: any;
  searchTextActive: any;
  isActive: boolean = false;
  type: any;
  activeCount: any;
  activeList: any;
  previousCount: number;
  previousList: any;
  searchText: any;
  count: number = 1;
  userId: any;
  text: any
  page: number = 1
  showRating: number;
  giveRating: number;
  modalReference: any
  closeResult: any
  constructor(
    private toaster: ToastrService,
    private utills: Utills,
    private tmpStorage: TmpStorage,
    private config: AppConfig,
    private user: UserService,
    private shop: ShopService,
    private modalService: NgbModal,
    private appoint: AppointmentService,
    private route: ActivatedRoute,
  ) { }

  // function to get user appointment history
  userMechanicRating() {
    let appoint = {
      userId: this.userId,
      page: this.page,
      searchText: this.searchText
    }
    this.appoint.userMechanicRating(appoint).subscribe((res: any) => {
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

  // rating(id,count){
  //     console.log(count,"count", "id>",id)
  // }


  openAddReview(content, list) {
    if (list.review_rating != null && list.review_rating != '') {
      this.showRating = list.review_rating;
    }

    this.shopId = list.shopId;
    this.appointmentId = list.appointmentId;
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  addReview() {
    if (this.giveRating) {
      let ratingObj = {
        rating: this.giveRating,
        text: this.text,
        userId: this.userId,
        shopId: this.shopId,
        appointmentId: this.appointmentId

      }
      this.appoint.addUserReview(ratingObj).subscribe((res: any) => {
        if (!res.auth) {
          this.toaster.error(res.message);
        }
        if (res.code == 402) {
          this.toaster.error(res.message);
        }
        else {
          if (res.code == 200) {

            this.toaster.success(res.message);
            this.modalReference.close();
            this.userMechanicRating();
            this.text = '';
          }
          else {
            this.previousCount = 0;
          }
        }
      })
    }
    else {
      this.toaster.error("Please mark on star");
    }




  }

  // function page change
  pageChange(pages: number): void {
    this.page = pages;
    this.userMechanicRating();
  }
  pageChangeActive(pages: number): void {
    this.page = pages;
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
            this.previousList.splice(rowIndex, 1);
            this.userMechanicRating();

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
      }
      else {
        this.isActive = false;
        this.userMechanicRating();
      }
    });

  }

}
