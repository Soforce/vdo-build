vlocity.cardframework.registerModule.controller('mobileCpqBarChartsCtrl', ['$scope', '$interpolate', function($scope, $interpolate) {
        var colors = ['#4bdddb', '#00a2e3', '#04335d'];
        
        $scope.card1Filter = 'thisperiod';
        
        $scope.usageData = [
            {
                data: 'Data',
                thisPeriod: 40
            }, {
                data: 'Bandwidth',
                thisPeriod: 45
            }, {
                data: 'Text',
                thisPeriod: 50
            }
        ];
        
        
        $scope.getColor = function(index) {
            return colors[index % colors.length];
        };
        
        // workround for jquery :( https://github.com/angular/angular.js/issues/10572
        var hasSet = [];
        var watchAttributes;
        $scope.$watch(function() {
            watchAttributes = $('svg[data-view-box]').toArray();
            return watchAttributes.map(function(svg) {
                return $interpolate(svg.getAttribute('data-view-box'))($scope) 
            });
        }, function(newValues, oldValues) {
            newValues.forEach(function(value, index) {
                if (value !== oldValues[index] || !hasSet[index]) {
                    watchAttributes[index].setAttribute('viewBox', value);
                    hasSet[index] = true;
                }
            });
        }, true);
        
    }]);