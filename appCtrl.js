function AppCtrl($scope)
{
    $scope.logout = function ()
    {
        $scope.$broadcast('UserLoggedOut');
    };
}
