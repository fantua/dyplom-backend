'use strict';

module.exports = function(Statistics) {
    // Model validators:
    Statistics.validateAsync('objectId', async function(err, done) {
        const { Objects } = Statistics.app.models;
        const result = await Objects.findById(this.objectId);

        if (!result) err();

        return done();
    }, { message: 'Object doesn\'t exist' });
};
