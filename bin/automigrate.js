'use strict';

const path = require('path');
const app = require(path.resolve(__dirname, '../server/server'));
const {db} = app.dataSources;

db.automigrate().then(async () => {
    const { Account } = app.models;

    await Account.create([
        { username: 'Admin', email: 'admin@i.ua', password: 'password' },
    ]);

    db.disconnect();
    process.exit(1);
});
