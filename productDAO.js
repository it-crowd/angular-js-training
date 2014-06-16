(function ()
{
    var module = angular.module('dao', ['ngResource']);
    module.factory('ProductDAO', function ($resource)
    {
        var ProductResource = $resource('/api/product/:id/:action', {'id': '@id'}, {'like': {method: 'POST', params: {action: 'like'}}});
        return {
            like: function (product)
            {
                return new ProductResource(product).$like();
            },
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
})();
