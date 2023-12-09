import { Schema, model } from 'mongoose';
import { Beer } from '../../entities/beer.model.js';

export const beerSchema = new Schema<Beer>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  brewer: {
    type: String,
    required: true,
    unique: false,
  },
  style: {
    type: String,
    required: true,
    unique: false,
  },
  alcohol: {
    type: String,
    required: true,
    unique: false,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  beerImg: {
    publicId: String,
    size: Number,
    format: String,
    url: String,
  },
  probada: {
    type: Boolean,
    required: false,
    unique: false,
  },
});

export const BeerModel = model('Beers', beerSchema, 'beers');

beerSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwd;
  },
});
