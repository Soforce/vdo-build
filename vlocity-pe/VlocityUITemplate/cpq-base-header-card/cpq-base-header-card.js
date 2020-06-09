vlocity.cardframework.registerModule.controller('contractController', ['$rootScope','$scope', '$timeout', function($rootScope,$scope, $timeout) {

    $scope.createContract = function(obj) {

        var orderId = obj.Id;
        sforce.connection.sessionId = window.sessionId;
        var result = sforce.apex.execute("%vlocity_namespace%.ContractServiceResource","createContractWithTemplate", {contextId: orderId});

        window.open('/' + result);
    };

    $scope.updateContract = function(obj) {
        var orderId = obj.Id;
        sforce.connection.sessionId = window.sessionId;
        var result = sforce.apex.execute("%vlocity_namespace%.ContractServiceResource","updateContract", {contextId: orderId});
    };
                
    $scope.decompOrder = function(obj) {

        var orderId = obj.Id;
        sforce.connection.sessionId = window.sessionId;
        var result = sforce.apex.execute("%vlocity_namespace%.SimpleDecompositionController","decompose", {orderId: orderId});
        if (result == 'OK') {
            // trim ID because we're sending Order IDs to thor in 15-length
            window.location.href='/apex/%vlocity_namespace%__XOMViewOrderDecomposition?id='+ orderId;
        }
        else alert(result);
    };

    $scope.submitOrder = function(obj) {

        var orderId = obj.Id;
        sforce.connection.sessionId = window.sessionId;
        var result = sforce.apex.execute("%vlocity_namespace%.SimpleDecompositionController","decomposeAndCreatePlan", {orderId: orderId});
        console.log(result);
        var objs = JSON.parse(result);
        window.location.href='/apex/OrchestrationPlanViewCommon?id='+ objs.planId;
    };
               
}]);