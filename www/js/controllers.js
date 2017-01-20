'use strict';
var appVersion = '0.0.9';

var controllers = angular.module('recess.controllers', [
  'ngStorage',
]);

controllers.config(function () {
  // configuration
});

controllers.controller('DemoController', function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    window.FirebasePlugin.logEvent('page_view', {page: 'demo'});
  });

});

controllers.controller('MessengerController', function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    window.FirebasePlugin.logEvent('page_view', {page: 'messenger'});
  });

});


controllers.controller('ChatController', function ($ionicPlatform, $scope, $ionicScrollDelegate, $timeout, $moment, Storage, $location, $anchorScroll) {
  $ionicPlatform.ready(function () {
    window.FirebasePlugin.logEvent('page_view', {page: 'chat'});
  });

  $scope.hideTime = true;

  var alternate;
  var isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

  $location.hash('anchorScroll');

  $scope.sendMessage = function () {
    alternate = !alternate;

    Storage.config.conversation.last().$loaded().then(function (last) {
      var uid = last[0].uid;
      Storage.conversation.$add({
        text: $scope.data.message,
      }, uid);

      $scope.data.message = undefined;
      $ionicScrollDelegate.scrollBottom(false);
      //$anchorScroll();
    });


  };


  $scope.inputUp = function () {
    if (isIOS) $scope.data.keyboardHeight = 216;
    $timeout(function () {
      $ionicScrollDelegate.scrollBottom(true);
    }, 200);
  };

  $scope.inputDown = function () {
    if (isIOS) $scope.data.keyboardHeight = 0;
    //$ionicScrollDelegate.resize();
  };

  $scope.closeKeyboard = function () {
    // cordova.plugins.Keyboard.close();
  };


  $scope.data = {};
  $scope.user = Storage.user();
  //$scope.uid = Storage.user.$value.uid;
  var conversationUid = Storage.config.conversation.last().$loaded().then(function (last) {
    $scope.messages = Storage.conversation.all(last[0].uid);
  });

});

controllers.controller('ActivityController', function (_, Fitness, Storage, $scope, $ionicPlatform, Collector, $moment) {


  /*
   var goals = Storage.goals.last().$loaded().then(function (goal) {
   console.log('last goal: ');
   console.log(goal);

   // initialize with default value
   if (goal[0] === undefined) {
   goals = Storage.goals.all();
   goals.$add({
   steps: 10000,
   active: 255,
   });

   goals = Storage.goals.last();
   }
   });
   */

  $scope.goals = {
    steps: 10000,
    active: 0,
  };

  $scope.stepsToday = 10000;


  $scope.reached = {};
  $scope.data = {
    today: {}
  };
  $scope.activeTodayDetail = [90, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 90];
  $scope.activeToday = 0;

  $scope.stepsWeek = [18000, 400, 500, 600, 700, 800, 18000];

  $scope.days = [];

  $scope.activeWeekDetail = [0, 0, 0, 0, 0, 0, 0];
  $scope.activeWeek = 700;

  for (var i = 6; i >= 0; i--) {
    if (i == 0) {
      $scope.days.push({
        label: 'Today',
        reached: {
          steps: false,
          active: false
        }
      });
    } else {
      $scope.days.push({
        label: $moment().subtract(i, 'days').format('dd'),
        reached: {
          steps: false,
          active: false
        }
      });
    }
  }


  $ionicPlatform.ready(function () {
    window.FirebasePlugin.logEvent('page_view', {page: 'activity'});

    // save device information
    var dev = Storage.device();

    if (device !== undefined) {
      device.appVersion = appVersion;
      // store in firebase
      delete device.uuid;
      delete device.serial;
      dev.$value = device;
      dev.$save();
    }


    Storage.goals.last().$loaded().then(function (goal) {
      if (goal[0] !== undefined) {
        var id = goal[0].$id;
        $scope.goals = {
          steps: goal[0].steps,
          active: goal[0].active
        }

      }


    });

    $scope.$on("$ionicView.enter", function (event, data) {
      Storage.goals.last().$loaded().then(function (goal) {
        if (goal[0] !== undefined) {
          var id = goal[0].$id;
          $scope.goals = {
            steps: goal[0].steps,
            active: goal[0].active
          }

        }


      });
    });


    Fitness.getTotalStepsToday(function (steps) {
      $scope.stepsToday = steps;
      console.log('Steps: ' + steps);
    });


    Fitness.getActivityToday(function (active) {
      console.log('Activity data returned:');
      console.log(active);

      /*
       var activeData = active.active[Object.keys(active.active)[0]];
       var activeSeries = [];
       var totalSteps = 0;
       _.each(activeData, function (data) {
       activeSeries.push([$moment(data.startDate).valueOf(), data.stepsTotal]);
       activeSeries.push([$moment(data.endDate).valueOf(), data.stepsTotal]);
       activeSeries.push([$moment(data.endDate).add(1, 'seconds').valueOf(), null]);
       totalSteps = data.stepsTotal;
       });
       $scope.activeSeries = activeSeries;

       var sedentaryData = active.sedentary[Object.keys(active.sedentary)[0]];
       var sedentarySeries = [];
       _.each(sedentaryData, function (data) {
       sedentarySeries.push([$moment(data.startDate).valueOf(), totalSteps]);
       sedentarySeries.push([$moment(data.endDate).valueOf(), totalSteps]);
       sedentarySeries.push([$moment(data.endDate).add(1, 'seconds').valueOf(), null]);
       });
       $scope.sedentarySeries = sedentarySeries;

       console.log($scope.activeSeries);
       console.log($scope.sedentarySeries);
       */

      $scope.activeToday = 100;
      console.log(active);
      if (active !== undefined) {
        $scope.activeTodayDetail = active.activity.min;
        $scope.activeToday = active.total.min;
      }

      $scope.reached.active = ($scope.activeToday >= $scope.goals.active && $scope.activeToday > 0);
      $scope.reached.steps = ($scope.stepsToday >= $scope.goals.steps && $scope.stepsToday > 0);


    });

    //================================================

    Fitness.getTotalStepsThisWeek(function (steps) {
      console.log('Steps this week:');
      console.log(steps);

      _.each(steps, function (step, i) {
        // assuming correct order and correct days returned
        $scope.stepsWeek[i] = step.value;
      });
    });

    $scope.data = {
      week: {
        days: []
      }
    };

    Fitness.getActiveWeek(function (active) {
      console.log('Active data of week returned:');
      console.log(active);
      if (active !== undefined) {


        active.days = _.sortKeysBy(active.days);
        var days = [];
        var total = 0;
        var idx = 0;
        _.each(active.days, function (day, i) {
          days.push(day.total.min);
          if (day.total.activeTime >= $scope.goals.active && $scope.goals.active > 0) {
            $scope.days[idx].reached.active = true;
          } else {
            $scope.days[idx].reached.active = false;
          }

          total += day.total.activeTime;
          idx += 1;
          $scope.activeWeekDetail[6 - Object.keys(active.days).length + idx] = day.total.min;
        });

        //$scope.activeWeekDetail = days;
        $scope.activeWeek = total;
      } else {
        $scope.activeWeekDetail = 0;
        $scope.activeWeek = 0;
      }

    });

  });
});

