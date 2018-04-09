'use strict';

const net = require('net');

module.exports = function(app) {
    const { host, port, crashPort, statsPort } = app.get('tcpService');
    const { Statistics, Crashes } = app.models;

    const server = net.createServer((socket) => {
        socket.on('data', async (data) => {
            const { remotePort } = socket;
            const { data: [ value ] } = data.toJSON();

            switch (remotePort) {
                case (remotePort > crashPort): {
                    const id = remotePort - crashPort;
                    const code = remotePort - id;

                    Crashes.create({ code, objectId: id });
                    break;
                }

                default: {
                    const id = remotePort - statsPort;

                    Statistics.create({ value, objectId: id });
                }
            }
        });
    });

    server.on('error', (err) => {
        console.log(`TCP server error:\n${err.stack}`);
    });

    server.on('listening', () => {
        const { address, port } = server.address();
        console.log(`TCP server listening at ${address}:${port}`);
    });

    server.listen(port, host);
};
