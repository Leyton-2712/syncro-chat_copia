import type{ Request, Response } from "express";

const healthCheckController = (req: Request, res: Response) => {
    res.send({
        message: "ok",
        status: 200,
    });
};
export default healthCheckController;
