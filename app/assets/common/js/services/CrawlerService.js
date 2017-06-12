function CrawlerService() {
    this.get = function(callback, params) {
        return callback(params);
    };
}

angular.module('app').service('CrawlerService', CrawlerService);