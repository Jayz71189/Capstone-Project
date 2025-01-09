"use strict";

const { Purchase } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Purchase.bulkCreate(
        [
          {
            id: 1,
            userId: 1,
            giftId: 1,
            totalPrice: 123.0,
            quantity: 1,
          },
          {
            id: 2,
            userId: 1,
            giftId: 2,
            totalPrice: 246.0,
            quantity: 2,
          },
          {
            id: 3,
            userId: 1,
            giftId: 3,
            totalPrice: 469.0,
            quantity: 3,
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
    options.tableName = "Purchases";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
