const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const stripe = require('../stripe');

const logger = require('../../logger');
const { hasPermission } = require('../utils');

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

    logger.debug('create item', JSON.stringify(item, null, 0))

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

    logger.debug('update item', JSON.stringify(updatedItem, null, 0))

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

  async updatePermissions(parent, args, context) {
    // Make sure they're signed in.
    const { userId } = context.request;
    logger.debug('userId', userId);

    if (!userId) {
      throw new Error('You must be signed in!');
    }

    // 2. Query the current user
    const currentUser = await context.prisma.user({ id: userId });

    // 3. Check if they have permissions to do this
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);

    // 4. Update the permissions
    return context.prisma.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions,
          },
        },
        where: {
          id: args.userId,
        },
      }
    );
  },

  async updateUser(parent, args, context) {
    logger.debug('updateUser request', JSON.stringify(args, null, 2));

    const { userId } = context.request;

    if (!userId) {
      throw new Error('You must be signed in soooon');
    }

    return context.prisma.updateUser({
      where: {
        id: userId,
      },
      data: {
        name: args.name
      }
    });
  },

  async addToCart(parent, args, context) {

    logger.debug('args', JSON.stringify(args, null, 2));

    logger.debug('cartItem id', args.id);

    // Make sure they're signed in.
    const { userId } = context.request;
    logger.debug('userId', userId);

    if (!userId) {
      throw new Error('You must be signed in soooon');
    }
    // 2. Query the users current cart
    const [existingCartItem] = await context.prisma.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id },
      },
    });

    logger.debug('existingCartItem', existingCartItem);

    // 3. Check if that item is already in their cart and increment by 1 if it is
    if (existingCartItem) {
      console.log('This item is already in their cart');
      return context.prisma.updateCartItem(
        {
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + 1 },
        }
      );
    }
    // 4. If its not, create a fresh CartItem for that user!
    return context.prisma.createCartItem({
      user: {
        connect: { id: userId },
      },
      item: {
        connect: { id: args.id },
      },
    });
  },
  async removeFromCart(parent, args, context) {

    logger.debug('cartItem id', args.id);

    // 1. Find the cart item
    const cartItem = await context.prisma.cartItem({ id: args.id }).$fragment(`
        fragment UserOnCartItem on CartItem {
          id
          user {
            id
          }
        }
    `);

    logger.debug('cartItem found', cartItem);

    // 1.5 Make sure we found an item
    if (!cartItem) throw new Error('No CartItem Found!');
    // 2. Make sure they own that cart item
    if (cartItem.user.id !== context.request.userId) {
      throw new Error('You are not the owner of this cartitem');
    }
    // 3. Delete that cart item
    return context.prisma.deleteCartItem({ id: args.id });
  },
  async createOrder(parent, args, context) {
    // 1. Query the current user and make sure they are signed in
    const { userId } = context.request;
    if (!userId) throw new Error('You must be signed in to complete this order.');
    const user = await context.prisma.user({ id: userId })
      .$fragment(`
      fragment UserInfoCheckout on User {
        id
        name
        email
        cart {
          id
          quantity
          item { title price id description image largeImage }
        }
      }
    `);

    // 2. recalculate the total for the price
    const amount = user.cart.reduce(
      (tally, cartItem) => tally + cartItem.item.price * cartItem.quantity,
      0
    );
    console.log(`Going to charge for a total of ${amount}`);

    logger.debug('token', args.token)

    // 3. Create the stripe charge (turn token into $$$)
    const charge = await stripe.charges.create({
      amount,
      currency: 'USD',
      source: args.token,
    });

    // 4. Convert the CartItems to OrderItems
    const orderItems = user.cart.map(cartItem => {
      const orderItem = {
        ...cartItem.item,
        quantity: cartItem.quantity,
        user: { connect: { id: userId } },
      };
      delete orderItem.id;
      return orderItem;
    });

    // 5. create the Order
    const order = await context.prisma.createOrder({
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId } },
    }).$fragment(`
      fragment OrderDetail on Order {
        id
        total
        charge
        items {
          id
          title
        }
        user {
          id
          name
          email
        }
      }
    `);

    // 6. Clean up - clear the users cart, delete cartItems
    const cartItemIds = user.cart.map(cartItem => cartItem.id);

    await context.prisma.deleteManyCartItems({
      id_in: cartItemIds
    });
    // 7. Return the Order to the client
    return order;

  },
}

module.exports = { Mutation };