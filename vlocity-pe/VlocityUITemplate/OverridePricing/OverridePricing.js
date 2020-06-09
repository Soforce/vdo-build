vlocity.cardframework.registerModule.controller('OverridePriceListEntry', ['$scope', function($scope) {
        $scope.arr = [];
        $scope.buttonClick = function(control)
        {
           console.info('check',this.bpTree); 
           console.info('control',control);   
           $scope.arr = this.bpTree.response.OverridePriceListEntry;
        };
      }]);