controllers.controller('GoalController', function ($ionicPlatform, $scope, $ionicPopup, Storage, $moment) {

  $ionicPlatform.ready(function () {
    window.FirebasePlugin.logEvent('page_view', {page: 'goal'});
  });

  $scope.goals = {
    steps: 0,
    active: 0,
  };

  Storage.goals.last().$loaded().then(function (goal) {
    if (goal[0] !== undefined) {

      var expiresAt = $moment(goal[0].expiresAt);
      var expiresInSeconds = 0;

      $scope.isChallengeLocked = $moment().isSameOrBefore(expiresAt, 'day');
      if ($scope.isChallengeLocked) {
        expiresInSeconds = expiresAt.diff($moment(), 'seconds');
      }
      $scope.goals = {
        steps: goal[0].steps,
        active: goal[0].active,
        expiresIn: $moment.duration(expiresInSeconds, 'seconds').humanize(),
      }

    }
  });

  $scope.setGoalSteps = function () {

    var popup = $ionicPopup.show({
      templateUrl: 'templates/ui-popup-goal-steps.html',
      title: 'Set your goal',
      subTitle: 'How many steps a day can you walk?',
      scope: $scope,
      cssClass: 'popup-goal-steps',
      buttons: [
        {
          text: 'Cancel',
          type: 'button-recess-cancel',

        },
        {
          text: '<b>Save</b>',
          type: 'button-recesss-steps',
          onTap: function (e) {
            return $scope.goals.steps;
          }
        }
      ]
    });

    popup.then(function (res) {
      console.log('Tapped!', res);
      if (res !== undefined) {
        $scope.goals.steps = res;
      }

    });

  };

  $scope.setGoalActive = function () {

    var popup = $ionicPopup.show({
      templateUrl: 'templates/ui-popup-goal-active.html',
      title: 'Set your goal',
      subTitle: 'How many minutes can you be active a day?',
      scope: $scope,
      cssClass: 'popup-goal-active',
      buttons: [
        {
          text: 'Cancel',
          type: 'button-recess-cancel',

        },
        {
          text: '<b>Save</b>',
          type: 'button-recesss-active',
          onTap: function (e) {
            return $scope.goals.active;
          }
        }
      ]
    });

    popup.then(function (res) {
      console.log('Tapped!', res);
      if (res !== undefined) {
        $scope.goals.active = res;
      }

    });

  };

  $scope.setReadyGo = function () {

    var popup = $ionicPopup.show({
      templateUrl: 'templates/ui-popup-goal-ready.html',
      title: 'Time to commit',
      subTitle: 'Your goals will be set and you will not be able to change them for 7 days.',
      cssClass: 'popup-ready',
      scope: $scope,
      buttons: [{
        text: 'Cancel',
        type: 'button-recesss-ready-cancel'
      }, {
        text: '<b>Save</b>',
        type: 'button-recesss-ready',
        onTap: function (e) {
          return true;
        }
      }]
    });

    popup.then(function (res) {
      console.log('Tapped!', res);
      if (res) {
        console.log('time to set the goals for good: ' + $scope.goals.steps);

        Storage.config.goals().$loaded().then(function (cfgGoal) {
          console.log('expires in seconds: ' + cfgGoal.default.expiresInSeconds);
          Storage.goals.$add({
            steps: $scope.goals.steps,
            active: $scope.goals.active,
            expiresAt: $moment().add(cfgGoal.default.expiresInSeconds, 'seconds').toJSON(),
          });

          // update goals for UI right away, reload will take it from FB
          $scope.isChallengeLocked = true;
          var expiresInSeconds = $moment().add(cfgGoal.default.expiresInSeconds, 'seconds').diff($moment(), 'seconds');
          $scope.goals = {
            steps: $scope.goals.steps,
            active: $scope.goals.active,
            expiresIn: $moment.duration(expiresInSeconds, 'seconds').humanize(),
          }
        });

      }
    });
  }

});

