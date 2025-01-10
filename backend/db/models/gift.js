"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Gift extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Gift.belongsTo(models.User, { foreignKey: "userId", as: "User" });
      Gift.hasMany(models.Comment, {
        foreignKey: "giftId",
      });
      Gift.hasMany(models.Like, { as: "Like", foreignKey: "giftId" });
      //   Spot.hasMany(models.Booking, {
      //     foreignKey: "spotId",
      //   });
      // Spot.belongsTo(models.SpotImage, {
      //   foreignKey: "id",
      //   as: "PreviewImage",
      // });

      Gift.hasMany(models.GiftImage, {
        foreignKey: "giftId",
        as: "GiftImages",
      });
    }
  }
  Gift.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 26],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Description is required" },
        },
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Price is required" },
          isFloat: true,
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      previewImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Gift",
    }
  );
  return Gift;
};
