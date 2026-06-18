import OrderRepository from "../repositories/OrderRepository.js";

class EstoqueService {
    verificar(pedido) {
        console.log(`[Estoque] Verificando ${pedido.products.length} produto(s)...`);
        return true;
    }
    baixar(pedido) {
        console.log(`[Estoque] Baixa realizada: ${pedido.products.join(", ")}`);
    }
}

class PagamentoService {
    processar(pedido, valor) {
        console.log(`[Pagamento] Processando R$ ${valor.toFixed(2)} via ${pedido.paymentMethod.tipo}...`);
        pedido.paymentMethod.proceso(valor);
    }
}

class CarrinhoService {
    limpar(pedido) {
        console.log(`[Carrinho] Carrinho do pedido #${pedido.id} limpo.`);
    }
}

class EmailService {
    enviarConfirmacao(pedido) {
        console.log(`[Email] Confirmação do pedido #${pedido.id} enviada ao cliente.`);
    }
}

const estoque   = new EstoqueService();
const pagamento = new PagamentoService();
const carrinho  = new CarrinhoService();
const email     = new EmailService();

export default class CheckoutController {

    static finalizar(req, res) {
        try {
            const order = OrderRepository.findById(req.params.id);
            if (!order) return res.status(404).json({ message: "Pedido não encontrado" });

            const valor = req.body.valor ?? 100.00;

            console.log(`\n[Checkout] Iniciando finalização do pedido #${order.id}...`);

            if (!estoque.verificar(order)) {
                return res.status(400).json({ message: "Produto(s) fora de estoque." });
            }

            pagamento.processar(order, valor);
            estoque.baixar(order);
            carrinho.limpar(order);
            email.enviarConfirmacao(order);

            order.setStatus("CONFIRMADO");

            console.log(`[Checkout] Pedido #${order.id} finalizado.\n`);

            return res.json({ sucesso: true, pedidoId: order.id, status: order.status });

        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}