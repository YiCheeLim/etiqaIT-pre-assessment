var app = angular.module('mainApp', [ 'ngRoute' ]);

app.config(['$routeProvider', function config ($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: '../html/user-list.html'
        }).
        when('/add-user', {
            templateUrl: '../html/user-add-edit.html'
        }).
        when('/edit-user', {
            templateUrl: '../html/user-add-edit.html'
        });
    }
]);

app.controller('mainController', function ( $scope, $location ) {
    $scope.userlist = [];
    $scope.info = {
        username: "",
        email: "",
        phone: "",
        skillsets: "",
        hobby: "",
        edit: false
    }

    if ( $location.url() === "/" ) {
        $scope.addUser = function () {
            $location.url('/add-user');
        };
        $scope.editUser = function ( user ) {
            $scope.info.username = user.username;
            $scope.info.email = user.email;
            $scope.info.phone = user.phone;
            $scope.info.skillsets = user.skillsets;
            $scope.info.hobby = user.hobby;
            $scope.info.edit = true;
            
            $location.url('/edit-user');
        }
    
        $scope.getUser = function () {
            const xhr = new XMLHttpRequest();
    
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    $scope.userlist = Object.values( JSON.parse(xhr.responseText) );
                    console.log( $scope.userlist )
                    $scope.$apply();
                }
            };
            xhr.open("POST", "/get-users");
            xhr.send();
        }
        $scope.getUser();
    } else {
        $scope.add = function () {
            const xhr = new XMLHttpRequest();
    
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    $scope.userlist.push( Object.values( JSON.parse(xhr.responseText) ) );
                    $location.url('/');
                }
            };
    
            xhr.open("POST", "/add-user");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send( JSON.stringify({
                username: $scope.info.username,
                email: $scope.info.email,
                phone: $scope.info.phone,
                skillsets: $scope.info.skillsets,
                hobby: $scope.info.hobby
            }) );
        };

        $scope.edit = function () {
            const xhr = new XMLHttpRequest();
    
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    $scope.info.edit = false;
                    $scope.userlist = Object.values( JSON.parse(xhr.responseText) );
                    $location.url('/');
                }
            };
    
            xhr.open("POST", "/update-user");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send( JSON.stringify({
                username: $scope.info.username,
                email: $scope.info.email,
                phone: $scope.info.phone,
                skillsets: $scope.info.skillsets,
                hobby: $scope.info.hobby
            }) );
        };
        $scope.delete = function () {
            const xhr = new XMLHttpRequest();
    
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    $scope.info.edit = false;
                    $scope.userlist = Object.values( JSON.parse(xhr.responseText) );
                    $location.url('/');
                }
            };
    
            xhr.open("POST", "/delete-user");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send( JSON.stringify({
                email: $scope.info.email
            }) );
        }
    }

});