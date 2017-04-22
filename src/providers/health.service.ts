import {Injectable} from '@angular/core';

import {DataService} from './data.service';
import 'rxjs/add/operator/map';

import {Health} from 'ionic-native';
import {Platform} from 'ionic-angular';
import * as moment from 'moment';
import * as _ from 'underscore';

@Injectable()
export class HealthService {

  data: any;
  maxRetries: number;

  constructor(private dataService: DataService, private platform: Platform) {
    this.data = dataService;
    console.log('Hello Health Provider');
    this.maxRetries = 3;
  }

  getStepsToday() {
    return this.getStepsDay(moment());
  }

  getStepsDay(day: moment.Moment) {

    return new Promise<number>((resolve, reject) => {

      //console.log(`Steps day ${day.format('DD.MM.YYYY')}`);

      Health.queryAggregated({
        startDate: day.startOf('day').toDate(),
        endDate: day.endOf('day').toDate(),
        dataType: 'steps',
        bucket: 'day'
      }).then((data) => {

        //console.log(`Health is available ${data}`);
        let steps = Math.round(data[0].value);
        resolve(steps);

      }).catch((error) => {
        console.log('Error getting location', error);

        // send mock data to ionic serve
        if (error === 'cordova_not_available') {
          resolve(10000);
        } else {
          reject(error);
        }
      });


    });

  }

  getStepsDayRaw(day: moment.Moment) {

    return new Promise<any>((resolve, reject) => {

      //console.log(`Steps day raw ${day.format('DD.MM.YYYY')}`);
      try {

        Health.query({
          startDate: day.startOf('day').toDate(),
          endDate: day.endOf('day').toDate(),
          dataType: 'steps',
          limit: 9999999,
        }).then((data) => {

          //console.log(`Health is available ${data}`);
          resolve(data);
          this.data.log(data, 100);

        }).catch((error) => {
          console.log('Error getting location', error);
          this.data.log(error, 101);
          // send mock data to ionic serve
          reject(error);
        });

      } catch (error) {
        this.data.log(error, 102);
      }

    });

  }

  getStepsWeek() {
    return new Promise<any>((resolve, reject) => {
      Health.queryAggregated({
        startDate: moment().startOf('day').subtract(6, 'days').toDate(),
        endDate: moment().endOf('day').subtract(1, 'hours').toDate(),
        dataType: 'steps',
        bucket: 'day',

      }).then((stepsThisWeek) => {

        let weekSteps = [];

        for (let step in stepsThisWeek) {
          var steps = {
            day: moment(stepsThisWeek[step].startDate),
            value: Math.round(stepsThisWeek[step].value),
          };
          weekSteps.push(steps);
          this.data.setUserStepsDay(steps.value, steps.day);
          // console.log(steps.day.format('DD.MM.YYYY'));
          // console.log(steps.value);
          // console.log('===');
        }

        resolve(weekSteps);

      }).catch((error) => {
        console.log('Error getting location', error);

        // send mock data to ionic serve
        if (error === 'cordova_not_available') {
          let stepsThisWeek = [
            {
              'startDate': '2017-02-17T05:00:00.000Z',
              'endDate': '2017-02-18T05:00:00.000Z',
              'value': 10680,
              'unit': 'count'
            }, {
              'startDate': '2017-02-18T05:00:00.000Z',
              'endDate': '2017-02-19T05:00:00.000Z',
              'value': 1718,
              'unit': 'count'
            }, {
              'startDate': '2017-02-19T05:00:00.000Z',
              'endDate': '2017-02-20T05:00:00.000Z',
              'value': 6395,
              'unit': 'count'
            }, {
              'startDate': '2017-02-20T05:00:00.000Z',
              'endDate': '2017-02-21T05:00:00.000Z',
              'value': 11681,
              'unit': 'count'
            }, {
              'startDate': '2017-02-21T05:00:00.000Z',
              'endDate': '2017-02-22T05:00:00.000Z',
              'value': 4568,
              'unit': 'count'
            }, {
              'startDate': '2017-02-22T05:00:00.000Z',
              'endDate': '2017-02-23T05:00:00.000Z',
              'value': 7411.999999999999,
              'unit': 'count'
            }, {
              'startDate': '2017-02-23T05:00:00.000Z',
              'endDate': '2017-02-24T05:00:00.000Z',
              'value': 5711,
              'unit': 'count'
            }];

          let weekSteps = [];

          for (let step of stepsThisWeek) {
            weekSteps.push({
              day: moment(step.startDate),
              value: step.value,
            })
          }

          resolve(weekSteps);

        } else {
          reject(error);
        }
      });
    });
  }

