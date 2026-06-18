import Payments from "../interfaces/Payments.js";

export class PaymentDecorator extends Payments {
    constructor(pagamento) {
        super();
        this.pagamento = pagamento;
        this.tipo      = pagamento.tipo;
    }

    proceso(valor) {
        this.pagamento.proceso(valor);
    }
}

export class LogDecorator extends PaymentDecorator {
    proceso(valor) {
        console.log(`[LOG] Iniciando transação — Método: ${this.tipo} | Valor: R$ ${valor.toFixed(2)}`);
        super.proceso(valor);
        console.log(`[LOG] Transação concluída — Método: ${this.tipo}`);
    }
}

export class DescontoDecorator extends PaymentDecorator {
    constructor(pagamento, percentual) {
        super(pagamento);
        this.percentual = percentual;
    }

    proceso(valor) {
        const desconto         = valor * (this.percentual / 100);
        const valorComDesconto = valor - desconto;
        console.log(`[DESCONTO] ${this.percentual}% aplicado — De R$ ${valor.toFixed(2)} para R$ ${valorComDesconto.toFixed(2)}`);
        super.proceso(valorComDesconto);
    }
}