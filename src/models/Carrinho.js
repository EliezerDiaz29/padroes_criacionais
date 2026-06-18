class EstrategiaFrete {
    calcular(peso) {
        throw new Error("Implemente calcular(peso).");
    }
}

export class FreteCorreios extends EstrategiaFrete {
    calcular(peso) {
        const valor = 5.00 + (peso * 1.50);
        console.log(`[Correios] Frete para ${peso}kg: R$ ${valor.toFixed(2)}`);
        return valor;
    }
}

export class FreteJadlog extends EstrategiaFrete {
    calcular(peso) {
        const valor = 8.00 + (peso * 1.00);
        console.log(`[Jadlog] Frete para ${peso}kg: R$ ${valor.toFixed(2)}`);
        return valor;
    }
}

export class FreteRetirada extends EstrategiaFrete {
    calcular(peso) {
        console.log(`[Retirada] Retirada na loja — Frete: R$ 0,00`);
        return 0;
    }
}

export default class Carrinho {
    constructor(estrategiaFrete = null) {
        this.itens           = [];
        this.estrategiaFrete = estrategiaFrete;
    }

    setFrete(estrategia) {
        this.estrategiaFrete = estrategia;
        return this;
    }

    adicionarItem(nome, peso, preco) {
        this.itens.push({ nome, peso, preco });
        return this;
    }

    calcularFrete() {
        if (!this.estrategiaFrete) throw new Error("Nenhuma estratégia de frete definida.");
        const pesoTotal = this.itens.reduce((acc, item) => acc + item.peso, 0);
        return this.estrategiaFrete.calcular(pesoTotal);
    }

    calcularTotal() {
        const subtotal = this.itens.reduce((acc, item) => acc + item.preco, 0);
        const frete    = this.calcularFrete();
        const total    = subtotal + frete;
        console.log(`[Carrinho] Subtotal: R$ ${subtotal.toFixed(2)} | Frete: R$ ${frete.toFixed(2)} | Total: R$ ${total.toFixed(2)}`);
        return total;
    }
}