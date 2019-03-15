const Query = {
  itemsList: (parent, args, context) => {
    return context.prisma.items({ where: { title: 'new' } })
  }
};

module.exports = Query;