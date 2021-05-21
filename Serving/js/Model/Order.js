class Order {
    constructor(id, orderNo, cusID) {
        this.id = id;
        this.orderNo = orderNo;
        this.cusID = cusID;
        this.foodItems = [];
    }

    addOrderItem(foodItem) {
        this.foodItems.push(foodItem);
    }
}