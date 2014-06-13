function ProductListCtrl($scope)
{
    var products = [
        {id: 1, name: 'TV'},
        {id: 2, name: 'Fridge'}
    ];

    $scope.filter = '';

    $scope.getProducts = function ()
    {
        var results = [];
        angular.forEach(products, function (value)
        {
            if (value.name.match($scope.filter)) {
                results.push(value);
            }
        });
        return results;
    }
}
