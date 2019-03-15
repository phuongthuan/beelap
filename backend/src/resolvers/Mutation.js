const Mutation = {
  async createItem(parent, { title, description, price }, context) {
    // TODO: Check if they are logged in
    const item = await context.prisma.createItem({
      title,
      description,
      price
    });

    return item;
  },
}

module.exports = { Mutation };