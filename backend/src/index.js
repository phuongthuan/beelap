const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const resolvers = require('./resolvers')

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

// TODO Use express middleware to handle cookies (JWT)

// TODO Use express middleware to populate current user

server.start({
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  }, deets => console.log(`Server is running on http://localhost:${deets.port}`)
);
