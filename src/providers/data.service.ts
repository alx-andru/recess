import {EventEmitter, Injectable} from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import {Storage} from '@ionic/storage';

import {AngularFire, FirebaseAuthState} from 'angularfire2';
import {Device, Firebase} from 'ionic-native';

import * as fb from 'firebase';


import * as moment from 'moment';
import * as hash from 'object-hash';

//declare var FCMPlugin: any;

@Injectable()
export class DataService {
  isAuthenticated: boolean = false;
  uid: string;

  public tabevent: EventEmitter<any> = new EventEmitter();

  public version: string = '0.0.21';


  constructor(public storage: Storage, public af: AngularFire) {

    console.log('Hello Data Provider');
    this.af.auth.subscribe((state: FirebaseAuthState) => {
      console.log('DataService auth state:', state);

      if (state) {
        console.log('User is authenticated now.');
        this.isAuthenticated = true;
        this.uid = state.uid;
        console.log(state);
      }

    });

  }

  ngOnInit() {

  }


  monitorConfig() {
    if (this.isAuthenticated) {
      /*
       // TODO one subscription per config value
       this.af.database.list(`/user/${this.uid}/config/phases/activity/enableAt`).subscribe(enableAt => {

       });

       this.af.database.list(`/user/${this.uid}/config/phases/goals/enableAt`).subscribe(enableAt => {

       });

       this.af.database.list(`/user/${this.uid}/config/phases/social/enableAt`).subscribe(enableAt => {

       });

       this.af.database.object(`/user/${this.uid}/config/showWelcome`, {preserveSnapshot: true})
       .subscribe(showConfig => {
       this.setShowWelcome(showConfig.val());
       });

       this.af.database.object(`/user/${this.uid}/config/phases/goals/settings`, {preserveSnapshot: true})
       .subscribe(goalsData => {
       console.log('Goal Monitor');
       const goal = goalsData.val();
       console.log('/Goal Monitor');

       this.setGoals(goal, false);
       });




       this.af.database.list(`/user/${this.uid}/config`).subscribe(configs => {
       //console.log('Got items: ', configs);

       for (let config in configs) {
       if (configs[config].$key === 'showWelcome') {
       this.setShowWelcome(configs[config].$value);

       } else if (configs[config].$key === 'phases') {

       if (configs[config].goals.settings) {
       this.setGoals(configs[config].goals.settings);
       }

       if (configs[config].social && configs[config].goals && configs[config].activity) {

       let phss = {
       social: {
       enableAt: configs[config].social.enableAt,
       },
       goals: {
       enableAt: configs[config].goals.enableAt,
       },
       activity: {
       enableAt: configs[config].activity.enableAt,
       },
       };

       //this.setPhases(phss);

       let unreadMessages = configs[config].social.unreadMessages;

       // emit phases to event
       this.tabevent.next({
       phases: phss,
       unreadMessages: unreadMessages,
       });

       }

       }
       }
       });

       */

    }
  }

  log(message, code) {
    // console.log('Log message');
    if (this.isAuthenticated) {
      let timestamp = moment();
      let event = this.af.database.object(`/user/${this.uid}/log/${timestamp.format('YYYY-MM-DD')}/${timestamp.valueOf()}`);
      event.set({
        code: code,
        message: message,
        timestamp: fb.database.ServerValue.TIMESTAMP,
      });
    }


  }

  updateAppVersion() {
    if (this.isAuthenticated) {
      let version = this.af.database.object(`/users/${this.uid}/device/appVersion`);
      version.set(this.version);
    }
  }


  setUnreadMessages(numberOfUnreadMessages) {
    if (this.isAuthenticated) {
      let unread = this.af.database.object(`/user/${this.uid}/config/phases/social/unreadMessages`);
      unread.set(numberOfUnreadMessages);
    }
  }

  getGoals() {
    return new Promise<any>((resolve, reject) => {
      if (this.isAuthenticated) {
        this.af.database.object(`/user/${this.uid}/config/phases/goals`,
          {
            preserveSnapshot: true
          }).take(1).subscribe((goalsData) => {

          const goals = goalsData.val();


          resolve({
            activity: goals.settings.activity,
            steps: goals.settings.steps,
            timestamp: goals.settings.timestamp
          });

        });
      } else {
        /*
         // temporary disable localstorage
         // fallback
         this.storage.get(`Recess.goals`).then(goals => {
         resolve(goals);
         }).catch(error => {
         console.error(error);
         reject(error);
         });
         */
      }
    });
  }

