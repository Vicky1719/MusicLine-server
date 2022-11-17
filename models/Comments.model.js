const { Schema, model } = require("mongoose");

const commentsSchema = new Schema(
  {
    description: {
      type: String

    },

    creation: {
      type: Schema.Types.ObjectId,
      ref: "Creation",
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Comments = model("Comments", commentsSchema);

module.exports = Comments;
