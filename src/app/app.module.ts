import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';

import {TabsPage} from '../pages/tabs/tabs';

import {WelcomePage} from '../pages/welcome/welcome';
import {IntroPage} from '../pages/intro/intro';
import {ChatPage} from '../pages/chat/chat';
import {ActivityPage} from '../pages/activity/activity';
import {GoalsPage} from '../pages/goals/goals';

import {GoalsInactivePage} from '../pages/goals-inactive/goals-inactive';
import {ChatInactivePage} from '../pages/chat-inactive/chat-inactive';

import {HelpPhasesPage} from '../pages/help-phases/help-phases';
import {HelpPhasesActivityPage} from '../pages/help-phases-activity/help-phases-activity';
import {HelpPhasesSocialPage} from '../pages/help-phases-social/help-phases-social';
import {HelpPhasesCompletePage} from '../pages/help-phases-complete/help-phases-complete';


import {HelpActivityPage} from '../pages/help-activity/help-activity';
import {HelpStepsPage} from '../pages/help-steps/help-steps';
import {HelpStarPage} from '../pages/help-star/help-star';
import {HelpSupportPage} from '../pages/help-support/help-support';

import {StepsTodayComponent} from '../components/steps-today/steps-today';
import {ActivityTodayComponent} from '../components/activity-today/activity-today';
import {AchievementsComponent} from '../components/achievements/achievements';

import {StepsWeekComponent} from '../components/steps-week/steps-week';
import {ActivityWeekComponent} from '../components/activity-week/activity-week';

import {ChartWeekComponent} from '../components/chart-week/chart-week';
import {UiAchievedAndGoalComponent} from '../components/ui-achieved-and-goal/ui-achieved-and-goal';
import {UiTooltipComponent} from '../components/ui-tooltip/ui-tooltip';
import {UiStarComponent} from '../components/ui-star/ui-star';

import {ClickOutside} from '../components/click-outside/click-outside';

import {AngularFireModule} from 'angularfire2';
import {AuthProvider} from '../providers/auth-provider';
import {MomentModule} from 'angular2-moment';

import {DataService} from '../providers/data.service';
import {HealthService} from '../providers/health.service';
import {EventService} from '../providers/event.service';

import {Storage} from '@ionic/storage';
import {ElasticModule} from 'angular2-elastic';

export function provideStorage() {
  return new Storage();
}

export const firebaseConfig = {
  apiKey: "AIzaSyBBb5a3AIVkM1LaVmAbJjeAal0FuGL_JZI",
  authDomain: "recess-app-011-a40ca.firebaseapp.com",
  databaseURL: "https://recess-app-011-a40ca.firebaseio.com",
  storageBucket: "recess-app-011-a40ca.appspot.com",
  messagingSenderId: "612209501790"
};


@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    WelcomePage,
    IntroPage,

    ChatPage,
    ActivityPage,
    GoalsPage,

    GoalsInactivePage,
    ChatInactivePage,

    HelpPhasesPage,
    HelpPhasesActivityPage,
    HelpPhasesSocialPage,
    HelpActivityPage,
    HelpStepsPage,
    HelpStarPage,
    HelpSupportPage,
    HelpPhasesCompletePage,

    StepsTodayComponent,
    ActivityTodayComponent,
    StepsWeekComponent,
    ActivityWeekComponent,

    AchievementsComponent,
    UiAchievedAndGoalComponent,
    UiTooltipComponent,
    UiStarComponent,

    ClickOutside,
    ChartWeekComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      scrollAssist: true,
      autoFocusAssist: true,
      mode: 'ios',
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    MomentModule,
    ElasticModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ChatPage,
    ActivityPage,
    GoalsPage,
    TabsPage,
    WelcomePage,
    IntroPage,

    GoalsInactivePage,
    ChatInactivePage,

    HelpPhasesPage,
    HelpActivityPage,
    HelpPhasesActivityPage,
    HelpPhasesSocialPage,
    HelpPhasesCompletePage,
    HelpStepsPage,
    HelpStarPage,
    HelpSupportPage,
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    {
      provide: AuthProvider,
      useClass: AuthProvider
    },
    {
      provide: DataService,
      useClass: DataService,
      multi: false,
    },
    {
      provide: HealthService,
      useClass: HealthService
    },
    {
      provide: EventService,
      useClass: EventService
    },
    {
      provide: Storage,
      useFactory: provideStorage
    }

  ]
})
export class AppModule {
}
