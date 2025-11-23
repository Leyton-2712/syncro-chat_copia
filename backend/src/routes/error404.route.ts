import {Router} from "express";
const router = Router();
//al no poner la ubicacion estamos diciendo que cualquier ruta que no tengamos le decimos ruta no encontrada
router.use((req,res)=>{
    res.status(404).json({
        message: "Error 404: Ruta no encontrada",
        status: 404,
        path: req.path
    });
});

export default router;
