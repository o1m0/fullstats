const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    valorantProfile: {
      gameName: { type: String, required: true },
      tagLine: { type: String, required: true },
      puuid: { type: String, required: true, unique: true },

      region: {
        type: String,
        enum: ["ap", "na", "eu", "kr"],
        required: true
      },

      accountLevel: Number,

      card: {
        small: String,
        large: String,
        wide: String,
        id: String
      },

      lastUpdate: Date,     
      lastUpdateRaw: Number
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);