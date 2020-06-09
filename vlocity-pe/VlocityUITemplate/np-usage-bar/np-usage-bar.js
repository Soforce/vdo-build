vlocity.cardframework.registerModule.controller('usageProgressController', ['$scope','$filter','$window', function($scope,$filter,$window) {
      $scope.cirPercent = 0;
        // Your code goes here
            $scope.calculatePercent = function(obj, data)
            {
                $scope.cirPercent = 100 - parseInt(($filter('getter')(obj, data.fields[0])/$filter('getter')(obj, data.fields[1])) * 100);
            }
        
        
       
    }]);