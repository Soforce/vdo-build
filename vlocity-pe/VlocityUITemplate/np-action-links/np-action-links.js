vlocity.cardframework.registerModule.controller('npActionlinks', ['$scope', function($scope) {
            $scope.spliceData = function(data,begin,end){
                
               return  data.slice(begin,end);
            }
      }]);