const logger = require('../../logger');

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