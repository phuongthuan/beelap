const logger = require('../../logger');
const { hasPermission } = require('../utils');

const Query = {
  items: async (parent, args, context) => {

    const { searchTerm, category, orderBy = "createdAt_DESC" } = args;

    const allItems = await context.prisma.items({ 
      orderBy,
      where: { 
        OR: [
          { title_contains: searchTerm },
          { description_contains: searchTerm }
        ],
        category: { id: category }
      }
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

    return allItems;
  },
  item: async (parent, { id }, context) => {
    const item = await context.prisma.item({ id }).$fragment(`
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

    return item;
  },
  categories: async (parent, args, context) => {
    return context.prisma.categories();
  },
  orders: async (parent, args, context) => {

    const { userId } = context.request;

    // 1. Check if they are logged in
    if (!userId) {
      throw new Error('You must be logged in!');
    }

    const orders = await context.prisma.orders({
      orderBy: "createdAt_DESC",
      where: {
        user: {
          id: userId,
        }
      }
    }).$fragment(`
        fragment OrderOfUser on Orders {
          id
          items {
            id
            title
            description
            price
            image
          }
          total
          charge
          user {
            id
            name
            email
          }
          createdAt
        }
    `);

    return orders;
  },
  me: async (parent, args, context) => {
    const { userId } = context.request;
    if (!userId) {
      return null;
    }
    return context.prisma.user({ id: userId }).$fragment(`
      fragment UserInfo on User {
        id
        name
        email
        permissions
        cart {
          id
          quantity
          item {
            id
            price
            image
            title
            description
          }
        }
      }
    `);
  },
  users: async (parent, args, context) => {
    // 1. Check if they are logged in
    if (!context.request.userId) {
      throw new Error('You must be logged in!');
    }
    console.log(context.request.userId);
    // 2. Check if the user has the permissions to query all the users
    hasPermission(context.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

    // 2. if they do, query all the users!
    return context.prisma.users();
  },
  order: async (parent, { id }, context) => {

    logger.debug('get Order detail id: ', id);

    const { userId } = context.request;

    if (!userId) throw new Error(`You must logged in!`);

    const order = await context.prisma.order({ id }).$fragment(`
      fragment OrderInfoDetail on Order {
        id
        total
        charge
        createdAt
        items {
          id
          title
          description
          price
          image
          quantity
        }
        user {
          id
        }
      }
    `);

    return order;
  }
};

module.exports = { Query };