'use strict';


var controllers = angular.module('recess.controllers', [
  'ngStorage',
]);

controllers.config(function () {
  // configuration
});

controllers.controller('DemoController', function () {

});

controllers.controller('MessengerController', function () {

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

  $scope.activeWeekDetail = [100, 100, 100, 100, 100, 100, 200];
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
        label: $moment.utc().subtract(i, 'days').format('dd'),
        reached: {
          steps: false,
          active: false
        }
      });
    }
  }


  $ionicPlatform.ready(function () {
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
        _.each(active.days, function (day) {
          days.push(day.total.min);
          if (day.total.min >= $scope.goals.active && $scope.goals.active > 0) {
            $scope.days[idx].reached.active = true;
          } else {
            $scope.days[idx].reached.active = false;
          }
          total += day.total.min;
          idx += 1;
        });

        $scope.activeWeekDetail = days;
        $scope.activeWeek = total;
      } else {
        $scope.activeWeekDetail = 0;
        $scope.activeWeek = 0;
      }

    });

  });
});

controllers.controller('GoalController', function ($scope, $ionicPopup, Storage) {
  $scope.goals = {
    steps: 0,
    active: 0,
  };

  Storage.goals.last().$loaded().then(function (goal) {
    if (goal[0] !== undefined) {
      var id = goal[0].$id;
      $scope.goals = {
        steps: goal[0].steps,
        active: goal[0].active
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
      buttons: [
        {
          text: 'Cancel',
          type: 'button-recesss-ready-cancel'
        },
        {
          text: '<b>Save</b>',
          type: 'button-recesss-ready',
          onTap: function (e) {
            return true;
          }
        }
      ]
    });

    popup.then(function (res) {
      console.log('Tapped!', res);
      if (res) {
        console.log('time to set the goals for good: ' + $scope.goals.steps);

        Storage.goals.all().$add({
          steps: $scope.goals.steps,
          active: $scope.goals.active,
        });
        //Goal.setGoal('steps', $scope.goals.steps);
        //Goal.setGoal('active', $scope.goals.active);

        //var ref = firebase.database().ref().child('users/' + $rootScope.user.uid + '/goals');
        //$scope.firegoals = $firebaseArray(ref);

        //$scope.firegoals.$add({
        //  timestamp: $moment().toJSON(),
        //  goals: $scope.goals
        //});
      }

    });

  }

});

controllers.controller('WelcomeController', function (Authentication, $scope, $timeout, $ionicPopup, $ionicSlideBoxDelegate, $localStorage,
                                                      Permissions) {
  console.log('Welcome Controller');

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

  $scope.next = function (idx) {
    if (idx == 1 && !$scope.permissions.fitness) {
      popupRequirementNotification();
    } else {
      $ionicSlideBoxDelegate.next();
    }

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

controllers.controller('RecessController', function (Authentication, $scope, $ionicSideMenuDelegate, $state) {

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
  }

});