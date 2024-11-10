import ERROR_MESSAGE from "../constants/ErrorMessage.js";
import ANSWER from "../constants/InputMessage.js";
import AnswerValidator from "../utils/AnswerValidator.js";
import DataLoader from "../utils/DataLoader.js";
import InputView from "../views/InputView.js";

class BuyController {
  #promotions = DataLoader.getPromotions("./public/promotions.md");

  constructor(buyProducts, buyQuantity) {
    this.buyProducts = this.#sortByPromotion(buyProducts);
    this.freeQty = 0;
    this.buyQuantity = buyQuantity;
    this.remainQty = buyQuantity;
    this.nonPromotionQtys = [];
  }

  async run() {
    for (const product of this.buyProducts) {
      const promotion = this.findPromotion(product.promotion);

      if (promotion !== undefined && promotion.isApplicable()) {
        this.#applyPromotion(product, promotion);
        const result = await this.#resultPromotionLogic(product, promotion);
        if (result !== false) return result;
      } else {
        if (this.buyProducts.length === 1) {
          product.reduceQuantity(this.buyQuantity);
          this.remainQty -= this.buyQuantity;
          return { finalQty: this.buyQuantity, freeQty };
        }

        const nonPromotionQty = this.nonPromotionQtys.reduce(
          (total, qty) => total + qty,
          0
        );
      }
    }
  }

  async #resultPromotionLogic(product, promotion) {
    if (this.remainQty === 0) {
      return {
        finalQty: this.buyQuantity,
        freeQty,
      };
    }
    if (this.remainQty > product.quantity) {
      this.nonPromotionQtys.push(this.remainQty);
      return false;
    }
    if (
      this.remainQty === promotion.buy &&
      this.remainQty <= product.quantity
    ) {
      return await this.#confirmAdditionalPromotion(product, promotion);
    }
  }
  async #confirmAdditionalPromotion(product, promotion) {
    const answer = AnswerValidator.validate(
      await InputView.askAdditionalPromotion(product.name, promotion.get)
    );
    if (answer) {
      product.reduceQuantity(promotion.get);
      return {
        finalQty: this.buyQuantity + promotion.get,
        freeQty: this.freeQty + promotion.get,
      };
    } else {
      product.reduceQuantity(this.remainQty);
      return {
        finalQty: this.buyQuantity,
        freeQty: this.freeQty,
      };
    }
  }

  #sortByPromotion(products) {
    // 프로모션 있는 상품순으로 먼저 정렬
    return products.sort((a, b) => {
      if (b.promotion && !a.promotion) return 1;
      if (!b.promotion && a.promotion) return -1;
      return 0;
    });
  }

  // 프로모션 적용하여 얻을 수 있는 증정수량과 남은 수량을 계산
  #applyPromotion(product, promotion) {
    const { freeQty, promotionQty } = promotion.calculateQtyAfterPromotion(
      this.remainQty,
      product.quantity
    );
    this.freeQty += freeQty;
    this.remainQty -= promotionQty;
    product.reduceQuantity(promotionQty);
  }

  findPromotion(promotion) {
    return this.#promotions.find((promo) => promo.name === promotion);
  }
}

export default BuyController;
