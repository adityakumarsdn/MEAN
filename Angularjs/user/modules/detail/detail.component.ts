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
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  detail: any;
  userId: any;
  appointmentId: any;
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


  // get appointment details
  getAppointmentDetail() {
    this.route.params.subscribe(params => {
      this.appointmentId = params.id;
    });

    let appointData = {
      appointmentId: this.appointmentId,
      userId: this.userId,
      page: "1"
    }
    this.appoint.getAppointmentDetail(appointData).subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        if (res.data.length == undefined || res.data.length == 0) {
        }
        else {
          this.appointmentList = res.data;
        }
      }
    })
  }

  ngOnInit() {
    let UsersLocal = JSON.parse(localStorage.getItem("erSuperAdminUser"));
    this.userId = UsersLocal.value._id;
    this.getAppointmentDetail();
  }

}
