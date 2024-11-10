import ERROR_MESSAGE from "../constants/ErrorMessage.js";
import ANSWER from "../constants/InputMessage.js";
import AnswerValidator from "../utils/AnswerValidator.js";
import DataLoader from "../utils/DataLoader.js";
import InputView from "../views/InputView.js";

class BuyController {
  #promotions = DataLoader.getPromotions("./public/promotions.md");

  constructor(buyProducts, buyQty) {
    this.buyProducts = this.#sortByPromotion(buyProducts);
    this.freeQty = 0;
    this.buyQty = Number(buyQty);
    this.remainQty = Number(buyQty);
  }

  async run() {
    for (const product of this.buyProducts) {
      const promotion = this.findPromotion(product.promotion);

      if (promotion !== undefined && promotion.isApplicable()) {
        this.#applyPromotion(product, promotion);
        const result = await this.#getResultPromotionLogic(product, promotion);

        if (result !== false) return result;
      } else {
        return await this.#getResultNonPromotionLogic(product);
      }
    }
  }

  async #getResultNonPromotionLogic(product) {
    if (this.buyProducts.length === 1) {
      product.reduceQuantity(this.buyQty);
      return {
        price: product.price,
        finalQty: this.buyQty,
        freeQty: this.freeQty,
        promotionQty: this.buyQty - this.remainQty,
      };
    }

    return await this.#confirmBuyNonPromotionL(product);
  }

  async #confirmBuyNonPromotionL(product) {
    const answer = AnswerValidator.validate(
      await InputView.askBuyNonPromotion(product.name, this.remainQty)
    );

    if (answer) {
      return this.#reAdjustQty(product);
    } else {
      return {
        price: product.price,
        finalQty: this.buyQty - remainQty,
        freeQty: this.freeQty,
        promotionQty: this.buyQty - this.remainQty,
      };
    }
  }

  async #reAdjustQty(product) {
    const nonPromotionQty = this.remainQty;
    for (let i = 0; i <= this.buyProducts.length; i++) {
      if (this.remainQty >= this.buyProducts[i].quantity) {
        this.remainQty -= this.buyProducts[i].quantity;
        this.buyProducts[i].reduceQuantity(this.buyProducts[i].quantity);
      } else {
        this.buyProducts[i].reduceQuantity(this.remainQty);
        this.remainQty -= this.remainQty;
      }
      if (this.remainQty === 0)
        return {
          price: product.price,
          finalQty: this.buyQty,
          freeQty: this.freeQty,
          promotionQty: this.buyQty - nonPromotionQty,
        };
    }
  }

  async #getResultPromotionLogic(product, promotion) {
    if (this.remainQty === 0) {
      return {
        price: product.price,
        finalQty: this.buyQty,
        freeQty: this.freeQty,
        promotionQty: this.buyQty,
      };
    }
    if (this.remainQty > product.quantity) return false;
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
      product.reduceQuantity(this.remainQty + promotion.get);
      return {
        price: product.price,
        finalQty: this.buyQty + promotion.get,
        freeQty: this.freeQty + promotion.get,
        promotionQty: this.buyQty - this.remainQty,
      };
    } else {
      product.reduceQuantity(this.remainQty);
      return {
        price: product.price,
        finalQty: this.buyQty,
        freeQty: this.freeQty,
        promotionQty: this.buyQty - this.remainQty,
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
