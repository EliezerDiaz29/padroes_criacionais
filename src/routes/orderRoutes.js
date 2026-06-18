import { Router } from "express";
import OrderController from "../controllers/OrderControllers.js";
import CheckoutController from "../controllers/CheckoutController.js";
import CarrinhoController from "../controllers/CarrinhoController.js";

const router = Router();

router.post("/orders", OrderController.create);
router.get("/orders", OrderController.findAll);
router.get("/orders/:id", OrderController.findById);
router.put("/orders/:id", OrderController.update);
router.delete("/orders/:id", OrderController.delete);

router.post("/orders/:id/pagar", OrderController.pagar);
router.post("/orders/:id/checkout", CheckoutController.finalizar);
router.post("/orders/:id/cancelar", OrderController.cancelar);
router.post("/orders/:id/endereco", OrderController.atualizarEndereco);
router.post("/orders/desfazer", OrderController.desfazer);

router.post("/carrinho/calcular", CarrinhoController.calcular);

export default router;
