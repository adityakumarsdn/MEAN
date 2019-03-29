import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
import { AppointmentService } from "../../../core/services/appointment.service";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { RepairService } from "../../../core/services/repair.service";
import { MessageService } from "../../../core/services/message.services";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  isFile: string = "0";
  messageFile: any;
  filename: any;
  receiveMessageObs: any;
  imageURL: any;
  page: number = 1;
  to: any;
  noMsg: boolean;
  chatWith: any;
  sendForm: FormGroup;
  mechanicName: any;
  isChatOpen: boolean = false;
  trimList: any;
  modelList: any;
  makeList: any;
  carForm: FormGroup;
  closeResult: string;
  bidList: any;
  bidCount: number;
  scheduleCount: number;
  appointmentList: any;
  searchTextActive: any;
  activeList: any = [];



  currentLat: any;
  currentLong: any;
  public carDetail: any;

  public nameSearch: FormGroup;
  public radiusSearch: FormGroup;
  public latitude: number;
  public longitude: number;
  public locations: any[];
  public carList: any[];
  public UserData: any[];
  public userId: string;
  public userName: string;
  public taskList: any[];
  public taskCount: number;
  public carCount: number;
  public locationList: any[];
  public zoom: number = 8;
  public zoom1: number = 4;
  public mark: any[];
  public mechanicLocation: any[] = [];
  public mechanicLocationHistory: any[] = [];

  public coordinates: number[] = [];
  modalReference: any;
  messageList: any = [];
  // messageList: Array<Message>;

  // initial center position for the map
  lat: number;
  lng: number;
  yearList: any;
  yearSelect: number;
  makeSelect: any;
  bookingList: any;
  appointmentCount: any;
  bookingCount: any;
  totalCount: any;


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
    private repair: RepairService,
    private message: MessageService,
  ) {
    this.nameSearch = formBuilder.group({
      searchText: ['', [requiredTrim]],
      page: "1",
      userId: "5ae94fcec7a0f527f98230ce"
    });

    this.radiusSearch = formBuilder.group({
      "coordinates": this.formBuilder.array([21.04019, 79.01364]),
      "radius": 0,
      "page": "1"
    });
    this.carForm = formBuilder.group({
      year: [''],
      make: [''],
      model: [''],
      trim: [''],
      mileage: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2)]]
    });
  }
  mapClicked(event) {

  }
  open(content) {
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // funvtion edit car
  openEdit(NewContent, car) {
    this.carDetail = car;
    this.modalReference = this.modalService.open(NewContent);
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

  searchByName() {
    this.user.getShopList(this.nameSearch.value).subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      } else if (res.data.length <= 0 || res.data.length == undefined) {
        this.toaster.error("Shop not found");
      }
      else {
        // navigator.geolocation.getCurrentPosition(this.showPosition);
        // this.toaster.success("Success");
      }
    });

  }

  // function delete car detail
  deleteCarDetail(Id: string, rowIndex: number) {
    Swal({
      title: 'Are you sure?',
      text: 'You want to delete the car detail!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.user.deleteCarDetail({ carId: Id }).subscribe((res: any) => {
          if (!res.auth) {
            this.toaster.error(res.message);
          }
          else {
            Swal(
              'Deleted!',
              'Your car detail has been deleted.',
              'success'
            )
            this.carList.splice(rowIndex, 1);
            this.showCarList();
          }
        })

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'Cancelled',
          'Your car detail not deleted.',
          'error'
        )
      }
    });
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
            this.appointmentList.splice(rowIndex, 1);
            this.userRecentAppointmentList();
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

  // delete bid detail
  deleteBidDetail(Id: string, rowIndex: number) {
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
            this.appointmentBookingList();
            this.userappointmentQuotesList();
            // this.bidList.splice(rowIndex, 1);
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

  findMe() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.showPosition(position);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  showPosition(position) {
    this.currentLat = position.coords.latitude;
    this.currentLong = position.coords.longitude;
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
    this.coordinates.push(position.coords.latitude);
    this.coordinates.push(position.coords.longitude);
    let location = {
      userId: this.userId
      // "coordinates": [this.currentLat, this.currentLong],
      // "radius": 0,
      // "page": "1"
    };
    this.shop.findServiceHistory(location).subscribe((res: any) => {
      if (!res.auth) {
        return;
      }
      else {
        if (res.code == 200) {
          let lbl = 1;
          let lab: number = 1;
          for (let i = 0; i < res.data.data.length; i++) {
            lab++;
            let Locations = {
              lat: res.data.data[i].location.coordinates[0],
              lng: res.data.data[i].location.coordinates[1],
              label: 'P',
              name: res.data.data[i].name,
            }
            // lab++;
            this.mechanicLocation.push(Locations)
          }
        }
        else {
          this.mechanicLocation = [];
        }
      }
    });
  }

  // list appointment details
  // userAppointmentList() {
  //   let user = {
  //     userId: this.userId,
  //     page: "1",
  //     searchText: "",
  //   }
  //   this.appoint.userAppointmentList(user).subscribe((res: any) => {
  //     if (!res.auth) {
  //       this.toaster.error(res.message);
  //     }
  //     else {
  //       if (res.code == 200) {
  //         this.appointmentList = res.data.data;
  //         console.log(this.appointmentList)
  //         this.scheduleCount = res.data.data.length;
  //       }
  //       else {
  //         this.scheduleCount = 0;
  //       }
  //     }
  //   });
  // }

  // list appointment details
  userRecentAppointmentList() {
    let user = {
      userId: this.userId,
      page: "1",
      searchText: "",
    }
    this.appoint.userRequestResponse(user).subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        if (res.code == 200) {
          this.appointmentList = res.data.task;
          // this.scheduleCount = res.data.data.totalCount;
          this.scheduleCount = res.data.totalCount;
        }
        else {
          this.scheduleCount = 0;
        }
      }
    });
  }

  // function booking appointment list
  appointmentBookingList() {
    this.bookingList = [];
    let user = {
      userId: this.userId,
      page: "1",
      searchText: "",
    }
    this.appoint.appointmentBookingList(user).subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        if (res.code == 200) {
          this.bookingList = res.data.data;
          this.bookingCount = res.data.totalCount;
        }
        else {
          this.bookingCount = 0;
        }
      }
    });
  }

  // list user bid request
  getUserBidRequest() {
    let bid = {
      userId: this.userId,
      page: "1"
    }
    this.appoint.userappointmentQuotesList(bid).subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        if (res.code == 200) {
          this.appointmentCount = res.data.totalCount;
        }
        else {
          this.appointmentCount = 0;
        }
      }
    })
  }


  // list user bid request
  userQuotesListByRequestId(Id) {
    let bid = {
      userId: this.userId,
      page: 1,
      searchText: "",
      requestId: Id
    }
    this.appoint.userQuotesListByRequestId(bid).subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        if (res.code == 200) {
          this.bidList = res.data.data;
          this.bidCount = res.data.totalCount;
        }
        else {
          this.bidList = [];
          this.bidCount = 0;
        }
      }
    })
  }

  // list user bid request
  userappointmentQuotesList() {
    this.bidList;
    let bid = {
      userId: this.userId,
      page: "1"
    }
    this.appoint.userappointmentQuotesList(bid).subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        if (res.code == 200) {
          this.bidList = res.data.data;
          this.bidCount = res.data.totalCount;
        }
        else {
          this.bidCount = 0;
        }
      }
    })
  }


  // List year
  ListYear() {
    this.repair.ListYear().subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        if (res.code == 200) {
          this.yearList = res.data;
        }
        else {
          this.yearList = [];
        }
      }
    });
  }

  // List make
  ListMake(value) {
    let yearData = {
      year: parseInt(value)
    }
    this.repair.ListMake(yearData).subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        this.yearSelect = parseInt(value);
        this.makeList = res.data;
      }
    });
  }

  // List model`
  ListModel(value) {
    let make = {
      year: this.yearSelect,
      makeId: value
    }
    this.repair.ListModel(make).subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        this.makeSelect = value;
        this.modelList = res.data;
      }
    })
  }

  // List trim

  ListTrim(Id: string) {
    let model = {
      year: this.yearSelect,
      makeId: this.makeSelect,
      modelId: Id,
    }
    this.repair.ListTrim(model).subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        this.trimList = res.data;
      }
    });
  }
  // function to get car list
  showCarList() {
    let UserObj = {
      userId: this.userId
    }
    this.user.userCarDetail(UserObj).subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        if (res.data.length == undefined) {
          this.carCount = 0;
        }
        else {
          this.carCount = res.data.length;
          this.carList = res.data;
        }
      }
    });
  }

  // function to add car
  addCarDetail() {
    let car = {
      userId: this.userId,
      year: parseInt(this.carForm.value.year),
      makeId: this.carForm.value.make,
      modelId: this.carForm.value.model,
      trimId: this.carForm.value.trim,
      mileage: this.carForm.value.mileage.toString(),
    }
    this.user.addCarDetail(car).subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        this.toaster.success(res.message);
        this.showCarList();
        this.modalReference.close();
      }
    })
  }

  // function edit car detail
  editCarDetail(carDetail) {
    let car = {
      carId: this.carDetail._id,
      userId: this.carDetail.userId,
      mileage: this.carDetail.mileage.toString()
    }
    this.user.editCarDetail(car).subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        this.toaster.success(res.message);
        this.showCarList();
        this.modalReference.close();
      }
    })
  }

  getUserAppointmentHistory() {

    let appoint = {
      userId: this.userId,
      page: this.page,
      searchText: this.searchTextActive
    }
    this.appoint.getUserBidRequestHistory(appoint).subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        if (res.code == 200) {

          this.mechanicLocationHistory = [];

          this.activeList = res.data.data;
          for (let i = 0; i < res.data.data.length; i++) {
            let Locations = {
              lat: res.data.data[i].location.coordinates[1],
              lng: res.data.data[i].location.coordinates[0],
              labelContent: i + 1,
              name: res.data.data[i].shopName,
            }
            // lab++;
            this.mechanicLocationHistory.push(Locations);

          }
        }
        else {
        }
      }
    });
  }


  ngOnInit() {
    this.findMe();
    let UsersLocal = JSON.parse(localStorage.getItem("erSuperAdminUser"));
    this.userId = UsersLocal.value._id;
    if (localStorage.getItem('issue')) {
      localStorage.removeItem('issue')
    }
    // this.userAppointmentList();
    this.userRecentAppointmentList();
    this.getUserAppointmentHistory();
    this.getUserBidRequest();
    this.ListYear();
    this.userName = UsersLocal.value.firstname + ' ' + UsersLocal.value.lastname;
    this.showCarList();
    // this.connectToChat();
    this.sendForm = this.formBuilder.group({
      message: ['', Validators.required]
    });
    this.appointmentBookingList();
    this.userappointmentQuotesList();
  }

  ngOnDestroy() {
    // this.receiveMessageObs.unsubscribe();
  }

  // function to connect user
  // connectToChat(): void {
  //   let connected = this.message.isConnected();
  //   if (connected == true) {
  //     this.initReceivers();
  //   } else {
  //     this.message.connect(this.userId, () => {
  //       this.message.sendUser(this.userId);
  //       // this.initReceivers();
  //     });
  //   }
  // }

  // function to check user active
  // isUserActive(mechanic: any) {
  // this.message.isUserActive(mechanic.mechanicId);
  // this.to = mechanic.mechanicId;
  // this.isChatOpen = true;

  // this.mechanicName = mechanic.mechanic_firstName + ' ' + mechanic.mechanic_lastName;
  // this.imageURL = this.config.imageUrl;
  // let msgObj = {
  //   from: this.userId,
  //   to: this.to,
  //   page: this.page
  // }
  // this.message.getList(msgObj);
  // this.initReceivers();
  // this.message.getMessage(msgObj).subscribe((res: any) => {
  //   if (!res.auth) {
  //     this.toaster.error(res.message);
  //   }
  //   else {
  //     if (res.code == 200) {
  //       this.messageList = res.data.data;
  //     }
  //     else {
  //       this.messageList = [];
  //     }
  //   }
  // });
  // }

  // function to receive message
  // initReceivers(): void {
  //   this.receiveMessageObs = this.message.receiveMessage()
  //     .subscribe(message => {
  //       this.messageList = message.data;
  //       // this.messageList.push(message.data);

  //     });
  // }

  //function upload message file
  // uploadMessageFile(event) {
  //   let reader = new FileReader();
  //   if (event.target.files && event.target.files.length > 0) {
  //     let file = event.target.files[0];
  //     let ext = file.name.split('.').pop();
  //     if (ext == "pdf" || ext == "jpg" || ext == "JPG" || ext == "svg" || ext == "jpeg" || ext == "JPEG" || ext == "png" || ext == "PNG" || ext == "xlsx" || ext == "xlx" || ext == "doc") {
  //       reader.readAsDataURL(file);
  //       this.filename = file.name
  //       reader.onload = () => {
  //         let fileupload = {
  //           filename: this.filename,
  //           fileext: '.' + ext,
  //           fileupload: reader.result.split(',')[1]
  //         }
  //         this.message.uploadMessageFile(fileupload).subscribe((res: any) => {
  //           if (!res.auth) {
  //             this.toaster.error(res.message);
  //           }
  //           else {
  //             this.messageFile = res.data;
  //             this.sendForm.value.message = this.messageFile;
  //             this.isFile = "1";
  //             this.onSendSubmit();
  //           }
  //         });
  //       }
  //     }
  //     else {
  //       this.toaster.error("File not found, upload again.");
  //     }
  //   }
  // }

  // function to send message
  // onSendSubmit(): void {
  //   let newMessage: Message = {
  //     from: this.userId,
  //     text: this.sendForm.value.message,
  //     to: this.to,
  //     isFile: this.isFile
  //   };
  //   this.message.sendMessage(newMessage);
  //   newMessage.mine = true;
  //   this.noMsg = false;
  //   this.messageList.push(newMessage);
  //   this.sendForm.setValue({ message: "" });
  //   this.isFile = "0";
  // }

  checkMine(message: Message): void {
    if (message.from == this.userId) {
      message.mine = true;
    }
  }

  closeChatBox() {
    this.isChatOpen = false;
  }
  markers: marker[] = this.mechanicLocation;
}

// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
}
interface Message {
  mine?: boolean;
  from: string;
  text: string;
  to: string;
  isFile: string;
}
