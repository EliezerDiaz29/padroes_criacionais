export default class Order {

    constructor(products, address, paymentMethod) {

        this.products = products;
        this.address = address;
        this.paymentMethod = paymentMethod;
    }

    toJSON() {
        return {
            id: this.id,
            products: this.products,
            address: this.address,
            paymentMethod: this.paymentMethod.tipo
        };
    }
}