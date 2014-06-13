function ProductListCtrl($scope)
{
    var products = [
        {id: 1, name: 'TV'},
        {id: 2, name: 'Fridge'}
    ];

    $scope.filter = '';

    $scope.remove = function (product)
    {
        var index = products.indexOf(product);
        if (index > -1) {
            products.splice(index, 1);
        }
    };

    function doFilterProducts()
    {
        $scope.filteredProducts = [];
        angular.forEach(products, function (value)
        {
            if (value.name.match($scope.filter)) {
                $scope.filteredProducts.push(value);
            }
        });
    }

    doFilterProducts();

    $scope.$watch('filter', function (newValue, oldValue)
    {
        if (newValue === oldValue) {
            return;
        }
        doFilterProducts();
    });

    $scope.$watch(function ()
    {
        return products;
    }, function (newValue, oldValue)
    {
        if (newValue === oldValue) {
            return;
        }
        doFilterProducts();
    }, true);

    $scope.$on('UserLoggedOut', function ()
    {
        products.length = 0;
    });
}
