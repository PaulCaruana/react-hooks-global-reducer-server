// eslint-disable-next-line no-undef
module.exports = function() {
    var faker = require("faker");
    var _ = require("lodash");
    return {
        users: _.times(30, function(n) {
            return {
                id: n,
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                username: faker.internet.userName()
            };
        })
    };
};