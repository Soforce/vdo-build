vlocity.cardframework.registerModule.controller('dxOpenStory', ['$scope', function($scope) {
        $scope.openStory = function(obj) {
            var toBeLaunchedUrl = '/' + obj.Id;
            if (typeof sforce !== 'undefined') {
                if (sforce.console.isInConsole()) {
                    openSubtab = function openSubtab(result) {
                        sforce.console.openSubtab(result.id, toBeLaunchedUrl, false, obj.title, null, openSuccess, obj.title);
                    };
                    openSuccess = function openSuccess(result) {
                        sforce.console.focusSubtabById(result.id);
                    };
                    sforce.console.getEnclosingPrimaryTabId(openSubtab);
                } else {
                    if(typeof sforce.one === 'object') {
                        sforce.one.navigateToURL(toBeLaunchedUrl, false);
                    } else {
                        location.assign(toBeLaunchedUrl);
                    }

                }
            }else {
                location.assign(toBeLaunchedUrl);
            }
        };
      }]);