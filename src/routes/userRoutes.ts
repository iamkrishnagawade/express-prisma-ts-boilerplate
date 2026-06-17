import { Router } from 'express';
import { validate } from '../middlewares/validateMiddleware.js';
import { createUserSchema, updateUserSchema, userIdParamSchema } from '../schemas/userSchema.js';
import {
  createUser,
  getUserById,
  getUsers,
  deleteUser,
  updateUser,
} from '../controllers/userController.js';

const router = Router();

router.route('/').get(getUsers).post(validate(createUserSchema), createUser);

router
  .route('/:id')
  .get(validate(userIdParamSchema), getUserById)
  .patch(validate(updateUserSchema), updateUser)
  .delete(validate(userIdParamSchema), deleteUser);

export default router;
