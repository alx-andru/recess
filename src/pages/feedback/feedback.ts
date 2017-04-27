import {Component} from '@angular/core';
import {AlertController} from 'ionic-angular';
import {DataService} from '../../providers/data.service';

/*
 Generated class for the Feedback page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html'
})
export class FeedbackPage {

  constructor(public data: DataService, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackPage');

  }

  consent(isConsent: boolean) {
    if (!isConsent) {
      this.showInfo();
    } else {
      this.data.setConsent();
    }
  }

  showInfo() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Feedback');
    alert.setSubTitle('Your consent is needed!');
    //let steps = 12000;
    //let activity = '10 hours';

    alert.setMessage(`Your collected information won't be used until we have your consent. If you change your mind, please come back and agree to be part of this study.`);

    alert.setCssClass('alert--select-start');
    //alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: data => {
        //this.testRadioOpen = false;
        //this.testRadioResult = data;

      }
    });
    alert.present();
  }

}