  getDistanceDayRaw(day: moment.Moment) {

    return new Promise<any>((resolve, reject) => {

      //console.log(`Distance day raw ${day.format('DD.MM.YYYY')}`);

      Health.query({
        startDate: day.startOf('day').toDate(),
        endDate: day.endOf('day').toDate(),
        dataType: 'distance',
        limit: 9999999,
      }).then((data) => {

        //console.log(`Health is available ${data}`);
        resolve(data);

      }).catch((error) => {
        console.log('Error getting location', error);

        // send mock data to ionic serve
        reject(error);
      });
    });

  }

  getActivityToday() {

    return this.getActivityDay(moment());
  }

  getActivityDay(day: moment.Moment) {
    return new Promise<any>((resolve, reject) => {

      Health.query({
        startDate: day.startOf('day').toDate(),
        endDate: day.endOf('day').subtract(1, 'hours').toDate(),
        dataType: 'steps',

      }).then((stepsToday) => {
        //console.log(`activity today:`, stepsToday);
        //console.log(`Health is available ${data}`);
        //console.log(data);
        //console.log('calculate activity from ');
        //console.log(JSON.stringify(stepsToday));
        //console.log('day value: ' + stepsToday[0].value);
        //console.log(JSON.stringify(stepsToday[0].value));


        this.calculateDayActivity(stepsToday, day).then(dayActivity => {
          //console.log(`DayActivity: ${dayActivity}`);
          //console.log(JSON.stringify(dayActivity));
          this.data.setUserActivityDayDetails(dayActivity, day);

          resolve(dayActivity);
        }).catch(error => {
          console.log('activity error');
          console.error(error);
          reject();
        });

      }).catch((error) => {
        console.log('Error getting location', error);

        // send mock data to ionic serve
        if (error === 'cordova_not_available') {
          let stepsToday = [{
            'startDate': '2017-02-23T18:28:03.000Z',
            'endDate': '2017-02-23T18:33:00.000Z',
            'value': 71,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T18:18:35.000Z',
            'endDate': '2017-02-23T18:28:03.000Z',
            'value': 46,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T18:12:13.000Z',
            'endDate': '2017-02-23T18:18:35.000Z',
            'value': 24,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T17:57:20.000Z',
            'endDate': '2017-02-23T17:57:49.000Z',
            'value': 31,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T17:47:20.000Z',
            'endDate': '2017-02-23T17:57:20.000Z',
            'value': 183,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T17:39:45.000Z',
            'endDate': '2017-02-23T17:40:25.000Z',
            'value': 54,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T17:36:36.000Z',
            'endDate': '2017-02-23T17:39:45.000Z',
            'value': 58,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T17:35:31.000Z',
            'endDate': '2017-02-23T17:36:36.000Z',
            'value': 85,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T17:30:01.000Z',
            'endDate': '2017-02-23T17:30:21.000Z',
            'value': 22,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T17:27:29.000Z',
            'endDate': '2017-02-23T17:30:01.000Z',
            'value': 56,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T17:17:53.000Z',
            'endDate': '2017-02-23T17:18:10.000Z',
            'value': 8,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T17:16:50.000Z',
            'endDate': '2017-02-23T17:17:53.000Z',
            'value': 94,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T15:51:24.000Z',
            'endDate': '2017-02-23T15:58:10.000Z',
            'value': 71,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T15:41:54.000Z',
            'endDate': '2017-02-23T15:51:24.000Z',
            'value': 172,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T14:18:37.000Z',
            'endDate': '2017-02-23T14:19:47.000Z',
            'value': 80,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T14:13:30.000Z',
            'endDate': '2017-02-23T14:14:33.000Z',
            'value': 78,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T14:12:28.000Z',
            'endDate': '2017-02-23T14:13:30.000Z',
            'value': 73,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T14:10:06.000Z',
            'endDate': '2017-02-23T14:12:28.000Z',
            'value': 20,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T14:09:03.000Z',
            'endDate': '2017-02-23T14:10:06.000Z',
            'value': 56,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T14:08:01.000Z',
            'endDate': '2017-02-23T14:09:03.000Z',
            'value': 60,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T14:07:01.000Z',
            'endDate': '2017-02-23T14:08:01.000Z',
            'value': 111,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T13:51:48.000Z',
            'endDate': '2017-02-23T13:52:16.000Z',
            'value': 23,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T13:50:46.000Z',
            'endDate': '2017-02-23T13:51:48.000Z',
            'value': 116,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T13:49:43.000Z',
            'endDate': '2017-02-23T13:50:46.000Z',
            'value': 78,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T13:48:41.000Z',
            'endDate': '2017-02-23T13:49:43.000Z',
            'value': 124,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T13:47:39.000Z',
            'endDate': '2017-02-23T13:48:41.000Z',
            'value': 124,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T13:46:36.000Z',
            'endDate': '2017-02-23T13:47:39.000Z',
            'value': 124,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T13:45:34.000Z',
            'endDate': '2017-02-23T13:46:36.000Z',
            'value': 124,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T13:44:31.000Z',
            'endDate': '2017-02-23T13:45:34.000Z',
            'value': 123,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T13:43:29.000Z',
            'endDate': '2017-02-23T13:44:31.000Z',
            'value': 122,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T13:42:27.000Z',
            'endDate': '2017-02-23T13:43:29.000Z',
            'value': 123,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T13:41:29.000Z',
            'endDate': '2017-02-23T13:42:27.000Z',
            'value': 100,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T13:39:59.000Z',
            'endDate': '2017-02-23T13:41:29.000Z',
            'value': 18,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T13:37:39.000Z',
            'endDate': '2017-02-23T13:39:59.000Z',
            'value': 11,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T12:49:34.000Z',
            'endDate': '2017-02-23T12:58:45.000Z',
            'value': 103,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }, {
            'startDate': '2017-02-23T12:40:12.000Z',
            'endDate': '2017-02-23T12:49:34.000Z',
            'value': 103,
            'unit': 'count',
            'sourceName': 'g0g',
            'sourceBundleId': 'com.apple.health.57E738B9-3821-4C4D-AE7B-EF5C348DD485'
          }];


          this.calculateDayActivity(stepsToday, day).then(dayActivity => {
            resolve(dayActivity);
          });

        } else {
          reject(error);
        }
      });

    });
  }