controllers.controller('WelcomeController', function ($ionicPlatform, Authentication, $scope, $timeout, $ionicPopup, $ionicSlideBoxDelegate, $localStorage,
                                                      Permissions) {


  $ionicPlatform.ready(function () {
    console.log('Welcome Controller');
    window.FirebasePlugin.logEvent('page_view', {page: 'welcome'});
  });

  $scope.permissions = $localStorage.permissions;

  $scope.slideChanged = function (idx) {
    var isSlideEnabled = true;
    if (idx == 1) {
      isSlideEnabled = false;
    }
    $timeout(function () {
      $ionicSlideBoxDelegate.enableSlide(isSlideEnabled);
    }, 0);
  };

  $scope.askHealthPermission = function () {

    Permissions.health().success(function (success) {
      console.log('Successfull health authentication');
      console.log(success);
      // enable sliding again
      $timeout(function () {
        $ionicSlideBoxDelegate.enableSlide(true);
      }, 0);
    }).error(function (error) {
      console.error(error);
    });
  };

  $scope.askPushNotificationPermission = function () {
    window.FirebasePlugin.grantPermission();

  };

  $scope.next = function (idx) {
    if (idx == 1 && !$scope.permissions.fitness) {
      popupRequirementNotification();
    } else {
      $ionicSlideBoxDelegate.next();
    }

  };

  $scope.prev = function (idx) {
    $ionicSlideBoxDelegate.previous();
  };

  function popupRequirementNotification() {
    var popup = $ionicPopup.show({
      templateUrl: 'templates/ui-popup-info-permissions.html',
      title: 'Ooooppps...',
      subTitle: 'As a minimum we require access to your <span>fitness</span> data',
      scope: $scope,
      cssClass: 'popup-goal-steps',
      buttons: [
        {
          text: '<b>Ok</b>',
          type: 'button-recesss-steps',
          onTap: function (e) {
            return '';
          }
        }
      ]
    });

    popup.then(function (res) {
      console.log('Ok!', res);
    });
  }

});

controllers.controller('RecessController', function (Authentication, $scope, $ionicSideMenuDelegate, $state, Storage, $localStorage) {

  $scope.toggleMenu = function () {
    $ionicSideMenuDelegate.toggleRight();
  };

  $scope.accessDataCollection = function () {
    $scope.toggleMenu();
    $state.go('demo');
  };

  $scope.accessIntro = function () {
    $scope.toggleMenu();
    $state.go('welcome');
  };

  // if user doesn't exist yet, don't load it.
  if ($localStorage.user !== undefined) {
    Storage.user().$loaded().then(function (user) {
      window.FirebasePlugin.onTokenRefresh(function (token) {
        // save this server-side and use it to push notifications to this device
        console.log('Push Token refresh: ' + token);
        user.pushToken = token;
        // store in firebase
        user.$save();

        $scope.user = user;
      }, function (error) {
        console.error(error);
      });
    });

    $scope.chat = Storage.config.chat();


  }


});