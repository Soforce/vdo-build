vlocity.cardframework.registerModule.controller('vdodeviceUsageController', ['$scope', function($scope) {
    var vdoBarChart;
    //Sample usageCollection

     $scope.usageCollection = {
         "monthlyBreakdown": {
             "labels" :['DATA', 'CALLS', 'HARDWARE', 'APPS'],
             "values": [100,50,26,30]
             }
         };
    
    //Usage collection is used from the card data
    //$scope.usageCollection = $scope.$parent.obj.usageCollection;
    
    $scope.createMonthlyBudgetBarChart = function(timeline) {
        var ctx = document.getElementById("vdo-consumer-device-usage-chart");
        
        vdoBarChart && vdoBarChart.destroy();
        
        vdoBarChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: $scope.usageCollection.monthlyBreakdown.labels,
                datasets: [{
                    label: 'Cost',
                    data: $scope.usageCollection.monthlyBreakdown.values.slice(-timeline),
                    backgroundColor: "#16325C"
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                },
                xAxes: [{
                    scaleLabel: {
                            labelString: 'Cost'
                    }
                }]
            }

        });
    };

    //Init of graphs
    $scope.createMonthlyBudgetBarChart();

  }]);