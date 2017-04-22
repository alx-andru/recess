import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {HealthService} from '../../providers/health.service';
import {Platform} from 'ionic-angular';
import {DataService} from '../../providers/data.service';
import * as moment from 'moment';

@Component({
  selector: 'activity-week',
  templateUrl: 'activity-week.html'
})

export class ActivityWeekComponent {

  week: any;
  weekHours: number = 0;
  weekGoal: number = 0;
  goal: number = 0;

  @Input() refresh: boolean = false;
  @Input() isBuddy: boolean = false;
  @Output() goalReachedWeek = new EventEmitter();

  constructor(public health: HealthService, public platform: Platform, private data: DataService) {
    console.log('Hello ActivityWeek Component');

    this.platform.ready().then(() => {

      this.refreshData();


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
          //console.log('call refresh data ' + cur);
          this.refreshData();

        }

        if ('isBuddy' == propName) {
          this.isBuddy = ('true' === cur);

          if (this.isBuddy) {
            this.data.getBuddyActivityWeek().then(week => {
              this.prepareChart(week);
            });

          } else {
            this.refreshData();

          }
        }

      }
    }
  }

  refreshData() {
    //console.log('ActivityWeek refreshData()');
    this.data.getGoals().then(goals => {
      //console.log(`ActivityWeek Goals: ${goals.activity}`);
      this.weekGoal = goals.activity * 7;
      this.goal = goals.activity;

      this.health.getActivityWeek().then(weekActivity => {

        //console.log(`WeekActivity: `, weekActivity);
        this.prepareChart(weekActivity);
      });

    }).catch(function (e) {
      console.log(e);
    });


  }

  prepareChart(data) {
    this.weekHours = 0;

    let days = [];
    let goalReached = [];

    for (let weekday of data) {

      //weekday = weekday.val();

      let percentage = weekday.totalHours / this.goal * 100;
      if (percentage >= 100) {
        percentage = 100;
        goalReached.push(true);
      } else {
        goalReached.push(false);
      }

      var totalHours = typeof weekday.totalHours === 'string' ? parseInt(weekday.totalHours) : weekday.totalHours;

      var day = {
        day: moment(weekday.date),
        percentage: `${percentage}%`,
        value: totalHours,
      };

      days.push(day);

      this.weekHours += totalHours;
    }

    this.week = days;
    this.goalReachedWeek.emit(goalReached);

  }

}
