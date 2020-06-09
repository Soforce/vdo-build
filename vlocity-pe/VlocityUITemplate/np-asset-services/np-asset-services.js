vlocity.cardframework.registerModule
    .controller('NpServiceActions',
                ['$scope','force', '$rootScope', '$filter', function($scope, force, $rootScope, $filter) {
     $scope.prefixNamespace = localStorage.getItem('nsPrefixDotNotation').replace('.','');
     console.log('sdfdfg' + $scope.prefixNamespace);
        $scope.openStory = function(obj) {
            var toBeLaunchedUrl = obj.navigateLink || ('/' + obj.Id.value)
            $scope.performAction({
                type: 'Custom',
                isCustomAction: true,
                url: toBeLaunchedUrl,
                openUrlIn: (window.sforce && sforce.console && sforce.console.isInConsole() ? 'New Tab / Window' : null)
            });
        };

    }]);