  setGoals(goals, isUser) {
    console.log('set goals');
    if (typeof  parseInt(goals.activity) === 'number' && typeof parseInt(goals.steps) === 'number') {
      if (this.isAuthenticated) {
        //console.log(`goals authenticated ${goals.activity} : ${goals.steps}`);

        let goalsData = this.af.database.object(`/user/${this.uid}/config/phases/goals/settings`);
        let newGoals = {
          activity: parseInt(goals.activity),
          steps: parseInt(goals.steps),
          timestamp: {},
        };

        if (isUser) {
          newGoals.timestamp = fb.database.ServerValue.TIMESTAMP;
        }
        console.log('new goal');
        console.log(newGoals);

        goalsData.set(newGoals);

        this.setEvent('goal', 'start', 'goals', newGoals);


      }

      this.storage.set('Recess.goals', goals).then(storageData => {
        //console.log(`Storage Recess.goals: ${storageData}`);
      }).catch(error => {
        console.error(error)
      });
    }

  }

  getChat() {
    return new Promise<any>((resolve, reject) => {
      if (this.isAuthenticated) {
        this.af.database.object(`/user/${this.uid}/config/phases/social/settings`,
          {
            preserveSnapshot: true
          }).take(1).subscribe((chat) => {

          resolve(chat.val());
        });
      } else {

        // fallback
        this.storage.get(`Recess.social`).then(chat => {
          resolve(chat);
        }).catch(error => {
          console.error(error);
          reject(error);
        });
      }
    });
  }

  setChat(talkTo) {
    if (this.isAuthenticated) {
      let goalsData = this.af.database.object(`/user/${this.uid}/config/phases/social/settings`);
      goalsData.set(talkTo);

    }

    this.storage.set('Recess.social', talkTo).then(storageData => {
      //console.log(`Storage: ${storageData}`);
    }).catch(error => {
      console.error(error)
    });
  }

  getStepsToday() {
    return new Promise<any>((resolve, reject) => {

      // fallback
      this.storage.get(`Recess.stepsToday`).then(steps => {
        resolve(steps);
      }).catch(error => {
        console.error(error);
        reject(error);
      });

    });
  }

  setStepsToday(stepsToday: number) {
    this.storage.set('Recess.stepsToday', stepsToday).then(storageData => {
      //console.log(`Storage: ${storageData}`);
    }).catch(error => {
      console.error(error)
    });
  }

  getLastSync() {
    return new Promise<any>((resolve, reject) => {
      if (this.isAuthenticated) {
        this.af.database.object(`/user/${this.uid}/sync/last`,
          {
            preserveSnapshot: true
          }).take(1).subscribe((sync) => {

          console.log(`last sync of ${this.uid} from data.service`, sync.val());
          resolve(sync.val());

        });
      } else {

        reject('not_authenticated');
      }
    });
  }

  setLastSync(lastSync: moment.Moment) {
    if (this.isAuthenticated) {
      let syncData = this.af.database.object(`/user/${this.uid}/sync/last`);
      console.log(`set last sync to: ${lastSync.valueOf()}`);
      syncData.set(lastSync.valueOf());

    }

    this.storage.set('Recess.sync', lastSync.valueOf()).then(storageData => {
      //console.log(`Storage: ${storageData}`);
    }).catch(error => {
      console.error(error)
    });
  }

  getPhases() {
    return new Promise<any>((resolve, reject) => {
      if (this.isAuthenticated) {
        this.af.database.object(`/user/${this.uid}/config/phases`, {
          preserveSnapshot: true
        }).take(1).subscribe((phases) => {

          resolve(phases.val());
        });
      } else {

        // fallback
        this.storage.get(`Recess.phases`).then(goals => {
          resolve(goals);
        }).catch(error => {
          console.error(error);
          reject(error);
        });
      }
    });
  }

  setAssistant(assistant) {

    if (this.isAuthenticated) {

      if (assistant.phases.social) {
        let social = this.af.database.object(`/user/${this.uid}/config/assistant/phases/social`);
        social.set(assistant.phases.social);
      }

      if (assistant.phases.activity) {
        let activity = this.af.database.object(`/user/${this.uid}/config/assistant/phases/activity`);
        activity.set(assistant.phases.activity);
      }

      if (assistant.phases.goals) {
        let goals = this.af.database.object(`/user/${this.uid}/config/assistant/phases/goals`);
        goals.set(assistant.phases.goals);
      }

    }
    // TODO first get then set only changes
    this.storage.set('Recess.config.assistant', assistant).then(assistantData => {
      //console.log(`Storage: ${assistantData}`);
    }).catch(error => {
      console.error(error)
    });


  }


