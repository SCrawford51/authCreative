angular.module('myApp', []).
    controller('myController', ['$scope', '$http',
        function ($scope, $http, $filter) {

            $scope.taskList = [];
            
            $http.get('/user/profile')
            .success(function (data, status, headers, config) {
                $scope.user = data;
                $scope.error = "";
            }).
            error(function (data, status, headers, config) {
                $scope.user = {};
                $scope.error = data;
            });

            $scope.getAll = function () {
                console.log("in getAll");
                return $http.get('/index').success(function (data) {
                    angular.copy(data, $scope.taskList);
                });
            };
            $scope.getAll();
        
            $scope.create = function (task) {
                return $http.post('/index', task).success(function (data) {
                    $scope.taskList.push(data);
                });
            };
        
            $scope.addTask = function () {
                if ($scope.Task === '') { return; }
                console.log("In addTask with " + $scope.Task);
                $scope.create({
                    task: $scope.Task,
                    priority: $scope.Priority,
                });
                $scope.Task = '';
                $scope.Priority = '';
            }
        
            $scope.removeTask = function (task) {
                console.log("In RemoveTask");
                $http.delete('/index/' + task._id)
                    .success(function (data) {
                        console.log("delete worked");
                    });
                    console.log(task._id);
                $scope.getAll();
            };
        }
    ]);