import {Component} from '@angular/core';

import {ChatPage} from '../chat/chat';
import {ChatInactivePage} from '../chat-inactive/chat-inactive';

import {ActivityPage} from '../activity/activity';
import {GoalsPage} from '../goals/goals';
import {GoalsInactivePage} from '../goals-inactive/goals-inactive';

import  {Keyboard, Badge} from 'ionic-native';
import {DataService} from "../../providers/data.service";

import * as moment from 'moment';

import {BasePage} from '../base/base';
import {AngularFire} from 'angularfire2';
import {FeedbackPage} from '../feedback/feedback';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage extends BasePage {

  chat: any = ChatInactivePage;
  activity: any = ActivityPage;
  goals: any = GoalsInactivePage;

  hideTabs: boolean = false;

  tabs: any;
  badgeRef :any;

  constructor(public data: DataService, public af: AngularFire) {

    super(data);

    this.data.tabevent.subscribe(configSocial => {
      this.setTabs(configSocial.phases);

      if(configSocial.unreadMessages == 0){
        this.tabs[0].badge = null;
        Badge.clear();

      } else {
        this.tabs[0].badge = configSocial.unreadMessages;
      }
    });

    this.data.getPhases().then(configSocial => {
      this.setTabs(configSocial);

    });

    this.tabs = [
      {title: 'social', root: ChatPage, icon: 'forum', badge: null},
      {title: 'activity', root: ActivityPage, icon: 'timeline', badge: null},
      {title: 'goal', root: GoalsPage, icon: 'assignment', badge: null},
    ];


  }

  setTabs(phases) {

    this.data.getStatus().then(status => {

      this.data.getConsent().then(function (consent) {

        if (null === phases) {
          return;
        }

        let enableGoalsAt = moment(phases.goals.enableAt);
        if (moment().isAfter(enableGoalsAt, 'day') || moment().isSame(enableGoalsAt, 'day')) {
          this.tabs[2].root = GoalsPage
        } else {
          this.tabs[2].root = GoalsInactivePage;
        }

        let enableSocialAt = moment(phases.social.enableAt);
        if (moment().isAfter(enableSocialAt, 'day') || moment().isSame(enableSocialAt, 'day')) {
          this.tabs[0].root = ChatPage;
        } else {
          this.tabs[0].root = ChatInactivePage;
        }

        if (!consent.agreedToShare && status.phase > 2) {
          console.log('push it baby');
            this.tabs[1].root = FeedbackPage;

        }

      });

    });






  }

  ionViewDidEnter() {
    Keyboard.onKeyboardShow().subscribe(() => {
      this.hideTabs = true
    });
    Keyboard.onKeyboardHide().subscribe(() => {
      this.hideTabs = false
    });
  }
}
