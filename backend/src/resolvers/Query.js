const Query = {
  items: async (parent, args, context) => {
    const allPosts = await context.prisma.items();
    return allPosts;
  },
};

module.exports = { Query };