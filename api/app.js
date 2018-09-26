'use strict';
const Hapi = require('hapi');
const Config = require('config');
const AuthBearer = require('hapi-auth-bearer-token');
const Boom = require('boom');

const dbOpts = {
    url: "mongodb://" + Config.get("mongoConfig.host") + ":" + Config.get("mongoConfig.port") + "/" + Config.get("mongoConfig.dbName"),
    settings: {
        poolSize: 10
    },
    decorate: true
};

const options = {
    ops: {
        interval: 1000
    },
    reporters: {
        myConsoleReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{log: '*', response: '*'}]
        }, {
            module: 'good-console'
        }, 'stdout']
    }
};

const server = Hapi.server({
    host: Config.get('api.host'),
    port: Config.get('api.port'),
    routes: {
        cors: {
            origin: ['*']
        }
    }
});

const getEtna = (request, h) => {
    return request.params
};

const postEtna = (request, h) => {
    return request.payload
};

const loginHandler = (request, h) => {
    let loginAuth = request.payload;
    loginAuth.password = undefined;
    loginAuth.accessToken = "Totototo";
    loginAuth.role = "Admin";
    server.log('info', loginAuth);
    return loginAuth;
};

server.route({
    method: ['POST'],
    path: '/login',
    config: {
        payload: {
            parse: true
        },
        auth: false
    },
    handler: loginHandler
});


const getCrime = async (request, h) => {
    if (request.params.id != null) {
        return getCrimeDetails(request, h);
    } else {
        return getCrimeList(request, h);
    }
};

const getCrimeDetails = async (request, h) => {
    const db = request.mongo.db;
    try {
        const result = await db.collection(Config.get('mongoConfig.collectionName')).findOne({compnos: parseInt(request.params.id)});
        if (!result) {
            return Boom.notFound();
        }
        return result;
    } catch (err) {
        throw err;
    }

};

const getCrimeList = async (request, h) => {
    const db = request.mongo.db;
    try {
        const result = await db.collection(Config.get('mongoConfig.collectionName')).find({}).limit(10).toArray();
        return result;
    }
    catch (err) {
        throw err;
    }

};

server.route({
    method: 'GET',
    path: '/crime/{id?}',
    handler: getCrime
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
        },
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

        await server.register({
            plugin: require('hapi-mongodb'),
            options: dbOpts
        });

        server.auth.strategy('singleuser', 'bearer-access-token', {
            allowQueryToken: true,
            validate: async (request, token, h) => {
                const isValid = token === '1234';

                const credentials = {token};
                const artifacts = {test: 'info'};

                return {isValid, credentials, artifacts};
            }
        });

        server.auth.strategy('admin', 'bearer-access-token', {
            allowQueryToken: true,
            validate: async (request, token, h) => {
                const isValid = token === '4321';

                const credentials = {token};
                const artifacts = {test: 'info'};

                return {isValid, credentials, artifacts};
            }
        });
        server.auth.default('singleuser');

        server.route({
            method: ['POST'],
            path: '/user/{id}/enable',
            config: {
                payload: {
                    parse: true
                },
                auth: 'admin'
            },
            handler: postEtna
        });

        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
    ;
    await server.log('info', 'server running at: ' + server.info.uri);
};

start();
