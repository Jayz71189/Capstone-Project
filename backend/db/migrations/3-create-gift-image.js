"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "GiftImages",
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        giftId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Gifts", // Name of the referenced table
            key: "id",
          },
          onDelete: "CASCADE", // Ensures spotImages are deleted if the Spot is deleted
          onUpdate: "CASCADE",
        },
        url: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        preview: {
          type: Sequelize.BOOLEAN,
          defaultValue: false, // Set default value to false
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "GiftImages";
    return queryInterface.dropTable(options);
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
