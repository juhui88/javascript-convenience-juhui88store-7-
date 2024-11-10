class Product {
  constructor(name, price, quantity, promotion) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.promotion = promotion;
  }
  hasSufficientQuantity(buyQuantity) {
    return this.quantity >= buyQuantity;
  }
  reduceQuantity(amount) {
    this.quantity -= amount;
  }
}

export default Product;
