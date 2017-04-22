import {Component, Input} from '@angular/core';
import {HelpActivityPage} from '../../pages/help-activity/help-activity';
import {PopoverController} from 'ionic-angular';


@Component({
  selector: 'ui-achieved-and-goal',
  templateUrl: 'ui-achieved-and-goal.html'
})


export class UiAchievedAndGoalComponent {

  @Input() hours: number = 0;
  @Input() goal: number = 0;
  @Input() isBuddy: boolean = false;

  constructor(public popoverCtrl: PopoverController) {
    console.log('Hello UiAchievedAndGoal Component');
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(HelpActivityPage, {}, {
      cssClass: 'phases'
    });
    popover.present({
      ev: myEvent
    });
  }

}
