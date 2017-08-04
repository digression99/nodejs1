var myApp = angular.module('myApp');

myApp.controller('BooksController', ['$scope', '$http', '$location', '$routeParams',
    function($scope, $http, $location, $routeParams) {
    console.log('books controller loaded...');

    // $scope.getBooks = function() {
    //     $http({
    //         method: 'GET',
    //         url: 'api/books'
    //     }).then(function (response){
    //         console.log(response);
    //         $scope.books = response.data;
    //     },function (error){
    //         console.log('cannot get data');
    //         throw error;
    //     });
    //     // $http.get('/api/books').success(function(response) {
    //     //     $scope.books = response;
    //     // });
    // };

    $scope.getBooks = function() {
        $http.get('/api/books')
            .then(function(response) {
                $scope.books = response.data
            })
    };

    $scope.getBook = function() {
        console.log('getBook executed...');
        var id = $routeParams.id;
        console.log('id = ', id);

        $http.get('/api/books/' + id)
            .then(function(response) {
                $scope.book = response.data;
            });
    };

    // $scope.getBook = function() {
    //     var id = $routeParams._id;
    //     $http({
    //         method: 'GET',
    //         url: 'api/books/' + id
    //     }).then(function (response){
    //         console.log(response);
    //         $scope.book = response.data;
    //     },function (error){
    //         console.log('cannot get data');
    //         throw error;
    //     });
    // }

    $scope.addBook = function() {
        //$http.post(url, data, [config]);
        console.log('addBook executed...');
        console.log($scope.book);

        $http.post('/api/books/add', $scope.book).then(function(response) {
            window.location.href = '#!/books';
            console.log(response);
        }, function(error) {
            console.log(error);
        });

        // $http({
        //     method: 'POST',
        //     url: 'api/books/'
        // }).then(function (response){
        //     console.log(response);
        //     $scope.book = response.data;
        // },function (error){
        //     console.log('cannot get data');
        //     throw error;
        // });
    }


    $scope.updateBook = function() {
        var id = $routeParams.id;

        $http.put('/api/books/' + id, $scope.book).then(function(response) {
            window.location.href = '#!/books';
        }, function(error) {
            console.log(error);
        });
    };
    $scope.deleteBook = function(id) {
        $http.delete('/api/books/' + id).then(function(response) {
            window.location.href = '#!/books';
        }, function(error) {
            console.log(error);
        });
    }
}]);