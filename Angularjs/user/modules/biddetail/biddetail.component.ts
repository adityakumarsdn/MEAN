import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from "@angular/router";
import { AppConfig } from '../../../core/config/app.config';
import { Utills } from '../../../core/utility/utills';
import { TmpStorage } from '../../../core/utility/temp.storage';
import { AuthService } from "../../../core/services/auth.service";
import { UserService } from "../../../core/services/user.service";
import { requiredTrim } from "../../../core/validators/validators";
import { ShopService } from "../../../core/services/shop.service";
import { AppointmentService } from "../../../core/services/appointment.service";
import { NgbModal, ModalDismissReasons, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-biddetail',
  templateUrl: './biddetail.component.html',
  styleUrls: ['./biddetail.component.css']
})
export class BiddetailComponent implements OnInit {
  bidList: any;
  bidId: any;
  detail: any;
  userId: any;
  appointmentList: any;

  constructor(
    private toaster: ToastrService,
    private auth: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private utills: Utills,
    private tmpStorage: TmpStorage,
    private config: AppConfig,
    private user: UserService,
    private shop: ShopService,
    private appoint: AppointmentService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
  ) { }


  // function get bid request detail
  bidRequestDetail() {
    this.route.params.subscribe(params => {
      this.bidId = params.id;
    });
    let appointData = {
      bidId: this.bidId
    }
    this.appoint.bidRequestDetail(appointData).subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        if (res.data.length == undefined || res.data.length == 0) {
        }
        else {
          this.bidList = res.data;
        }
      }
    })
  }

  acceptRejectBidRequest(bidId, isAccept) {
    let bid = {
      bidId: bidId,
      isAccepted: isAccept
    }
    this.appoint.acceptRejectBidRequest(bid).subscribe((res) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        this.toaster.success(res.message);
        this.bidRequestDetail();
      }
    })
  }

  ngOnInit() {
    let UsersLocal = JSON.parse(localStorage.getItem("erSuperAdminUser"));
    this.userId = UsersLocal.value._id;
    this.bidRequestDetail();
  }

}
