import Carrinho, { FreteCorreios, FreteJadlog, FreteRetirada } from "../models/Carrinho.js";

const estrategias = {
    CORREIOS: new FreteCorreios(),
    JADLOG:   new FreteJadlog(),
    RETIRADA: new FreteRetirada(),
};

export default class CarrinhoController {

    static calcular(req, res) {
        try {
            const { itens, frete } = req.body;

            if (!itens || itens.length === 0) {
                return res.status(400).json({ message: "Informe ao menos um item." });
            }

            const estrategia = estrategias[frete?.toUpperCase()];
            if (!estrategia) {
                return res.status(400).json({ message: "Frete inválido. Use: CORREIOS, JADLOG ou RETIRADA." });
            }

            const carrinho = new Carrinho(estrategia);
            itens.forEach(({ nome, peso, preco }) => carrinho.adicionarItem(nome, peso, preco));

            const subtotal   = itens.reduce((acc, i) => acc + i.preco, 0);
            const freteCusto = carrinho.calcularFrete();
            const total      = subtotal + freteCusto;

            return res.json({
                transportadora: frete.toUpperCase(),
                subtotal:       parseFloat(subtotal.toFixed(2)),
                frete:          parseFloat(freteCusto.toFixed(2)),
                total:          parseFloat(total.toFixed(2))
            });

        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}