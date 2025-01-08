"use strict";

const { Comment } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Comment.bulkCreate(
        [
          {
            userId: 1,
            giftId: 1,
            comment: "This was an awesome gift!",
          },
          {
            userId: 2,
            giftId: 2,
            comment: "Nice gift, but a bit expensive.",
          },
          {
            userId: 3,
            giftId: 3,
            comment: "Not great, the item was made cheaply.",
          },
        ],
        { validate: true }
      );
    } catch (err) {
      console.error(err);
      throw "";
    }
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Comments";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(
      options,
      {
        name: { [Op.in]: ["App Academy", "App Academy 2", "App Academy 3"] },
      },
      {}
    );
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
