'use strict';


var recess = angular.module('recess', [
  'ionic',
  'ngCordova',
  'recess.controllers',
  'recess.services', '' +
  'recess.directives',
  'chart.js',
  'angular-momentjs',
  'highcharts-ng']
);

recess.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    //window.device = {platform: 'desktop'};



    window.FirebasePlugin.onNotificationOpen(function(notification) {
      console.error(notification);
    }, function(error) {
      console.error(error);
    });


  });

});

recess.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $localStorageProvider) {
  $localStorageProvider.setKeyPrefix('recess-');

  // force tabs for android to be displayed at the bottom as well
  $ionicConfigProvider.tabs.position('bottom');

  // disable all transistions for performance reasons
  $ionicConfigProvider.views.transition('none');

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
    // Messenger
    .state('chat', {
      url: '/chat',
      templateUrl: 'tabs/chat.html',
      controller: 'ChatController',
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

    console.log('UrlRouterProvider');

    var $state = $injector.get('$state');
    var permissions = $localStorageProvider.get('permissions');

    // Permission for Health has to be given, if not, prompt user to welcome screen
    if (permissions !== undefined && permissions !== null && permissions.fitness) {
      $state.go('activity');
    } else {
      // default permissions
      var permissions = {
        notifications: false,
        fitness: false,
      };
      $localStorageProvider.set('permissions', permissions);
      $state.go('welcome');
    }

  });

});

