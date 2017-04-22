import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {DataService} from '../../providers/data.service';
import {BasePage} from '../base/base';
import {InAppBrowser} from 'ionic-native';
import {IntroPage} from '../../pages/intro/intro';
import {TabsPage} from '../../pages/tabs/tabs';


@Component({
  selector: 'page-help-support',
  templateUrl: 'help-support.html'
})
export class HelpSupportPage extends BasePage {

  introPage = IntroPage;
  tabs: any = TabsPage;

  constructor(public data: DataService, private navCtrl: NavController) {
    super(data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpSupportPage');
  }

  openSupport() {
    let browser = new InAppBrowser('http://ai.uwaterloo.ca/recess/?source=app', '_system');
  }

  openIntro() {
    this.navCtrl.setRoot(IntroPage);
  }

}
