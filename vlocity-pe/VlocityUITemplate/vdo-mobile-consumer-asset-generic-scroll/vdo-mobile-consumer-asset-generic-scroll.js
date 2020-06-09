vlocity.cardframework.registerModule.controller('npTableListPlusController', ['$rootScope', '$scope', '$filter', function($rootScope, $scope, $filter) {
    
    $scope.setRowData = function(obj, index){
        $scope.row = obj;
        $scope.row.attrs = [];
        if(obj.attributeCategories &&  obj.attributeCategories.records){
            for(var i = 0; i < obj.attributeCategories.records.length; i++){
                if(obj.attributeCategories.records[i].nameResult){
                  for(var j = 0; j < obj.attributeCategories.records[i].nameResult.productAttributes.records.length; j++){
                    $scope.row.attrs.push(obj.attributeCategories.records[i].nameResult.productAttributes.records[j]);
                  }
                } else if (!obj.attributeCategories.records[i].nameResult && obj.attributeCategories.records[i].productAttributes){
                  for(var j = 0; j < obj.attributeCategories.records[i].productAttributes.records.length; j++){
                    $scope.row.attrs.push(obj.attributeCategories.records[i].productAttributes.records[j]);
                  }
                }
            }
         }
    };
    
    $scope.setAttr = function(row, index){
        $rootScope.config.attr =  Object.assign({}, row);
        row.selected = true;
        $rootScope.index = index;
        console.log('sdf'+ $rootScope.index)
    };
    
    
}]);