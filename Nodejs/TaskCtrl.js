'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    UserRole = require('../models/userrole'),
    Role = mongoose.model('Role'),
    AuthUser = require('./AuthCtrl.js'),
    NotificationCtrl = require('./NotificationCtrl.js'),
    Task = mongoose.model('Task'),
    VoiceTask = mongoose.model('VoiceTask'),
    DeviceToken = require('../models/deviceToken'),
    Terms = mongoose.model('Term'),
    Work = mongoose.model('Work'),
    Privacy = mongoose.model('Privacy'),
    Shop = mongoose.model('Shop'),
    Appointment = mongoose.model('Appointment'),
    MechanicTask = mongoose.model('MechanicTask'),
    Notification = mongoose.model('Notification'),
    Car = mongoose.model('Car'),
    jwt = require('jsonwebtoken'),
    VoiceTask = mongoose.model('VoiceTask'),
    BidAppointment = mongoose.model('BidAppointment'),
    RepairRequest = mongoose.model('RepairRequest'),
    Issue = mongoose.model('Issue'),
    SubIssue = mongoose.model('SubIssue'),
    Response = require('../lib/response.js'),
    formidable = require('formidable'),
    util = require('util'),
    fs = require('fs-extra'),
    Promise = require('promise'),
    path = require('path'),
    utility = require('../lib/utility.js'),
    constantsObj = require('./../../constants'),
    config = require('../../config/config.js'),
    validator = require('validator'),
    async = require('async'),
    co = require('co'),
    us = require('underscore'),
    crypto = require('crypto'),
    base64 = require('file-base64'),
    common = require('../../config/common.js');

module.exports = {
    addTaskRequest: addTaskRequest,
    addVoiceTaskRequest: addVoiceTaskRequest,
    listUserTaskRequest: listUserTaskRequest,
    listRepairRequest: listRepairRequest,
    scheduleAppointment: scheduleAppointment,
    bidAppointment: bidAppointment,
    getIssuesList: getIssuesList,
    subIssuesList: subIssuesList,
    sendRequest: sendRequest,
    sendLogedInUserRequest: sendLogedInUserRequest,
    mechanicRepairRequest: mechanicRepairRequest,
    userAppointmentList: userAppointmentList,
    mechanicAppointmentList: mechanicAppointmentList,
    mechanicAcceptRejectSchedule: mechanicAcceptRejectSchedule,
    getAppointmentDetail: getAppointmentDetail,
    userAppointmentDelete: userAppointmentDelete,
    userRequestDelete: userRequestDelete,
    assistantAppointmentDelete: assistantAppointmentDelete,
    acceptRejectBidRequest: acceptRejectBidRequest,
    getUserBidRequest: getUserBidRequest,
    bidRequestDetail: bidRequestDetail,
    appointmentListByVA: appointmentListByVA,
    listVoiceRequest: listVoiceRequest,
    userBidRequestDelete: userBidRequestDelete,
    userAppointmentHistoryList: userAppointmentHistoryList,
    getUserBidRequestHistory: getUserBidRequestHistory,
    getMechanicBidRequest: getMechanicBidRequest,
    getMechanicBidRequestHistory: getMechanicBidRequestHistory,
    mechanicBidRequestDelete: mechanicBidRequestDelete,
    appointmentHistoryListByVA: appointmentHistoryListByVA,
    mechanicDoneStatus: mechanicDoneStatus,
    sendRequestRegisteredUser: sendRequestRegisteredUser,
    deleteMechanicRepairRequest: deleteMechanicRepairRequest,
    getMechanicAcceptedBidRequest: getMechanicAcceptedBidRequest,
    getMechanicDeclinedBidRequest: getMechanicDeclinedBidRequest,
    mechanicDashboardAppointment: mechanicDashboardAppointment,
    userRecentAppointmentList: userRecentAppointmentList,
    appointmentBookingList: appointmentBookingList,
    userappointmentQuotesList: userappointmentQuotesList,
    userRequestResponse: userRequestResponse,
    getMechanicQuotes: getMechanicQuotes,
    getMechanicBookings: getMechanicBookings,
    userQuotesListByRequestId: userQuotesListByRequestId,
    getTermDetail: getTermDetail,
    addTermsDetail: addTermsDetail,
    editTermsDetail: editTermsDetail,
    getPrivacyDetail: getPrivacyDetail,
    addPrivacyDetail: addPrivacyDetail,
    editPrivacyDetail: editPrivacyDetail,
    addWorkDetail: addWorkDetail,
    editWorkDetail: editWorkDetail,
    getWorkDetail: getWorkDetail,
    listWorkDetail: listWorkDetail

};

/**
 * Function is to add task request
 * @access private
 * @return json
 * Created by Aditya
 * @smartData Enterprises (I) Ltd
 * Created Date 04-May-2018
 */
function addTaskRequest(req, res) {
    if (!req.body.issueId && !req.body.userId) {
        return res.json(Response(402, "failed", constantsObj.validationMessages.requiredFieldsMissing));
    } else {
        for (var i = 0; i < req.body.issues.length; i++) {
            var taskDetail = {
                issueId: req.body.issues[i],
                userId: req.body.userId,
                carId: req.body.carId,
            }
            new Task(taskDetail).save(function (err, taskData) {
                if (err) {
                    return res.json(Response(500, "failed", utility.validationErrorHandler(err), err));
                }
            });
        }
        return res.json(Response(200, "success", constantsObj.messages.taskAdded, ""));

    }
}

/**
 * Function is to add voice task request
 * @access private
 * @return json
 * Created by Aditya
 * @smartData Enterprises (I) Ltd
 * Created Date 04-May-2018
 */
function addVoiceTaskRequest(req, res) {
    var timestamp = Number(new Date()); // current time as number
    var file = req.swagger.params.audiofile.value;
    var userId = req.swagger.params.userId.value;
    var splitFileName = file.originalname.split('.');
    var ext = splitFileName[splitFileName.length - 1].toLowerCase();
    var filename = userId + '_' + timestamp + '.' + ext;
    var audiopath = "/usr/share/nginx/html/assets/audio-request/" + filename;
    utility.fileUpload(path.resolve(audiopath), file.buffer).then(function () {
        var voiceTaskDetail = {
            userId: req.body.userId,
            audiopath: filename
        }
        new VoiceTask(voiceTaskDetail).save(function (err, voiceTaskData) {
            if (err) {
                return res.json(Response(500, "failed", utility.validationErrorHandler(err), err));
            } else {
                return res.json(Response(200, "success", constantsObj.messages.voiceTaskAdded, voiceTaskData));
            }
        });
    }).catch(function (err) {
        res.jsonp(Error(constant.statusCode.error, constant.messages.requestNotProcessed, err));
    });
}


