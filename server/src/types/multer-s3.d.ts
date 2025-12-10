import { File } from "multer";

export interface S3File extends File {
  location: string;
  key: string;
  bucket: string;
  etag: string;
}
