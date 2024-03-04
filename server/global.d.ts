import { Request } from 'express';

declare module 'node-cache'
declare module 'multer-storage-cloudinary'


declare module 'express' {
    export interface Request {
        file: any;
    }
}