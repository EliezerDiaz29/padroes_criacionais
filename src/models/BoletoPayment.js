import Payments from "../interfaces/Payments.js";

export default class BoletoPayment extends Payments {

    constructor() {
        super();
        this.tipo = "BOLETO";
    }

    proceso(valor) {
        console.log(`Pagamento com boleto: R$ ${valor}`);
    }
}