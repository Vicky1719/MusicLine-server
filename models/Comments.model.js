const { Schema, model } = require("mongoose");

const commentsSchema = new Schema(
  {
    description: {
      type: String
    },

    creation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "creation",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const Comments = model("Comments", commentsSchema);

module.exports = Comments;
