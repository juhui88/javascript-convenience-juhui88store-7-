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
        const promotionResult = await this.#getResultPromotionLogic(
          product,
          promotion
        );

        if (promotionResult !== false) return promotionResult;
      }
      const nonPromotionResult = await this.#getResultNonPromotionLogic(
        product
      );
      if (nonPromotionResult !== false) return nonPromotionResult;
    }
  }

  async #getResultNonPromotionLogic(product) {
    if (product.hasSufficientQuantity(this.remainQty)) {
      product.reduceQuantity(this.remainQty);
      return {
        price: product.price,
        finalQty: this.buyQty,
        freeQty: this.freeQty,
        promotionQty: this.buyQty - this.remainQty,
      };
    }

    if (this.freeQty === 0) {
      this.remainQty -= product.quantity;
      product.reduceQuantity(product.quantity);

      return false;
    }

    return await this.#confirmBuyNonPromotion(product);
  }

  async #confirmBuyNonPromotion(product) {
    const answer = AnswerValidator.validate(
      await InputView.askBuyNonPromotion(product.name, this.remainQty)
    );

    if (answer) {
      return this.#reAdjustQty(product);
    } else {
      return {
        price: product.price,
        finalQty: this.buyQty - this.remainQty,
        freeQty: this.freeQty,
        promotionQty: this.buyQty - this.remainQty,
      };
    }
  }

  async #reAdjustQty(product) {
    const nonPromotionQty = this.remainQty;
    for (let i = 0; i <= this.buyProducts.length; i++) {
      if (this.buyProducts[i].hasSufficientQuantity(this.remainQty)) {
        this.buyProducts[i].reduceQuantity(this.remainQty);
        this.remainQty -= this.remainQty;
      } else {
        this.remainQty -= this.buyProducts[i].quantity;
        this.buyProducts[i].reduceQuantity(this.buyProducts[i].quantity);
      }
      if (this.remainQty <= 0)
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
    if (this.remainQty < promotion.buy)
      return await this.#confirmBuyNonPromotion(product);
    if (this.remainQty > product.quantity) return false;
    if (
      this.remainQty === promotion.buy &&
      this.remainQty + promotion.get <= product.quantity
    ) {
      return await this.#confirmAdditionalPromotion(product, promotion);
    }
    return false;
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
        promotionQty: this.buyQty + promotion.get,
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
