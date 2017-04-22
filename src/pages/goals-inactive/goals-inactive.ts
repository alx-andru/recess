import {Component} from '@angular/core';
import {DataService} from "../../providers/data.service";
import * as moment from 'moment';
import {BasePage} from '../base/base';

@Component({
  selector: 'page-goals-inactive',
  templateUrl: 'goals-inactive.html'
})
export class GoalsInactivePage extends BasePage {
  public goals: any;
  public phases: any;
  public backinDays: any = 7;


  constructor(public data: DataService) {

    super(data);

    this.goals = {
      steps: 10000,
      activity: 8,
    };

    this.phases = {
      goals: {
        enabledAt: moment().subtract(7, 'days'),
      }
    };

    this.determineComeBack();
  }

  determineComeBack() {
    this.data.getPhases().then(phases => {
      this.phases = phases;
      this.backinDays = moment(phases.goals.enableAt).startOf('day').diff(moment().startOf('day'), 'days');

    });
  }

  ionViewWillEnter() {
    this.determineComeBack();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GoalsInactivePage');


  }

}
