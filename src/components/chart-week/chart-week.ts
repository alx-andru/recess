import {Component, Input, SimpleChanges} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'chart-week',
  templateUrl: 'chart-week.html'
})
export class ChartWeekComponent {

  @Input() days: any;
  @Input() isBuddy: boolean = false;

  private _isBottom: boolean = false;


  @Input()
  set isBottom(isBottom: boolean) {
    this._isBottom = isBottom;
  }

  get isBottom(): boolean {
    return this._isBottom;
  }

  tooltipValue: any;
  tooltipTimestamp: any;
  dayselected: number;

  constructor() {
    console.log('Hello ChartWeek Component');

    this.days = [];
    for (let i = 6; i >= 0; i--) {

      this.days.push({
        day: moment().subtract(i, 'days'),
        percentage: '0%',
        value: 0,
      });
    }


  }

  ngOnInit() {
    //console.log(this.days);


  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let chng = changes[propName];
      let cur = JSON.stringify(chng.currentValue);
      let prev = JSON.stringify(chng.previousValue);
      //console.log(`ChartWeek: ${propName}: currentValue = ${cur}, previousValue = ${prev}`);

      if (cur !== prev && cur !== undefined) {
        if (propName === 'isBuddy') {
          this.isBuddy = (cur === 'true');
        }

        //console.log(changes[propName]);
        //this.prepareChart();
      }


    }
  }


  showTooltip(idx) {
    //console.log(`bar selected ${idx}`);
    this.tooltipValue = this.days[idx].value;
    this.days[idx].selected = true;
    this.tooltipTimestamp = this.days[idx].day;
    this.dayselected = idx;
  }


  removeSelections(idx) {

    // idx is set if a selection should be retained
    if (idx === undefined) {
      idx = -1;
      this.tooltipValue = undefined;
    }

    if (this.days) {
      this.days.forEach((day, i) => {
        if (idx !== i) { // keep selection for current element
          day.selected = false;
        }
      });
    }

  }

}
