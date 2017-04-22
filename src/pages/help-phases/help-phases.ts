import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {BasePage} from '../base/base';
import {DataService} from "../../providers/data.service";


@Component({
  selector: 'page-help-phases',
  templateUrl: 'help-phases.html'
})
export class HelpPhasesPage extends BasePage {

  constructor(public viewCtrl: ViewController,
              public data: DataService) {
    super(data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpPhasesPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
