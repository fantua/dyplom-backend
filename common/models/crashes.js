'use strict';

const SMSru = require('sms_ru');

module.exports = function(Crashes) {
    // Model validators:
    Crashes.validateAsync('objectId', async function(err, done) {
        const { Objects } = Crashes.app.models;
        const result = await Objects.findById(this.objectId);

        if (!result) err();

        return done();
    }, { message: 'Object doesn\'t exist' });

    // Model lifecycle hooks:
    Crashes.observe('after save', async (ctx) => {
        const { app } = Crashes;
        const { enable, appId, phoneNumber } = app.get('sms');

        if (enable && ctx.isNewInstance) {
            const { objectId, code } =  ctx.instance;
            const { name } = await app.models.Objects.findById(objectId);
            const sms = new SMSru(appId);

            sms.sms_send({
                to: phoneNumber,
                text: `Аварійна ситуація на об'єкті ${name} (${objectId}). Код: ${code}`,
            }, (e) => {});
        }
    });
};
