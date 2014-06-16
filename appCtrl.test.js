describe('AppCtrl', function ()
{
    describe('logout', function ()
    {
        var controllersScope, userLoggedOutListenerMock;
        beforeEach(inject(function ($rootScope, $controller)
        {
//            Given
            controllersScope = $rootScope.$new();
            var childScope = controllersScope.$new();
            userLoggedOutListenerMock = jasmine.createSpy('UserLoggedOutListener');
            childScope.$on('UserLoggedOut', userLoggedOutListenerMock)

//            When
            $controller('AppCtrl', {$scope: controllersScope});
            controllersScope.logout();
        }));
        it('should broadcast UserLoggedOut event', function ()
        {
            expect(userLoggedOutListenerMock).toHaveBeenCalled();
        });
    });
});