import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {HealthService} from '../../providers/health.service';
import {Platform} from 'ionic-angular';
import * as moment from 'moment';
import {DataService} from '../../providers/data.service';

@Component({
  selector: 'activity-today',
  templateUrl: 'activity-today.html'
})
export class ActivityTodayComponent {

  hours: number;
  day: any;

  goal: number = 0;

  private tooltipValue: any;
  private tooltipTimestamp: any;
  private dayselected: number;

  @Input() refresh: boolean = false;
  @Input() isBuddy: boolean = false;

  @Output() goalReachedToday = new EventEmitter();

  constructor(public health: HealthService, public platform: Platform, private data: DataService) {
    console.log('Hello ActivityToday Component');

    this.platform.ready().then(() => {
      this.refreshData();

    });

  }

  //TODO: use actual values and proper template
  public showTooltip(idx) {
    let convertedHoursFromMs = Math.round(moment.duration(this.day[idx].value).asMinutes());

    this.tooltipValue = `${convertedHoursFromMs} minutes active between ${this.day[idx].label}`;
    this.day[idx].selected = true;
    this.tooltipTimestamp = moment();
    this.dayselected = idx;
  }

  ionViewWillEnter() {
    this.refreshData();
  }

  ngOnChanges(changes: SimpleChanges) {
    let self = this;
    for (let propName in changes) {
      let chng = changes[propName];
      let cur = JSON.stringify(chng.currentValue);
      let prev = JSON.stringify(chng.previousValue);

      if (cur !== prev && cur !== undefined) {

        if ('isBuddy' === propName) {
          this.isBuddy = ('true' == cur);

          if (this.isBuddy) {
            this.data.getBuddyActivityDay(moment()).then(stepsBuddyToday => {

              self.hours = stepsBuddyToday.total;
              self.day = stepsBuddyToday.details;

              const goalReachedToday = self.hours >= self.goal;

              self.goalReachedToday.emit(goalReachedToday);

            });
          }

        }

        if ('refresh' === propName && 'true' === cur) {
          this.refreshData();
        }

      }
    }
  }

  refreshData() {
    this.data.getGoals().then(goals => {
      this.goal = goals.activity;

      this.health.getActivityToday().then(data => {

        this.hours = data.totalHours;
        this.day = data.day;
        const goalReachedToday = this.hours >= this.goal;

        this.goalReachedToday.emit(goalReachedToday);

      });
    });
  }

  removeSelections(idx) {

    // idx is set if a selection should be retained
    if (idx === undefined) {
      idx = -1;
      this.tooltipValue = undefined;
    }

    if (this.day !== undefined) {

      this.day.forEach((hour, i) => {
        if (idx !== i) { // keep selection for current element
          hour.selected = false;
        }
      });
    }

  }

}
