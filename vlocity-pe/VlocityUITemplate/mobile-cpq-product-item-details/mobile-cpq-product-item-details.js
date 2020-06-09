vlocity.cardframework.registerModule.controller('InfoSpitter', [
    '$scope', '$rootScope', function ($scope, $rootScope) {
        console.log("YO");
        console.log($scope.$root.nsPrefix);
        console.log($rootScope.nsPrefix);
    }
]);