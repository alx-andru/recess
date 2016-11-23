'use strict';

var recess = angular.module('recess', [
  'ionic',
  'ngCordova',
  'recess.controllers',
  'recess.services', '' +
  'recess.directives',
  'chart.js',
  'angular-momentjs']
);

recess.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {


    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      //StatusBar.styleBlackTranslucent();
      StatusBar.styleDefault();
    }


  });

});

recess.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  // force tabs for android to be displayed at the bottom as well
  $ionicConfigProvider.tabs.position('bottom');

  $stateProvider
  // Welcome
    .state('welcome', {
      url: '/welcome',
      templateUrl: 'welcome.html',
      controller: 'WelcomeController',
    })

    // Activity
    .state('activity', {
      url: '/activity',
      templateUrl: 'tabs/activity.html',
      controller: 'ActivityController',
    })
    // Messenger
    .state('messenger', {
      url: '/messenger',
      templateUrl: 'tabs/messenger.html',
      controller: 'MessengerController',
    })
    // Goal
    .state('goal', {
      url: '/goal',
      templateUrl: 'tabs/goal.html',
      controller: 'GoalController',
    })
    // Demo
    .state('demo', {
      url: '/demo',
      templateUrl: 'demo.html',
      controller: 'DemoController',
    })
  ;


  $urlRouterProvider.otherwise(function ($injector) {
    console.log('See if it is a first time runner.');
    var $state = $injector.get('$state');
    var permissions = JSON.parse(window.localStorage.getItem('recess.permissions'));

    if (permissions !== undefined && permissions !== null && permissions.fitness) {
      $state.go('activity');
    } else {
      window.localStorage.setItem('recess.firstTime', true);
      var permissions = {
        notifications: false,
        fitness: false,
      };
      window.localStorage.setItem('recess.permissions', JSON.stringify(permissions));
      $state.go('welcome');
    }


  });


});
