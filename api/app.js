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
    path: '/user/{id?}',
    handler: getEtna
});

server.route({
    method: ['POST'],
    path: '/login',
    config: {
        payload: {
            parse: true
        }
        auth: false
    },
    handler: postEtna
});

server.route({
    method: ['POST'],
    path: '/user/{id}/enable',
    config: {
        payload: {
            parse: true
        }
    },
    handler: postEtna
});


server.route({
    method: 'GET',
    path: '/crime/{id?}',
    handler: getEtna
});

server.route({
    method: ['POST'],
    path: '/crime',
    config: {
        payload: {
            parse: true
        }
    },
    handler: postEtna
});

/* MICROSERVICES */

server.route({
    method: 'GET',
    path: '/user/export',
    handler: getEtna
});

server.route({
    method: ['POST'],
    path: '/user',
    config: {
        payload: {
            parse: true
        }
        auth: false
    },
    handler: postEtna
});


server.route({
    method: ['POST'],
    path: '/crime/search',
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
