import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {DataService} from '../../providers/data.service';


@Component({
  selector: 'page-base',
  templateUrl: 'base.html'
})
export class BasePage {

  constructor(public data: DataService) {
    //console.log('constructor BasePage', this.constructor.name);

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad BasePage', this.constructor.name);
    this.data.setEvent('page_view','ionViewDidLoad', this.constructor.name);
  }

  ionViewWillEnter() {
    //console.log('ionViewWillEnter BasePage', this.constructor.name);
    this.data.setEvent('page_view','ionViewWillEnter', this.constructor.name);
  }

  ionViewDidEnter() {
    //console.log('ionViewDidEnter BasePage', this.constructor.name);
    this.data.setEvent('page_view','ionViewDidEnter', this.constructor.name);
  }

  ionViewWillLeave() {
    //console.log('ionViewWillLeave BasePage', this.constructor.name);
    this.data.setEvent('page_view','ionViewWillLeave', this.constructor.name);
  }

  ionViewDidLeave() {
    //console.log('ionViewDidLeave BasePage', this.constructor.name);
    this.data.setEvent('page_view','ionViewDidLeave', this.constructor.name);
  }

  ionViewWillUnload() {
    //console.log('ionViewWillUnload BasePage', this.constructor.name);
    this.data.setEvent('page_view','ionViewWillUnload', this.constructor.name);
  }

  ionViewCanEnter() {
    //console.log('ionViewCanEnter BasePage', this.constructor.name);
    this.data.setEvent('page_view','ionViewCanEnter', this.constructor.name);
  }

  ionViewCanLeave() {
    //console.log('ionViewCanLeave BasePage', this.constructor.name);
    this.data.setEvent('page_view','ionViewCanLeave', this.constructor.name);
  }

}
