function ProductEditCtrl($scope)
{
    var originalProduct;
    $scope.save = function ()
    {
        angular.extend(originalProduct, $scope.product);
        $scope.product = null;//alternatively: delete$scope.product;
        $scope.$root.$broadcast('ProductSaved');
    };
    $scope.cancel = function ()
    {
        $scope.product = null;
        $scope.$root.$broadcast('ProductEditCancelled');
    };

    $scope.$on('EditProduct', function ($event, product)
    {
        originalProduct = product;
        $scope.product = angular.extend({}, product);
    });

}
