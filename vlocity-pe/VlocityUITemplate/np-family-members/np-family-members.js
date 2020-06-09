vlocity.cardframework.registerModule.controller('policyAssetDriverController', ['$scope', function($scope) {
    
      
        if($scope.$parent.$parent.$parent.session)
        {
        $scope.sessionData = $scope.$parent.$parent.$parent.session.DefaultIcon;
        }
        // Your code goes here
      }]);