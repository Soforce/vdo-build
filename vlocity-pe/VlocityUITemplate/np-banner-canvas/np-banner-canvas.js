vlocity.cardframework.registerModule
    .controller('npResourceCarouselImages',
                ['$scope', '$timeout', 'dataSourceService', '$rootScope', '$log', function($scope, $timeout, dataSourceService, $rootScope, $log) {
                
         $scope.prefixNamespace = localStorage.getItem('nsPrefixDotNotation').replace('_','-');
         //auto run the carousel
            $scope.autoRun = true;
            $scope.data = [];
            $scope.viaSldsCardSlide= {index : 0};
            var timer;
            $scope.sliderFunc = function(obj) {
                $scope.data = obj;
                startTimer();
            };
          //set timer to increment/decrement   
            var startTimer = function()
            {
                timer = $timeout(function() {
                $scope.next();
                timer = $timeout(startTimer, 2000);
                }, 5000);
            }
            //next slide 
            $scope.next = function()
            {
                $scope.viaSldsCardSlide.index = $scope.viaSldsCardSlide.index < ($scope.data.length - 1) ? $scope.viaSldsCardSlide.index + 1 : 0
            }
            
            $scope.$on('$destroy', function() {
                $timeout.cancel(timer); // when the scope is getting destroyed, cancel the timer
            });
        var lightningNsPrefix = $scope.nsPrefix.replace('__', ':'),
            collectedChanges = [];


    }]);