var data = angular.module("stock_data", []);

data.controller("stock", function($scope, $http) {
    var url = window.location.href.split('/');
    var stock = url.pop();
    $http.get('/stock/' + stock).success(function(data, status, headers, config) {
        $('#loading').hide();
        $scope.data = data;
        $('#loaded').show();
        console.log(data);
    });

});
