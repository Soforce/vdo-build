vlocity.cardframework.registerModule.controller('assetDetailChartsCtrl', ['$scope', '$interpolate', function($scope, $interpolate) {
        var colors = ['#f57923', '#f5a623', '#ffcf7f'];
        
        $scope.card1Filter = $scope.card2Filter = $scope.card3Filter = 'thisperiod';
        
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
        
        $scope.usageDataByMonth = [{
            month: 'Jul',
            data: 100,
            bandwidth: 120,
            color: colors[1]
        },{
            month: 'Aug',
            data: 150,
            bandwidth: 150,
            color: colors[1]
        },{
            month: 'Sep',
            data: 250,
            bandwidth: 220,
            color: colors[2]
        },{
            month: 'Oct',
            data: 190,
            bandwidth: 180,
            color: colors[1]
        },{
            month: 'Nov',
            data: 190,
            bandwidth: 220,
            color: colors[1]
        },{
            month: 'Dec',
            data: 190,
            bandwidth: 290,
            color: colors[2]
        }];
        
        $scope.usageByField = 'data';
        
        $scope.setUsageToBandwidth = function() {
            $scope.usageByField = 'bandwidth';
        };
        
        $scope.setUsageToData = function() {
            $scope.usageByField = 'data';
        };
        
        
        $scope.usageThisMonth = {
            totalAvailable: 15,
            used: 7.4
        };
        
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
        
      var p = ($scope.usageThisMonth.used/$scope.usageThisMonth.totalAvailable)*100;
      $('.pie').get(0).style.animationDelay = '-' + p + 's';
        
    }]);