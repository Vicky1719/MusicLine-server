const { Schema, model } = require("mongoose");

const creationSchema = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    letter: {
        type: String,
      },

    music: {
        type: String,
      },

    song: {
        type: String,
      },
   
  },

  {
    timestamps: true,
  }
);

const Creation = model("Creation", creationSchema);

module.exports = Creation;