/**
 * Function is to get user task 
 * @access private
 * @return json
 * Created by Aditya
 * @smartData Enterprises (I) Ltd
 * Created Date 09-May-2018
 */
function listUserTaskRequest(req, res) {
    new Promise(function (resolve, reject) {
        if (!req.body.userId) {
            reject(res.json(Response(402, "failed", constantsObj.validationMessages.requiredFieldsMissing)));
        } else {
            var condition = {};
            var count = 5;
            var skip = parseInt(count * (req.body.page - 1));
            condition.isActive = true;
            condition.isDeleted = false;
            condition.userId = mongoose.Types.ObjectId(req.body.userId);
            Task.aggregate([{
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $lookup: {
                    from: "issues",
                    localField: "issueId",
                    foreignField: "_id",
                    as: "issue"
                }
            },
            {
                $unwind: "$issue"
            },
            {
                $lookup: {
                    from: "cars",
                    localField: "carId",
                    foreignField: "_id",
                    as: "car"
                }
            },
            {
                $unwind: "$car"
            },
            {
                $lookup: {
                    from: "carmakes",
                    localField: "car.makeId",
                    foreignField: "_id",
                    as: "make"
                }
            },
            {
                $lookup: {
                    from: "carmodels",
                    localField: "car.modelId",
                    foreignField: "_id",
                    as: "model"
                }
            },
            {
                $lookup: {
                    from: "cartrims",
                    localField: "car.trimId",
                    foreignField: "_id",
                    as: "trim"
                }
            },

            {
                $match: condition
            },
            {
                $limit: count
            },
            {
                $project: {
                    _id: 1,
                    isActive: 1,
                    isDeleted: 1,
                    createdAt: 1,
                    userId: "$user._id",
                    firstname: "$user.firstname",
                    lastname: "$user.lastname",
                    email: "$user.email",
                    issueId: 1,
                    issueName: "$issue.name",
                    makename: '$make.name',
                    modelname: '$model.name',
                    trimname: '$trim.name',

                }
            }
            ])
                .exec(function (err, taskData) {
                    if (err) {
                        reject(res.json(Response(500, "failed", constantsObj.validationMessages.internalError, err)));
                    } else {
                        if (taskData.length > 0) {
                            resolve(res.json({
                                'code': 200,
                                status: 'success',
                                "message": constantsObj.messages.dataRetrievedSuccess,
                                data: taskData
                            }));
                        } else {
                            reject(res.json(Response(402, "failed", constantsObj.validationMessages.taskNotFound, {})));
                        }
                    }
                });
        }
    })
}

/**
 * Function is to get task request
 * @access private
 * @return json
 * Created by Aditya
 * @smartData Enterprises (I) Ltd
 * Created Date 09-May-2018
 */

function listRepairRequest(req, res) {
    return new Promise(function (resolve, reject) {
        if (!req.body.page) {
            reject(res.json(Response(402, "failed", constantsObj.validationMessages.requiredFieldsMissing)));
        } else {
            var condition = {};
            var count = 5;
            var skip = parseInt(count * (req.body.page - 1));
            condition.isActive = true;
            condition.isDeleted = false;
            condition.isComplete = false;
            Task.aggregate([{
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $lookup: {
                    from: "issues",
                    localField: "issueId",
                    foreignField: "_id",
                    as: "issue"
                }
            },
            {
                $unwind: "$issue"
            },
            {
                $match: condition
            },
            {
                $skip: skip
            },
            {
                $limit: count
            },
            {
                $project: {
                    _id: 1,
                    isActive: 1,
                    isDeleted: 1,
                    userId: "$user._id",
                    firstname: "$user.firstname",
                    lastname: "$user.lastname",
                    email: "$user.email",
                    issueId: 1,
                    issueName: "$issue.name",
                }
            }
            ])
                .exec(function (err, taskData) {
                    if (err) {
                        reject(res.json(Response(500, "failed", constantsObj.validationMessages.internalError, err)));
                    } else {
                        if (taskData.length > 0) {
                            resolve(res.json({
                                'code': 200,
                                status: 'success',
                                "message": constantsObj.messages.dataRetrievedSuccess,
                                data: taskData
                            }));
                        } else {
                            reject(res.json(Response(402, "failed", constantsObj.validationMessages.taskNotFound, {})));
                        }
                    }
                });
        }
    });
}


/**
 * Function to schedule appointment
 * @access private
 * @return json
 * Created by Aditya
 * @smartData Enterprises (I) Ltd
 * Created Date 09-May-2018
 */
function scheduleAppointment(req, res) {
    new Promise(function (resolve, reject) {
        if (!req.body.appointmentDate && !req.body.appointmentWith && !req.body.userId) {
            reject(res.json(Response(402, "failed", constantsObj.validationMessages.requiredFieldsMissing)));
        } else {
            var appointObj = {
                appointmentDate: new Date(), ,
                appointmentTime: req.body.appointmentTime,
                appointmentWith: req.body.appointmentWith,
                taskId: req.body.taskId,
                shopId: req.body.shopId,
                userId: req.body.userId,
            }
            new Appointment(appointObj).save(function (err, appointData) {
                if (err) {
                    reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                } else {
                    resolve(res.json(Response(200, "success", constantsObj.messages.appointmentAdded, appointData)));
                }
            });
        }
    })
}

/**
 * Function to bid request
 * @access private
 * @return json
 * Created by Aditya
 * @smartData Enterprises (I) Ltd
 * Created Date 09-May-2018
 */
function bidAppointment(req, res) {
    new Promise(function (resolve, reject) {
        if (!req.body.appointmentDate && !req.body.appointmentWith && !req.body.userId) {
            reject(res.json(Response(402, "failed", constantsObj.validationMessages.requiredFieldsMissing)));
        } else {
            var bidObj = {
                appointmentId: req.body.taskId,
                mechanicId: req.body.mechanicId,
                shopId: req.body.shopId,
                userId: req.body.userId,
                appointmentTime: new Date(),
                price: req.body.price
            }
            new BidAppointment(bidObj).save(function (err, bidTaskData) {
                if (err) {
                    reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                } else {
                    resolve(res.json(Response(200, "success", constantsObj.messages.bidAppointment, bidTaskData)));
                }
            });
        }
    })
}

