import Order from "../models/Order.js";
import PaymentFactory from "../factories/PaymentFactory.js";

export default class OrderBuilder {

    constructor() {
        this.products = [];
        this.address = null;
        this.paymentMethodType = null;
    }

    addProduct(product) {
        const exists = this.products.some(
            prod => prod.toLowerCase() === product.toLowerCase()
        );

        if (exists) {
            throw new Error("Este produto ja foi adicionado ao pedido");
        }

        this.products.push(product);
        return this;
    }

    setAddress(address) {
        this.address = address;
        return this;
    }

    setPaymentMethodType(type) {
        this.paymentMethodType = type;
        return this;
    }

    build() {
        if (this.products.length === 0) {
            throw new Error("O pedido deve conter pelo menos um produto");
        }

        if (!this.address) {
            throw new Error("O endereço de entrega é obrigatório");
        }

        if (!this.paymentMethodType || this.paymentMethodType.trim() === "") {
            throw new Error("Deve selecionar um método de pagamento válido");
        }

        const paymentMethod = PaymentFactory.criar(this.paymentMethodType);

        return new Order(
            this.products,
            this.address,
            paymentMethod
        );
    }
}