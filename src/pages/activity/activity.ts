import {Component, Renderer, ViewChild} from '@angular/core';
import {NavController, Platform, PopoverController, Slides, ViewController} from 'ionic-angular';
import {AngularFire, FirebaseAuthState} from 'angularfire2';

import {HelpSupportPage} from '../help-support/help-support';

import {BasePage} from '../base/base';
import {DataService} from '../../providers/data.service';

import {HealthService} from '../../providers/health.service';

import * as moment from 'moment';
import {FeedbackPage} from '../feedback/feedback';

@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html'
})

export class ActivityPage extends BasePage {
  private achievementsToday: any;
  private achievementsWeek: any;

  title: string;
  isBuddy: boolean = false;

  isBuddyActive: boolean = false;

  private TXT_TITLE_ACTIVITY_TODAY: string = 'Your activity';
  private TXT_TITLE_ACTIVITY_WEEK: string = 'Last 7 days';

  private TXT_TITLE_ACTIVITY_TODAY_BUDDY: string = 'Buddys activity';
  private TXT_TITLE_ACTIVITY_WEEK_BUDDY: string = 'Last 7 days';

  @ViewChild(Slides) slides: Slides;
  @ViewChild('assistant') assistantButton;


  refresh: boolean = false;
  syncInitialized: boolean = false;

  status: any;
  assistantData: any;

  self: any;

  constructor(public platform: Platform,
              public af: AngularFire,
              public popoverCtrl: PopoverController,
              public health: HealthService,
              public data: DataService,
              private renderer: Renderer,
              public navCtrl: NavController,
              ) {

    super(data);

    this.achievementsToday = [{
      isAchievedSteps: false,
      isAchievedActivity: false
    }];
    this.achievementsWeek = [
      {
        isAchievedSteps: false,
        isAchievedActivity: false
      },
      {
        isAchievedSteps: false,
        isAchievedActivity: false
      },
      {
        isAchievedSteps: false,
        isAchievedActivity: false
      },
      {
        isAchievedSteps: false,
        isAchievedActivity: false
      },
      {
        isAchievedSteps: false,
        isAchievedActivity: false
      },
      {
        isAchievedSteps: false,
        isAchievedActivity: false
      },
      {
        isAchievedSteps: false,
        isAchievedActivity: false
      }
    ];

    this.title = this.TXT_TITLE_ACTIVITY_TODAY;

    const self = this;

    this.af.auth.subscribe((state: FirebaseAuthState) => {
      console.log('Activity auth state:', state);

      /*
       this.data.getAssistant().then(assistantData => {
       this.assistantData = assistantData;
       });
       */

      // TODO: improve me and use await


      if (!this.syncInitialized) {
        console.log('sync now');
        this.syncInitialized = true;
        this.health.syncData();


        this.data.getStatus().then(status => {
          console.log('Status: ' + JSON.stringify(status));

          this.status = status;

          this.data.getPhases().then(configSocial => {

            let enableSocialAt = moment(configSocial.social.enableAt);
            if (moment().isAfter(enableSocialAt, 'day') || moment().isSame(enableSocialAt, 'day')) {

              if ( //
              (status.mode == 'A' && status.phase > 2) ||
              (status.mode == 'B' && status.phase >= 2) ||
              (status.mode == 'C')
              ) {
                this.isBuddyActive = true;

              }

            } else {

              this.isBuddyActive = false;

            }


          });


        });


        this.data.getStatus().then(status => {

          this.data.getConsent().then(function (consent) {
            console.log('dfsdfasdfasdfasfdasdfasdfsfs');
            console.log(consent.agreedToShare);
            console.log(status.phase);
            if (!consent.agreedToShare && status.phase > 2) {
              console.log('push it baby');
              self.showFeedback();

            }

          });

        });


        /*
         setTimeout(function () {
         switch (self.mode) {
         case 'A1':
         case 'A2':
         case 'B1':
         if (self.assistantData && self.assistantData.phases && self.assistantData.phases.activity > 1) {
         //self.simulatePopoverClick();
         self.assistantData.phases.activity--;
         self.data.setAssistant(self.assistantData);

         }
         break;
         case 'B2':
         case 'C1':
         case 'C2':
         if (this.assistantData && self.assistantData.phases && self.assistantData.phases.social > 1) {
         self.simulatePopoverClick();
         self.assistantData.phases.social--;
         self.data.setAssistant(self.assistantData);

         }
         break;
         default:
         console.log('default');
         self.isBuddyActive = true;

         if (this.assistantData && self.assistantData.phases && self.assistantData.phases.goals > 1) {
         self.simulatePopoverClick();
         self.assistantData.phases.goals--;
         self.data.setAssistant(self.assistantData);

         }
         break;
         }

         }, 2000
         );
         */
      }


    });


  }

  showFeedback() {
    this.navCtrl.push(FeedbackPage);

  }

  doRefresh(refresher) {

    if (this.isBuddyActive) {
      console.log('Refresh');
      this.isBuddy = !this.isBuddy;

      setTimeout(() => {
        console.log('Async operation has ended');
        this.slideChanged();
        refresher.complete();
      }, 3000);
    }

  }


  presentPopoverHelp(myEvent) {
    let popover = this.popoverCtrl.create(HelpSupportPage, {}, {
      cssClass: 'support'
    });
    popover.present({
      ev: myEvent
    });

    this.data.setEvent('button', 'support');
  }


  stepsReachedToday(stepsReached) {
    //console.log(stepsReached);
    this.achievementsToday[0].isAchievedSteps = stepsReached;

  }

  stepsReachedWeek(stepsReached) {
    for (let reached in stepsReached) {
      this.achievementsWeek[reached].isAchievedSteps = stepsReached[reached];
    }
  }

  activityReachedToday(activityReached) {
    //console.log(activityReached);
    this.achievementsToday[0].isAchievedActivity = activityReached;

  }

  activityReachedWeek(activityReached) {
    for (let reached in activityReached) {
      this.achievementsWeek[reached].isAchievedActivity = activityReached[reached];
    }
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ActivityPage');

  }

  ionViewWillEnter() {
    //console.log('activity entered');
    this.refresh = !this.refresh;
  }


  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    if (currentIndex === 1 && this.isBuddy) {
      this.title = this.TXT_TITLE_ACTIVITY_WEEK_BUDDY;

    } else if (currentIndex === 1 && !this.isBuddy) {
      this.title = this.TXT_TITLE_ACTIVITY_WEEK;

    } else if (currentIndex !== 1 && this.isBuddy) {
      this.title = this.TXT_TITLE_ACTIVITY_TODAY_BUDDY;

    } else if (currentIndex !== 1 && !this.isBuddy) {
      this.title = this.TXT_TITLE_ACTIVITY_TODAY;
    }

  }


}
