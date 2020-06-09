vlocity.cardframework.registerModule.controller('vdoBanLinesController', function($scope, $location) {

    $scope.goLogin = function() {
        console.log('/apex/c__VDOCards?layout=vdo-business-community-account-details-layout&id=' + $scope.obj.Id + '&useCache=false');
        $location.path('/apex/c__VDOCards?layout=vdo-business-community-account-details-layout&id=' + $scope.obj.Id + '&useCache=false');
        window.location = '/apex/c__VDOCards?layout=vdo-business-community-account-details-layout&id=' + $scope.obj.Id + '&useCache=false';
    };
})