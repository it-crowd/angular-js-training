function ProductListCtrl($scope, ProductDAO)
{
    $scope.filter = '';

    $scope.visible = true;

    $scope.remove = function (product)
    {
        ProductDAO.remove(product).success(doFilterProducts).error(function (error)
        {
            alert('Cannot remove product. Reason: ' + error.reason);
        });
    };

    $scope.edit = function (product)
    {
        $scope.$root.$broadcast('EditProduct', product);
        $scope.visible = false;
    };

    function doFilterProducts()
    {
        ProductDAO.query($scope.filter).success(function (result)
        {
            $scope.filteredProducts = result;
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

    $scope.$on('ProductSaved', function ()
    {
        doFilterProducts();
        $scope.visible = true;
    });

    $scope.$on('ProductEditCancelled', function ()
    {
        $scope.visible = true;
    });
}
