import multer from 'multer';
// Use memory storage for buffer processing
const storage = multer.memoryStorage();
export const upload = multer({ storage });