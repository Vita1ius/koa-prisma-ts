import Router from 'koa-router'
import PostController from '../controller/post.controller';
import { authenticated } from '../middleware/auth.middleware';

const router = new Router();
const postController = new PostController;

router.get('/posts', postController.getAll.bind(postController));
router.get('/postById/:id', postController.getPostById.bind(postController));
router.get('/postByTitle', postController.getPostByTitle.bind(postController));
router.get('/postByAuthorId/:authorId', postController.getByAuthorId.bind(postController));
router.delete('/post/:id', postController.deletePost.bind(postController))
router.put('/post/:id', postController.updatePost.bind(postController));
router.put('/post/:id/views', postController.view.bind(postController));
router.post('/createPost',authenticated , postController.createPost.bind(postController));

export default router;