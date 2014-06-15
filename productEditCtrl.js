function ProductEditCtrl($scope, ProductDAO)
{
    $scope.save = function ()
    {
        ProductDAO.save($scope.product).then(function ()
        {
            $scope.product = null;//alternatively: delete$scope.product;
            $scope.$root.$broadcast('ProductSaved');
        });
    };
    $scope.cancel = function ()
    {
        $scope.product = null;
        $scope.$root.$broadcast('ProductEditCancelled');
    };

    $scope.$on('EditProduct', function ($event, product)
    {
        $scope.product = angular.extend({}, product);
    });

}