/**
 * Function to get isssues list
 * @access private
 * @return json
 * Created by Aditya
 * @smartData Enterprises (I) Ltd
 * Created Date 14-May-2018
 */
function getIssuesList(req, res) {
    new Promise(function (resolve, reject) {
        Issue.find({
            isActive: true,
            isDeleted: false
        }, function (err, issueData) {
            if (err) {
                reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
            } else {
                resolve(res.json({
                    'code': 200,
                    status: 'success',
                    "message": constantsObj.messages.dataRetrievedSuccess,
                    data: issueData
                }));
            }
        });
    });
}

/**
 * Function to get sub isssues list
 * @access private
 * @return json
 * Created by Aditya
 * @smartData Enterprises (I) Ltd
 * Created Date 14-May-2018
 */
function subIssuesList(req, res) {
    new Promise(function (resolve, reject) {
        if (!req.body.issueId) {
            reject(res.json(Response(402, "failed", constantsObj.validationMessages.requiredFieldsMissing)));
        } else {
            var subIssue = {
                issueId: req.body.issueId,
                isActive: true,
                isDeleted: false,
            }
            SubIssue.find(subIssue, function (err, subIssueData) {
                if (err) {
                    reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                } else {
                    resolve(res.json({
                        'code': 200,
                        status: 'success',
                        "message": constantsObj.messages.dataRetrievedSuccess,
                        data: subIssueData
                    }));
                }
            });
        }
    });
}

/**
 * Function to send repair request
 * @access private
 * @return json
 * Created by Aditya
 * @smartData Enterprises (I) Ltd
 * Created Date 16-May-2018
 */
