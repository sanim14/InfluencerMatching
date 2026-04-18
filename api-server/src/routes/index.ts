import { Router, type IRouter } from "express";
import healthRouter from "./health";
import influencerRouter from "./influencer";

const router: IRouter = Router();

router.use(healthRouter);
router.use(influencerRouter);

export default router;
