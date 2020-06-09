vlocity.cardframework.registerModule.controller('vdoBanUsageController', ['$scope', function($scope) {
    var vdoBarChart, vdoPieChart;
    $scope.usageGraphMonths = 6;
    $scope.usageBreakdownGraphMonths = "month";
    
    //Sample usageCollection

     $scope.usageCollection = {
         "monthlyBudget": {
                 "labels" : ['May-16','Jun-16','Jul-16','Aug-16','Sep-16','Oct-16','Nov-16','Dec-16','Jan-17','Feb-17','Mar-17','Apr-17'],
                 "values" : [20, 20, 25, 28, 20, 34, 30, 40, 20, 25, 39, 34, 45]
             },
             "breakdown":{
                 "month": {
                     "labels" :['DATA', 'CALLS', 'HARDWARE', 'APPS'],
                     "values": [40,30,18,12]
                 },
                 "quarter": {
                     "labels" :['DATA', 'CALLS', 'HARDWARE', 'APPS'],
                     "values": [230,130,58,42]
                 },
                 "half": {
                     "labels" :['DATA', 'CALLS', 'HARDWARE', 'APPS'],
                     "values": [545,435,328,112]
                 }
             }
         };
    
    //Usage collection is used from the layout data
    //$scope.usageCollection = $scope.$parent.records.usageCollection;
    
    $scope.chartTimeline = function(type) {
        if(type ==="budget") {
            $scope.createMonthlyBudgetBarChart($scope.usageGraphMonths);
        }else {
            $scope.createMonthlyBreakdownPieChart($scope.usageBreakdownGraphMonths);
        }
    };

    $scope.createMonthlyBudgetBarChart = function(timeline) {
        var ctx = document.getElementById("myBarChart");
        
        vdoBarChart && vdoBarChart.destroy();
        
        vdoBarChart = new Chart(ctx, {
            type: 'bar',
            valueAxis: {
                title: { 
                    text: "Cost in 1000"
                }
            },
            data: {
                labels: $scope.usageCollection.monthlyBudget.labels.slice(-timeline) ,
                datasets: [{
                    label: 'Usage',
                    data: $scope.usageCollection.monthlyBudget.values.slice(-timeline),
                    backgroundColor: "#16325C"
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Cost (In 1000)'
                          }
                    }]
                }
            }

        });
    };

    $scope.createMonthlyBreakdownPieChart = function(timeline) {
        var ctx1 = document.getElementById("myPieChart");
        
        vdoPieChart && vdoPieChart.destroy();
        vdoPieChart = new Chart(ctx1, {
            type: 'pie',
            data: {
                labels: $scope.usageCollection.breakdown[timeline].labels,
                datasets: [{
                    label: 'Usage',
                    data: $scope.usageCollection.breakdown[timeline].values,
                    backgroundColor: ["#16325C",
                        '#7a879b',
                        '#575b60',
                        '#3b5d8e',
                    ]
                }]
            }
        });
    };
    
    //Init of graphs
    $scope.createMonthlyBudgetBarChart(6);
    $scope.createMonthlyBreakdownPieChart("month");
    

  }]);