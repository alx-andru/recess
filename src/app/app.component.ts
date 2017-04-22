import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar, Splashscreen, Keyboard} from 'ionic-native';

import {TabsPage} from '../pages/tabs/tabs';
import {AuthProvider} from '../providers/auth-provider';

import {WelcomePage} from '../pages/welcome/welcome';

import {DataService} from '../providers/data.service';


@Component({
  templateUrl: 'app.html',
  providers: []
})
export class MyApp {
  rootPage: any;


  constructor(platform: Platform, public auth: AuthProvider, data: DataService) {
    this.auth.loginOrCreateUser();


    data.getShowWelcome().then(showWelcome => {
      // read from storage wether to display welcome or not
      if (showWelcome !== false) {
        this.rootPage = WelcomePage;

      } else {
        this.rootPage = TabsPage;

      }
    });


    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      //Keyboard.disableScroll(true);
      Keyboard.disableScroll(true);


    });
  }
}
