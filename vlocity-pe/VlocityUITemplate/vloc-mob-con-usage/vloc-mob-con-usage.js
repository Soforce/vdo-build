vlocity.cardframework.registerModule.controller('usageController',
                ['$scope',
                function($scope) {
        
        var topData = 1;
        var topTalk = 1;
        var topText = 1;
        var thresholdData = 0;
        var thresholdTalk = 0;
        var thresholdText = 0;
        
        //Draw Graph
        $scope.drawGraph = function(data) {
            if(data.obj.expr1 !== null){
                var fillPercentage = Math.round((data.obj.expr0 / data.obj.expr1)*100);
                if(fillPercentage > 100){
                    fillPercentage = 100;
                }
                $('.con-bar-chart-' + data.cardIndex + ' .con-device-details-bar-graph-chart-fill').css('width',fillPercentage + '%');
            }
        };
        
        this.init = function(payload){
            for(var i = 0; i < payload.length; i++){

                //Find highest usage or theshold
                if(payload[i].expr0 > topData && payload[i].%vlocity_namespace%__Type__c == 'Data'){
                    topData = payload[i].expr0;
                }
                if(payload[i].expr1 > topData && payload[i].%vlocity_namespace%__Type__c == 'Data'){
                    topData = payload[i].expr1;
                }
                if(payload[i].expr0 > topTalk && payload[i].%vlocity_namespace%__Type__c == 'Talk'){
                    topTalk = payload[i].expr0;
                }
                if(payload[i].expr1 > topTalk && payload[i].%vlocity_namespace%__Type__c == 'Talk'){
                    topTalk = payload[i].expr1;
                }
                if(payload[i].expr0 > topText && payload[i].%vlocity_namespace%__Type__c == 'Text'){
                    topText = payload[i].expr0;
                }
                if(payload[i].expr1 > topText && payload[i].%vlocity_namespace%__Type__c == 'Text'){
                    topText = payload[i].expr1;
                }
                
                //Find threshold
                if(payload[i].expr1 > thresholdData && payload[i].%vlocity_namespace%__Type__c == 'Data'){
                    thresholdData = payload[i].expr1;
                }
                if(payload[i].expr1 > thresholdTalk && payload[i].%vlocity_namespace%__Type__c == 'Talk'){
                    thresholdTalk = payload[i].expr1;
                }
                if(payload[i].expr1 > thresholdText && payload[i].%vlocity_namespace%__Type__c == 'Text'){
                    thresholdText = payload[i].expr1;
                }
            }
            
            $scope.topData = topData;
            $scope.topTalk = topTalk;
            $scope.topText = topText;
            $scope.thresholdData = thresholdData;
            $scope.thresholdTalk = thresholdTalk;
            $scope.thresholdText = thresholdText;
        }

}]);