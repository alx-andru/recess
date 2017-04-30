import {Component, ViewChild} from '@angular/core';
import {NavController, Slides} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';
import {DataService} from '../../providers/data.service';


@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html'
})
export class IntroPage {
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, public data: DataService) {
    this.data.setEvent('process', 'start', 'intro');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroPage');
  }

  slideChanged() {
    //let currentIndex = this.slides.getActiveIndex();
    //console.log('changed');
    this.data.setEvent('process', 'slide', 'intro', this.slides.getActiveIndex());
  }

  start() {
    console.log('start');
    this.data.setEvent('process', 'end', 'intro');
    this.navCtrl.setRoot(TabsPage);
  }


}
