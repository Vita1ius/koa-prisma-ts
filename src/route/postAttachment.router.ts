import Router from 'koa-router'
import PostAttachmentController from '../controller/post-attachment.controller';
import { authenticated } from '../middleware/auth.middleware';
const multer = require('@koa/multer');

const router = new Router();
const postAttachmentController = new PostAttachmentController;

const storage = multer.memoryStorage();

const fileFilter = (req:any, file:any, cb:any) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    //cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
    cb(new Error('wrong type'), false);
  }
};

// ["image", "jpeg"]
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000000, files: 4 },
});

router.post('/upload',authenticated,upload.array("file"), postAttachmentController.upload.bind(postAttachmentController));
router.get('/getImages/:postId',authenticated, postAttachmentController.getImages.bind(postAttachmentController));
router.delete('/deleteImage/:id',authenticated, postAttachmentController.deleteImageById.bind(postAttachmentController));

export default router;