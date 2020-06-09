vlocity.cardframework.registerModule.controller('canvasController', ['$scope', function($scope) {
        $scope.convertString = function(string) {
            return JSON.parse(string);
        }
      }]);