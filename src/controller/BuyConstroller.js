import DataLoader from "../utils/DataLoader.js";

class BuyController {
  #promotions = DataLoader.getPromotions("./public/promotions.md");
  constructor(buyList) {
    this.buyList = buyList;
    this.freeQty = 0;
    this.remainQty = this.getTotalQty();
  }

  getTotalQty() {
    return this.buyList.reduce((total, product) => total + product.quantity, 0);
  }

  run() {
    for (product of this.buyList) {
      const promotion = this.findPromotion(product.promotion);
      console.log(product);
    }
  }

  findPromotion(name) {
    return this.#promotions.find((promo) => promo.name === name);
  }
}

export default BuyController;
