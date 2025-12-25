import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { ContactValidation } from './contact.validation';
import { ContactController } from './contact.controller';

const router = express.Router();

router
  .route('/')
  .post(
    validateRequest(ContactValidation.createZodSchema),
    ContactController.create
  )
  .get(
    // auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    auth(USER_ROLES.USER),
    ContactController.getAll
  );

router
  .route('/:id')
  .get(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), ContactController.getById)
  .patch(
    // auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    auth(USER_ROLES.USER),
    validateRequest(ContactValidation.updateZodSchema),
    ContactController.update
  )
  .delete(
    // auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN)
    auth(USER_ROLES.USER),
    ContactController.remove);

export const ContactRoutes = router;


