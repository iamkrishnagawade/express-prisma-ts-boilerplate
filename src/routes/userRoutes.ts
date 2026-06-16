import { Router } from 'express';
import { validate } from '../middlewares/validateMiddleware.js';
import { createUserSchema, updateUserSchema, userIdParamSchema } from '../schemas/userSchema.js';
import { createUser, getUserById, getUsers } from '../controllers/userController.js';

const router = Router();

router.route('/').get(getUsers).post(validate(createUserSchema), createUser);

router.route('/:id').get(validate(userIdParamSchema), getUserById);

export default router;