  getStatus() {
    return new Promise<any>((resolve, reject) => {
      console.log('getstatus');
      if (this.isAuthenticated) {
        console.log('isAuthenticated');
        this.af.database.object(`/users/${this.uid}`,
          {
            preserveSnapshot: true
          }).take(1).subscribe((userData) => {

          let user = userData.val();

          let userCreatedAt = moment(user.createdAt).startOf('day');

          let userActiveDays = moment().startOf('day').diff(userCreatedAt, 'days');

          Firebase.setUserId(user.uid);
          Firebase.setScreenName(user.alias);
          Firebase.setUserProperty('type', user.type);

          console.log(`User Active days ${userActiveDays}`);
          let phase = 1;
          let mode = user.mode;

          if (userActiveDays < 2) {
            // do nothing
          } else if (userActiveDays < 4) {
            phase = 2;
          } else {
            phase = 3;
          }

          //console.log(`User Mode: ${mode}${phase}`);
          Firebase.setUserProperty('phase', `${phase}`);
          Firebase.setUserProperty('mode', `${mode}`);

          resolve({
            mode: mode,
            phase: phase
          });

        });
      }
    });
  }

  getAssistant() {
    return new Promise<any>((resolve, reject) => {
      if (this.isAuthenticated) {
        this.af.database.object(`/user/${this.uid}/config/assistant`,
          {
            preserveSnapshot: true
          }).take(1).subscribe((assistantData) => {
          console.log('assistantdata');
          resolve(assistantData.val());
        });

      } else {
        // fallback
        this.storage.get(`Recess.config.assistant`).then(assistantData => {
          resolve(assistantData);
        }).catch(error => {
          console.error(error);
          reject(error);
        });
      }

    });

  }


  getShowWelcome() {
    return new Promise<boolean>((resolve, reject) => {
      if (this.isAuthenticated) {
        this.af.database.object(`/user/${this.uid}/config/showWelcome`,
          {
            preserveSnapshot: true
          }).take(1).subscribe((showWelcomeData) => {

          resolve(showWelcomeData);
        });

      } else {
        // fallback
        this.storage.get(`Recess.config.showWelcome`).then(showWelcomeData => {
          resolve(showWelcomeData);
        }).catch(error => {
          console.error(error);
          reject(error);
        });
      }

    });

  }

  setShowWelcome(showWelcome: boolean) {
    if (this.isAuthenticated) {
      let showWelcomeData = this.af.database.object(`/user/${this.uid}/config/showWelcome`);
      showWelcomeData.set(showWelcome);
    }

    this.storage.set(`Recess.config.showWelcome`, showWelcome).then(storageData => {
      //console.log(`Storage: ${storageData}`);
    }).catch(error => {
      console.error(error)
    });
  }

  setSurvey(surveyFilledOut) {
    if (this.isAuthenticated) {
      let survey = this.af.database.object(`/user/${this.uid}/survey`);
      surveyFilledOut.filledOutAt = moment().valueOf();
      survey.set(surveyFilledOut);

      for (var question in surveyFilledOut) {
        if (surveyFilledOut.hasOwnProperty(question)) {
          Firebase.setUserProperty(question, surveyFilledOut[question]);
        }
      }
    }

    this.storage.set('Recess.survey', surveyFilledOut).then(storageData => {
      //console.log(`Storage: ${storageData}`);
    }).catch(error => {
      console.error(error)
    });
  }

  setConsent() {
    if (this.isAuthenticated) {
      let survey = this.af.database.object(`/user/${this.uid}/survey/consent`);
      survey.set({
        agreedToShare: true,
        timestamp: fb.database.ServerValue.TIMESTAMP,
      });

    }

  }

  getConsent() {
    return new Promise<any>((resolve, reject) => {
      console.log('get consent');
      if (this.isAuthenticated) {
        console.log('get consent authenticated');

        this.af.database.object(`/user/${this.uid}/survey/consent`,
          {
            preserveSnapshot: true
          }).take(1).subscribe((consentData) => {

          let consent = consentData.val();
          resolve(consent);

        });

      }
    });
  }

