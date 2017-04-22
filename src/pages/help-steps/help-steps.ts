import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {BasePage} from '../base/base';
import {DataService} from "../../providers/data.service";


@Component({
  selector: 'page-help-steps',
  templateUrl: 'help-steps.html'
})
export class HelpStepsPage extends BasePage {

  constructor(public viewCtrl: ViewController,
              public data: DataService) {

    super(data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpStepsPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
