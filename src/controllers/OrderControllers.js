import PaymentFactory from "../factories/PaymentFactory.js";
import OrderBuilder from "../builders/OrderBuilder.js";
import OrderRepository from "../repositories/OrderRepository.js";

export default class OrderController {

    static nextId = 1;

    static create(req, res) {
        try {
            const builder = new OrderBuilder();
    
            req.body.products.forEach(
                product => builder.addProduct(product)
            );
    
            const order = builder
                .setAddress(req.body.address)
                .setPaymentMethodType(req.body.paymentMethod.type)
                .build();
    
            order.id = OrderController.nextId++;
            OrderRepository.save(order);
    
            return res.status(201).json(order);
    
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

    static findAll(req, res) {

        return res.json(
            OrderRepository.findAll()
        );
    }

    static findById(req, res) {

        const order =
            OrderRepository.findById(
                req.params.id
            );

        if (!order) {

            return res.status(404).json({
                message:
                    "Pedido não encontrado"
            });
        }

        return res.json(order);
    }

    static update(req, res) {
    try {
        const order = OrderRepository.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Pedido não encontrado"
            });
        }

        const builder = new OrderBuilder();

        req.body.products.forEach(
            product => builder.addProduct(product)
        );

        const updatedOrder = builder
            .setAddress(req.body.address)
            .setPaymentMethodType(req.body.paymentMethod.type)
            .build();

        updatedOrder.id = order.id;

        OrderRepository.update(updatedOrder);

        return res.status(200).json(updatedOrder);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}
    static delete(req, res) {

        const deleted =
            OrderRepository.delete(
                req.params.id
            );

        if (!deleted) {

            return res.status(404).json({
                message:
                    "Pedido não encontrado"
            });
        }

        return res.json({
            message:
                "Pedido excluido corretamente"
        });
    }

}