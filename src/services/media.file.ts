/* eslint-disable camelcase */
import { v2 as cloudinary } from 'cloudinary';
import createDebug from 'debug';
import { ImgData } from '../types/imgFiles.js';
import { HttpError } from '../types/http.error.js';

const debug = createDebug('W9Final:media.files');

export class MediaFiles {
  constructor() {
    // Cloudinary.config({
    //   cloud_name: 'dv0kwrjox',
    //   api_key: '992654134475157',
    //   api_secret: process.env.CLOUDINARY_SECRET,
    // }); ESTO ES UN ALTERNATIVA

    cloudinary.config({
      secure: true,
    });
    debug('Instantiated');
    debug('Key:', process.env.CLOUDINARY_KEY);
  }

  async uploadImage(imagePath: string) {
    try {
      const uploadApiRespones = await cloudinary.uploader.upload(imagePath, {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });
      const imgData: ImgData = {
        url: uploadApiRespones.url,
        publicId: uploadApiRespones.public_id,
        size: uploadApiRespones.bytes,
        height: uploadApiRespones.height,
        With: uploadApiRespones.width,
        format: uploadApiRespones.format,
      };
      return imgData;
    } catch (error) {
      throw new HttpError(406, 'Not aceptable', (error as Error).message);
    }
  }
}
