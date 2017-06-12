function FakeProvider() {
    this.get = function(params) {
        return [
            {
                "name": 1,
            },
            {
                "name": 2,
            }
        ];
    };
}

angular.module('app').service('FakeProvider', FakeProvider);