import BoletoPayment from "../models/BoletoPayment.js";
import CreditCardPayment from "../models/CreditCardPayment.js";
import PixPayments from "../models/PixPayment.js";

export default class PaymentFactory {
     static criar(tipo) {

        tipo = tipo.toUpperCase();

        if(tipo === "PIX") {
            return new PixPayments();
        }

        if(tipo === "BOLETO") {
            return new BoletoPayment();
        }

        if(tipo === "CARTÃO") {
            return new CreditCardPayment();
        } 
            throw new Error("Tipo de pago invalido.")
    }
}
