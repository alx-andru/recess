import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {BasePage} from '../base/base';
import {DataService} from "../../providers/data.service";

@Component({
  selector: 'page-help-activity',
  templateUrl: 'help-activity.html'
})
export class HelpActivityPage extends BasePage {

  constructor(public viewCtrl: ViewController,
              public data: DataService) {
    super(data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpActivityPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
