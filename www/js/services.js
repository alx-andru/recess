'use strict';


var services = angular.module('recess.services', []);

services.config(function () {
  // configuration
});

services.factory('Permissions', function ($q, $localStorage) {
  var permissions = $localStorage.permissions;

  var _health = function () {
    var deferred = $q.defer();
    var promise = deferred.promise;

    // is health initialized
    if (navigator.health) {

      navigator.health.isAvailable(function (success) {

        var datatypes = ['steps', 'distance', 'activity'];

        navigator.health.requestAuthorization(datatypes,
          function (authSuccess) {
            permissions.fitness = true;
            deferred.resolve(authSuccess);

          }, function (authError) {
            console.error(authError);
            permissions.fitness = false;

            deferred.reject('Health could not grant permissions.');
        });

      }, function (error) {
        console.error(error);
        deferred.reject('Health is not available.');
      });
    } else {
      deferred.reject('Health is not available.');
    }


    promise.success = function(fn) {
      promise.then(fn);
      return promise;
    };

    promise.error = function(fn) {
      promise.then(null, fn);
      return promise;
    };

    return promise;
  };

  return {
    health: _health,
  };
});