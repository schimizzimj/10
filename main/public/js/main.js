var data = angular.module("stock_data", []);

data.controller("stock", function($scope, $http) {
    console.log(this.href.substr(this.href.lastIndexOf('/') + 1);
    $http.get('/' + this.href.substr(this.href.lastIndexOf('/') + 1)).success(function(data, status, headers, config) {
        $scope.data = data;
        console.log(data);
    });});
