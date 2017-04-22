import {Component} from '@angular/core';
import {BasePage} from '../base/base';
import {DataService} from "../../providers/data.service";
import * as moment from 'moment';


@Component({
  selector: 'page-chat-inactive',
  templateUrl: 'chat-inactive.html'
})
export class ChatInactivePage extends BasePage {
  public goals: any;
  public phases: any;
  public backinDays: any = 7;

  constructor(public data: DataService) {
    super(data);

    this.phases = {
      goals: {
        enabledAt: moment().subtract(7, 'days'),
      }
    };


    this.determineComeBack();
  }

  determineComeBack(){
    this.data.getPhases().then(phases => {
      this.phases = phases;
      this.backinDays = moment(phases.social.enableAt).startOf('day').diff(moment().startOf('day'), 'days');

    });
  }

  ionViewWillEnter(){
    this.determineComeBack();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatInactivePage');
  }

}
