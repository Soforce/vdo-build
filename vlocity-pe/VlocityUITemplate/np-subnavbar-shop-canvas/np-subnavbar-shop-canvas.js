vlocity.cardframework.registerModule.controller('subnavcontroller', ['$scope','$window','$rootScope', function($scope,$window, $rootScope) {
     $scope.limit = 8;
     $scope.cardLength = 0;
     $scope.CommunityHomeURL = localStorage.getItem('sfInstanceUrl');
     $scope.cardMinWidth = 110;
 
     $scope.setCardActive = function()
     {
         
         var salesforceLastPathParamId = $window.parent.location.pathname;
        var parts = salesforceLastPathParamId.split('/');
       $scope.salesforceLastPathParam = parts[parts.length - 2]
        // var salesforceLastPathParam = $window.parent.location.pathname.substr($window.parent.location.pathname.lastIndexOf('/') - 1);
     
     if($scope.salesforceLastPathParam && $scope.salesforceLastPathParam.length ===18) {
         $scope.salesforceId = $scope.salesforceLastPathParam;
         $('.overview').removeClass('tabSelected');
     }
     else{
         $('.overview').addClass('tabSelected');
        // $scope.salesforceId = 'Overview';
     }
     };
     
    
    $rootScope.$watch(function() { 
        var salesforceLastPathParamId = $window.parent.location.pathname;
        var parts = salesforceLastPathParamId.split('/');
       $scope.salesforceLastPathParam = parts[parts.length - 2]
        return $scope.salesforceLastPathParam;
    },
    function(a){  
      $scope.setCardActive();
      // show loading div, etc...
      console.log('test'+ $scope.salesforceId);
    });
    
}]);