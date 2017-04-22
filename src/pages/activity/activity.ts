import {Component, Renderer, ViewChild} from '@angular/core';
import {Platform, PopoverController, Slides} from 'ionic-angular';
import {AngularFire, FirebaseAuthState} from 'angularfire2';
import {HelpPhasesSocialPage} from '../help-phases-social/help-phases-social';
import {HelpPhasesActivityPage} from '../help-phases-activity/help-phases-activity';
import {HelpPhasesCompletePage} from '../help-phases-complete/help-phases-complete';

import {HelpSupportPage} from '../help-support/help-support';

import {BasePage} from '../base/base';
import {DataService} from '../../providers/data.service';

import {HealthService} from '../../providers/health.service';

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

  mode: any;
  assistantData: any;

  constructor(public platform: Platform,
              public af: AngularFire,
              public popoverCtrl: PopoverController,
              public health: HealthService,
              public data: DataService,
              private renderer: Renderer) {

    super(data);

    let self = this;

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

    this.af.auth.subscribe((state: FirebaseAuthState) => {
      console.log('Activity auth state:', state);

      this.data.getAssistant().then(assistantData => {
        this.assistantData = assistantData;
      });

      this.data.getStatus().then(status => {
        this.mode = status;
      });

      if (!this.syncInitialized) {
        console.log('sync now');
        this.syncInitialized = true;
        this.health.syncData();

        setTimeout(function () {
            switch (self.mode) {
              case 'A1':
              case 'A2':
              case 'B1':
                if (self.assistantData && self.assistantData.phases && self.assistantData.phases.activity > 1) {
                  self.simulatePopoverClick();
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
      }


    });


  }

  doRefresh(refresher) {
    console.log('Refresh');
    this.isBuddy = !this.isBuddy;

    setTimeout(() => {
      console.log('Async operation has ended');
      this.slideChanged();
      refresher.complete();
    }, 3000);
  }

  simulatePopoverClick() {
    let evObj = new Event('click', {bubbles: true});

    this.renderer.invokeElementMethod(this.assistantButton._elementRef.nativeElement,
      'dispatchEvent',
      [new MouseEvent('click', evObj)]);
  }

  presentPopover(myEvent) {
    let self = this;
    //console.log('Mode: ' + this.mode);

    let popover;

    switch (this.mode) {
      case 'A1':
      case 'A2':
      case 'B1':
        //console.log('Case A1 or A2');
        //
        popover = this.popoverCtrl.create(HelpPhasesActivityPage, {}, {
          cssClass: 'phases'
        });
        popover.present({
          ev: myEvent
        });


        break;

      case 'B2':
      case 'C1':
      case 'C2':
        //console.log('Case B2');
        //
        popover = this.popoverCtrl.create(HelpPhasesSocialPage, {}, {
          cssClass: 'phases'
        });
        popover.present({
          ev: myEvent
        });


        break;

      default:
        //console.log('Case Complete');
        //
        popover = this.popoverCtrl.create(HelpPhasesCompletePage, {}, {
          cssClass: 'phases'
        });
        popover.present({
          ev: myEvent
        });

    }

    this.data.setEvent('button', 'phases');

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
