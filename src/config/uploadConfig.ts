import * as multer from 'multer';
import { extname, resolve } from 'path';

export default function upload(folder: any) {
    return {
      storage: multer.diskStorage({
        destination: resolve(__dirname, "..", folder),
        filename: (req, file, callback) => {
          let fileName = `${Date.now() + "_" + file.originalname}`;
          fileName = fileName.replace(/\s/g, "_");;
          return callback(null, fileName);
        }
      }),
      fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg")
          return cb(null, true);
        else {
          req.errorFile = 'Only .png, .jpg and .jpeg format allowed!';
          return cb(null, false);
        }
      }
    }
  }

