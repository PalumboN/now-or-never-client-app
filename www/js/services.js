angular.module('nan.services', [])
.service('httpService', function($http, $q, notificationService) {
    return {
        get: function(uri) {
            var deferred = $q.defer()
            $http.get(uri).success(function(data) {
                deferred.resolve(data)
            }).error(function(data) {
                notificationService.error('<b>Error on get.</b><br>' + data.message)
                deferred.reject('Error calling: ' + uri)
            })
            return deferred.promise
        },
        post: function(uri, data) {
            var deferred = $q.defer()
            $http.post(uri, data).success(function(data) {
                deferred.resolve(data)
            }).error(function(data) {
                notificationService.error('<b>Error on post.</b><br>' + data.message)
                deferred.reject(data)
            })
            return deferred.promise
        },
        put: function(uri, data) {
            var deferred = $q.defer()
            $http.put(uri, data).success(function(data) {
                deferred.resolve(data)
            }).error(function(data) {
                notificationService.error('<b>Error on put.</b><br>' + data.message)
                deferred.reject(data)
            })
            return deferred.promise
        }, 
        delete: function(uri) {
            var deferred = $q.defer()
            $http.delete(uri).success(function(data) {
                deferred.resolve(data)
            }).error(function(data) {
                notificationService.error('<b>Error on delete.</b><br>' + data.message)
                deferred.reject('Error calling: ' + uri)
            })
            return deferred.promise
        }
    }
})