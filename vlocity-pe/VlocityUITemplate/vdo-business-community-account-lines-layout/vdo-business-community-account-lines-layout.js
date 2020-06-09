vlocity.cardframework.registerModule.controller('vdoBanLinesController', ['$scope', function($scope) {
        $scope.all = {'isAllSelected': false};
        $scope.showLinesActionBar = false;
        $scope.selectedItems = 0;
        $scope.$watch('$parent.records', function(records){
            var selectedItems = 0;
            angular.forEach(records, function(item){
              selectedItems += item.isSelected ? 1 : 0;
            })
            $scope.selectedItems = selectedItems;
            if($scope.selectedItems >0) {
               $scope.showLinesActionBar = true; 
            }
        }, true); 
        
        $scope.toggleAll = function() {
            var toggleStatus = !!$scope.all.isAllSelected;
            angular.forEach($scope.$parent.records, function(itm){ itm.isSelected = toggleStatus; });
           
        };
  
        $scope.optionToggled = function(){
            $scope.all.isAllSelected = $scope.$parent.records.every(function(itm){ return itm.isSelected; })
        };
}]);