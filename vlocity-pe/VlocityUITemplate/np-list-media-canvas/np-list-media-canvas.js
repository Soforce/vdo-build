vlocity.cardframework.registerModule.controller('npMedialistCanvasCtrl', ['$scope','$rootScope','userProfileService', function($scope, $rootScope,userProfileService) {
             $scope.sessionTitle = $scope.session.Title;
            userProfileService.userInfoPromise().then(function(){
                console.log('after user promise');
                $scope.$parent.$parent.$parent.reloadLayout2();
            });
            
    
      }]);