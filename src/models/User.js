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

    riotId: {
      gameName: String, // 例: TenZ
      tagLine: String,  // 例: NA1
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);