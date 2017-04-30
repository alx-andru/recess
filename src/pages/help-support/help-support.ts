import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {DataService} from '../../providers/data.service';
import {BasePage} from '../base/base';
import {InAppBrowser} from 'ionic-native';
import {IntroPage} from '../../pages/intro/intro';
import {TabsPage} from '../../pages/tabs/tabs';
import {FeedbackPage} from '../../pages/feedback/feedback';


@Component({
  selector: 'page-help-support',
  templateUrl: 'help-support.html'
})
export class HelpSupportPage extends BasePage {

  introPage = IntroPage;
  feedbackPage = FeedbackPage;
  tabs: any = TabsPage;
  showFeedback: boolean = false;

  constructor(public data: DataService, private navCtrl: NavController) {
    super(data);


    this.data.getStatus().then(status => {

      if (status.phase > 2) {
        this.showFeedback = true;
      }

    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpSupportPage');
  }

  openSupport() {
    new InAppBrowser('http://ai.uwaterloo.ca/recess/?source=app', '_system');
  }

  openIntro() {
    this.navCtrl.push(IntroPage);
  }

}
