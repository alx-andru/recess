import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Slides} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';


@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html'
})
export class IntroPage {
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroPage');
  }

  slideChanged() {
    //let currentIndex = this.slides.getActiveIndex();
    //console.log('changed');
  }

  start() {
    console.log('start');
    this.navCtrl.setRoot(TabsPage);
  }



}
