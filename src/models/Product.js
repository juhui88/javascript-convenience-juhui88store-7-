class Product {
  constructor(name, price, quantity, promotion) {
    this.name = name;
    this.price = Number(price);
    this.quantity = Number(quantity);
    this.promotion = this.isNull(promotion);
  }
  hasSufficientQuantity(buyQuantity) {
    return this.quantity >= buyQuantity;
  }
  reduceQuantity(amount) {
    this.quantity -= amount;
  }
  isNull(promotion) {
    if (promotion === "null") return null;
    return promotion;
  }
  getFormatQtyAndPromotion() {
    if (this.quantity === 0) return ["재고 없음", ""];
    if (this.promotion === null) return [this.quantity, ""];
    return [this.quantity, this.promotion];
  }
}

export default Product;
