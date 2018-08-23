function FileProvider($http) {
    this.get = function(params) {
        return $http.get('/app/assets/data/' + params.entity + 's.json');
    };
}

angular.module('app').service('FileProvider', FileProvider);