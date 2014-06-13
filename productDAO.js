var module = angular.module('dao', []);
module.factory('ProductDAO', function ($q, $timeout)
{
    var idSequence = 0;
    var products = [
        {id: ++idSequence, name: 'TV'},
        {id: ++idSequence, name: 'Fridge'}
    ];


    return {
        query: function (filter)
        {
            var deferred = $q.defer();
            $timeout(function ()
            {
                var results = [];
                angular.forEach(products, function (value)
                {
                    if (value.name.match(filter)) {
                        results.push(value);
                    }
                });
                deferred.resolve(results);
            }, 1000);
            return deferred.promise;
        },
        remove: function (product)
        {
            var deferred = $q.defer();
            $timeout(function ()
            {
                angular.forEach(products, function (value, index)
                {
                    if (value.id === product.id) {
                        products.splice(index, 1);
                    }
                });
                if (Math.random() > .5) {
                    deferred.resolve();
                } else {
                    deferred.reject({reason: 'Random failure'});
                }
            }, 1500);
            return deferred.promise;
        }, save: function (product)
        {
            var deferred = $q.defer();
            $timeout(function ()
            {
                var found = false;
                angular.forEach(products, function (value)
                {
                    if (value.id === product.id) {
                        angular.extend(value, product);
                        found = true;
                    }
                });
                if (!found) {
                    product.id = ++idSequence;
                    products.push(product);
                }
                deferred.resolve();
            }, 1500);
            return deferred.promise;
        }
    }
});
