import { Schema, model } from 'mongoose';
import { Pubs } from '../../entities/pubs.model';

export const pubSchema = new Schema<Pubs>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  direction: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: String,
    required: true,
    unique: true,
  },
  beers: [{ type: Schema.Types.ObjectId, ref: 'Beer', required: true }],
});

export const PubsModel = model('Pubs', pubSchema, 'pubs');

pubSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwd;
  },
});