  getActivityWeek() {

    return new Promise<any>((resolve, reject) => {

      let dayPromises = [];
      for (let i = 6; i >= 0; i--) {
        dayPromises.push(this.getActivityDay(moment().subtract(i, 'days')));
      }

      Promise.all(dayPromises).then(dayActivities => {
        //console.log('This is the week');
        //console.log(dayActivities);
        let activityThisWeek = [];

        for (let dayActivity of dayActivities) {
          var activity = {
            day: moment(dayActivity.date),
            value: dayActivity.totalHours,
          };
          activityThisWeek.push(activity);
          this.data.setUserActivityDayTotal(activity.value, activity.day);

        }

        resolve(dayActivities);

      }).catch(reason => {
        console.error(`Activity week promises failed`, reason);
        reject(reason);
      });

    });

  }

  private calculateDayActivity(steps, day) {

    let sourceBundles = _.groupBy(steps, 'sourceBundleId');
    let max = 0;
    let maxBundle = '';
    Object.keys(sourceBundles).forEach((key, idx) => {
        if (sourceBundles[key].length > max) {
          max = sourceBundles[key].length;
          maxBundle = key;
        }
      }
    );

    // choosen source
    let stepsToCalculateActivity = sourceBundles[maxBundle];


    //console.log(JSON.stringify(stepsToCalculateActivity));

    const minimumStepsPerMinute = 10;
    const minimumDurationInMs = moment.duration(10, 'minutes').asMilliseconds();

    return new Promise<any>((resolve, reject) => {

      // provide a return template, mostly because of the label
      let hours = [
        {value: 0, label: '0-1am', active: false, selected: false},
        {value: 0, label: '1-2am', active: false, selected: false},
        {value: 0, label: '2-3am', active: false, selected: false},
        {value: 0, label: '3-4am', active: false, selected: false},
        {value: 0, label: '4-5am', active: false, selected: false},
        {value: 0, label: '5-6am', active: false, selected: false},
        {value: 0, label: '7-8am', active: false, selected: false},
        {value: 0, label: '8-9am', active: false, selected: false},
        {value: 0, label: '9-10am', active: false, selected: false},
        {value: 0, label: '10-11am', active: false, selected: false},
        {value: 0, label: '11-12pm', active: false, selected: false},

        {value: 0, label: '12-1pm', active: false, selected: false},
        {value: 0, label: '1-2pm', active: false, selected: false},
        {value: 0, label: '2-3pm', active: false, selected: false},
        {value: 0, label: '3-4pm', active: false, selected: false},
        {value: 0, label: '4-5pm', active: false, selected: false},
        {value: 0, label: '5-6pm', active: false, selected: false},
        {value: 0, label: '6-7pm', active: false, selected: false},
        {value: 0, label: '7-8pm', active: false, selected: false},
        {value: 0, label: '8-9pm', active: false, selected: false},
        {value: 0, label: '10-11pm', active: false, selected: false},
        {value: 0, label: '11-12am', active: false, selected: false}
      ];

      // determine activity per hour
      let goalCount = 0;

      if (stepsToCalculateActivity && stepsToCalculateActivity.length > 0) {
        // iterate through steps to calculate activity
        var activities = {};
        let previousEnd = null;

        // TODO: not quite sure why I need to sort, but let's be on the safe side
        stepsToCalculateActivity = _.sortBy(stepsToCalculateActivity, function (activity) {
          return moment(activity.startDate).valueOf();
        });

        for (let step of stepsToCalculateActivity) {
          try {
            const start = moment(step.startDate);
            const end = moment(step.endDate);
            let difference = end.diff(start);
            if (difference === 0 && previousEnd !== null) {
              difference = end.diff(previousEnd);
            }

            const stepcount = step.value;
            previousEnd = end;

            // add up activity plus steps per hour
            activities[start.format('H')] = activities[start.format('H')] === undefined ? {
              duration: difference,
              steps: step.value
            } : {
              duration: activities[start.format('H')].duration + difference,
              steps: activities[start.format('H')].steps + stepcount,
            };

            //console.log(JSON.stringify(activities[start.format('H')]));

          } catch (err) {
            //console.log(`first error`, err);
            reject('first loop error');
          }


        }

        for (let activity of Object.keys(activities)) {
          try {
            let stepsPerMinute = activities[activity].steps / moment.duration(activities[activity].duration).asMinutes();

            // hour 7 !== index 7
            let prevIdx = (parseInt(activity) - 1) > -1 ? (parseInt(activity) - 1) : 0;
            hours[prevIdx].value = activities[activity].duration;
            if (activities[activity].duration >= minimumDurationInMs && stepsPerMinute >= minimumStepsPerMinute) {
              // hour 7 !== index 7
              hours[parseInt(activity) - 1].active = true;

              goalCount += 1;
            }
          } catch (err) {
            console.log(`second error`, err);
            reject('second loop error');
          }
        }
      }
      resolve({
        date: day, // grab date from first entry
        totalHours: goalCount,
        day: hours
      });

    });

  }


