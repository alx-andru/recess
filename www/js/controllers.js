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

controllers.controller('ActivityController', function () {

});

controllers.controller('GoalController', function () {

});

controllers.controller('WelcomeController', function ($scope, $timeout, $ionicPopup, $ionicSlideBoxDelegate, $localStorage,
                                                      Permissions) {

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
        $ionicSlideBoxDelegate.enableSlide(isSlideEnabled);
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

controllers.controller('RecessController', function ($scope, $ionicSideMenuDelegate, $state) {
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