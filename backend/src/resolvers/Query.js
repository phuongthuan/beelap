const Query = {
  items: async (parent, args, context) => {
    const allPosts = await context.prisma.items({ orderBy: "createdAt_DESC" });
    return allPosts;
  },
  item: async (parent, { id }, context) => {
    return context.prisma.item({ id });
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