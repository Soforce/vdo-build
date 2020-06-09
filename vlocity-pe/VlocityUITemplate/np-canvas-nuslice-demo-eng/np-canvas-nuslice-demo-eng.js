vlocity.cardframework.registerModule.controller('npCanvasCtrl', ['$scope','$rootScope','userProfileService', function($scope, $rootScope,userProfileService) {
     $scope.sessionTitle = $scope.session.Title;
      $scope.sessionBorder = $scope.session.Border;
     // reloading the layout after getting the contextID($root.vlocity.userAccountId)
            userProfileService.userInfoPromise().then(function(){
                console.log('after user promise');
                $scope.$parent.$parent.$parent.reloadLayout2();
            });
      }]);