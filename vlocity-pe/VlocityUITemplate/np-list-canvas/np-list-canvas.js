vlocity.cardframework.registerModule.controller('npListScrollableCanvasCtrl', ['$scope','$rootScope','userProfileService', function($scope, $rootScope,userProfileService) {
             $scope.sessionTitle= null;
              $scope.sessionBorder = $scope.session.Border;
            //   $scope.sessionScroll = $scope.session.Scroll;
              $scope.sessionLimit = $scope.session.Limit;
              
             
            $scope.setData = function(value, title){
                //Defaulting the scroll to horizontal if no value is passed
                $scope.sessionScroll = value ||'horizontal';
                 $scope.sessionTitle = title;
            };
            
            userProfileService.userInfoPromise().then(function(){
                console.log('after user promise');
                $scope.$parent.$parent.$parent.reloadLayout2();
            });
            
    
      }]);