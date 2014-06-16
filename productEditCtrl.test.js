describe('ProductEditCtrl', function ()
{
    describe('on EditProduct event', function ()
    {
        var $scope, product;
        beforeEach(inject(function ($rootScope, $controller)
        {
//            Given
            $scope = $rootScope.$new();
            product = {id: 1, name: 'abc'};
            expect($scope.product).not.toEqual(product);

//            When
            $controller('ProductEditCtrl', {$scope: $scope, ProductDAO: {}});
            $rootScope.$broadcast('EditProduct', product);
        }));
        it('should set scope.product to a copy of data from event', function ()
        {
            expect($scope.product).toEqual(product);
            expect($scope.product).not.toBe(product);
        });
    });

    describe('save', function ()
    {
        var $scope, productDAOMock, deferred, productSavedListenerMock, product;
        beforeEach(inject(function ($rootScope, $controller, $q)
        {
//            Given
            product = {id: 1, name: 'abc'};
            productSavedListenerMock = jasmine.createSpy('ProductSavedListener');
            $rootScope.$on('ProductSaved', productSavedListenerMock);
            $scope = $rootScope.$new();
            productDAOMock = jasmine.createSpyObj('ProductDAO', ['save']);
            deferred = $q.defer();
            productDAOMock.save.andReturn(deferred.promise);

//            When
            $controller('ProductEditCtrl', {$scope: $scope, ProductDAO: productDAOMock});
            $scope.product = product;
            $scope.save();
        }));
        it('should delegate to ProductDAO', function ()
        {
            expect(productDAOMock.save).toHaveBeenCalled();
        });

        describe('while promise is unresolved', function ()
        {
            beforeEach(inject(function ($rootScope)
            {
                $rootScope.$digest();
            }));
            it('should NOT clear scope.product', function ()
            {
                expect($scope.product).toBe(product);
            });
            it('should NOT broadcast ProductSaved event on $rootScope', function ()
            {
                expect(productSavedListenerMock).not.toHaveBeenCalled();
            });
        });

        describe('on success', function ()
        {
            beforeEach(inject(function ($rootScope)
            {
                deferred.resolve();
                $rootScope.$digest();
            }));
            it('should clear scope.product', function ()
            {
                expect($scope.product).toBeNull();
            });
            it('should broadcast ProductSaved event on $rootScope', function ()
            {
                expect(productSavedListenerMock).toHaveBeenCalled();
            });
        });
    });

    describe('cancel', function ()
    {
        var $scope, productEditCancelledListenerMock, product;
        beforeEach(inject(function ($rootScope, $controller, $q)
        {
            //            Given
            product = {id: 1, name: 'abc'};
            productEditCancelledListenerMock = jasmine.createSpy('ProductEditCancelledListenerMock');
            $rootScope.$on('ProductEditCancelled', productEditCancelledListenerMock);
            $scope = $rootScope.$new();

            //            When
            $controller('ProductEditCtrl', {$scope: $scope, ProductDAO: {}});
            $scope.product = product;
            $scope.cancel();
        }));
        it('should clear $scope.product', function ()
        {
            expect($scope.product).toBeNull();
        });
        it('should broadcast ProductEditCancelled event on $rootScope', function ()
        {
            expect(productEditCancelledListenerMock).toHaveBeenCalled();
        });
    });
});
