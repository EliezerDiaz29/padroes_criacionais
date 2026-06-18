import BoletoPayment from "../models/BoletoPayment.js";
import CreditCardPayment from "../models/CreditCardPayment.js";
import PixPayments from "../models/PixPayment.js";
import GatewayAdapter from "../models/GatewayAdapter.js";

export default class PaymentFactory {
    static criar(tipo) {
        tipo = tipo.toUpperCase();

        if (tipo === "PIX")            return new PixPayments();
        if (tipo === "BOLETO")         return new BoletoPayment();
        if (tipo === "CARTÃO")         return new CreditCardPayment();
        if (tipo === "GATEWAY_LEGADO") return new GatewayAdapter();

        throw new Error("Tipo de pagamento inválido.");
    }
}