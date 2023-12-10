import mongoose from 'mongoose';
import { pubSchema } from './pubs.mongo.model.js';

describe('When...', () => {
  describe('should', () => {
    test('should create pubSchema with all required fields', () => {
      const mockPubsModel = mongoose.model('Pubs', pubSchema);
      const document = {
        id: '1',
        name: 'Pub 1',
        direction: '123 Main St',
        owner: 'John Doe',
        beers: [],
      };
      // eslint-disable-next-line new-cap
      const userDocument = new mockPubsModel(document);
      const returnedObject = userDocument.toJSON();
      expect(returnedObject._id).toBeUndefined();
    });
  });
});
