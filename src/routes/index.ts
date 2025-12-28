import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { MemberShipPlanRoutes } from '../app/modules/membershipPlan/membershipPlan.route';
import { MemberShipFeatureRoutes } from '../app/modules/membershipPlan/memberShipFeatures/memberShipFeatures.route';
import { MemberShipApplicationRoutes } from '../app/modules/membershipApplication/membershipApplication.route';
import { SponsorRoutes } from '../app/modules/sponsor/sponsor.route';
import { PartnerOfferRoutes } from '../app/modules/partnerOffer/partnerOffer.route';
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
    path: '/membership-plan',
    route: MemberShipPlanRoutes,
  },
  {
    path: '/membership-feature',
    route: MemberShipFeatureRoutes,
  },
  {
    path: '/membership-application',
    route: MemberShipApplicationRoutes,
  },
  {
    path: '/sponsor',
    route: SponsorRoutes,
  },
  {
    path: '/partner-offer',
    route: PartnerOfferRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
