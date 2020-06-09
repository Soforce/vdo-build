vlocity.cardframework.registerModule.controller('omniIntelligenceController', ['$scope', '$rootScope', function($scope, $rootScope) {

        this.getImageUrl = function(obj) {
        if (!obj) {
            return null;
        }
        var imageId = null;
        Object.keys(obj.attachment).forEach(function(key) {
            if (!imageId) {
                imageId = obj.attachment[key];
            }
            if (/@sidebar/.test(key)) {
                imageId = obj.attachment[key];
                return false;
            }
        });
        return ($rootScope.instanceUrl  || '') + '/servlet/servlet.FileDownload?file=' +imageId;
    };
    
    
    this.getTags = function(obj) {
        if (!obj || !angular.isArray(obj.componentScores)) {
            return [];
        }
        return obj.componentScores.reduce(function(array, componentScore) {
            if (componentScore && angular.isArray(componentScore.scoreParameters)) {
                return array.concat(componentScore.scoreParameters);
            }
            return array;
        }, []);
    };
    
    this.performAction = function(obj) {
        
    }

}]);