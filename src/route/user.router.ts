import Router from 'koa-router'
import UserController from '../controller/user.controller';
import { authenticated } from '../middleware/auth.middleware';

const router = new Router();
const userController = new UserController();

router.get('/users',authenticated , userController.getAllUsers.bind(userController));
router.get('/user/:id',authenticated, userController.getUserById.bind(userController));
router.post('/user', userController.createUser.bind(userController));
router.post('/signup',authenticated, userController.signup.bind(userController));
router.delete('/user/:id',authenticated, userController.deleteUser.bind(userController));
router.put('/user/:id',authenticated, userController.updateUser.bind(userController));
router.post('/user/login', userController.login.bind(userController));
router.get('/send', userController.sendPasswordResetEmail.bind(userController));
router.patch('/resetPassword/:resetToken', userController.resetPasswordHandler.bind(userController));

router.get('/users/posts',authenticated, userController.getUserPostCount.bind(userController));

export default router;