  getRandomInt(min, max) {
    if (Math.random() >= 0.5) {
      return (Math.floor(Math.random() * (max - min + 1)) + min) / 100 * -1;
    }
    return (Math.floor(Math.random() * (max - min + 1)) + min) / 100;
  }

  setUserStepsDay(steps, day: moment.Moment) {

    if (this.isAuthenticated) {
      let self = this;

      let data = this.af.database.object(`/user/${this.uid}/data/ui/user/steps/${day.format('YYYY-MM-DD')}`);
      data.set(steps);

      this.af.database.object(`/user/${this.uid}/data/ui/buddy/steps/${day.format('YYYY-MM-DD')}`,
        {
          preserveSnapshot: true
        }).take(1).subscribe((buddySteps) => {
        let noise = self.getRandomInt(0, 25);

        // update only non-existing values and todays values
        if (null == buddySteps.val() || day.isSame(moment(), 'day') && ((steps - buddySteps.val()) > 25)) {
          let buddySteps = Math.round(steps + steps * noise);
          self.setBuddyStepsDay(buddySteps, day);
        }

      });

    }
  }


  setUserActivityDayTotal(activity, day: moment.Moment) {
    if (this.isAuthenticated) {
      let self = this;
      let data = this.af.database.object(`/user/${this.uid}/data/ui/user/activity/${day.format('YYYY-MM-DD')}/totalHours`);
      data.set(activity);


      this.af.database.object(`/user/${this.uid}/data/ui/buddy/activity/${day.format('YYYY-MM-DD')}/totalHours`,
        {
          preserveSnapshot: true
        }).take(1).subscribe((buddyActivity) => {
        let noise = self.getRandomInt(0, 25);

        if (null == buddyActivity.val()) {
          let buddyActivity = Math.round(activity + activity * noise);
          self.setBuddyActivityDayTotal(buddyActivity, day);
        }

      });

    }
  }

  setBuddyStepsDay(steps, day: moment.Moment) {

    if (this.isAuthenticated) {
      let data = this.af.database.object(`/user/${this.uid}/data/ui/buddy/steps/${day.format('YYYY-MM-DD')}`);
      data.set(steps);

    }
  }

  getBuddyStepsDay(day: moment.Moment) {
    return new Promise<number>((resolve, reject) => {
      if (this.isAuthenticated) {
        this.af.database.object(`/user/${this.uid}/data/ui/buddy/steps/${day.format('YYYY-MM-DD')}`,
          {
            preserveSnapshot: true
          }).take(1).subscribe((steps) => {

          resolve(steps.val());

        });
      }
    });
  }

  getBuddyStepsWeek() {
    return new Promise<any>((resolve, reject) => {
      if (this.isAuthenticated) {
        this.af.database.list(`/user/${this.uid}/data/ui/buddy/steps`,
          {
            preserveSnapshot: true,
            query: {
              limitToLast: 7
            }
          }).take(1).subscribe((steps) => {

          resolve(steps);

        });
      }
    });
  }

  setBuddyActivityDayTotal(activity, day: moment.Moment) {
    if (this.isAuthenticated) {
      //console.log('set buddy activity');

      let totalHours = this.af.database.object(`/user/${this.uid}/data/ui/buddy/activity/${day.format('YYYY-MM-DD')}/totalHours`);
      totalHours.set(activity);

      let date = this.af.database.object(`/user/${this.uid}/data/ui/buddy/activity/${day.format('YYYY-MM-DD')}/date`);
      date.set(day.valueOf());

    }
  }

  setUserActivityDayDetails(activity, day: moment.Moment) {
    if (this.isAuthenticated) {
      let self = this;

      let data = this.af.database.object(`/user/${this.uid}/data/ui/user/activity/${day.format('YYYY-MM-DD')}/details`);
      data.set(activity.day);

      let noise = self.getRandomInt(0, 25);

      let buddyActivity = activity.day;
      for (let hour of buddyActivity) {
        hour.value = Math.round(hour.value + hour.value * noise);
        //console.log(hour);
      }

      this.setBuddyActivityDayDetails(buddyActivity, day);

    }

  }

  setBuddyActivityDayDetails(buddyActivity, day: moment.Moment) {

    if (this.isAuthenticated) {
      let data = this.af.database.object(`/user/${this.uid}/data/ui/buddy/activity/${day.format('YYYY-MM-DD')}/details`);
      data.set(buddyActivity);

    }

  }

