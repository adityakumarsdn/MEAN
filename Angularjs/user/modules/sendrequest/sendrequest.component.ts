import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from "../../../core/services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormArray, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { Utills } from "../../../core/utility/utills";
import { TmpStorage } from "../../../core/utility/temp.storage";
import { AppConfig } from "../../../core/config/app.config";
import { RepairService } from "../../../core/services/repair.service";
import { sharedService } from "../../../core/services/shared.service";
import { Subscription } from 'rxjs/Subscription';
import { NgbTimeStruct, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ShopService } from "../../../core/services/shop.service";
import { UserService } from "../../../core/services/user.service";
const now = new Date();

@Component({
  selector: 'app-sendrequest',
  templateUrl: './sendrequest.component.html',
  styleUrls: ['./sendrequest.component.css']
})
export class SendRequestComponent implements OnInit {
  tempTimeList2: { time: string; isSelected: boolean; showTime: any; }[];
  tempTimeList: { time: string; isSelected: boolean; showTime: any; }[];
  currentTime2: string;
  select: Date;
  currentTime: string;
  nexttimeList: any[];
  userName: any;
  mechanics: any;
  userId: any;
  yearValue: any;
  shops: any[] = [];
  issues: any[] = [];
  mechNo: number;
  searchText: any;
  isSchedule: boolean;
  isSelected: boolean;
  public selectForm: FormGroup;
  public loading = false;

  page: number = 1;
  totalCount: any;
  count: any = 5;
  tempCount: any = 5;
  public selectMechanic: any = 0;

  time: any;
  mechanicList: any = [];
  invalidDates: Date[];
  secondDate: any;
  firstDate: any;
  secondDayTme: any[] = [];
  firstDayTme: any[] = [];
  isClicked: boolean = false;
  selectedItem: any;
  endTime_2: string;
  startTime_2: string;
  endTime: string;
  startTime: string;
  endingTime: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  startingTime: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  appointmentDate: any;
  endingTime_2: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  startingTime_2: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  appointmentDate_2: any;
  isCarActive: boolean = false;
  isIssue: boolean = false;
  selected: string;
  selectedVal: {};
  timeList: any[] = [];
  makeList: any;
  trimList: any;
  modelList: any;
  carForm: FormGroup;
  subscription: Subscription;
  repairForm: FormGroup;
  tyreIssue: any;
  brakeIssue: any;
  transIssue: any;
  gearIssue: any;
  electeicIssue: any;
  fluidIssue: any;
  exhaustIssue: any;
  engineIssue: any;
  ACissue: any;
  symptoms: any;
  cmnIssue: any[];
  public commonIssue: any[] = [];
  // commonIssue: any;
  issuesList: any;
  minDate = new Date();
  mechanicLocation: any = [];
  public isDisabled = false
  public currentLat: any;
  public currentLong: any;
  public latitude: number;
  public longitude: number;
  lat: number;
  lng: number;
  radius: number;
  coordinates: number[] = [];
  yearList: any;
  yearSelect: number;
  makeSelect: any;
  firstSelectDate: number;
  secondSelectDate: number;
  carCount: number;
  carList: any;
  mileage: any;
  defaultMake: any;
  defaultModel: any;
  defaultTrim: any;
  carYear: any;
  isActive: boolean = false;
  isListActive: boolean = false;
  nonVerifiedId: any = null;
  selectedIssues: string[] = [];




  constructor(
    private toaster: ToastrService,
    private auth: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private utills: Utills,
    private tmpStorage: TmpStorage,
    private config: AppConfig,
    private repair: RepairService,
    private shared: sharedService,
    private shop: ShopService,
    private route: ActivatedRoute,
    private user: UserService,
  ) {
    this.selectForm = this.formBuilder.group({
      users: this.formBuilder.array([])
    });
    this.subscription = this.shared.subj$.subscribe(val => {
      this.selectedVal = val;
    })
    this.carForm = formBuilder.group({
      year: [''],
      make: [''],
      model: [''],
      trim: [''],
      mileage: new FormControl('', [Validators.maxLength(2)]),
    });
    this.repairForm = formBuilder.group({
      common: [''],
      symptom: [''],
      ac: [''],
      engine: [''],
      fluid: [''],
      exhaust: [''],
      electric: [''],
      gear: [''],
      trans: [''],
      brake: [''],
      tyre: [''],
    });
  }

