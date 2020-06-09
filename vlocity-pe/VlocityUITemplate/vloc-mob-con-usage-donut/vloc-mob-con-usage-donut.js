vlocity.cardframework.registerModule.controller('usageDonutController',
                ['$scope',
                function($scope) {
        
        var totalUsage = 0;
        //$scope.offset = 500;

        this.init = function(payload){
            for(var i = 0; i < payload.length; i++){
                totalUsage += payload[i].expr0;
            }
            
            $scope.totalUsage = totalUsage;
            var circtotal = 500 - (payload.length*10);

            for(var j = 0; j < payload.length; j++){
                payload[j].circleamount = (((payload[j].expr0 / totalUsage) * circtotal)+10).toFixed(0);
                console.log('amount: ', payload[j].expr0);
                console.log('tote: ', totalUsage);
                console.log('circ: ', payload[j].circleamount);
                if(j === 0)
                    payload[j].offset = 0;
                else if(j == 1)
                    payload[j].offset = 500 - payload[j-1].circleamount;
                else
                    payload[j].offset = payload[j-1].offset - payload[j-1].circleamount;
                    
                console.log('offset: ', payload[j].offset);
            }
        }

}]);