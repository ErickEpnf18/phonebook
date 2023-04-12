'use strict';

require('dotenv').config();
const mongoose = require('mongoose');

const { model, Schema } = mongoose;

mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new Schema({
  name: {
    type: String,
    minLength: [3, 'User name is too short, it must be at least 3 letters,'],
    required: [true, 'User phone name required']
  },
  number: {
    type: String,
    validate: {
      // /\d{3}-\d{3}-\d{4}/.test(v)
      validator: (v) => /^\(?([0-9]{2,3})\)?-\d{4}/.test(v),
      message: (props) => `${props.value} is not a valid number`
    },
    required: [true, 'User phone number required']
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = model('Person', personSchema);
