const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const resolvers = require('./resolvers');

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  context: request => { 
    return {
      ...request,
      prisma,
    }
  },
});

server.express.use(cookieParser());

// decode the JWT so we can get the user Id on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put the userId onto the req for future requests to access
    req.userId = userId;
  }
  next();
});

// Use express middleware to populate current user
server.express.use(async (req, res, next) => {
  // if they aren't logged in, skip this
  if (!req.userId) return next();
  const user = await prisma.user({ id: req.userId }).$fragment(`
    fragment CurrentUserPermission on User {
      id
      permissions
      email
      name
    }
  `);
  req.user = user;
  next();
});

server.start({
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  }, deets => console.log(`Server is running on http://localhost:${deets.port}`)
);