  getBuddyActivityDay(day: moment.Moment) {
    return new Promise<any>((resolve, reject) => {

      if (this.isAuthenticated) {
        //console.log('get buddy activity');

        this.af.database.object(`/user/${this.uid}/data/ui/buddy/activity/${day.format('YYYY-MM-DD')}`,
          {
            preserveSnapshot: true,

          }).take(1).subscribe((activity) => {

          resolve(activity.val());

        });

      }

    });
  }

  getBuddyActivityWeek() {
    return new Promise<any>((resolve, reject) => {

      if (this.isAuthenticated) {

        this.af.database.list(`/user/${this.uid}/data/ui/buddy/activity`,
          {
            preserveSnapshot: false,
            query: {
              limitToLast: 7
            }
          }).take(1).subscribe((activity) => {

          resolve(activity);

        });

      }

    });
  }

  setStepsForDay(steps, day: moment.Moment) {
    if (this.isAuthenticated) {
      //let data = this.af.database.list(`/user/${this.uid}/data/steps/${day.format('YYYY.MM.DD')}`);
      //console.log(day.format('YYYY.MM.DD'));
      for (let step in steps) {

        // clean up data
        if (steps[step].sourceBundleId !== undefined) {
          if (steps[step].sourceBundleId.toLowerCase().indexOf('pebble') > 0) {
            steps[step].sourceName = 'Pebble';
          }
          if (steps[step].sourceBundleId.toLowerCase().indexOf('apple') > 0) {
            steps[step].sourceName = 'Apple';
          }
          if (steps[step].sourceBundleId.toLowerCase().indexOf('iphone') > 0) {
            steps[step].sourceName = 'iPhone';
          }
          if (steps[step].sourceBundleId.toLowerCase().indexOf('watch') > 0) {
            steps[step].sourceName = 'Watch';
          }
          delete steps[step].sourceBundleId;

        } else {
          steps[step].sourceName = 'Android'; //TODO: get deviceinfo and place it here
        }

        steps[step].startDate = moment(steps[step].startDate).valueOf();
        steps[step].endDate = moment(steps[step].endDate).valueOf();

        //console.log(steps[step]);
        const stepsHash = hash(steps[step]);

        let data = this.af.database.object(`/user/${this.uid}/data/steps/${day.format('YYYY-MM-DD')}/${stepsHash}`);
        data.set(steps[step]);
      }
    }
  }

  setDistanceForDay(distance, day: moment.Moment) {
    if (this.isAuthenticated) {
      //let data = this.af.database.list(`/user/${this.uid}/data/steps/${day.format('YYYY.MM.DD')}`);
      //console.log(day.format('YYYY.MM.DD'));
      for (let step in distance) {

        // clean up data
        if (distance[step].sourceBundleId !== undefined) {
          if (distance[step].sourceBundleId.toLowerCase().indexOf('pebble') > 0) {
            distance[step].sourceName = 'Pebble';
          }
          if (distance[step].sourceBundleId.toLowerCase().indexOf('apple') > 0) {
            distance[step].sourceName = 'Apple';
          }
          if (distance[step].sourceBundleId.toLowerCase().indexOf('iphone') > 0) {
            distance[step].sourceName = 'iPhone';
          }
          if (distance[step].sourceBundleId.toLowerCase().indexOf('watch') > 0) {
            distance[step].sourceName = 'Watch';
          }
          delete distance[step].sourceBundleId;

        } else {
          distance[step].sourceName = 'Android'; //TODO: get deviceinfo and place it here
        }

        distance[step].startDate = moment(distance[step].startDate).valueOf();
        distance[step].endDate = moment(distance[step].endDate).valueOf();

        //console.log(distance[step]);
        const distanceHash = hash(distance[step]);

        let data = this.af.database.object(`/user/${this.uid}/data/distance/${day.format('YYYY-MM-DD')}/${distanceHash}`);
        data.set(distance[step]);
      }
    }
  }

  getUser() {
    return new Promise<any>((resolve, reject) => {
      if (this.isAuthenticated) {
        this.af.auth.subscribe(authData => {
          //console.log(authData);
          resolve(authData);

        });
      } else {
        this.storage.get(`Recess.user`).then(userData => {
          resolve(userData);
        }).catch(error => {
          console.error(error);
          this.log(error, 105);
          reject(error);
        });
      }
    });

  }

