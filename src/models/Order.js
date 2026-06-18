export default class Order {
  constructor(products, address, paymentMethod) {
    this.products = products;
    this.address = address;
    this.paymentMethod = paymentMethod;
    this.status = "PENDENTE";
    this._observers = [];
  }

  registrarObserver(observer) {
    this._observers.push(observer);
  }

  removerObserver(observer) {
    this._observers = this._observers.filter((o) => o !== observer);
  }

  notificar() {
    this._observers.forEach((o) => o.atualizar(this));
  }

  setStatus(novoStatus) {
    this.status = novoStatus;
    this.notificar();
  }

  toJSON() {
    return {
      id: this.id,
      products: this.products,
      address: this.address,
      paymentMethod: this.paymentMethod.tipo,
      status: this.status,
    };
  }
}
