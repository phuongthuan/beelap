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
    return context.prisma.user({ id: userId });
  }
};

module.exports = { Query };