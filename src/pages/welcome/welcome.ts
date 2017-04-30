import {Component, ViewChild} from '@angular/core';
import {NavController, Slides, AlertController, Platform} from 'ionic-angular';
import {InAppBrowser} from 'ionic-native';
import {DataService} from '../../providers/data.service';
import {IntroPage} from '../../pages/intro/intro';

import {Health} from 'ionic-native';
import {BasePage} from '../base/base';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})

export class WelcomePage extends BasePage {

  @ViewChild(Slides) slides: Slides;

  survey: any;

  health: boolean = false;
  notifications: boolean = false;

  constructor(public navCtrl: NavController,
              public data: DataService,
              public alertCtrl: AlertController,
              public plt: Platform) {

    super(data);

    this.data = data;
    // survey blueprint
    this.survey = {
      agreedToStudy: true,
      consent: {
        agreedToShare: false,
      },
      age: null,
      gender: null,
      occupation: null,
      intensity: null,
      app: null,
      tracker: null
    };

    this.data.setEvent('process', 'start', 'welcome');



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  goToTerms() {
    this.slides.slideTo(1, 200);
    this.data.setEvent('process', 'terms', 'welcome');

  }

  goToStart() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(0, 100);
  }

  openTerms() {
    this.data.setEvent('process', 'terms_web', 'welcome');

    new InAppBrowser('http://ai.uwaterloo.ca/recess/policy?source=app', '_system');
  }

  goToSurveyStart() {
    // TODO: data.set.... user
    this.slides.lockSwipes(false);
    this.slides.slideTo(2, 100);
    this.data.setEvent('process', 'start_again', 'welcome');

  }

  goToSurveyEnd() {
    this.slides.slideTo(3, 100);
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    if (currentIndex == 1) { // Terms
      this.slides.lockSwipes(true);
    } else {
      this.slides.lockSwipes(false);
    }
  }

  goToPermissions() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(4, 100);
    this.data.setEvent('process', 'permissions', 'welcome');

  }

  start() {
    console.log(this.survey);
    if (this.health == true) {
      this.data.setSurvey(this.survey);
      this.data.setShowWelcome(false);
      //this.navCtrl.setRoot(TabsPage);
      this.navCtrl.setRoot(IntroPage);
    } else {
      let alert = this.alertCtrl.create({
        title: 'Permissions',
        subTitle: 'To make use of the recess app, we will need access to your health data.',
        buttons: ['OK']
      });
      alert.present();
    }

  }

  askHealthPermission() {
    this.data.setEvent('process', 'ask_permission_health', 'welcome');

    Health.requestAuthorization(['steps', 'distance']).then(isAuthorized => {
      console.log(`Authorization ${isAuthorized}`);
    }).catch(error => {
      console.error(error);
    });

    if (this.plt.is('android')) {
      Health.promptInstallFit().then(data => {
        console.log(data);
      }).catch(error => {
        console.log('Error Prompt Install Fit');
        console.error(error);
      });
    }


  }

  askNotificationPermission() {

  }


}
