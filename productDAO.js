var module = angular.module('dao', ['ngResource']);
module.factory('ProductDAO', function ($resource)
{
    var ProductResource = $resource('/api/product/:id', {'id': '@id'});
    return {
        query: function (filter)
        {
            return ProductResource.query({searchQuery: filter}).$promise;
        },
        remove: function (product)
        {
            return new ProductResource(product).$remove();
        }, save: function (product)
        {
            return new ProductResource(product).$save();
        }
    }
});
