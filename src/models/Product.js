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
    let quantityString = `${this.quantity}개`;
    let promotionString = this.promotion;
    if (this.quantity === 0) quantityString = `재고 없음`;
    if (this.promotion === null) promotionString = "";
    return [quantityString, promotionString];
  }
}

export default Product;
