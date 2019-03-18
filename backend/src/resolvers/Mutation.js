const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const logger = require('../../logger');

const Mutation = {
  async createItem(parent, args, context) {
    // TODO: Check if they are logged in
    logger.debug('createItem Request: ', JSON.stringify(args, null, 2));
    const item = await context.prisma.createItem({ ...args });

    return item;
  },
  async updateItem(parent, args, context) {
    const updates = { ...args };
    logger.debug('updateItem Request: ', JSON.stringify(args, null, 2));
    delete updates.id;

    return context.prisma.updateItem({
      data: updates,
      where: { id: args.id }
    })
  },
  async deleteItem(parent, { id }, context) {
    logger.debug('deleteItem Request: ', JSON.stringify({ id }, null, 2));
    const itemExists = await context.prisma.$exists.item({ id });
    if (!itemExists) {
      throw new Error(`Item not found or you're not the author`);
    }

    return context.prisma.deleteItem({ id });
  },
  async signup(parent, args, context) {
    // lowercase their email
    args.email = args.email.toLowerCase();
    // hash their password
    const password = await bcrypt.hash(args.password, 10);
    // create the user in the database

    logger.debug('signup Request: ', JSON.stringify(args, null, 2));

    const user = await context.prisma.createUser(
      {
        ...args,
        password,
        permissions: { set: ['USER'] },
      }
    );
    // create the JWT token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // We set the jwt as a cookie on the response
    context.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });
    // Finalllllly we return the user to the browser
    return user;
  },
  async signin(parent, { email, password }, context) {
    // 1. check if there is a user with that email
    const user = await context.prisma.user({ email });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    // 2. Check if their password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid Password!');
    }

    logger.debug('signin Request: ', context.response);

    // 3. generate the JWT Token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // 4. Set the cookie with the token
    context.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    // 5. Return the user
    return user;
  },
  signout(parent, args, context) {
    context.response.clearCookie('token');
    return { message: 'Goodbye!' };
  },
}

module.exports = { Mutation };