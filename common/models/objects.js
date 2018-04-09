'use strict';

const _ = require('lodash');

module.exports = function(Objects) {
    Objects.params = (cb) => {
        const { app } = Objects;
        const { port, crashPort, statsPort } = app.get('tcpService');

        const response = {
            port,
            crashPort,
            statsPort,
            protocol: 'tcp',
            host: app.get('host'),
        };

        cb(null, response);
    };

    // Custom REST endpoints:
    Objects.remoteMethod('destroyAll', {
        isStatic: true,
        description: 'Delete all matching records.',
        accepts: [
            {arg: 'where', type: 'object', description: 'filter.where object'},
            {arg: 'options', type: 'object', http: 'optionsFromRequest'},
        ],
        returns: {
            arg: 'count',
            type: 'object',
            description: 'The number of instances deleted',
            root: true,
        },
        http: {verb: 'del', path: '/'},
        accessType: 'WRITE',
    });

    Objects.remoteMethod('params', {
        isStatic: true,
        description: 'Browse instance parameters.',
        returns: {
            arg: 'params',
            type: 'object',
            root: true,
        },
        http: {verb: 'get', path: '/params'},
        accessType: 'READ',
    });
};
