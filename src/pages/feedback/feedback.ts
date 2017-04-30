import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {DataService} from '../../providers/data.service';


@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html'
})
export class FeedbackPage {
  agreedToShare: boolean = false;

  constructor(public data: DataService,
              public alertCtrl: AlertController,
              public navCtrl: NavController) {

    this.data.getConsent().then(consent => {
      this.agreedToShare = consent.agreedToShare;
    });
  }

  ionViewDidLoad() {

  }

  consent(isConsent: boolean) {
    if (!isConsent) {
      this.showInfo();

    } else {
      this.data.setConsent();
      this.agreedToShare = true;
      this.navCtrl.pop();

    }
  }

  showInfo() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Feedback');
    alert.setSubTitle('Your consent is needed!');
    alert.setMessage(`Your collected information won't be used until we have your consent. If you change your mind, please come back and agree to be part of this study.`);
    alert.setCssClass('alert--select-start');

    alert.addButton({
      text: 'Ok',
      handler: data => {
        // tapped ok, send back to activity
        this.navCtrl.pop();

      }
    });
    alert.present();
  }

}
