export default class OrderRepository {
    static orders = []

    static findAll() {  

        return this.orders;
    }

    static findById(id) {

        return this.orders.find(order => order.id == id);
    }

    static save(order) {

        this.orders.push(order);
        return order;
    }

    static update(updatedOrder) {
        const orderPosition = this.orders.findIndex(
            order => order.id == updatedOrder.id
        );
    
        if (orderPosition === -1) {
            return false;
        }
    
        this.orders[orderPosition] = updatedOrder;
        return true;
    }

    static delete(id) {

        const orderPosition = this.orders.findIndex(order => order.id == id);

        if(orderPosition == -1) {
            return false;
        }

        this.orders.splice(orderPosition, 1);
        
        return true;

    }
}