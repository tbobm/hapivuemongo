'use strict';
const Hapi = require('hapi');
const Config = require('config');
const AuthBearer = require('hapi-auth-bearer-token');
const Boom = require('boom');
const request = require('request-promise');

const dbOpts = {
  url: process.env.MONGO_URI || "mongodb://localhost/hapivue",
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
    uri: 'http://token:5000/token',
    json: true,
    resolveWithFullResponse: true,
    method: 'POST',
    body: r.payload,
  };

  return request(options).then((response) => {
    return response.body;
  }).catch((err) => {
    if (err.statusCode === 404) {
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
    uri: 'http://connection:5000/connectUser',
    json: true,
    resolveWithFullResponse: true,
    method: 'POST',
    body: r.payload,
  };

  return request(options).then((response) => {
    return response.body;
  }).catch((err) => {
    if (err.statusCode === 404) {
      return {error: "User not found or not enabled or incorrect password"};
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


const getCrime = async (r, h) => {
  if (!r.auth || !r.auth.credentials || !r.auth.credentials.permissions || !r.auth.credentials.permissions.read)
    return Boom.forbidden("You don't have enough permissions");
  if (r.params.id != null) {
    return getCrimeDetails(r, h);
  } else {
    return getCrimeList(r, h);
  }
};

const getCrimeDetails = async (request, h) => {
  const db = request.mongo.db;
  try {
    const result = await db.collection(Config.get('mongoConfig.collectionName')).findOne({_id: new request.mongo.ObjectID(request.params.id)});
    if (!result) {
      return Boom.notFound();
    }
    return result;
  } catch (err) {
    throw err;
  }

};

const getCrimeList = async (r, h) => {
  const db = r.mongo.db;
  try {
    server.log('debug', r.params);
    server.log('debug', parseInt(r.params.limit));
    if (!r.params.limit)
      r.params.limit = 25;
    if (!r.params.offset)
      r.params.offset = 0;
    let listCrime = await db.collection(Config.get('mongoConfig.collectionName')).find({}, {
      limit: r.params.limit,
      skip: r.params.offset
    }).limit(parseInt(r.params.limit)).toArray();
    return listCrime;
  }
  catch (err) {
    throw err;
  }

};

server.route({
  method: 'GET',
  path: '/crimes/{id}',
  handler: getCrime
});

const searchCrime = async (r, h) => {
  server.log('debug', r.payload);
  if (!r.payload.limit)
    r.payload.limit = 25;
  if (!r.payload.offset)
    r.payload.offset = 0;
  let obj = {};
  obj["limit"] = r.payload.limit;
  obj["offset"] = r.payload.offset;
  if (r.payload.field && r.payload.filter)
    obj[r.payload.field] = r.payload.filter;
  server.log('debug', obj);
  const options = {
    uri: 'http://search:5000/crimes',
    json: true,
    resolveWithFullResponse: true,
    method: 'POST',
    body: obj,
  };

  return request(options).then((response) => {
    //server.log('debug', response);
    return response.body;
  }).catch((err) => {
    server.log('error', err);
    server.log('error', 'errorstatuscode:' + err.statusCode)
    Boom.notFound();
  })

};

server.route({
  method: 'POST',
  path: '/crimes/search',
  handler: searchCrime
});


const updateCrime = async (r, h) => {
  if (!r.auth || !r.auth.credentials || !r.auth.credentials.permissions || !r.auth.credentials.permissions.edit)
    return Boom.forbidden("You don't have enough permissions");
  const db = r.mongo.db;
  try {
    r.payload._id = new r.mongo.ObjectID(r.payload._id)
    const result = await db.collection(Config.get('mongoConfig.collectionName')).save(r.payload);
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
  path: '/crimes/{id}',
  handler: updateCrime
});

const deleteCrime = async (r, h) => {
  if (!r.auth || !r.auth.credentials || !r.auth.credentials.permissions || !r.auth.credentials.permissions.delete)
    return Boom.forbidden("You don't have enough permissions");
  const db = r.mongo.db;
  try {
    const result = await db.collection(Config.get('mongoConfig.collectionName')).remove({_id: new r.mongo.ObjectID(r.params.id)}, {justOne: true});
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
  path: '/crimes/{id}',
  handler: deleteCrime
});

server.route({
  method: ['POST'],
  path: '/crimes',
  config: {
    payload: {
      parse: true
    }
  },
  handler: updateCrime
});

/* MICROSERVICES */

const userExportHandler = async (r, reply) => {
  const options = {
    uri: 'http://export:4000/exportToCsv',
    json: true,
    resolveWithFullResponse: true,
    method: 'GET',
  };

  return request(options).then((response) => {
    return response.body;
  }).catch((err) => {
    server.log('error', err);
    server.log('error', 'errorstatuscode:' + err.statusCode)
    return Boom.internal();
  })
};

server.route({
  method: 'GET',
  path: '/users.csv',
  handler: userExportHandler
});

const registerHandler = async (r, h) => {
  const options = {
    uri: 'http://register:5000/registerUser',
    json: true,
    resolveWithFullResponse: true,
    method: 'POST',
    body: r.payload,
  };

  return request(options).then((response) => {
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
  handler: registerHandler
});


const activateUserHandler = async (r, h) => {
  const options = {
    uri: 'http://activate:5000/validateUser',
    resolveWithFullResponse: true,
    method: 'PUT',
    json: {
      id: r.params.id
    }
  };

  return request(options).then((response) => {
    return response.body;
  }).catch((err) => {
    server.log('error', err);
    server.log('error', 'errorstatuscode:' + err.statusCode)
    return Boom.internal();
  })

};

server.route({
  method: ['POST'],
  path: '/users/{id}/enable',
  config: {
    payload: {
      parse: true
    }
  },
  handler: activateUserHandler
});

const listUserHandler = async (r, h) => {
  const options = {
    uri: 'http://activate:5000/list',
    json: true,
    resolveWithFullResponse: true,
    method: 'GET',
  };

  return request(options).then((response) => {
    return response.body;
  }).catch((err) => {
    server.log('error', err);
    server.log('error', 'errorstatuscode:' + err.statusCode)
    return Boom.internal();
  })
};

server.route({
  method: ['GET'],
  path: '/users',
  handler: listUserHandler
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
      validate: async (r, token, h) => {
        let isValid = true;
        let credentials = {token};
        const artifacts = {test: 'info'};

        const options = {
          uri: 'http://token:5000/token',
          json: true,
          resolveWithFullResponse: true,
          method: 'POST',
          body: {'token': token},
        };

        return request(options).then((response) => {
          credentials = response.body;
          return {isValid, credentials, artifacts};
        }).catch((err) => {
          server.log('error', err);
          server.log('error', 'errorstatuscode:' + err.statusCode)
          isValid = false;
          return {isValid, credentials, artifacts};
        })
      }
    });

    server.auth.default('singleuser');


    await server.start();
  }
  catch (err) {
    process.exit(1);
  }
  ;
  await server.log('info', 'server running at: ' + server.info.uri);
};

start();
