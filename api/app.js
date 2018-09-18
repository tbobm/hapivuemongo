'use strict';
const Hapi = require('hapi');
const Config = require('config');
const AuthBearer = require('hapi-auth-bearer-token');

const options = {
    ops: {
        interval: 1000
    },
    reporters: {
        myConsoleReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*', response: '*' }]
        }, {
            module: 'good-console'
        }, 'stdout']
    }
};

const server = Hapi.server({
    host: Config.get('api.host'),
    port: Config.get('api.port'),
});

const getEtna = (request, h) => {
    return request.params
};

const postEtna = (request, h) => {
    return request.payload
};

server.route({
    method: 'GET',
    path: '/etna/{etnaMessage?}',
/*    config: {
        auth: false
    },*/
    handler: getEtna
});

server.route({
    method: ['PUT', 'POST'],
    path: '/etna',
    config: {
        payload: {
            parse: true
        }
    },
    handler: postEtna
});



async function start() {
    try {
        await server.register({
            plugin: require('good'),
            options,
        });
        await server.register(AuthBearer);

        server.auth.strategy('simple', 'bearer-access-token', {
            allowQueryToken: true,
            validate: async (request, token, h) => {
                const isValid = token === '1234';

                const credentials = { token };
                const artifacts = { test: 'info' };

                return { isValid, credentials, artifacts };
            }
        });
        server.auth.default('simple');

        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    };
    await server.log('info', 'server running at: '+ server.info.uri);
};

start();
