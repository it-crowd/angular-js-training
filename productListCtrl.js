function ProductListCtrl($scope)
{
    var products = [
        {id: 1, name: 'TV'}
    ];

    $scope.getProducts = function ()
    {
        return products;
    }
}
