"use strict";

const { Gift } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Gift.bulkCreate(
        [
          {
            id: 1,
            userId: 1,
            name: "Wine Glass",
            description: "The best Wine Glass for your every occasion ",
            price: 123,
            quantity: 1,
            // createdAt: "2021-11-19 20:39:36",
            // updatedAt: "2021-11-19 20:39:36",
            previewImage: "image url",
          },
          {
            id: 2,
            userId: 1,
            name: "Cooking Pans Set",
            description:
              "State of the Art cooking tools for the ultimate cook ",
            price: 123,
            quantity: 2,
            // createdAt: "2021-11-19 20:39:36",
            // updatedAt: "2021-11-19 20:39:36",
            previewImage: "image url",
          },
          {
            id: 3,
            userId: 1,
            name: "Gift Card",
            description: "Gift card to use for any amazing gift",
            price: 123,
            quantity: 3,
            // createdAt: "2021-11-19 20:39:36",
            // updatedAt: "2021-11-19 20:39:36",
            previewImage: "image url",
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
    options.tableName = "Gifts";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
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
