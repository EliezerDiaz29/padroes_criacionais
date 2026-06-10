import Payments from "../interfaces/Payments.js";

export default class CreditCardPayment extends Payments {

    constructor() {
        super();
        this.tipo = "CARTÃO";
    }

    proceso(valor) {
        console.log(`Pagamento com cartão: R$ ${valor}`);
    }
}