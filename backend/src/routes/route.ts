import {Router} from "express";

import authRoutes from "./auth.routes";
import googleRoutes from "./google.route";
import healthCheckRoutes from "../helthCheck/healthCheck.routes";
import chatRoutes from "./chat.route";
import messageRoutes from "./message.route";
import error404Routes from "./error404.route";

const router = Router();

router.use("/api/auth", authRoutes);
router.use("/api/auth", googleRoutes);
router.use("/api", healthCheckRoutes);
router.use("/api", chatRoutes);
router.use("/api", messageRoutes);
router.use("/", error404Routes);

export default router;
