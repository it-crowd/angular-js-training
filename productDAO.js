var module = angular.module('dao', []);
module.factory('ProductDAO', function ()
{
    console.log('instantiating ProductDAO');

    var idSequence = 0;
    var products = [
        {id: ++idSequence, name: 'TV'},
        {id: ++idSequence, name: 'Fridge'}
    ];


    return {
        query: function (filter)
        {
            var results = [];
            angular.forEach(products, function (value)
            {
                if (value.name.match(filter)) {
                    results.push(value);
                }
            });
            return results;
        },
        remove: function (product)
        {
            angular.forEach(products, function (value, index)
            {
                if (value.id === product.id) {
                    products.splice(index, 1);
                }
            });
        }, save: function (product)
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
        }
    }
});
