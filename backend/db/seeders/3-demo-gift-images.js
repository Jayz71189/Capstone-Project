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
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-21409981/original/a8fa243d-dac8-4238-93e5-f7aa33072ff8.jpeg?im_w=1200&im_format=avif",
          preview: true, // Marked as preview image
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          giftId: 2,
          url: "https://a0.muscache.com/im/pictures/13507508/edc9eb7f_original.jpg?im_w=1200&im_format=avif",
          preview: true, // Not marked as preview
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          giftId: 3,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-313113/original/db974e45-6bfb-437d-ab51-8ecaba1f4ee0.jpeg?im_w=1200&im_format=avif",
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
