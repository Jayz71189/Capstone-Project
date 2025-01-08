"use strict";
const { Model } = require("sequelize");

// models/Image.js
module.exports = (sequelize, DataTypes) => {
  class GiftImage extends Model {
    static associate(models) {
      GiftImage.belongsTo(models.Gift, {
        foreignKey: "giftId", // Foreign key in GiftImages table
        // as: "gift", // Alias to access the related Gift model
      });
    }
  }
  GiftImage.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      giftId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Gifts", // The Gift model that this image is related to
          key: "id", // The key in the Gifts table
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false, // Stores binary data for the full-size image
      },
      preview: {
        type: DataTypes.BOOLEAN, // Stores the URL or path to the preview image
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "GiftImage",
    }
  );
  return GiftImage;
};
