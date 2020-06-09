vlocity.cardframework.registerModule.controller('statementMediaController', ['$scope', function($scope) {
    
        $scope.prefixNamespace = localStorage.getItem('nsPrefixDotNotation').replace('_','-');
        
        $scope.sessionData = $scope.$parent.$parent.$parent.session.docIcon;
        // Your code goes here
      }]);