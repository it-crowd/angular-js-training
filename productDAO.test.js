describe('ProductDAO', function ()
{

    beforeEach(module('dao'));

    describe('like', function ()
    {

        var thenCallback, catchCallback, finallyCallback;
        beforeEach(inject(function (ProductDAO)
        {
            thenCallback = jasmine.createSpy('thenCallback');
            catchCallback = jasmine.createSpy('catchCallback');
            finallyCallback = jasmine.createSpy('finallyCallback');
            var promise = ProductDAO.like({id: 1});
            promise.then(thenCallback);
            promise.catch(catchCallback);
            promise.finally(finallyCallback);

        }));
        describe('should return promise', function ()
        {
            describe('that on 200 HTTP status', function ()
            {
                beforeEach(inject(function ($httpBackend)
                {
                    $httpBackend.when('POST', '/api/product/1/like').respond(200);
                    $httpBackend.flush();
                }));
                it('should resolve', inject(function ($httpBackend)
                {
                    expect(thenCallback).toHaveBeenCalled();
                }));
                it('should call finally callback', function ()
                {
                    expect(finallyCallback).toHaveBeenCalled();
                });
            });
        });
        describe('should return promise', function ()
        {
            describe('that on 400 HTTP status', function ()
            {
                beforeEach(inject(function ($httpBackend)
                {
                    $httpBackend.when('POST', '/api/product/1/like').respond(400);
                    $httpBackend.flush();
                }));
                it('should reject', inject(function ($httpBackend)
                {
                    expect(catchCallback).toHaveBeenCalled();

                }));
                it('should call finally callback', function ()
                {
                    expect(finallyCallback).toHaveBeenCalled();
                });
            });
        });
    });

    describe('save', function ()
    {
        var $resourceMock, ProductResourceMock, ProductResourceConstructorMock, product;
        beforeEach(module(function ($provide)
        {
            $resourceMock = jasmine.createSpy('$resource');
            ProductResourceConstructorMock = jasmine.createSpy('new ProductResource');
            ProductResourceMock = jasmine.createSpyObj('ProductResource', ['$save']);
            ProductResourceConstructorMock.andReturn(ProductResourceMock);
            $provide.value('$resource', $resourceMock.andReturn(ProductResourceConstructorMock));
            product = {id: 1, name: 'abc'};
        }));

        beforeEach(inject(function (ProductDAO)
        {
            ProductDAO.save(product);
        }));

        it('should invoke new ProductResource(product).$save()', function ()
        {
            expect(ProductResourceConstructorMock).toHaveBeenCalledWith(product);
            expect(ProductResourceMock.$save).toHaveBeenCalled()
        });
    });
});