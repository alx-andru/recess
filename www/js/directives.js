'use strict';


var directives = angular.module('recess.directives', []);

directives.config(function() {
  // configuration
});

directives.directive('footer', function() {
  return {
    scope: {
      isMessengerActive: '=messengerActive',
      isActivityActive: '=activityActive',
      isGoalActive: '=goalActive',

    },
    templateUrl: 'templates/footer.html',
    link: function(scope, element){
      scope.isAndroid = ionic.Platform.isAndroid();

    }
  }
});