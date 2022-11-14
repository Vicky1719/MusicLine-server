const { Schema, model } = require("mongoose");

const commentsSchema = new Schema(
  {
    description: {
      type: String
    },

    creation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Creation",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Comments = model("Comments", commentsSchema);

module.exports = Comments;
