const Mutation = {
  async createItem(parent, args, context) {
    // TODO: Check if they are logged in
    const item = await context.prisma.createItem({ ...args });

    return item;
  },
}

module.exports = { Mutation };