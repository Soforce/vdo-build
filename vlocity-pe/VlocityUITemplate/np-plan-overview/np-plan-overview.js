vlocity.cardframework.registerModule
    .controller('dxviaProfileController',
                ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
                    
        var self = this;
        $scope.image = "";
        $scope.writeImage = function()
        {
            $("#pimage").html($scope.image);
        }
       self.getPhotoUrl = function(obj) {
            if (obj.PhotoUrl) {
                if ($rootScope.instanceUrl) {
                    return $rootScope.instanceUrl + obj.PhotoUrl;
                } else {
                    return obj.PhotoUrl;
                }
            }
        };

        self.getSentiment = function(obj) {
            var nsPrefix = window.nsPrefix || window.ns || localStorage.getItem('nsPrefixDotNotation').replace('.', '__');
            if (nsPrefix) {
                if (nsPrefix.length > 1 && !/__$/.test(nsPrefix)) {
                    nsPrefix += '__';
                }
                if (obj[nsPrefix + 'CustomerValue__c']) {
                    return obj[nsPrefix + 'CustomerValue__c'].toLowerCase();
                } else if (obj[nsPrefix + 'CustomerSentiment__c']) {
                    return obj[nsPrefix + 'CustomerSentiment__c'].toLowerCase();
                }
            }
            // hide by default
            return 'ng-hide';
        };

    }]);