"use strict";

const { GiftImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await GiftImage.bulkCreate([
        {
          id: 1,
          giftId: 1,
          url: "https://modernquests.com/cdn/shop/files/leonardo-germany-poesia-red-wine-glasses-600ml-set-of-6-3.jpg?v=1690061463&width=1000",
          preview: true, // Marked as preview image
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          giftId: 2,
          url: "https://assets.wfcdn.com/im/48132452/resize-h800-w800%5Ecompr-r85/2507/250729796/Cook+N+Home+Pots+and+Pans+Nonstick+Kitchen+Cookware+Set.jpg",
          preview: true, // Not marked as preview
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          giftId: 3,
          url: "https://images.zola.com/75533730-a111-4f86-af4c-6a3ea6efd9c9?w=320",
          preview: true, // Marked as preview image
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          giftId: 4,
          url: "https://www.ikea.com/us/en/images/products/faergklar-plate-matte-light-gray__1027982_pe835159_s5.jpg?f=xl",
          preview: true, // Marked as preview image
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
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
    options.tableName = "GiftImages";
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
