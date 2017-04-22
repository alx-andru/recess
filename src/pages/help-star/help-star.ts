import {Component} from '@angular/core';
import {BasePage} from '../base/base';
import {DataService} from '../../providers/data.service';
import {PopoverController} from "ionic-angular";

@Component({
  selector: 'page-help-star',
  templateUrl: 'help-star.html'
})
export class HelpStarPage extends BasePage {

  constructor(public data: DataService) {
    super(data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpStarPage');
  }




}
