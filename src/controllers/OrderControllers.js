import OrderBuilder from "../builders/OrderBuilder.js";
import OrderRepository from "../repositories/OrderRepository.js";
import { EmailObserver, EstoqueObserver, LogObserver } from "../models/OrderObservers.js";
import { LogDecorator, DescontoDecorator } from "../models/PaymentDecorators.js";
import { CancelarPedidoComando, AtualizarEnderecoComando, GerenciadorComandos } from "../models/OrderCommands.js";

const gerenciador = new GerenciadorComandos();

export default class OrderController {

    static nextId = 1;

    static create(req, res) {
        try {
            const builder = new OrderBuilder();
            req.body.products.forEach(p => builder.addProduct(p));

            const order = builder
                .setAddress(req.body.address)
                .setPaymentMethodType(req.body.paymentMethod.type)
                .build();

            order.id = OrderController.nextId++;

            order.registrarObserver(new EmailObserver());
            order.registrarObserver(new EstoqueObserver());
            order.registrarObserver(new LogObserver());

            OrderRepository.save(order);
            return res.status(201).json(order);

        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    static findAll(req, res) {
        return res.json(OrderRepository.findAll());
    }

    static findById(req, res) {
        const order = OrderRepository.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Pedido não encontrado" });
        return res.json(order);
    }

    static update(req, res) {
        try {
            const order = OrderRepository.findById(req.params.id);
            if (!order) return res.status(404).json({ message: "Pedido não encontrado" });

            const builder = new OrderBuilder();
            req.body.products.forEach(p => builder.addProduct(p));

            const updatedOrder = builder
                .setAddress(req.body.address)
                .setPaymentMethodType(req.body.paymentMethod.type)
                .build();

            updatedOrder.id = order.id;
            OrderRepository.update(updatedOrder);
            return res.status(200).json(updatedOrder);

        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    static delete(req, res) {
        const deleted = OrderRepository.delete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Pedido não encontrado" });
        return res.json({ message: "Pedido excluido corretamente" });
    }

    static pagar(req, res) {
        try {
            const order = OrderRepository.findById(req.params.id);
            if (!order) return res.status(404).json({ message: "Pedido não encontrado" });

            const valor    = req.body.valor ?? 100.00;
            const desconto = req.body.desconto ?? 0;
            const comLog   = req.body.log !== false;

            let pagamento = order.paymentMethod;

            if (desconto > 0) pagamento = new DescontoDecorator(pagamento, desconto);
            if (comLog)       pagamento = new LogDecorator(pagamento);

            pagamento.proceso(valor);

            return res.json({
                message:  "Pagamento processado.",
                metodo:   order.paymentMethod.tipo,
                desconto: `${desconto}%`,
                log:      comLog
            });

        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    static cancelar(req, res) {
        try {
            const order = OrderRepository.findById(req.params.id);
            if (!order) return res.status(404).json({ message: "Pedido não encontrado" });

            gerenciador.executar(new CancelarPedidoComando(order));
            return res.json({ message: `Pedido #${order.id} cancelado.`, status: order.status });

        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    static atualizarEndereco(req, res) {
        try {
            const order = OrderRepository.findById(req.params.id);
            if (!order) return res.status(404).json({ message: "Pedido não encontrado" });

            gerenciador.executar(new AtualizarEnderecoComando(order, req.body.address));
            return res.json({ message: "Endereço atualizado.", address: order.address });

        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    static desfazer(req, res) {
        gerenciador.desfazerUltimo();
        return res.json({ message: "Última ação desfeita." });
    }
}