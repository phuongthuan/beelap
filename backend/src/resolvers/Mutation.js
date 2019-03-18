const logger = require('../../logger');

const Mutation = {
  async createItem(parent, args, context) {
    // TODO: Check if they are logged in
    logger.debug('createItem Request: ', JSON.stringify(args, null, 2));
    const item = await context.prisma.createItem({ ...args });

    return item;
  },
  async updateItem(parent, args, context) {
    const updates = { ...args };
    logger.debug('updateItem Request: ', JSON.stringify(args, null, 2));
    delete updates.id;

    return context.prisma.updateItem({
      data: updates,
      where: { id: args.id }
    })
  },
  async deleteItem(parent, { id }, context) {
    logger.debug('deleteItem Request: ', JSON.stringify({ id }, null, 2));
    const itemExists = await context.prisma.$exists.item({ id });
    if (!itemExists) {
      throw new Error(`Item not found or you're not the author`);
    }

    return context.prisma.deleteItem({ id });
  }
}

module.exports = { Mutation };