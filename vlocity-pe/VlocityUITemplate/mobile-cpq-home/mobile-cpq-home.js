vlocity.cardframework.registerModule
    .controller('CpqHomeController',
                 ['$scope', '$timeout', '$state', '$rootScope', 'CommonService', 'IonicService', function($scope, $timeout, $state, $rootScope, CommonService, IonicService) {
          var vm = this;          
                    vm.searchTerm = '';
                     vm.searching = false;
                     vm.searchResults = [];
       	console.log('home controller');             
        this.performSearch = function() {
           if (vm.searchTerm.length > 1 ) {
            CommonService.showSpinner();
                vm.searching = true;
                 CommonService.peformGobalSearch(vm.searchTerm, ["Account"], _.get(vm.stateConfig, 'Fields'))
                    .then(function (searchResults) {
                            vm.searching = false;
                            CommonService.hideSpinner();
                            vm.searchResults = searchResults;
                            
                           console.log("search result", searchResults);
                        },
                        function (error) {
                            vm.searching = false;
                            CommonService.hideSpinner();
                            IonicService.popup.alert({
                                title: error[0].errorCode,
                                template: error[0].message
                            });

                        });
           } else  if (vm.searchTerm.length === 0 ) {
               vm.searching = false;
               vm.searchResults = [];
           }
        
        this.viewSearchDetail = function(objId) {
            vm.searchTerm = "";
            vm.searchResults = [];
            vm.searching = false;
            
            $state.go('app.story', {
				objectId: objId
			});
        };    
           
        };
        
}]);