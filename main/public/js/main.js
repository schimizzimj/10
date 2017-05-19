var data = angular.module("stock_data", []);

data.controller("stock", function($scope, $http) {
    var url = window.location.href.split('/');
    var stock = url.pop();
    $http.get('/stock/' + stock).success(function(data, status, headers, config) {
        if (data.company) {
            $('#loading').hide();
            $scope.data = data;
            for (var i = 0; i < data.all.length; i++) {
                data.all[i].created = data.all[i].created * 1000;
            }
            $('#loaded').show();
            $('#loaded2').show();
            console.log(data);
        } else {
            $('#loading').hide();
            $scope.ticker = stock.toUpperCase();
            $('#invalid').show();
        }

    });

});
