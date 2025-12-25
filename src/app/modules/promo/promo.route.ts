import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { PromoValidation } from './promo.validation';
import { PromoController } from './promo.controller';

const router = express.Router();

router
  .route('/')
  .post(
    auth(USER_ROLES.BUSINESS, USER_ROLES.SUPER_ADMIN , USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
    // auth(USER_ROLES.USER),
    validateRequest(PromoValidation.createZodSchema),
    PromoController.create
  )

router
  .route('/')
  .get(
    // auth(USER_ROLES.BUSINESS),
    auth(USER_ROLES.USER),
    PromoController.getById)
  .patch(
    // auth(USER_ROLES.BUSINESS, USER_ROLES.SUPER_ADMIN , USER_ROLES.SUPER_ADMIN),
    auth(USER_ROLES.USER),
    validateRequest(PromoValidation.updateZodSchema),
    PromoController.update
  )
  .delete(
    // auth(USER_ROLES.BUSINESS),
    auth(USER_ROLES.USER),
    PromoController.remove);

export const PromoRoutes = router;


