// eslint-disable-next-line no-undef
module.exports = function() {
    var faker = require("faker");
    var _ = require("lodash");
    return {
        users: _.times(20, function(id) {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            const rawUsername = `${lastName.toLowerCase()}${firstName.charAt(0).toLowerCase()}`;
            const username = rawUsername.replace(/[^a-zA-Z0-9]/g, "");
            const createdAt = Date.now();
            const updatedAt = Date.now();
            return {id, firstName, lastName, username, updatedAt, createdAt};
        })
    };
};