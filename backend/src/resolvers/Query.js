const Query = {
  items: async (parent, args, context) => {
    const allPosts = await context.prisma.items({ orderBy: "createdAt_DESC" });
    return allPosts;
  },
  item: async (parent, { id }, context) => {
    return context.prisma.item({ id });
  }
};

module.exports = { Query };