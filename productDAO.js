var module = angular.module('dao', []);
module.factory('ProductDAO', function ($http)
{

    return {
        query: function (filter)
        {
            return $http.get('http://localhost:8000/api/product', {params: {searchQuery: filter}});
        },
        remove: function (product)
        {
            return $http.delete('http://localhost:8000/api/product/' + product.id);
        }, save: function (product)
        {
            var url;
            if (product.id) {
                url = 'http://localhost:8000/api/product/' + product.id;

            } else {
                url = 'http://localhost:8000/api/product';
            }
            return $http.post(url, product);
        }
    }
});
