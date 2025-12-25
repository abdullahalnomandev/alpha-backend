import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { PreferenceRoutes } from '../app/modules/Preference/preferences.route';
import { ContactRoutes } from '../app/modules/contact/contact.route';
import { BusinessRequestRoutes } from '../app/modules/businessRequest/businessRequest.route';
import { PromoRoutes } from '../app/modules/promo/promo.route';
import { BusinessRoutes } from '../app/modules/business/business.route';
const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/preference',
    route: PreferenceRoutes,
  },
  {
    path: '/contact',
    route: ContactRoutes,
  },
  {
    path: '/business-request',
    route: BusinessRequestRoutes,
  },
  {
    path: '/promo',
    route: PromoRoutes,
  },
  {
    path: '/business',
    route: BusinessRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