  syncData() {

    let self = this;
    this.data.log(`Sync Data with maxtRetries ${this.maxRetries}`, 500);

    setTimeout(function () {
      self.data.getLastSync().then(sync => {
        //console.log('sync received', sync);
        if (sync !== null) {
          let startSyncFrom = moment(sync);
          //console.log(`Last Sync ${startSyncFrom.format('DD.MM.YYYY')}`);
          let daysToSync = moment.duration(moment().startOf('day').diff(startSyncFrom.startOf('day')));

          for (let i = daysToSync.asDays(); i > 0; i--) {
            let collectDay = moment().subtract(i, 'days').startOf('day');
            //console.log(`collect for day ${collectDay.format('DD.MM.YYYY')}`);

            self.getStepsDayRaw(collectDay).then(day => {

              //console.log(`found raw steps from day`);

              self.data.setStepsForDay(day, collectDay);

            }).catch(error => {
              //console.error(error);
              self.data.log(error, 103);
            });

            self.getDistanceDayRaw(collectDay).then(day => {

              //console.log(`found raw distance from day`);

              self.data.setDistanceForDay(day, collectDay);

            }).catch(error => {
              //console.error(error);
              self.data.log(error, 104);
            });

            // TODO: Hope is strong in this one...
            self.data.setLastSync(collectDay);


          }

        }

      }).catch(error => {
        //console.error(error);
      });
      this.maxRetries -= 1;
      // call self again -1 retry
      if (this.maxRetries >= 0) {
        self.syncData();
      }

    }, 2000);


  }
}
