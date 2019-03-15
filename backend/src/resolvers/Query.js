const Query = {
  items: async (parent, args, context) => {
    const items = await prisma.items();
    return items;
  },
};

module.exports = Query;