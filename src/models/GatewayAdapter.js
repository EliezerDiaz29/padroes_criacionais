import Payments from "../interfaces/Payments.js";

class GatewayLegado {
    efetuarCobranca(quantia, moeda) {
        console.log(`[GatewayLegado] Cobrança efetuada: ${moeda} ${quantia.toFixed(2)}`);
    }
}

export default class GatewayAdapter extends Payments {
    constructor() {
        super();
        this.tipo    = "GATEWAY_LEGADO";
        this.gateway = new GatewayLegado();
    }

    proceso(valor) {
        this.gateway.efetuarCobranca(valor, "BRL");
    }
}