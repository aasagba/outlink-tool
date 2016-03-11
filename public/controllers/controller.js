var myApp = angular.module('myApp', ['datatables', 'checklist-model', 'ngDialog']).run(initDT);; 

function initDT(DTDefaultOptions) {
    DTDefaultOptions.setLoadingTemplate('<img src="loader.gif">');
}

myApp.controller('AppCtrl', ['$scope', '$http', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', 'ngDialog', function($scope, $http, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, ngDialog) {
	
	var vm = this;
	vm.data = [];
	vm.limit = 100;
	vm.currentTotal = 0;
	vm.totalResults = 0;
	$scope.loading = false;
	
	
	$scope.data = []
	,$scope.log = []
	,$scope.roles = [
	    'exact match'
	  ]
	,$scope.user = {
	    roles: []
	 }
	,$scope.term = ''
	,$scope.checked = 'regex'
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
		logIt("value: "+value+", checked: "+checked);
		if(checked) {
			$scope.checked = value;
		} else {
			$scope.checked = "regex";
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
	
	$scope.clickToOpen = function () {
        ngDialog.open({ template: 'popupTmpl.html', className: 'ngdialog-theme-default' });
    };
    
    $scope.downloadToCSV = function (d) {
    	logIt("Processing CSV file");
    	logIt("Processing: " + vm.data.length + " results");
    	var csvContent = "data:text/csv;charset=utf-8,";
    	flag = true;
    	
    	vm.data.forEach(function(infoArray, index){
    		var a = [];
    		if (flag) {
    			a.push("Page Url", "Outlink");
    			flag = false;
    		} else {
    			a.push(infoArray.pageUrl, infoArray.outLink);
    		}
    		
		    dataString = a.join(",");
		    csvContent += index < vm.data.length ? dataString+ "\n" : dataString;
		
		}); 
		
		var encodedUri = encodeURI(csvContent);
		var link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "Littleforest_Report.csv");
		document.body.appendChild(link);
		link.click();
    }
	
}]);
	
