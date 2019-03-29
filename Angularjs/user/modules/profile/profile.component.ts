import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { MouseEvent } from '@agm/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import Swal from 'sweetalert2'
import { AppConfig } from '../../../core/config/app.config';
import { Utills } from '../../../core/utility/utills';
import { TmpStorage } from '../../../core/utility/temp.storage';
import { AuthService } from "../../../core/services/auth.service";
import { UserService } from "../../../core/services/user.service";
import { requiredTrim } from "../../../core/validators/validators";
import { ShopService } from "../../../core/services/shop.service";
import { CommonService } from '../../../core/services/common.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  message: string = "Hola Mundo!"

  @Output() messageEvent = new EventEmitter<string>();

  shopId: any;
  isTechnician: boolean = false;
  isManufacturer: boolean = false;
  isInsurance: boolean = false;
  isLicence: boolean = false;
  technicianfile: any;
  manufacturefile: any;
  insurancefile: any;
  licensefile: any;
  isImage: boolean = false;
  name: string;
  filetype: any;
  imageUser: any;
  profilePic: any;
  image: string;
  imagename: any;
  shopDetail: any;
  userId: any;
  userList: any;
  stateList: any;
  public userupdate: FormGroup;
  public loading = false;
  public passwordChange: FormGroup;
  public shopUpdate: FormGroup;
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
    private common: CommonService
  ) {

  }

  sendMessage() {
    this.messageEvent.emit(this.profilePic);
  }

  // get state list
  getStateList() {
    this.auth.getStateList().subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        this.stateList = res.data;
      }
    });
  }

  // get user by Id
  getUserById() {
    let UsersLocal = JSON.parse(localStorage.getItem("erSuperAdminUser"));
    let Id = UsersLocal.value._id;
    let user = {
      userId: Id
    }
    this.user.userDetailById(user).subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        this.userList = res.data;
        this.imageUser = res.data.profile_image;
        if (this.imageUser == '' || this.imageUser == null) {
          this.isImage = true;
        }
        this.profilePic = this.config.serverImageUrls + "uploads/" + res.data.profile_image;
        this.name = res.data.firstname + " " + res.data.lastname;
        this.userupdate.patchValue(res.data);
      }
    });
  }

  // update mechanic
  updateUser() {
    let UsersLocal = JSON.parse(localStorage.getItem("erSuperAdminUser"));
    this.userupdate.value.userId = UsersLocal.value._id;
    // this.userupdate.value.phoneNumber = this.userupdate.value.phoneNumber.toString()
    this.user.updateUser(this.userupdate.value).subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        this.toaster.success(res.message);
      }
    });
  }

  //change password
  changePassword() {
    let UsersLocal = JSON.parse(localStorage.getItem("erSuperAdminUser"));
    this.passwordChange.value.userId = UsersLocal.value._id;
    if (this.passwordChange.value.newPassword == this.passwordChange.value.confirmpassword) {
      this.user.updatePassword(this.passwordChange.value).subscribe((res: any) => {
        if (!res.auth) {
          this.toaster.error(res.message);
        }
        else {
          this.toaster.success(res.message);
          this.router.navigate(['user/dashboard']);
        }
      });
    }
    else {
      this.toaster.error("Password must be same");
    }


  }

  // function to convert user image to base 64
  updateUserPic(evt) {
    var fileSize = 500000
    this.filetype = evt.target.files[0].type;
    this.imagename = evt.target.files[0].name;
    var files = evt.target.files;
    var file = files[0];

    if (evt.target.files[0].size <= fileSize) {
      if (files && file && (this.filetype == "image/jpeg" || this.filetype == "image/png" || this.filetype == "image/jpg")) {
        var reader = new FileReader();
        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      }
      else {
        this.toaster.error("Please upload image.")
      }
    } else {
      this.toaster.error("File size should be 5MB")
    }

  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.image = btoa(binaryString);
    let userPic = {
      userId: this.userId,
      file: this.image,
    }
    // console.log("loadingggggggggg true");
    this.loading = true;

    this.user.updateUserPic(userPic).subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
        this.loading = false;

      }
      else {
        this.toaster.success(res.message);
        this.getUserById();
        this.profilePic = res.data;
        this.loading = false;
        // console.log("loaddinggggggg false", res.data)
        let temp = ''
        this.common.currentMessage.subscribe(message => {
          this.profilePic = message
          this.loading = false;
          temp = res.data;
        })

        this.common.setMechanicPic(temp)
        // this.sendMessage();

        // location.reload();
      }
    });
  }

  ngOnInit() {
    let UsersLocal = JSON.parse(localStorage.getItem("erSuperAdminUser"));
    this.userId = UsersLocal.value._id;
    this.userupdate = this.formBuilder.group({
      userId: ['', [requiredTrim]],
      firstname: ['', [requiredTrim]],
      lastname: ['', [requiredTrim]],
      email: ['', [requiredTrim]],
      phoneNumber: ['', [requiredTrim]],
      address: this.formBuilder.group({
        street: ['', [requiredTrim]],
        city: ['', [requiredTrim]],
        state: ['', [requiredTrim]],
        postcode: ['', [requiredTrim]],

      }),
    });


    this.passwordChange = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],

      newPassword: ['', [Validators.required]],
      confirmpassword: ['', [Validators.required]],
    });

    this.getStateList();
    this.getUserById();
    // this.sendMessage();
  }


}
