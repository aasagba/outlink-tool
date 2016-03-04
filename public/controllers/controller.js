var myApp = angular.module('myApp', ['datatables', 'checklist-model', 'sly']).run(initDT);; 

function initDT(DTDefaultOptions) {
    DTDefaultOptions.setLoadingTemplate('<img src="loader.gif">');
}

myApp.controller('AppCtrl', ['$scope', '$http', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', function($scope, $http, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
	
	var vm = this;
	vm.data = [];
	vm.limit = 100;
	vm.currentTotal = 0;
	vm.totalResults = 0;
	$scope.loading = false;
	
	
	$scope.data = []
	,$scope.log = []
	,$scope.roles = [
	    'standard', 
	    'regex'
	  ]
	,$scope.user = {
	    roles: []
	 }
	,$scope.term = ''
	,$scope.checked = 'standard'
	,$scope.totalDisplayed = 10000;
	
	$scope.getRoles = function() {
	   return $scope.user.roles;
	};
	
	$scope.loadMore = function () {
		$scope.totalDisplayed += $scope.totalDisplayed;
		logIt("total: " + $scope.totalDisplayed);
	}
	
	$scope.loadMore2 = function() {
		logIt("limit is: " + vm.limit);
		logIt("Current total is: " + vm.currentTotal);
      var incremented = parseInt(vm.currentTotal, 10) + parseInt(vm.limit, 10);
      logIt("incremented is: " + incremented);
      vm.currentTotal = incremented > vm.data.length ? vm.data.length : incremented;
      logIt("total: " + vm.currentTotal);
    };
	
	$scope.check = function(value, checked) {
		logIt("value: "+value+", chcked: "+checked);
		if(checked) {
			$scope.checked = value;
		}
		
	    var idx = $scope.user.roles.indexOf(value);
	    if (idx >= 0 && !checked) {
	      $scope.user.roles.splice(idx, 1);
	    }
	    if (idx < 0 && checked) {
	      $scope.user.roles.push(value);
	    }
	 };
	
	logIt("AppCtrl controller initialised");
	
	function logIt(text, params) {
  		console.log('logIt: ' + text);
  		$scope.log.push(text);
  	}
	
	// DataTables configurable options
    $scope.dtOptions = DTOptionsBuilder.newOptions()
    	.withDisplayLength($scope.totalDisplayed)
    	.withPaginationType('full_numbers');
    
    $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1)
    ];
	
	$scope.search = function(term) {
		$scope.loading = true;
			
		logIt("Search term is: " + term);
		logIt("Search type is: " + $scope.checked);
		
		var searchType = $scope.checked;
		
		// Encode url passed in parameter as it contains special chars
		urlEncoded = encodeURIComponent(term);
		logIt(urlEncoded);
		
		
		$http.get('/data/' + urlEncoded + "/" + searchType).success(function(response) {
			logIt("Data  successfully retrieved.");
			//logIt(response);
			
			//logIt("Response" + JSON.stringify(response));
			
			/*angular.forEach(response, function (page) {
				logIt( "id: " + page.id + ", pageUrl: " + page.pageUrl + ", outLink: " + page.outLink );
			})*/
			
			//$scope.data = response;
			vm.data = response;
			
			// set total results on this instance
			vm.totalResults = vm.data.length;
			
			// set current scrolling total
			if (vm.totalResults < vm.limit ) {
				vm.currentTotal = vm.totalResults;
			} else {
				vm.currentTotal = vm.limit;
			}
			
		}).finally( function() {
			$scope.loading = false;
		});
		
	}
}]);
	
