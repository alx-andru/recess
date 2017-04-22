import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {DataService} from "../../providers/data.service";
import {BasePage} from '../base/base';



@Component({
  selector: 'page-goals',
  templateUrl: 'goals.html'
})
export class GoalsPage extends BasePage {
  goals: any;

  constructor(public data: DataService,
              public alertCtrl: AlertController) {
    super(data);

    this.goals = {
      steps: 10000,
      activity: 8,
    };

    this.data.getGoals().then(goals => {
      this.goals = goals;
      //console.log(goals);
    });

  }

  ionViewWillEnter() {
    this.data.getGoals().then(goals => {
      this.goals = goals;
      //console.log(goals);
    });
  }

  showSteps() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Set your goal');
    alert.setSubTitle('How many steps a day can you walk?');

    alert.setCssClass('alert--select-goal');

    alert.addInput({
      type: 'radio',
      label: '8.000',
      value: '8000',
      checked: this.goals.steps === 8000,
    });

    alert.addInput({
      type: 'radio',
      label: '10.000',
      value: '10000',
      checked: this.goals.steps === 10000,
    });

    alert.addInput({
      type: 'radio',
      label: '12.000',
      value: '12000',
      checked: this.goals.steps === 12000,
    });

    alert.addInput({
      type: 'radio',
      label: '15.000',
      value: '15000',
      checked: this.goals.steps === 15000,
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Save',
      handler: data => {
        this.goals.steps = data;
      }
    });
    alert.present();
  }

  showActivity() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Set your Activity');
    alert.setSubTitle('How many minutes can you be active a day?');

    alert.setCssClass('alert--select-activity');

    alert.addInput({
      type: 'radio',
      label: '6x a day',
      value: '6',
      checked: this.goals.activity === 6,
    });

    alert.addInput({
      type: 'radio',
      label: '8x a day',
      value: '8',
      checked: this.goals.activity === 8,
    });

    alert.addInput({
      type: 'radio',
      label: '10x a day',
      value: '10',
      checked: this.goals.activity === 10,
    });

    alert.addInput({
      type: 'radio',
      label: '12x a day',
      value: '12',
      checked: this.goals.activity === 12,
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Save',
      handler: data => {
        this.goals.activity = data;
      }
    });
    alert.present();
  }


  showChallenge() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Start your challenge');
    alert.setSubTitle('Set your goal for the next 7 days!');
    //let steps = 12000;
    //let activity = '10 hours';

    let stepText = `<span class="highlight">${this.goals.steps} steps</span>`;
    let activityText = `<span class="highlight">${this.goals.activity}</span>`;
    alert.setMessage(`For the next 7 days you will be walking ${stepText} and have ${activityText} of active time.`);

    alert.setCssClass('alert--select-start');
    alert.addButton('Cancel');
    alert.addButton({
      text: 'Save',
      handler: data => {
        //this.testRadioOpen = false;
        //this.testRadioResult = data;
        this.data.setGoals(this.goals);
      }
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GoalsPage');
  }

}