  // function to get repair list
  getIssuesList() {
    this.repair.getIssuesList().subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        this.issuesList = res.data;
        this.cmnIssue = this.issuesList.filter(function (elem) {
          return elem.type == "Common Issues";
        });
        for (let i = 0; i < this.cmnIssue.length; i++) {
          // if( this.isIssue ==true){
          //   this.selectedIssues.push(this.selected);
          // }
          let Obj = {
            label: this.cmnIssue[i].name,
            value: this.cmnIssue[i]._id
          }

          this.commonIssue.push(Obj);

        }
        // console.log("issues", this.commonIssue);
        this.symptoms = this.issuesList.filter(function (elem) {
          return elem.type == "Symptoms";
        });
        this.ACissue = this.issuesList.filter(function (elem) {
          return elem.type == "AC";
        });
        this.engineIssue = this.issuesList.filter(function (elem) {
          return elem.type == "Engine";
        });
        this.exhaustIssue = this.issuesList.filter(function (elem) {
          return elem.type == "Exhaust";
        });
        this.fluidIssue = this.issuesList.filter(function (elem) {
          return elem.type == "Fluids";
        });
        this.electeicIssue = this.issuesList.filter(function (elem) {
          return elem.type == "Electrical";
        });
        this.gearIssue = this.issuesList.filter(function (elem) {
          return elem.type == "Gear";
        });
        this.transIssue = this.issuesList.filter(function (elem) {
          return elem.type == "Transmission";
        });
        this.brakeIssue = this.issuesList.filter(function (elem) {
          return elem.type == "Brakes";
        });
        this.tyreIssue = this.issuesList.filter(function (elem) {
          return elem.type == "Tires";
        });
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

  // get car detail
  getCar(Id, car) {
    let year = {
      year: car.year
    }
    this.yearList = [];
    this.yearList.push(year);
    this.carYear = car.year;
    // this.ListMake(car.year);
    let make = {
      make: car.makeId,
      year: car.year
    }
    this.makeList = [];
    this.defaultMake = car.makeId;
    this.defaultModel = car.modelId;
    this.defaultTrim = car.trimId;
    this.mileage = car.mileage;
    this.makeList.push(make);
    let model = {
      make: car.makeId,
      model: car.modelId,
      year: car.year
    }
    this.modelList = [];
    this.modelList.push(model);
    let trim = {
      make: car.makeId,
      model: car.modelId,
      year: car.year,
      trim: car.trimId
    }
    this.trimList = [];
    this.trimList.push(trim)
  }


  pageChange(pages: number): void {
    this.page = pages;
    // this.findMe();
    this.getShopList(this.searchText);
  }
  pageChangeActive(pages: number): void {
    this.page = pages;
    this.getShopList(this.searchText);
  }


  getShopList(Text) {
    this.tempCount = 5;

    this.isDisabled = true;
    (document.getElementById('search') as HTMLInputElement).innerHTML = "Searching"
    // //this.loading = true;
    this.findMe();

    // this.searchRadius = "";

    var zipcode = parseInt(Text);
    this.searchText = Text;



    if (isNaN(zipcode)) {
      // console.log('not a num,ber')
      let position = JSON.parse(localStorage.getItem('coordinate'));
      this.currentLat = position.lat;
      this.currentLong = position.long;

      let location = {
        "coordinates": [this.currentLat, this.currentLong],
        // "coordinates": [39.92323, -75.62515],
        "radius": 10,
        "page": "1",
        "searchText": Text,
        "count": this.count
      };


      // this.serchmachanicRequest = true
      this.shop.findShopRadius(location).subscribe((res: any) => {
        // this.serchmachanicRequest = false
        if (!res.auth) {
          // //this.loading = false;

        } else {
          // console.log("-------------->elsee", res.data)
          this.isDisabled = false;
          (document.getElementById('search') as HTMLInputElement).innerHTML = "Search";
          if (res.code == 200) {
            this.mechanicLocation = []
            this.lat = res.data[0].location.coordinates[1];
            this.lng = res.data[0].location.coordinates[0];
            this.isSelected = false;
            let lbl = 1;
            this.mechanicList = res.data;
            // for (let i = 0; i < this.mechanicList.length; i++) {
            //   if (this.mechanicList[i].rating == 0) {

            //     this.findAndAppend(this.mechanicList[i]).then((val) => {
            //       this.mechanicList[i] = val;

            //     });

            //   }
            // }
            // for (let i = 0; i < this.mechanicList.length; i++) {
            //   if (this.mechanicList[i].ratingData.length) {
            //     let ret = Math.round(this.mechanicList[i].ratingData.reduce(function (a, b) { return a + b.rating; }, 0) / this.mechanicList[i].ratingData.length);
            //     this.mechanicList[i].rating = 3.5
            //   } else {
            //     this.mechanicList[i].rating = 3.5
            //   }
            // }
            // this.mechanicList.map(function (item, index) {
            //   console.log(" index =", index)
            //   item['index'] = index + 1;
            // });
            this.totalCount = res.totalCount;
            this.mechNo = res.data.length;
            let lab: number = 1;
            for (let i = 0; i < res.data.length; i++) {
              let Locations = {
                lat: res.data[i].location.coordinates[1],
                lng: res.data[i].location.coordinates[0],
                labelContent: i + 1,
                name: res.data[i].name,
                draggable: true

              }
              this.mechanicLocation.push(Locations)
            }
          } else {
            this.mechanicList = [];
            this.mechanicLocation = [];
            this.mechNo = 0;
            // //this.loading = false;
          }
        }
      });
    } else {

      var geocoder = new google.maps.Geocoder();
      var address = zipcode;
      let self = this;

      // console.log('search text :: ->', searchText);
      geocoder.geocode({ 'address': Text }, (results, status) => {
        // console.log('status', status)
        if (status == google.maps.GeocoderStatus.OK) {
          this.currentLat = results[0].geometry.location.lat();
          this.currentLong = results[0].geometry.location.lng();
          let location = {
            "coordinates": [results[0].geometry.location.lat(), results[0].geometry.location.lng()],
            // "coordinates": [39.92323, -75.62515],
            "radius": 10,
            "page": "1",
            "searchText": Text,
            "count": this.count
          };
          // //this.loading = true;
          // this.serchmachanicRequest = true
          this.shop.findShopRadius(location).subscribe((res: any) => {
            // //this.loading = false;

            // this.serchmachanicRequest = false
            if (!res.auth) {
            } else {
              if (res.data.length > 0) {
                this.mechanicList = [];
                // console.log('zxfxzf', this.mechanicList)

                // //this.loading = false

                this.mechanicList = res.data;
                // for (let i = 0; i < this.mechanicList.length; i++) {
                //   if (this.mechanicList[i].ratingData.length) {
                //     let ret = Math.round(this.mechanicList[i].ratingData.reduce(function (a, b) { return a + b.rating; }, 0) / this.mechanicList[i].ratingData.length);
                //     this.mechanicList[i].rating = ret
                //   } else {
                //     this.mechanicList[i].rating = Number(0)
                //   }
                // }
                // for (let i = 0; i < this.mechanicList.length; i++) {
                //   if (this.mechanicList[i].rating == 0) {

                //     this.findAndAppend(this.mechanicList[i]).then((val) => {
                //       this.mechanicList[i] = val;

                //     });

                //   }
                // }
                //google.maps.event.addDomListener(window, 'load', this.initialize);
                let Map_Locations = []
                this.mechanicLocation = []
                this.lat = res.data[0].location.coordinates[1];
                this.lng = res.data[0].location.coordinates[0];
                this.isSelected = false;
                let lbl = 1;


                // this.mechanicList.map((item, index) => {
                //   console.log('index', index)
                //   item['index'] = index + 1;
                // });
                // console.log('zxfxzf', this.mechanicList)
                this.totalCount = res.totalCount;
                let maps = document.querySelector('agm-map');
                google.maps.event.addDomListener(window, 'load', this.initialize);


                this.isDisabled = false;
                (document.getElementById('search') as HTMLInputElement).innerHTML = "Search";

                this.mechNo = res.data.length;
                let lab: number = 1;
                for (let i = 0; i < res.data.length; i++) {
                  let Locations = {

                    lat: res.data[i].location.coordinates[1],
                    lng: res.data[i].location.coordinates[0],
                    labelContent: i + 1,
                    name: res.data[i].name,
                    draggable: true

                  }
                  Map_Locations.push(Locations)
                }
                this.mechanicLocation = Map_Locations;
                // console.log("MechanicsListCheck", self.mechanicList, self.mechanicLocation, self.mechNo)
              }
              else {
                this.mechanicList = [];
                this.mechanicLocation = [];
                this.mechNo = 0;
                // console.log("no location")
                this.isDisabled = false;
                (document.getElementById('search') as HTMLInputElement).innerHTML = "Search";
                //this.loading = false;
              }
            }
          });
        } else {
          // console.log('nothing is here');
        }
      });

    }
  }



  //update count
  updateCount() {
    this.tempCount = this.tempCount + 5
    let location;
    if (this.searchText != "") {
      location = {
        "coordinates": [this.currentLat, this.currentLong],
        // "coordinates": [39.92323, -75.62515],
        "radius": 10,
        "page": "1",
        "searchText": this.searchText,
        "count": this.tempCount
      };
    }

    // this.serchmachanicRequest = true
    this.shop.findShopRadius(location).subscribe((res: any) => {
      // this.serchmachanicRequest = false
      if (!res.auth) {
      }
      else {
        if (res.data.length > 0) {
          this.mechanicLocation = []
          this.lat = res.data[0].location.coordinates[1];
          this.lng = res.data[0].location.coordinates[0];
          this.isSelected = false;
          let lbl = 1;
          this.mechanicList = res.data;
          // for (let i = 0; i < this.mechanicList.length; i++) {
          //   if (this.mechanicList[i].rating == 0) {

          //     this.findAndAppend(this.mechanicList[i]).then((val) => {
          //       this.mechanicList[i] = val;

          //     });

          //   }
          // }
          // // this.tempMechanicList = this.mechanicList;
          // for (let i = 0; i < this.mechanicList.length; i++) {
          //   if (this.mechanicList[i].ratingData.length) {
          //     let ret = Math.round(this.mechanicList[i].ratingData.reduce(function (a, b) { return a + b.rating; }, 0) / this.mechanicList[i].ratingData.length);
          //     this.mechanicList[i].rating = ret
          //   } else {
          //     this.mechanicList[i].rating = Number(0)
          //   }
          // }
          this.totalCount = res.totalCount;
          // this.tempTotalCount = this.totalCount;
          this.mechNo = res.data.length;
          let lab: number = 1;
          // this.mechanicList.map((item, index) => {
          //   console.log('index', index)
          //   item['index'] = index + 1;
          // });
          for (let i = 0; i < res.data.length; i++) {
            let Locations = {
              lat: res.data[i].location.coordinates[1],
              lng: res.data[i].location.coordinates[0],
              labelContent: i + 1,
              name: res.data[i].name,
              draggable: true

            }
            this.mechanicLocation.push(Locations)
          }
        }
        else {
          this.mechanicList = [];
          this.mechanicLocation = [];
          this.mechNo = 0;
        }
      }
    });
  }

  initialize() {
    var prop = {
      center: new google.maps.LatLng(this.latitude, this.longitude),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("w3docs-map"), prop);
  }
  // function to get shop list
  findMe() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // this.showPosition(position);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }


  findAndAppend(item) {
    // console.log("inside findAndAppend")

    return new Promise((resolve, reject) => {

      try {

        // if (item.nonVerifiedId) {
        //     Shop.findOne({ _id: item.nonVerifiedId }, {
        //         _id: 1,
        //         name: 1,
        //     }, function (err, shopData) {
        //         if (err) {
        //             console.log('err', err);
        //             resolve(item)
        //         } else {
        //             console.log("ADITYA###############", shopData)
        //             item.nonVerifiedName = shopData.name;
        //             console.log("ASDFGGGGGGGGGGGGGGGGG", item.nonVerifiedName)
        //             resolve(item)
        //         }
        //     });
        // } else {
        //     item.nonVerifiedName = '';
        //     resolve(item)
        // }



        let yelpObj = {

          "term": item.name,
          "location": item.address.city
        }
        // console.log("checking!!!!!!!!!!", this.tempMechanicList)

        this.shop.getYelpRating(yelpObj).subscribe((yelpres: any) => {
          if (!yelpres.auth) {
            // this.toaster.error(res.message);
          }
          else if (yelpres.data == undefined) {
            // item.yelpRating = 0;
            // item.rating = Number(0);
            // resolve(item)
            // resolve(item)
          }
          else {
            item.yelpRating = yelpres.data.rating;
            resolve(item);
            // console.log("item", item)


          }
        })

      } catch (error) {
        resolve(item)
      }
    })
  }


  showPosition() {
    let position = JSON.parse(localStorage.getItem('coordinate'));
    this.currentLat = position.lat;
    this.currentLong = position.long;
    this.lat = position.lat;
    this.lng = position.long;
    // this.coordinates.push(position.coords.latitude);
    // this.coordinates.push(position.coords.longitude);
    let location = {
      "coordinates": [this.currentLat, this.currentLong],
      "radius": 10,
      "page": "1",
      'count': this.count
      // "searchText":searchText
    };
    this.shop.findShopRadius(location).subscribe((res: any) => {
      if (!res.auth) {
      }
      else {
        if (res.data.length > 0) {
          let lbl = 1;
          this.mechanicList = res.data;
          // for (let i = 0; i < this.mechanicList.length; i++) {
          //   if (this.mechanicList[i].rating == 0) {

          //     this.findAndAppend(this.mechanicList[i]).then((val) => {
          //       this.mechanicList[i] = val;

          //     });

          //   }
          // }
          this.mechNo = res.data.length;
          this.totalCount = res.data.totalCount;
          let lab: number = 1;
          for (let i = 0; i < res.data.length; i++) {
            let Locations = {
              lat: res.data[i].location.coordinates[0],
              lng: res.data[i].location.coordinates[1],
              labelContent: i + 1,
              name: res.data[i].name,
            }
            // lab++;
            this.mechanicLocation.push(Locations)
          }
        }
        else {
          this.mechNo = 0;
        }
      }
    });
  }

  sendRequest(Id: string, isChecked: boolean) {
    const userFormArray = <FormArray>this.selectForm.controls.users;
    if (isChecked) {
      userFormArray.push(new FormControl(Id));
    } else {
      let index = userFormArray.controls.findIndex(x => x.value == Id)
      userFormArray.removeAt(index);
    }
    this.isSelected = false;
    this.isSchedule = false;
    if (userFormArray.value.length > 1) {
      this.isSelected = true;
      this.isSchedule = true;
      this.mechanics = userFormArray.value;
    }
    this.selectMechanic = userFormArray.value.length;
  }

  sendSingleRequest(mechId) {
    this.mechanics = [];
    this.mechanics.push(mechId);
    this.saveRequest();
    // this.setVaID(id);
  }



  firstDay(event, newValue, time) {


    // this.firstDayTme = [];
    if (!this.select) {
      this.toaster.error('Please select date');
      return;
    }
    time.isSelected = !time.isSelected;
    if (event.srcElement.id) {
      this.isClicked = !this.isClicked;
    }
    if (this.firstDayTme.length > 0) {

      const result = this.firstDayTme.find(data => data === newValue);
      const index = this.firstDayTme.findIndex(data => data === newValue)
      if (result) {
        this.firstDayTme.splice(index, 1);
      }
      else {
        this.firstDayTme.push(newValue);
      }
    }
    else {
      this.firstDayTme.push(newValue);
    }
    // for (var i = 0; i < this.timeList.length; i++) {

    //   if (this.timeList[i].time != time.time) {
    //     this.timeList[i].isSelected = false;
    //   }
    //   else {

    //     this.timeList[i].isSelected = true;

    //   }

    // }
  }


  onBlurMethod(event) {
    if (this.firstSelectDate !== new Date(event).getDate()) {
      this.timeList = [];
      this.firstDayTme = [];

    }


    let date = new Date();
    let hour = date.getHours()
    let period = date.getHours() >= 12 ? 'PM' : 'AM';
    let newTime = hour + ':00'
    this.currentTime = newTime;

    this.showtimeList();
    var d1 = new Date().getDate();
    var d2 = new Date(event).getDate();
    this.firstSelectDate = new Date(event).getDate();
    this.select = new Date(event);
    if (d1 != d2) {
      this.timeList = [
        { time: "8:00  AM", isSelected: false, showTime: "8:00" },
        { time: "9:00  AM", isSelected: false, showTime: "9:00" },
        { time: "10:00 AM", isSelected: false, showTime: "10:00" },
        { time: "11:00 AM", isSelected: false, showTime: "11:00" },
        { time: "12:00 PM", isSelected: false, showTime: "12:00" },
        { time: "01:00 PM", isSelected: false, showTime: "13:00" },
        { time: "02:00 PM", isSelected: false, showTime: "14:00" },
        { time: "03:00 PM", isSelected: false, showTime: "15:00" },
        { time: "04:00 PM", isSelected: false, showTime: "16:00" },
        { time: "05:00 PM", isSelected: false, showTime: "17:00" },
        { time: "06:00 PM", isSelected: false, showTime: "18:00" }
      ];
      for (var i = 0; i < this.timeList.length; i++) {
        if (this.timeList[i].time == this.firstDayTme[0]) {
          this.timeList[i].isSelected = true
        }
      }



    }

  }
  onBlurMethod2(event) {
    if (this.secondSelectDate !== new Date(event).getDate()) {
      this.nexttimeList = [];
      this.secondDayTme = [];

    }
    this.secondSelectDate = new Date(event).getDate();
    if (this.firstSelectDate == this.secondSelectDate) {
      this.toaster.error('Please select different date.');
      this.secondDate = '';
      return;
    }
    this.nexttimeList = [];
    let date = new Date();
    let hour = date.getHours()
    let period = date.getHours() >= 12 ? 'PM' : 'AM';
    let newTime = hour + ':00'
    this.currentTime2 = newTime;

    this.showtimeList2();
    var d1 = new Date().getDate();
    var d2 = new Date(event).getDate();

    this.select = new Date(event);
    if (d1 != d2) {

      this.nexttimeList = [
        { time: "8:00  AM", isSelected: false, showTime: "8:00" },
        { time: "9:00  AM", isSelected: false, showTime: "9:00" },
        { time: "10:00 AM", isSelected: false, showTime: "10:00" },
        { time: "11:00 AM", isSelected: false, showTime: "11:00" },
        { time: "12:00 PM", isSelected: false, showTime: "12:00" },
        { time: "01:00 PM", isSelected: false, showTime: "13:00" },
        { time: "02:00 PM", isSelected: false, showTime: "14:00" },
        { time: "03:00 PM", isSelected: false, showTime: "15:00" },
        { time: "04:00 PM", isSelected: false, showTime: "16:00" },
        { time: "05:00 PM", isSelected: false, showTime: "17:00" },
        { time: "06:00 PM", isSelected: false, showTime: "18:00" }
      ];
      for (var i = 0; i < this.nexttimeList.length; i++) {
        if (this.nexttimeList[i].time == this.secondDayTme[0]) {
          this.nexttimeList[i].isSelected = true
        }
      }


    }

  }




  showtimeList() {

    let date = new Date();
    let hour = date.getHours() - (date.getHours() >= 12 ? 12 : 0);
    let period = date.getHours() >= 12 ? 'PM' : 'AM';
    let newTime = '0' + hour + ':00'

    this.tempTimeList = [
      { time: "8:00 AM", isSelected: false, showTime: "8:00" },
      { time: "9:00 AM", isSelected: false, showTime: "9:00" },
      { time: "10:00 AM", isSelected: false, showTime: "10:00" },
      { time: "11:00 AM", isSelected: false, showTime: "11:00" },
      { time: "12:00 PM", isSelected: false, showTime: "12:00" },
      { time: "01:00 PM", isSelected: false, showTime: "13:00" },
      { time: "02:00 PM", isSelected: false, showTime: "14:00" },
      { time: "03:00 PM", isSelected: false, showTime: "15:00" },
      { time: "04:00 PM", isSelected: false, showTime: "16:00" },
      { time: "05:00 PM", isSelected: false, showTime: "17:00" },
      { time: "06:00 PM", isSelected: false, showTime: "18:00" }
    ];
    let curTime = parseInt(this.currentTime.split(':')[0]);

    for (let i = 0; i < this.tempTimeList.length; i++) {
      let showTime = parseInt(this.tempTimeList[i].showTime.split(':')[0])
      if (curTime < showTime) {
        this.timeList.push({
          time: this.tempTimeList[i].time,
          isSelected: false,
          showTime: this.tempTimeList[i].showTime
        });

      }

    }

  }




  showtimeList2() {

    let date = new Date();
    let hour = date.getHours() - (date.getHours() >= 12 ? 12 : 0);
    let period = date.getHours() >= 12 ? 'PM' : 'AM';
    let newTime = '0' + hour + ':00'

    this.tempTimeList2 = [
      { time: "8:00 AM", isSelected: false, showTime: "8:00" },
      { time: "9:00 AM", isSelected: false, showTime: "9:00" },
      { time: "10:00 AM", isSelected: false, showTime: "10:00" },
      { time: "11:00 AM", isSelected: false, showTime: "11:00" },
      { time: "12:00 PM", isSelected: false, showTime: "12:00" },
      { time: "01:00 PM", isSelected: false, showTime: "13:00" },
      { time: "02:00 PM", isSelected: false, showTime: "14:00" },
      { time: "03:00 PM", isSelected: false, showTime: "15:00" },
      { time: "04:00 PM", isSelected: false, showTime: "16:00" },
      { time: "05:00 PM", isSelected: false, showTime: "17:00" },
      { time: "06:00 PM", isSelected: false, showTime: "18:00" }
    ];
    let currentTime = parseInt(this.currentTime2.split(':')[0]);

    for (let i = 0; i < this.tempTimeList2.length; i++) {
      let showTime = parseInt(this.tempTimeList2[i].showTime.split(':')[0])
      if (currentTime <= showTime) {
        this.nexttimeList.push({
          time: this.tempTimeList2[i].time,
          isSelected: false,
          showTime: this.tempTimeList2[i].showTime
        })
      }

    }

  }









  showTempTimeList() {
    this.timeList = [
      { time: "8:00  AM", isSelected: false, showTime: "8:00" },
      { time: "9:00  AM", isSelected: false, showTime: "9:00" },
      { time: "10:00 AM", isSelected: false, showTime: "10:00" },
      { time: "11:00 AM", isSelected: false, showTime: "11:00" },
      { time: "12:00 PM", isSelected: false, showTime: "12:00" },
      { time: "01:00 PM", isSelected: false, showTime: "13:00" },
      { time: "02:00 PM", isSelected: false, showTime: "14:00" },
      { time: "03:00 PM", isSelected: false, showTime: "15:00" },
      { time: "04:00 PM", isSelected: false, showTime: "16:00" },
      { time: "05:00 PM", isSelected: false, showTime: "17:00" },
      { time: "06:00 PM", isSelected: false, showTime: "18:00" }
    ];
  }


  showTempTimeList2() {
    this.nexttimeList = [
      { time: "8:00  AM", isSelected: false, showTime: "8:00" },
      { time: "9:00  AM", isSelected: false, showTime: "9:00" },
      { time: "10:00 AM", isSelected: false, showTime: "10:00" },
      { time: "11:00 AM", isSelected: false, showTime: "11:00" },
      { time: "12:00 PM", isSelected: false, showTime: "12:00" },
      { time: "01:00 PM", isSelected: false, showTime: "13:00" },
      { time: "02:00 PM", isSelected: false, showTime: "14:00" },
      { time: "03:00 PM", isSelected: false, showTime: "15:00" },
      { time: "04:00 PM", isSelected: false, showTime: "16:00" },
      { time: "05:00 PM", isSelected: false, showTime: "17:00" },
      { time: "06:00 PM", isSelected: false, showTime: "18:00" }
    ];
  }

  secondDay(event, newValue, time) {
    // this.secondDayTme = [];

    if (!this.select) {
      this.toaster.error('Please select date');
      return;
    }
    if (this.firstSelectDate === this.secondSelectDate) {
      this.toaster.error('Please select different date.');
      return;
    }
    if (!this.secondSelectDate) {
      this.toaster.error('Please select date');
      return;
    }

    time.isSelected = !time.isSelected;
    if (this.secondDayTme.length > 0) {
      const result = this.secondDayTme.find(data => data === newValue);
      const index = this.secondDayTme.findIndex(data => data === newValue)
      if (result) {
        this.secondDayTme.splice(index, 1);
      }
      else {
        this.secondDayTme.push(newValue);
      }
    }
    else {
      this.secondDayTme.push(newValue);
    }
    // for (var i = 0; i < this.nexttimeList.length; i++) {

    //   if (this.nexttimeList[i].time != time.time) {
    //     this.nexttimeList[i].isSelected = false;
    //   }
    //   else {
    //     this.nexttimeList[i].isSelected = true;

    //   }

    // }
    this.isClicked = !this.isClicked;
  }


  // function to get user detail
  getUser() {
    let UsersLocal = JSON.parse(localStorage.getItem("erSuperAdminUser"));
    this.userId = UsersLocal.value._id;

    let user = {
      userId: this.userId
    }
    this.user.userDetailById(user).subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        this.userName = res.data.firstname + ' ' + res.data.lastname;
      }
    })
  }
  setVaID(id) {

    this.nonVerifiedId = id;
    this.mechanics = [];
    // 5af043d57dc8b9764f8b523e
    this.mechanics.push("5af043d57dc8b9764f8b523e");
    this.saveRequest();
    // let UsersLocal = JSON.parse(localStorage.getItem("erSuperAdminUser"));
    // this.userId = UsersLocal.value._id;
    // while (this.issues.length) {
    //   this.issues.pop();
    // }
    // this.issues.push(this.repairForm.value.common, this.repairForm.value.symptom, this.repairForm.value.ac,
    //   this.repairForm.value.engine, this.repairForm.value.fluid, this.repairForm.value.exhaust, this.repairForm.value.electric,
    //   this.repairForm.value.gear, this.repairForm.value.trans, this.repairForm.value.brake, this.repairForm.value.tyre)

    // this.issues = this.issues.filter(v => v != '');
    // if (this.issues.length <= 0) {
    //   return;
    // }
    // let repairRequest = {
    //   userId: this.userId,
    //   year: 0,
    //   makeId: this.carForm.value.make,
    //   modelId: this.carForm.value.model,
    //   trimId: this.carForm.value.trim,
    //   mileage: this.carForm.value.mileage.toString(),
    //   issues: this.issues,
    //   firstDate: this.firstDate,
    //   firstDayTme: this.firstDayTme,
    //   secondDate: this.secondDate,
    //   secondDayTme: this.secondDayTme,
    //   mechanicId: this.mechanics,
    //   nonVerifiedId: this.nonVerifiedId,

    // }
    // console.log(this.issues);
    // if (!this.carYear) {
    //   repairRequest.year = parseInt(this.carForm.value.year);
    // }
    // else {
    //   repairRequest.year = this.carYear
    // }

    // this.repair.sendLogedInUserRequest(repairRequest).subscribe((res: any) => {
    //   if (!res.auth) {
    //     this.toaster.error(res.message);
    //   }
    //   else {
    //     this.toaster.success(res.message);
    //     this.nonVerifiedId = null;
    //     this.router.navigate(['/user/dashboard']);
    //   }
    // })


  }

  saveRequest() {
    let UsersLocal = JSON.parse(localStorage.getItem("erSuperAdminUser"));
    this.userId = UsersLocal.value._id;
    while (this.issues.length) {
      this.issues.pop();
    }
    if (Array.isArray(this.repairForm.value.common)) {
      for (let i = 0; i < this.repairForm.value.common.length; i++) {
        this.issues.push(this.repairForm.value.common[i]);
      }
    } else {
      this.issues.push(this.repairForm.value.common);
    }


    this.issues.push(this.repairForm.value.symptom, this.repairForm.value.ac,
      this.repairForm.value.engine, this.repairForm.value.fluid, this.repairForm.value.exhaust, this.repairForm.value.electric,
      this.repairForm.value.gear, this.repairForm.value.trans, this.repairForm.value.brake, this.repairForm.value.tyre)

    this.issues = this.issues.filter(v => v != '');
    if (this.issues.length <= 0) {
      return;
    }

    if (this.startingTime.hour > 12) {
      this.startingTime.hour = this.startingTime.hour - 12;
      this.startTime = this.startingTime.hour + ':' + this.startingTime.minute + ' PM'
    }
    else {
      this.startTime = this.startingTime.hour + ':' + this.startingTime.minute + ' AM'
    }
    if (this.endingTime.hour > 12) {
      this.endingTime.hour = this.endingTime.hour - 12;
      this.endTime = this.endingTime.hour + ':' + this.endingTime.minute + ' PM'
    }
    else {
      this.endTime = this.endingTime.hour + ':' + this.endingTime.minute + ' AM'
    }
    if (this.startingTime_2.hour > 12) {
      this.startingTime_2.hour = this.startingTime_2.hour - 12;
      this.startTime_2 = this.startingTime_2.hour + ':' + this.startingTime_2.minute + ' PM'
    }
    else {
      this.startTime_2 = this.startingTime_2.hour + ':' + this.startingTime_2.minute + ' AM'
    }
    if (this.endingTime_2.hour > 12) {
      this.endingTime_2.hour = this.endingTime_2.hour - 12;
      this.endTime_2 = this.endingTime_2.hour + ':' + this.endingTime_2.minute + ' PM'
    }
    else {
      this.endTime_2 = this.endingTime_2.hour + ':' + this.endingTime_2.minute + ' AM'
    }
    let repairRequest = {
      userId: this.userId,
      year: this.yearValue,
      makeId: this.carForm.value.make,
      modelId: this.carForm.value.model,
      trimId: this.carForm.value.trim,
      mileage: this.carForm.value.mileage.toString(),
      issues: this.issues,
      firstDate: this.firstDate,
      firstDayTme: this.firstDayTme,
      secondDate: this.secondDate,
      secondDayTme: this.secondDayTme,
      mechanicId: this.mechanics,
      nonVerifiedId: this.nonVerifiedId,

    }
    if (!this.carYear) {
      repairRequest.year = parseInt(this.carForm.value.year);
    }
    else {
      repairRequest.year = this.carYear
    }

    this.repair.sendLogedInUserRequest(repairRequest).subscribe((res: any) => {
      if (!res.auth) {
        this.toaster.error(res.message);
      }
      else {
        this.toaster.success(res.message);
        this.router.navigate(['/user/dashboard']);
      }
    })
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
        if (!res.data) {
          this.carCount = 0;
        }
        else {
          this.carCount = res.data.length;
          this.carList = res.data;
        }
      }
    });
  }

  changeIsActive() {
    this.isActive = true;
    this.isListActive = true;
  }
  ngOnInit() {
    let UsersLocal = JSON.parse(localStorage.getItem("erSuperAdminUser"));
    this.userId = UsersLocal.value._id;
    // this.findMe();
    this.showPosition();
    this.getIssuesList();
    this.ListYear();
    this.showCarList();
    // this.showtimeList();
    this.showTempTimeList()
    this.showTempTimeList2()
    let today = new Date();
    let invalidDate = new Date();
    invalidDate.setDate(today.getDate() - 1);
    this.invalidDates = [invalidDate];
    this.getUser();
  }

}
interface Issues {
  _id: string;
  isActive: boolean;
  isDeleted: boolean;
  name: string;
  type: string;
}