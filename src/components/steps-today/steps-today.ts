import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {Platform, PopoverController} from 'ionic-angular';
import {HealthService} from '../../providers/health.service';
import {DataService} from '../../providers/data.service';
import {HelpStepsPage} from '../../pages/help-steps/help-steps';
import * as moment from 'moment';

@Component({
  selector: 'steps-today',
  templateUrl: 'steps-today.html',
})
export class StepsTodayComponent {

  text: string;

  strokeDasharray: string;
  strokeDasharrayHalf: string;

  steps: number = 0;
  goal: any = 0;

  @Input() refresh: boolean = false;
  @Input() isBuddy: boolean = false;

  @Output() goalReachedToday = new EventEmitter();

  constructor(public platform: Platform,
              public health: HealthService,
              public data: DataService,
              public popoverCtrl: PopoverController) {

    console.log('Hello StepsToday Component');

    data.getStepsToday().then(stepsToday => {
      this.steps = stepsToday;
    });

    this.platform.ready().then(() => {

      //this.refreshData();

    });

  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let chng = changes[propName];
      let cur = JSON.stringify(chng.currentValue);
      let prev = JSON.stringify(chng.previousValue);
      //console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);

      if (cur !== prev && cur !== undefined) {

        if (propName == 'isBuddy') {
          this.isBuddy = ('true' === cur);

          if (this.isBuddy) {
            this.data.getBuddyStepsDay(moment()).then(stepsBuddyToday => {
              this.steps = stepsBuddyToday;
              this.updateGaugeChart();

            });
          } else {
            this.refreshData();
          }


        }
        if ('refresh' === propName && 'true' === cur) {
          console.log('call refresh data ' + cur);
          this.refreshData();
        }

      }
    }
  }

  refreshData() {

    this.data.getGoals().then(goals => {
      //console.log(goals.steps);
      this.goal = goals.steps;

      this.health.getStepsToday().then(data => {
        this.steps = data;
        this.data.setStepsToday(data);

        //console.log(JSON.stringify(data));
        this.updateGaugeChart();
      });

    }).catch(function (e) {
      console.log(e);
    });
  }

  updateGaugeChart() {
    const radius = 100;
    let donutRadius = radius * Math.PI;
    let percentage = this.steps / this.goal;
    if (percentage >= 1) {
      percentage = 1;
      this.goalReachedToday.emit(true);
    } else {
      this.goalReachedToday.emit(false);
    }

    // example: 50% -> 188 376
    let dashArrayValue = donutRadius * percentage;
    let dashArrayHalf = donutRadius * 0.5;
    let dashArrayMax = donutRadius * 2;
    this.strokeDasharray = `${dashArrayValue} ${dashArrayMax}`;
    this.strokeDasharrayHalf = ` ${dashArrayMax}`;
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(HelpStepsPage, {}, {
      cssClass: 'phases'
    });
    popover.present({
      ev: myEvent
    });

    this.data.setEvent('button', 'steps');
  }

}
