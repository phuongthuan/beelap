const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const logger = require('../../logger');

const Mutation = {
  async createItem(parent, args, context) {
    logger.debug('createItem Request: ', JSON.stringify(args, null, 2));

    const { userId } = context.request;

    if (!userId) {
      throw new Error(`You must logged in`);
    }

    const item = await context.prisma.createItem({ 
      user: {
        connect: { id: userId },
      },
      category: args.category,
      ...args,
     }).$fragment(`
        fragment ItemWithCategories on Item {
          id
          title
          category {
            id
            name
          }
          description
          price
          image
          largeImage
        }
    `);

     console.log('create item', JSON.stringify(item, null, 0))

    return item;
  },

  async updateItem(parent, args, context) {

    logger.debug('updateItem Request: ', JSON.stringify(args, null, 2));

    const updates = { ...args };

    if (!context.request.userId) {
      throw new Error(`You must logged in!`);
    }

    delete updates.id;

    const updatedItem = await context.prisma.updateItem({
      data: {
        category: args.category,
        ...updates,
      },
      where: { id: args.id }
    }).$fragment(`
        fragment ItemWithCategories on Item {
          id
          title
          category {
            id
            name
          }
          description
          price
          image
          largeImage
        }
    `);

    console.log('update item', JSON.stringify(updatedItem, null, 0))

    return updatedItem;
  },

  async deleteItem(parent, { id }, context) {

    logger.debug('deleteItem Request: ', JSON.stringify({ id }, null, 2));

    if (!context.request.userId) {
      throw new Error(`You must logged in!`);
    }

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