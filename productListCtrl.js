function ProductListCtrl($scope, ProductDAO)
{
    $scope.filter = '';

    $scope.visible = true;

    $scope.remove = function (product)
    {
        ProductDAO.remove(product);
        doFilterProducts();
    };

    $scope.edit = function (product)
    {
        $scope.$root.$broadcast('EditProduct', product);
        $scope.visible = false;
    };

    function doFilterProducts()
    {
        $scope.filteredProducts = ProductDAO.query($scope.filter);
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
        $scope.visible = true;
    });

    $scope.$on('ProductEditCancelled', function ()
    {
        $scope.visible = true;
    });
}
