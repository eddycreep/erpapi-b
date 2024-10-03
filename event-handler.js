class PizzaShop {
    constructor() {
        this.orderNumber = 0;
    }

    order() {
        this.orderNumber++;
    }

    showOrder() {
        console.log(`the order number is......${this.orderNumber}`);
    }
}

module.exports = PizzaShop;