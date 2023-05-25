import Router from 'koa-router'
import UserController from '../controller/user.controller';
import { authenticated } from '../middleware/auth.middleware';

const router = new Router();
const userController = new UserController();

router.get('/users',authenticated , userController.getAllUsers.bind(userController));
router.get('/user/:id', userController.getUserById.bind(userController));
router.post('/users', userController.createUser.bind(userController));
router.post('/signup', userController.signup.bind(userController));
router.delete('/user/:id', userController.deleteUser.bind(userController));
router.put('/user/:id', userController.updateUser.bind(userController));
router.post('/user/login', userController.login.bind(userController));

export default router;