import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from '../../../core/config/app.config';
import { Utills } from '../../../core/utility/utills';
import { TmpStorage } from '../../../core/utility/temp.storage';
import { AuthService } from "../../../core/services/auth.service";
import { UserService } from "../../../core/services/user.service";

import { requiredTrim } from "../../../core/validators/validators";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  public addRequest: FormGroup;
  public taskList: any[];

  constructor(
    private toaster: ToastrService,
    private auth: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private utills: Utills,
    private tmpStorage: TmpStorage,
    private config: AppConfig,
    private user: UserService,
  ) {
    this.addRequest = formBuilder.group({
      price: ['', [requiredTrim]],
      dateTime: new Date(),
      description: ['', [requiredTrim]],
      radius: [''],
      carId: "5af1248c82495a1151f4f07b",
      userId: "5aefda17ad01e419be064ddd",
    });
  }

  addTaskRequest() {
    this.user.addTaskRequest(this.addRequest.value).subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      } else if (!res.data) {
        this.toaster.error(res.message);
      }
      else {
        this.toaster.success(res.message);
        this.addRequest.reset();
      }
    });
  }

  listUserTaskRequest() {

  }


  ngOnInit() {
    this.user.listUserTaskRequest(this.addRequest.value).subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        this.taskList = res.data;
      }
    });
  }

}
