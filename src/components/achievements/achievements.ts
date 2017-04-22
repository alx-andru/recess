import { Component, Input } from '@angular/core';

/*
  Generated class for the Achievements component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'achievements',
  templateUrl: 'achievements.html'
})
export class AchievementsComponent {

  @Input() achievements:any;
  @Input() isBuddy: boolean = false;

  constructor() {
    console.log('Hello Achievements Component');

  }

}
