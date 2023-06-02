import Router from 'koa-router'
import PostController from '../controller/post.controller';
import { authenticated } from '../middleware/auth.middleware';

const router = new Router();
const postController = new PostController;

router.get('/posts',authenticated, postController.getAll.bind(postController));
router.get('/postById/:id',authenticated, postController.getPostById.bind(postController));
router.get('/postByTitle',authenticated, postController.getPostByTitle.bind(postController));
router.get('/postByAuthorId/:authorId',authenticated, postController.getByAuthorId.bind(postController));
router.delete('/post/:id',authenticated, postController.deletePost.bind(postController))
router.put('/post/:id',authenticated, postController.updatePost.bind(postController));
router.put('/post/:id/views',authenticated, postController.view.bind(postController));
router.post('/createPost',authenticated , postController.createPost.bind(postController));

export default router;