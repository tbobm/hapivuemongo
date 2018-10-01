'use strict';
const Hapi = require('hapi');
const Config = require('config');
const AuthBearer = require('hapi-auth-bearer-token');
const Boom = require('boom');
const request = require('request-promise');

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

// n9vPhf8yE8xsutbljU8jhArZfRSvPkq9JC8H4Egoa0emaTRoZeEHzaNrPFoVfYsiH-ISWjKy9DPD5u_WcbmcJQ

const checkToken = async (r, h) => {
  const options = {
    uri: 'http://localhost:5002/token',
    json: true,
    resolveWithFullResponse: true,
    method: 'POST',
    body: r.payload,
  };
  server.log('info', r.p);

  return request(options).then((response) => {
    server.log('debug', response);
    return response.body;
  }).catch((err) => {
    if (err.statusCode === 404){
      return {error: "Token not found"};
    }
    server.log('error', err);
    server.log('error', 'errorstatuscode:' + err.statusCode)
  })

};

server.route({
  method: ['POST'],
  path: '/token',
  config: {
    payload: {
      parse: true
    },
    auth: false
  },
  handler: checkToken
});

const loginHandler = async (r, h) => {
  const options = {
    uri: 'http://localhost:5001/connectUser',
    json: true,
    resolveWithFullResponse: true,
    method: 'POST',
    body: r.payload,
  };
  server.log('info', r.p);

  return request(options).then((response) => {
    server.log('debug', response);
    return response.body;
  }).catch((err) => {
    if (err.statusCode === 404){
      return {error: "User not found or incorrect password"};
    }
    server.log('error', err);
    server.log('error', 'errorstatuscode:' + err.statusCode)
  })

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
    server.log('info', request.params);
    const result = await db.collection(Config.get('mongoConfig.collectionName')).findOne({_id: new request.mongo.ObjectID(request.params.id)});
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


const updateCrime = async (request, h) => {
  const db = request.mongo.db;
  try {
    // request.payload['_id'] = new request.mongo.ObjectID(request.params.id);
    const result = await db.collection(Config.get('mongoConfig.collectionName')).save(request.payload);
    server.log('debug', result);
    if (!result) {
      return Boom.notFound();
    }
    return result;
  } catch (err) {
    throw err;
  }

};

server.route({
  method: 'POST',
  path: '/crime/{id}',
  handler: updateCrime
});

const deleteCrime = async (request, h) => {
  const db = request.mongo.db;
  try {
    const result = await db.collection(Config.get('mongoConfig.collectionName')).remove({_id: new request.mongo.ObjectID(request.params.id)}, {justOne: true});
    server.log('debug', result);
    if (!result) {
      return Boom.notFound();
    }
    return result;
  } catch (err) {
    throw err;
  }

};

server.route({
  method: 'DELETE',
  path: '/crime/{id}',
  handler: deleteCrime
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

const registerTempHandler = async (r, h) => {
  const options = {
    uri: 'http://localhost:5000/registerUser',
    json: true,
    resolveWithFullResponse: true,
    method: 'POST',
    body: r.payload,
  };
  server.log('info', r.p);

  return request(options).then((response) => {
    server.log('debug', response);
    return response.body;
  }).catch((err) => {
    server.log('error', err);
    server.log('error', 'errorstatuscode:' + err.statusCode)
  })

};

server.route({
  method: ['POST'],
  path: '/register',
  config: {
    payload: {
      parse: true
    },
    auth: false
  },
  handler: registerTempHandler
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
