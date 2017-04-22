import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {HealthService} from '../../providers/health.service';
import {Platform} from 'ionic-angular';
import {DataService} from '../../providers/data.service';
import * as moment from 'moment';

@Component({
  selector: 'steps-week',
  templateUrl: 'steps-week.html'
})
export class StepsWeekComponent {
  week: any;
  goal: number = 0;

  @Input() refresh: boolean = false;
  @Input() isBuddy: boolean = false;
  @Output() goalReachedWeek = new EventEmitter();


  constructor(private health: HealthService, public platform: Platform, private data: DataService) {
    //console.log('Hello StepsWeek Component');

    this.platform.ready().then(() => {
      setTimeout(() => {
        //this.refreshData();
      }, 1000);

    });
  }

  refreshData() {
    this.data.getGoals().then(goals => {
      //console.log(goals.steps);
      this.goal = goals.steps;

      this.health.getStepsWeek().then(data => {

        //console.log(data);
        this.prepareChart(data);
      });

    }).catch(function (e) {
      console.log(e);
    });


  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let chng = changes[propName];
      let cur = JSON.stringify(chng.currentValue);
      let prev = JSON.stringify(chng.previousValue);
      //console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);

      if (cur !== prev && cur !== undefined) {
        if ('refresh' === propName && 'true' === cur) {
          this.refreshData();
        }

        if ('isBuddy' === propName) {
          this.isBuddy = ('true' === cur);

          if (this.isBuddy) {
            //
            this.data.getBuddyStepsWeek().then(buddyWeekSteps => {
              //
              console.log(JSON.stringify(buddyWeekSteps));
              let days = [];
              let start = 6;
              for (let daySteps of buddyWeekSteps) {
                days.push({
                  day: moment().startOf('day').subtract(start--, 'days'),
                  value: daySteps.val()
                });

              }

              this.prepareChart(days);


            });

          } else {
            this.refreshData();
          }
        }

      }
    }
  }

  prepareChart(data) {

    let days = [];
    let goalReached = [];

    for (let weekday of data) {
      let percentage = weekday.value / this.goal * 100;
      if (percentage > 100) {
        percentage = 100;
        goalReached.push(true);
      } else {
        goalReached.push(false);
      }

      //console.log('Percentage: ' + percentage);

      days.push({
        day: weekday.day,
        percentage: `${percentage}%`,
        value: parseInt(weekday.value)
      });

    }
    this.week = days;
    console.log(JSON.stringify(this.week));

    this.goalReachedWeek.emit(goalReached);
  }


}
