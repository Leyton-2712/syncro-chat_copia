import Router  from "express";
import healthCheckController from "./healthCheck.controller";

const router = Router();

router.get("/healthCheck", healthCheckController);

export default router;