  getUserInfo() {
    return new Promise<any>((resolve, reject) => {

      if (this.isAuthenticated) {

        this.af.database.object(`/users/${this.uid}`,
          {
            preserveSnapshot: true,

          }).take(1).subscribe((user) => {

          resolve(user.val());

        });

      }

    });
  }

  initPush() {

    Firebase.grantPermission();
    console.log('initPush');
    let af = this.af;

    Firebase.getToken().then(token => {
      console.log(`The token is ${token}`);
      let userPushToken = af.database.object(`/users/${this.uid}/pushToken`);
      userPushToken.set(token);

    }).catch(error => {
      console.error('Error getting token', error);
    });

  }

  refreshPush() {

    console.log('refresh token');
    let self = this;

    if (this.isAuthenticated) {
      console.log('refresh token now');


      Firebase.onTokenRefresh().subscribe((token: string) => {
        console.log(`Got a new token ${token}`);
        let userPushToken = self.af.database.object(`/users/${this.uid}/pushToken`);
        userPushToken.set(token);

      });


    }


  }

  initUser(userInfo: any) {
    console.log('set user');

    userInfo.device = {
      appVersion: this.version,
      platform: Device.platform || false,
      version: Device.version || false,
      manufacturer: Device.manufacturer || false,
      model: Device.model || false,
    };

    let mode = this.determineMode();
    userInfo.mode = mode.group;
    userInfo.week = moment().isoWeekYear();

    let user = {
      sync: {
        last: moment().subtract(7, 'days').startOf('day').valueOf(),
      },
      conversation: {
        placeholder: true
      },
      //info: credentials,
      config: {
        showWelcome: true,
        resetUser: false,
        assistant: {
          phases: {
            social: 4,
            activity: 4,
            goal: 4,
          }
        },
        phases: {
          social: {
            unreadMessages: 0,
            enableAt: moment().add(mode.socialActiveInDays, 'days').startOf('day').valueOf(),
            settings: {
              talkTo: userInfo.uid,
              talkToBot: 'witty',
            },
          },
          goals: {
            enableAt: moment().add(mode.goalsActiveInDays, 'days').startOf('day').valueOf(),
            settings: {
              activity: 8,
              steps: 10000,
              timestamp: moment().subtract(10, 'days'),
            },

          },
          activity: {
            enableAt: moment().add(mode.activityActiveInDays, 'days').startOf('day').valueOf(),
          }
        }

      }
    };

    this.storage.set('Recess.user', userInfo).then(storageData => {
      //console.log(`Storage: ${storageData}`);
    }).catch(error => {
      console.error(error)
    });

    this.setAssistant(user.config.assistant);

    let users = this.af.database.object(`/user/${userInfo.uid}`);
    users.set(user);

    let allUsers = this.af.database.object(`/users/${userInfo.uid}`);
    allUsers.set(userInfo);

    this.initPush();

  }

  setEvent(type: string, action: string, module: string, meta?: any) {
    if (this.isAuthenticated) {
      let timestamp = moment();
      let event = this.af.database.object(`/user/${this.uid}/events/${timestamp.format('YYYY-MM-DD')}/${timestamp.valueOf()}`);
      event.set({
        type: type,
        action: action,
        module: module,
        timestamp: fb.database.ServerValue.TIMESTAMP,
        meta: meta || null,
      });

      Firebase.logEvent(type, {content_type: action, item_id: type, item_name: module});

    }
  }

  determineMode() {
    let random = Math.random();

    if (random < 0.33) {

      // Week 1                       | Week 2                    | After Study
      // Activity + Goals             | Activity + Goals          | Activity + Goals + Social
      return {
        group: 'A',
        socialActiveInDays: 14,
        activityActiveInDays: -7,
        goalsActiveInDays: -1,
      };
    } else if (random < 0.66) {

      // Week 1                       | Week 2                    | After Study
      // Activity + Goals             | Activity + Goals + Social | Activity + Goals + Social
      return {
        group: 'B',
        socialActiveInDays: 7,
        activityActiveInDays: -7,
        goalsActiveInDays: -1,
      };
    } else {

      // Week 1                     | Week 2                    | After Study
      // Activity + Goals  + Social | Activity + Goals + Social | Activity + Goals + Social
      return {
        group: 'C',
        socialActiveInDays: -1,
        activityActiveInDays: -7,
        goalsActiveInDays: -1,
      };
    }
  }


}
