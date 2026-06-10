import Payments from "../interfaces/Payments.js";

export default class PixPayment extends Payments {

    constructor() {
        super();
        this.tipo = "PIX";
    }

    proceso(valor) {
        console.log(`Pagamento com PIX: R$ ${valor}`);
    }
}