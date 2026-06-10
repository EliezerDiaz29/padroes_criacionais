import { Router } from "express";
import OrderController from "../controllers/OrderControllers.js";

const router = Router();

router.post(
    "/orders",
    OrderController.create
);

router.get(
    "/orders",
    OrderController.findAll
);

router.get(
    "/orders/:id",
    OrderController.findById
);

router.delete(
    "/orders/:id",
    OrderController.delete
);

router.put(
    "/orders/:id",
    OrderController.update
);

export default router;