import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { BusinessRequestValidation } from './businessRequest.validation';
import { BusinessRequestController } from './businessRequest.controller';

const router = express.Router();

router
  .route('/')
  .post(
    auth(USER_ROLES.USER, USER_ROLES.BUSINESS, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    validateRequest(BusinessRequestValidation.createZodSchema),
    BusinessRequestController.create
  )
  .get(
    // auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    auth(USER_ROLES.USER),
    BusinessRequestController.getAll
  );

router
  .route('/:id')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    BusinessRequestController.getById
  )
  .patch(
    auth(USER_ROLES.USER),
    // auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    validateRequest(BusinessRequestValidation.updateZodSchema),
    BusinessRequestController.update
  )
  .delete(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    BusinessRequestController.remove
  );

export const BusinessRequestRoutes = router;


