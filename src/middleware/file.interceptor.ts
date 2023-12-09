import { NextFunction, Request, Response } from 'express';
// eslint-disable-next-line no-unused-vars
import randomUUID from 'crypto';
import multer from 'multer';

export class FileInterceptor {
  singleFileStore(fileName = 'file', fileSize = 8_000_000) {
    const options: multer.Options = {
      // Temp dest: 'uploads',
      storage: multer.diskStorage({
        destination: './public/uploads',
        filename(_req, file, callback) {
          // No sonar
          const prefix = crypto.randomUUID();
          callback(null, prefix + '-' + file.originalname);
        },
      }),
      limits: { fileSize },
    };

    const middleware = multer(options).single(fileName);
    return (req: Request, res: Response, next: NextFunction) => {
      const previousBody = req.body;
      middleware(req, res, next);

      req.body = { ...previousBody, ...req.body };
    };
  }
}
