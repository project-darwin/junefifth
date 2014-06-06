angular.module('pricewise.controllers.user', [])
  .controller('UserController', ['$scope', '$http', '$stateParams', 'Global', function($scope, $http, $stateParams, Global){
    $scope.global = Global;
  }])