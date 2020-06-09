vlocity.cardframework.registerModule.controller('npCatalogController', ['$scope', function($scope) {
    
     $scope.prefixNamespace = localStorage.getItem('nsPrefixDotNotation').replace('.','__');
        
       console.log($scope.prefixNamespace);
      }]);