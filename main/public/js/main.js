var data = angular.module("stock_data", ['chart.js']);

data.controller("stock", function($scope, $http) {
    var url = window.location.href.split('/');
    var stock = url.pop();
    $http.get('/stock/' + stock).then(function(data, status, headers, config) {
        data = data.data;
        if (data.company) {
            $('#loading').hide();
            $scope.data = data;
            var chart_dates = [];
            var sentiment = [];
            var price = [];
            for (var i = 0; i < data.all.length; i++) {
                data.all[i].created = data.all[i].created * 1000;
                chart_dates.push(new Date(data.all[i].created));
                sentiment.push(data.all[i].indNum);
                price.push(data.all[i].price);
            }
            $scope.labels = chart_dates;
            $scope.series = ['Series A', 'Series B'];
            $scope.cData = [price, sentiment];
            $scope.datasetOverride = [
                {
                    yAxisID: 'y-axis-1'
                }, {
                    yAxisID: 'y-axis-2'
                }
            ];
            $scope.options = {
                scales: {
                    yAxes: [
                        {
                            id: 'y-axis-1',
                            type: 'linear',
                            position: 'left'
                        }, {
                            id: 'y-axis-2',
                            type: 'linear',
                            position: 'right',
                            ticks: {
                                max: 1,
                                min: -1
                            }
                        }
                    ]
                }
            };

            $('.loaded').show();

            console.log(data);
        } else {
            $('#loading').hide();
            $scope.ticker = stock.toUpperCase();
            $('#invalid').show();
        }

    });

});
