import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { BusinessValidation } from './business.validation';
import { BusinessController } from './business.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

router
  .route('/')
  .post(
    fileUploadHandler(),
    // auth(USER_ROLES.ADMIN,USER_ROLES.BUSINESS,USER_ROLES.SUPER_ADMIN),
    auth(USER_ROLES.BUSINESS),
    validateRequest(BusinessValidation.createZodSchema),
    BusinessController.create
  )
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.BUSINESS, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
    BusinessController.getAll
)

router
  .route('/my-business')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.BUSINESS, USER_ROLES.SUPER_ADMIN),
    // auth(USER_ROLES.USER),
    BusinessController.myBusiness
)

router
  .route('/:id')
  .patch(
    fileUploadHandler(),
    auth(USER_ROLES.ADMIN, USER_ROLES.BUSINESS, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
    BusinessController.update
  )
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.BUSINESS, USER_ROLES.SUPER_ADMIN),
    // auth(USER_ROLES.USER),
    BusinessController.getById
  )

router
  .route('/user/:id')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.BUSINESS, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
    BusinessController.getBusnessById
  )

//   .delete(
//     auth(USER_ROLES.USER),
//     BusinessController.remove
//   );

// router
//   .route('/admin')
//   .get(
//     auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
//     BusinessController.getAll
//   );



export const BusinessRoutes = router;
