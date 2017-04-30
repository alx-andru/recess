import {Component, Input} from '@angular/core';
import {HelpStarPage} from '../../pages/help-star/help-star';
import {PopoverController} from 'ionic-angular';
import {DataService} from '../../providers/data.service';

@Component({
  selector: 'ui-star',
  templateUrl: 'ui-star.html'
})


export class UiStarComponent {

  @Input() isStepsAchieved: boolean = false;
  @Input() isActivityAchieved: boolean = false;
  @Input() isBuddy: boolean = false;

  constructor(public popoverCtrl: PopoverController, public data: DataService) {
    console.log('Hello UiStar Component');
    console.log(`steps ${this.isStepsAchieved}`);
    console.log(`activity ${this.isActivityAchieved}`);

  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(HelpStarPage, {}, {
      cssClass: 'phases'
    });
    popover.present({
      ev: myEvent
    });

    this.data.setEvent('button', 'tap', 'phases');


  }


}
