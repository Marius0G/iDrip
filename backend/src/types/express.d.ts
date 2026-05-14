declare namespace Express {
  interface Request {
    userId?: string;
    userEmail?: string;
    userName?: string;
    file?: Express.Multer.File;
    files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
  }
}