function sendRequest(req, res) {
    console.log("1 body---", req.body)
    let verifiedList = [];
    let unverifiedList = [];
    var unVerifiedId1;
    let promise1 = false;
    let promise2 = false;

    if (!req.body.firstname && !req.body.email && !req.body.password) {
        return res.json(Response(402, "failed", constantsObj.validationMessages.requiredFieldsMissing));
    } else if (req.body.email && !validator.isEmail(req.body.email)) {
        return res.json(Response(402, "failed", constantsObj.validationMessages.invalidEmail));
    } else {
        var emailObj = {
            email: req.body.email,
            isActive: true,
            isDeleted: false
        }
        User.find(emailObj, function (err, userdata) {
            if (err) {
                return res.json(Response(500, "failed", constantsObj.validationMessages.internalError, err));
            } else if (userdata.length > 0) {
                return res.json(Response(402, "failed", constantsObj.validationMessages.emailAlreadyExist));
            } else {

                var timestamp = Number(new Date());
                var verifingLink = utility.randomValueHex(20) + timestamp + utility.randomValueHex(10);
                var userObj = {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email.toLowerCase(),
                    password: utility.getEncryptText(req.body.password),
                    confirmpassword: utility.getEncryptText(req.body.password),
                    location: {
                        type: "Point",
                        coordinates: [req.body.coordinates[1], req.body.coordinates[0]]
                    },
                    isRegistered: true,
                    verifying_token: verifingLink,
                    phoneNumber: req.body.phoneNumber
                };
                new User(userObj).save(function (err, userData) {
                    if (err) {
                        reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                    } else {

                        var userMailData = {
                            userId: userData._id,
                            email: userData.email,
                            firstname: userData.firstname,
                            lastname: userData.lastname,
                            verifying_token: userData.verifying_token,
                        };
                        utility.readTemplateSendMail(userData.email, constantsObj.emailSubjects.verify_email, userMailData, 'verify_email', function (err, resp) { });
                        var roleObj = {
                            userId: userData._id,
                            roleId: req.body.roleId
                        }
                        console.log(roleObj)
                        new UserRole(roleObj).save(function (err, roleData) {
                            if (err) {
                                reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                            } else {
                                var repairDetail = {
                                    firstDate: req.body.firstDate,
                                    firstDayTme: req.body.firstDayTme,
                                    secondDate: req.body.secondDate,
                                    secondDayTme: req.body.secondDayTme,
                                    issues: req.body.issues,
                                    userId: userData._id,
                                    appointmentWith: req.body.mechanicId,
                                }

                                new Promise(function (resolve, reject) {
                                    new RepairRequest(repairDetail).save(function (err, repairData) {
                                        if (err) {
                                            reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                                        } else {


                                            var carObj = {
                                                year: req.body.year,
                                                makeId: req.body.makeId,
                                                modelId: req.body.modelId,
                                                trimId: req.body.trimId,
                                                userId: userData._id,
                                                isActive: true,
                                                isDeleted: false
                                            }
                                            Car.findOne(carObj, function (err, carsCheck) {
                                                if (err) {
                                                    reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                                                } else {
                                                    if (carsCheck) {
                                                        resolve(repairData)
                                                    } else {
                                                        var carDetail = {
                                                            year: req.body.year,
                                                            makeId: req.body.makeId,
                                                            modelId: req.body.modelId,
                                                            trimId: req.body.trimId,
                                                            userId: userData._id,
                                                            mileage: req.body.mileage
                                                        }
                                                        new Car(carDetail).save(function (err, carData) {
                                                            if (err) {
                                                                reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                                                            } else {
                                                                resolve(repairData);


                                                            }
                                                        });
                                                    }
                                                }
                                            })
                                        }
                                    })
                                })
                                    .then(function (repairData) {




                                        async.each(req.body.mechanicId, function (id, callback15) {
                                            var mechanic = {
                                                _id: id
                                            }
                                            Shop.findOne(mechanic, function (err, shop) {
                                                if (shop.userId && shop.isVerified == 1) {
                                                    verifiedList.push(shop.userId);
                                                } else {
                                                    unverifiedList.push(shop._id);
                                                }
                                                callback15();


                                            });


                                        },
                                            function (err) {
                                                if (err) {
                                                    reject(err);
                                                } else {
                                                    if (unverifiedList.length) {
                                                        new Promise(function (resolve, reject) {
                                                            var carObj = {
                                                                year: req.body.year,
                                                                makeId: req.body.makeId,
                                                                modelId: req.body.modelId,
                                                                trimId: req.body.trimId,
                                                                userId: userData._id,
                                                                isActive: true,
                                                                isDeleted: false
                                                            }
                                                            Car.findOne(carObj, function (err, carsCheck) {
                                                                if (err) {
                                                                    reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                                                                } else {
                                                                    if (carsCheck) {
                                                                        resolve(carsCheck)
                                                                    } else {
                                                                        var carDetail = {
                                                                            year: req.body.year,
                                                                            makeId: req.body.makeId,
                                                                            modelId: req.body.modelId,
                                                                            trimId: req.body.trimId,
                                                                            userId: userData._id,
                                                                            mileage: req.body.mileage
                                                                        }
                                                                        new Car(carDetail).save(function (err, carData) {
                                                                            if (err) {
                                                                                reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                                                                            } else {
                                                                                resolve(carData);
                                                                            }
                                                                        });
                                                                    }
                                                                }
                                                            })

                                                        })
                                                            .then(function (request) {
                                                                return new Promise((resolve, reject) => {

                                                                    RepairRequest.findOneAndUpdate({
                                                                        _id: repairData._id
                                                                    }, {
                                                                            $set: {
                                                                                carId: request._id
                                                                            }
                                                                        }, {
                                                                            new: true
                                                                        })
                                                                        .lean()
                                                                        .exec(function (err, RepairRequestUpdate) {
                                                                            if (err) {
                                                                                reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                                                                            } else {
                                                                                resolve(RepairRequestUpdate);
                                                                            }
                                                                        });
                                                                });
                                                            })
                                                            .then(function (schedule) {
                                                                return new Promise(function (resolve, reject) {
                                                                    if (!req.body.firstDate) {
                                                                        reject(res.json(Response(402, "failed", constantsObj.validationMessages.requiredFieldsMissing)));
                                                                    } else {
                                                                        var appointmentList = [];
                                                                        var timestamp = Number(new Date());
                                                                        var uniqueNumber = utility.randomValueHex(20) + timestamp;
                                                                        async.each(unverifiedList, function (mechId, callback) {
                                                                            var mechanic = {
                                                                                userId: "5af043d57dc8b9764f8b523e"
                                                                            }
                                                                            Shop.find(mechanic, function (err, shop) {

                                                                                var appointObj = {
                                                                                    appointmentWith: "5af043d57dc8b9764f8b523e",
                                                                                    firstDate: req.body.firstDate,
                                                                                    firstDayTme: req.body.firstDayTme,
                                                                                    secondDate: req.body.secondDate,
                                                                                    secondDayTme: req.body.secondDayTme,
                                                                                    userId: schedule.userId,
                                                                                    shopId: shop[0]._id,
                                                                                    carId: schedule.carId,
                                                                                    requestNumber: uniqueNumber,
                                                                                    requestId: schedule._id,
                                                                                    nonVerifiedId: mechId,
                                                                                }
                                                                                new Appointment(appointObj).save(function (err, appointData) {
                                                                                    if (err) {
                                                                                        callback(err)
                                                                                    } else {
                                                                                        callback();
                                                                                        appointmentList.push(appointData);
                                                                                    }
                                                                                });
                                                                            });
                                                                        }, function (err) {
                                                                            if (err) {
                                                                                reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                                                                            } else {
                                                                                resolve(appointmentList)
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            })
                                                            .then(function (task) {
                                                                return new Promise(function (resolve, reject) {
                                                                    var mechTaskList = [];
                                                                    async.each(req.body.issues, function (issue, callback1) {
                                                                        async.each(task, function (appointment, callback2) {
                                                                            var taskDetail = {
                                                                                issueId: issue,
                                                                                userId: appointment.userId,
                                                                                carId: appointment.carId,
                                                                                appointmentId: appointment._id,
                                                                                mechanicId: appointment.appointmentWith,
                                                                                requestNumber: appointment.requestNumber,
                                                                            }
                                                                            new Task(taskDetail).save(function (err, taskData) {
                                                                                if (err) {
                                                                                    callback2(err);
                                                                                } else {
                                                                                    callback2();
                                                                                }
                                                                            });
                                                                        }, function (err) {
                                                                            if (err) {
                                                                                callback1(err);
                                                                            } else {
                                                                                callback1();
                                                                            }

                                                                        });

                                                                    }, function (err) {
                                                                        if (err) {
                                                                            reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                                                                        } else {
                                                                            resolve(task);
                                                                        }
                                                                    });
                                                                });
                                                            })
                                                            .then(function (notify) {
                                                                return new Promise((resolve, reject) => {
                                                                    async.each(notify, function (appointment, callback3) {
                                                                        var notifyObj = {
                                                                            sourceUser: appointment.userId,
                                                                            destnationUser: appointment.appointmentWith,
                                                                            notifyTypeId: appointment._id,
                                                                            content: "New Repair Request.",
                                                                            notifyType: "Appointment",
                                                                            createdBy: "user",
                                                                        }
                                                                        NotificationCtrl.addNotification(notifyObj, function (err, data) {
                                                                            if (err) {
                                                                                callback3(err);
                                                                            } else {
                                                                                callback3();
                                                                            }
                                                                        });
                                                                    }, function (err) {
                                                                        if (err) {
                                                                            reject(err);
                                                                        } else {
                                                                            resolve(notify);
                                                                        }

                                                                    });
                                                                })
                                                            })
                                                            .then(function (pushnotify) {
                                                                return new Promise((resolve, reject) => {
                                                                    async.each(pushnotify, function (pushnotific, callback4) {
                                                                        var user = {
                                                                            _id: pushnotific.appointmentWith,
                                                                            isDeleted: false,
                                                                            isActive: true,
                                                                            isRegistered: true
                                                                        }
                                                                        User.findOne(user, function (err, userData) {
                                                                            if (err) {
                                                                                callback4(err)
                                                                            } else {
                                                                                if (userData) {
                                                                                    DeviceToken.find({
                                                                                        userId: userData._id
                                                                                    }).lean().exec(function (err, deviceData) {
                                                                                        if (err) {
                                                                                            console.log("err------------8824", err)
                                                                                        } else { }
                                                                                    });
                                                                                    for (var j = 0; j < userData.deviceInfo.length - 1; j++) {
                                                                                        console.log("data found----", userData.deviceInfo[j])
                                                                                        if (userData.deviceInfo[j].deviceToken) {
                                                                                            var notifyObj = {
                                                                                                deviceType: userData.deviceInfo[j].deviceType,
                                                                                                deviceToken: userData.deviceInfo[j].deviceToken,
                                                                                                notifyTypeId: pushnotific._id,
                                                                                                content: "New Repair Request.",
                                                                                                notifyType: "Appointment",
                                                                                                destnationUser: pushnotific.appointmentWith,
                                                                                                destinationType: "mechanic",
                                                                                            }
                                                                                            console.log("sdvdsfvdsfvfffffffffffffff", notifyObj)
                                                                                            utility.sendPushNotification(notifyObj);
                                                                                        }
                                                                                    }
                                                                                    callback4();
                                                                                } else {
                                                                                    callback4();
                                                                                }
                                                                            }
                                                                        })

                                                                    },
                                                                        function (err) {
                                                                            if (err) {
                                                                                reject(err);
                                                                            } else {
                                                                                promise1 = true;
                                                                                if (!promise2) {
                                                                                    resolve(res.json({

                                                                                        code: 200,
                                                                                        message: 'Your request sent successfully.',
                                                                                        data: pushnotify
                                                                                    }));
                                                                                }
                                                                            }

                                                                        });
                                                                });
                                                            });
                                                    }

                                                    if (verifiedList.length) {
                                                        new Promise(function (resolve, reject) {
                                                            var carObj = {
                                                                year: req.body.year,
                                                                makeId: req.body.makeId,
                                                                modelId: req.body.modelId,
                                                                trimId: req.body.trimId,
                                                                userId: userData._id,
                                                                isActive: true,
                                                                isDeleted: false
                                                            }
                                                            Car.findOne(carObj, function (err, carsCheck) {
                                                                if (err) {
                                                                    reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                                                                } else {
                                                                    if (carsCheck) {
                                                                        resolve(carsCheck)
                                                                    } else {
                                                                        var carDetail = {
                                                                            year: req.body.year,
                                                                            makeId: req.body.makeId,
                                                                            modelId: req.body.modelId,
                                                                            trimId: req.body.trimId,
                                                                            userId: userData._id,
                                                                            mileage: req.body.mileage
                                                                        }
                                                                        new Car(carDetail).save(function (err, carData) {
                                                                            if (err) {
                                                                                reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                                                                            } else {
                                                                                resolve(carData);
                                                                            }
                                                                        });
                                                                    }
                                                                }
                                                            })

                                                        })
                                                            .then(function (request) {
                                                                console.log("3-----------1884------", request);
                                                                return new Promise((resolve, reject) => {

                                                                    RepairRequest.findOneAndUpdate({
                                                                        _id: repairData._id
                                                                    }, {
                                                                            $set: {
                                                                                carId: request._id
                                                                            }
                                                                        }, {
                                                                            new: true
                                                                        })
                                                                        .lean()
                                                                        .exec(function (err, RepairRequestUpdate) {
                                                                            console.log('RepairRequestUpdateRepairRequestUpdate 1916', RepairRequestUpdate)
                                                                            if (err) {
                                                                                reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                                                                            } else {
                                                                                resolve(RepairRequestUpdate);
                                                                            }
                                                                        });
                                                                });
                                                            })
                                                            .then(function (schedule) {
                                                                return new Promise(function (resolve, reject) {
                                                                    if (!req.body.firstDate) {
                                                                        reject(res.json(Response(402, "failed", constantsObj.validationMessages.requiredFieldsMissing)));
                                                                    } else {
                                                                        var appointmentList = [];
                                                                        var timestamp = Number(new Date());
                                                                        var uniqueNumber = utility.randomValueHex(20) + timestamp;
                                                                        async.each(verifiedList, function (mechId, callback) {
                                                                            var mechanic = {
                                                                                userId: mechId
                                                                            }
                                                                            Shop.find(mechanic, function (err, shop) {

                                                                                var appointObj = {
                                                                                    appointmentWith: mechId,
                                                                                    firstDate: req.body.firstDate,
                                                                                    firstDayTme: req.body.firstDayTme,
                                                                                    secondDate: req.body.secondDate,
                                                                                    secondDayTme: req.body.secondDayTme,
                                                                                    userId: schedule.userId,
                                                                                    shopId: shop[0]._id,
                                                                                    carId: schedule.carId,
                                                                                    requestNumber: uniqueNumber,
                                                                                    requestId: schedule._id,
                                                                                    nonVerifiedId: req.body.nonVerifiedId,
                                                                                }
                                                                                new Appointment(appointObj).save(function (err, appointData) {
                                                                                    if (err) {
                                                                                        callback(err)
                                                                                    } else {
                                                                                        callback();
                                                                                        appointmentList.push(appointData);
                                                                                    }
                                                                                });
                                                                            });
                                                                        }, function (err) {
                                                                            if (err) {
                                                                                reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                                                                            } else {
                                                                                resolve(appointmentList)
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            })
                                                            .then(function (task) {
                                                                return new Promise(function (resolve, reject) {
                                                                    var mechTaskList = [];
                                                                    async.each(req.body.issues, function (issue, callback1) {
                                                                        async.each(task, function (appointment, callback2) {
                                                                            var taskDetail = {
                                                                                issueId: issue,
                                                                                userId: appointment.userId,
                                                                                carId: appointment.carId,
                                                                                appointmentId: appointment._id,
                                                                                mechanicId: appointment.appointmentWith,
                                                                                requestNumber: appointment.requestNumber,
                                                                            }
                                                                            new Task(taskDetail).save(function (err, taskData) {
                                                                                if (err) {
                                                                                    callback2(err);
                                                                                } else {
                                                                                    callback2();
                                                                                }
                                                                            });
                                                                        }, function (err) {
                                                                            if (err) {
                                                                                callback1(err);
                                                                            } else {
                                                                                callback1();
                                                                            }

                                                                        });

                                                                    }, function (err) {
                                                                        if (err) {
                                                                            reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                                                                        } else {
                                                                            resolve(task);
                                                                        }
                                                                    });
                                                                });
                                                            })
                                                            .then(function (notify) {
                                                                return new Promise((resolve, reject) => {
                                                                    async.each(notify, function (appointment, callback3) {
                                                                        var notifyObj = {
                                                                            sourceUser: appointment.userId,
                                                                            destnationUser: appointment.appointmentWith,
                                                                            notifyTypeId: appointment._id,
                                                                            content: "New Repair Request.",
                                                                            notifyType: "Appointment",
                                                                            createdBy: "user",
                                                                        }
                                                                        NotificationCtrl.addNotification(notifyObj, function (err, data) {
                                                                            if (err) {
                                                                                callback3(err);
                                                                            } else {
                                                                                callback3();
                                                                            }
                                                                        });
                                                                    }, function (err) {
                                                                        if (err) {
                                                                            reject(err);
                                                                        } else {
                                                                            resolve(notify);
                                                                        }

                                                                    });
                                                                })
                                                            })
                                                            .then(function (pushnotify) {
                                                                return new Promise((resolve, reject) => {
                                                                    async.each(pushnotify, function (pushnotific, callback4) {
                                                                        var user = {
                                                                            _id: pushnotific.appointmentWith,
                                                                            isDeleted: false,
                                                                            isActive: true,
                                                                            isRegistered: true
                                                                        }
                                                                        User.findOne(user, function (err, userData) {
                                                                            if (err) {
                                                                                callback4(err)
                                                                            } else {
                                                                                if (userData) {
                                                                                    console.log("found---", userData.firstname)
                                                                                    for (var j = 0; j < userData.deviceInfo.length - 1; j++) {
                                                                                        console.log("data found----", userData.deviceInfo[j])
                                                                                        if (userData.deviceInfo[j].deviceToken) {
                                                                                            var notifyObj = {
                                                                                                deviceType: userData.deviceInfo[j].deviceType,
                                                                                                deviceToken: userData.deviceInfo[j].deviceToken,
                                                                                                notifyTypeId: pushnotific._id,
                                                                                                content: "New Repair Request.",
                                                                                                notifyType: "Appointment",
                                                                                                destnationUser: pushnotific.appointmentWith,
                                                                                                destinationType: "mechanic",
                                                                                            }
                                                                                            utility.sendPushNotification(notifyObj);
                                                                                        }
                                                                                    }
                                                                                    callback4();

                                                                                } else {
                                                                                    callback4();
                                                                                }
                                                                            }
                                                                        })

                                                                    },
                                                                        function (err) {
                                                                            if (err) {
                                                                                reject(err);
                                                                            } else {
                                                                                promise2 = true;
                                                                                if (!promise1) {
                                                                                    resolve(res.json({
                                                                                        code: 200,
                                                                                        message: 'Your request sent successfully.',
                                                                                        data: pushnotify
                                                                                    }));
                                                                                }

                                                                            }

                                                                        });
                                                                });
                                                            });
                                                    }
                                                }

                                            });
                                    })                                
                            }
                        });




                     
                    }
                });
            }
        });
    }
}

/**
 * Function to send logedin user repair request
 * @access private
 * @return json
 * Created by Aditya
 * @smartData Enterprises (I) Ltd
 * Created Date 19-May-2018
 */
function sendLogedInUserRequest(req, res) {
    console.log("1 body---", req.body)
    let verifiedList = [];
    let unverifiedList = [];
    var unVerifiedId1;
    let promise1 = false;
    let promise2 = false

    var repairDetail = {
        firstDate: req.body.firstDate,
        firstDayTme: req.body.firstDayTme,
        secondDate: req.body.secondDate,
        secondDayTme: req.body.secondDayTme,
        issues: req.body.issues,
        userId: req.body.userId,
        appointmentWith: req.body.mechanicId
    }
   

    new Promise(function (resolve, reject) {

        new RepairRequest(repairDetail).save(function (err, repairData) {
            if (err) {
                reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
            } else {


                var carObj = {
                    year: req.body.year,
                    makeId: req.body.makeId,
                    modelId: req.body.modelId,
                    trimId: req.body.trimId,
                    userId: req.body.userId,
                    isActive: true,
                    isDeleted: false
                }
                Car.findOne(carObj, function (err, carsCheck) {
                    if (err) {
                        reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                    } else {
                        if (carsCheck) {
                            console.log("carsCheck", carsCheck)
                            resolve(repairData)
                        } else {
                            var carDetail = {
                                year: req.body.year,
                                makeId: req.body.makeId,
                                modelId: req.body.modelId,
                                trimId: req.body.trimId,
                                userId: req.body.userId,
                                mileage: req.body.mileage
                            }
                            new Car(carDetail).save(function (err, carData) {
                                if (err) {
                                    reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                                } else {
                                    resolve(repairData);
                                    console.log("carData", carData)
                                    resolve(repairData);


                                }
                            });
                        }
                    }
                })
            }
        })
    })
        .then(function (repairData) {




            async.each(req.body.mechanicId, function (id, callback15) {
                var mechanic = {
                    _id: id
                }
                Shop.findOne(mechanic, function (err, shop) {
                    if (shop.userId && shop.isVerified == 1) {
                        verifiedList.push(shop.userId);
                        console.log("inside verified list", verifiedList, shop)
                    } else {
                        unverifiedList.push(shop._id);
                        console.log("insideunverifiedList", unverifiedList, shop)
                    }
                    callback15();


                });


            },
                function (err) {
                    if (err) {
                        reject(err);
                    } else {

                        
                        if (unverifiedList.length) {
                            console.log('inside if unVerifiedId1');



                            new Promise(function (resolve, reject) {
                                var carObj = {
                                    year: req.body.year,
                                    makeId: req.body.makeId,
                                    modelId: req.body.modelId,
                                    trimId: req.body.trimId,
                                    userId: req.body.userId,
                                    isActive: true,
                                    isDeleted: false
                                }
                                Car.findOne(carObj, function (err, carsCheck) {
                                    if (err) {
                                        reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                                    } else {
                                        if (carsCheck) {
                                            resolve(carsCheck)
                                        } else {
                                            var carDetail = {
                                                year: req.body.year,
                                                makeId: req.body.makeId,
                                                modelId: req.body.modelId,
                                                trimId: req.body.trimId,
                                                userId: req.body.userId,
                                                mileage: req.body.mileage
                                            }
                                            new Car(carDetail).save(function (err, carData) {
                                                if (err) {
                                                    reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                                                } else {
                                                    resolve(carData);
                                                }
                                            });
                                        }
                                    }
                                })

                            })
                                .then(function (request) {
                                    
                                    return new Promise((resolve, reject) => {

                                        RepairRequest.findOneAndUpdate({
                                            _id: repairData._id
                                        }, {
                                                $set: {
                                                    carId: request._id
                                                }
                                            }, {
                                                new: true
                                            })
                                            .lean()
                                            .exec(function (err, RepairRequestUpdate) {
                                                if (err) {
                                                    reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                                                } else {
                                                    resolve(RepairRequestUpdate);
                                                }
                                            });
                                    });
                                })
                                .then(function (schedule) {
                                    return new Promise(function (resolve, reject) {
                                        if (!req.body.firstDate) {
                                            reject(res.json(Response(402, "failed", constantsObj.validationMessages.requiredFieldsMissing)));
                                        } else {
                                            var appointmentList = [];
                                            var timestamp = Number(new Date());
                                            var uniqueNumber = utility.randomValueHex(20) + timestamp;
                                            async.each(unverifiedList, function (mechId, callback) {
                                                var mechanic = {
                                                    userId: "5af043d57dc8b9764f8b523e"
                                                }
                                                Shop.find(mechanic, function (err, shop) {

                                                    var appointObj = {
                                                        appointmentWith: "5af043d57dc8b9764f8b523e",
                                                        firstDate: req.body.firstDate,
                                                        firstDayTme: req.body.firstDayTme,
                                                        secondDate: req.body.secondDate,
                                                        secondDayTme: req.body.secondDayTme,
                                                        userId: schedule.userId,
                                                        shopId: shop[0]._id,
                                                        carId: schedule.carId,
                                                        requestNumber: uniqueNumber,
                                                        requestId: schedule._id,
                                                        nonVerifiedId: mechId,
                                                    }
                                                    new Appointment(appointObj).save(function (err, appointData) {
                                                        if (err) {
                                                            callback(err)
                                                        } else {
                                                            callback();
                                                            appointmentList.push(appointData);
                                                        }
                                                    });
                                                });
                                            }, function (err) {
                                                if (err) {
                                                    reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                                                } else {
                                                    resolve(appointmentList)
                                                }
                                            });
                                        }
                                    });
                                })
                                .then(function (task) {
                                    return new Promise(function (resolve, reject) {
                                        var mechTaskList = [];
                                        async.each(req.body.issues, function (issue, callback1) {
                                            async.each(task, function (appointment, callback2) {
                                                var taskDetail = {
                                                    issueId: issue,
                                                    userId: appointment.userId,
                                                    carId: appointment.carId,
                                                    appointmentId: appointment._id,
                                                    mechanicId: appointment.appointmentWith,
                                                    requestNumber: appointment.requestNumber,
                                                }
                                                new Task(taskDetail).save(function (err, taskData) {
                                                    if (err) {
                                                        callback2(err);
                                                    } else {
                                                        callback2();
                                                    }
                                                });
                                            }, function (err) {
                                                if (err) {
                                                    callback1(err);
                                                } else {
                                                    callback1();
                                                }

                                            });

                                        }, function (err) {
                                            if (err) {
                                                reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                                            } else {
                                                resolve(task);
                                            }
                                        });
                                    });
                                })
                                .then(function (notify) {
                                    return new Promise((resolve, reject) => {
                                        async.each(notify, function (appointment, callback3) {
                                            var notifyObj = {
                                                sourceUser: appointment.userId,
                                                destnationUser: appointment.appointmentWith,
                                                notifyTypeId: appointment._id,
                                                content: "New Repair Request.",
                                                notifyType: "Appointment",
                                                createdBy: "user",
                                            }
                                            NotificationCtrl.addNotification(notifyObj, function (err, data) {
                                                if (err) {
                                                    callback3(err);
                                                } else {
                                                    callback3();
                                                }
                                            });
                                        }, function (err) {
                                            if (err) {
                                                reject(err);
                                            } else {
                                                resolve(notify);
                                            }

                                        });
                                    })
                                })
                                .then(function (pushnotify) {
                                    return new Promise((resolve, reject) => {
                                        async.each(pushnotify, function (pushnotific, callback4) {
                                            var user = {
                                                _id: pushnotific.appointmentWith,
                                                isDeleted: false,
                                                isActive: true,
                                                isRegistered: true
                                            }
                                            User.findOne(user, function (err, userData) {
                                                if (err) {
                                                    callback4(err)
                                                } else {
                                                    if (userData) {
                                                      

                                                        for (var j = 0; j < userData.deviceInfo.length - 1; j++) {
                                                            if (userData.deviceInfo[j].deviceToken) {
                                                                var notifyObj = {
                                                                    deviceType: userData.deviceInfo[j].deviceType,
                                                                    deviceToken: userData.deviceInfo[j].deviceToken,
                                                                    notifyTypeId: pushnotific._id,
                                                                    content: "New Repair Request.",
                                                                    notifyType: "Appointment",
                                                                    destnationUser: pushnotific.appointmentWith,
                                                                    // deviceType: userData.deviceInfo[j].deviceType,
                                                                    destinationType: "mechanic",
                                                                }
                                                                utility.sendPushNotification(notifyObj);
                                                            }
                                                        }
                                                        callback4();

                                                       
                                                    } else {
                                                        callback4();
                                                    }
                                                }
                                            })

                                        },
                                            function (err) {
                                                if (err) {
                                                    reject(err);
                                                } else {
                                                    promise1 = true;
                                                    if (!promise2) {
                                                        resolve(res.json({

                                                            code: 200,
                                                            message: 'Your request sent successfully.',
                                                            data: pushnotify
                                                        }));
                                                    }
                                                }

                                            });
                                    });
                                });
                        }

                        if (verifiedList.length) {
                            new Promise(function (resolve, reject) {
                                var carObj = {
                                    year: req.body.year,
                                    makeId: req.body.makeId,
                                    modelId: req.body.modelId,
                                    trimId: req.body.trimId,
                                    userId: req.body.userId,
                                    isActive: true,
                                    isDeleted: false
                                }
                                Car.findOne(carObj, function (err, carsCheck) {
                                    console.log('carsCheck carsCheck 1856', carsCheck)
                                    if (err) {
                                        reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                                    } else {
                                        if (carsCheck) {
                                            resolve(carsCheck)
                                        } else {
                                            var carDetail = {
                                                year: req.body.year,
                                                makeId: req.body.makeId,
                                                modelId: req.body.modelId,
                                                trimId: req.body.trimId,
                                                userId: req.body.userId,
                                                mileage: req.body.mileage
                                            }
                                            new Car(carDetail).save(function (err, carData) {
                                                if (err) {
                                                    reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                                                } else {
                                                    resolve(carData);
                                                }
                                            });
                                        }
                                    }
                                })

                            })
                                .then(function (request) {
                                 
                                    return new Promise((resolve, reject) => {

                                        RepairRequest.findOneAndUpdate({
                                            _id: repairData._id
                                        }, {
                                                $set: {
                                                    carId: request._id
                                                }
                                            }, {
                                                new: true
                                            })
                                            .lean()
                                            .exec(function (err, RepairRequestUpdate) {
                                                console.log('RepairRequestUpdateRepairRequestUpdate 1916', RepairRequestUpdate)
                                                if (err) {
                                                    reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                                                } else {
                                                    resolve(RepairRequestUpdate);
                                                }
                                            });
                                    });
                                })
                                .then(function (schedule) {
                                    return new Promise(function (resolve, reject) {
                                        if (!req.body.firstDate) {
                                            reject(res.json(Response(402, "failed", constantsObj.validationMessages.requiredFieldsMissing)));
                                        } else {
                                            var appointmentList = [];
                                            var timestamp = Number(new Date());
                                            var uniqueNumber = utility.randomValueHex(20) + timestamp;
                                            async.each(verifiedList, function (mechId, callback) {
                                                var mechanic = {
                                                    userId: mechId
                                                }
                                                Shop.find(mechanic, function (err, shop) {

                                                    var appointObj = {
                                                        appointmentWith: mechId,
                                                        firstDate: req.body.firstDate,
                                                        firstDayTme: req.body.firstDayTme,
                                                        secondDate: req.body.secondDate,
                                                        secondDayTme: req.body.secondDayTme,
                                                        userId: schedule.userId,
                                                        shopId: shop[0]._id,
                                                        carId: schedule.carId,
                                                        requestNumber: uniqueNumber,
                                                        requestId: schedule._id,
                                                        nonVerifiedId: req.body.nonVerifiedId,
                                                    }
                                                    new Appointment(appointObj).save(function (err, appointData) {
                                                        if (err) {
                                                            callback(err)
                                                        } else {
                                                            callback();
                                                            appointmentList.push(appointData);
                                                        }
                                                    });
                                                });
                                            }, function (err) {
                                                if (err) {
                                                    reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                                                } else {
                                                    resolve(appointmentList)
                                                }
                                            });
                                        }
                                    });
                                })
                                .then(function (task) {
                                    return new Promise(function (resolve, reject) {
                                        var mechTaskList = [];
                                        async.each(req.body.issues, function (issue, callback1) {
                                            async.each(task, function (appointment, callback2) {
                                                var taskDetail = {
                                                    issueId: issue,
                                                    userId: appointment.userId,
                                                    carId: appointment.carId,
                                                    appointmentId: appointment._id,
                                                    mechanicId: appointment.appointmentWith,
                                                    requestNumber: appointment.requestNumber,
                                                }
                                                new Task(taskDetail).save(function (err, taskData) {
                                                    if (err) {
                                                        callback2(err);
                                                    } else {
                                                        callback2();
                                                    }
                                                });
                                            }, function (err) {
                                                if (err) {
                                                    callback1(err);
                                                } else {
                                                    callback1();
                                                }

                                            });

                                        }, function (err) {
                                            if (err) {
                                                reject(res.json(Response(500, "failed", utility.validationErrorHandler(err), err)));
                                            } else {
                                                resolve(task);
                                            }
                                        });
                                    });
                                })
                                .then(function (notify) {
                                    return new Promise((resolve, reject) => {
                                        async.each(notify, function (appointment, callback3) {
                                            var notifyObj = {
                                                sourceUser: appointment.userId,
                                                destnationUser: appointment.appointmentWith,
                                                notifyTypeId: appointment._id,
                                                content: "New Repair Request.",
                                                notifyType: "Appointment",
                                                createdBy: "user",
                                            }
                                            NotificationCtrl.addNotification(notifyObj, function (err, data) {
                                                if (err) {
                                                    callback3(err);
                                                } else {
                                                    callback3();
                                                }
                                            });
                                        }, function (err) {
                                            if (err) {
                                                reject(err);
                                            } else {
                                                resolve(notify);
                                            }

                                        });
                                    })
                                })
                                .then(function (pushnotify) {
                                    return new Promise((resolve, reject) => {
                                        async.each(pushnotify, function (pushnotific, callback4) {
                                            var user = {
                                                _id: pushnotific.appointmentWith,
                                                isDeleted: false,
                                                isActive: true,
                                                isRegistered: true
                                            }
                                            User.findOne(user, function (err, userData) {
                                                if (err) {
                                                    callback4(err)
                                                } else {
                                                    if (userData) {
                                                        



                                                        for (var j = 0; j < userData.deviceInfo.length - 1; j++) {
                                                            console.log("data found----", userData.deviceInfo[j])
                                                            if (userData.deviceInfo[j].deviceToken) {
                                                                var notifyObj = {
                                                                    deviceType: userData.deviceInfo[j].deviceType,
                                                                    deviceToken: userData.deviceInfo[j].deviceToken,
                                                                    notifyTypeId: pushnotific._id,
                                                                    content: "New Repair Request.",
                                                                    notifyType: "Appointment",
                                                                    destnationUser: pushnotific.appointmentWith,
                                                                    // deviceType: userData.deviceInfo[j].deviceType,
                                                                    destinationType: "mechanic",
                                                                }
                                                                utility.sendPushNotification(notifyObj);
                                                            }
                                                        }
                                                        callback4();

                                                    } else {
                                                        callback4();
                                                    }
                                                }
                                            })

                                        },
                                            function (err) {
                                                if (err) {
                                                    reject(err);
                                                } else {
                                                    promise2 = true;
                                                    if (!promise1) {
                                                        resolve(res.json({
                                                            code: 200,
                                                            message: 'Your request sent successfully.',
                                                            data: pushnotify
                                                        }));
                                                    }

                                                }

                                            });
                                    });
                                });
                        }
                    }

                });
        })
