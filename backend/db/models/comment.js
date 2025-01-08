"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User, { foreignKey: "userId" });
      Comment.belongsTo(models.Gift, { foreignKey: "giftId" });
      //   Spot.hasMany(models.Review, {
      //     foreignKey: "spotId",
      //   });
      //   Spot.hasMany(models.Booking, {
      //     foreignKey: "spotId",
      //   });
      //   Review.belongsTo(models.SpotImage, {
      //     foreignKey: "id",
      //     as: "PreviewImage",
      //   });
    }
  }
  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      //id: spot.id,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      giftId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
