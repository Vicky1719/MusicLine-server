const { Schema, model } = require("mongoose");

const commentsSchema = new Schema(
  {
    commentSong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "creation",
    },

    commentUser: {
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
