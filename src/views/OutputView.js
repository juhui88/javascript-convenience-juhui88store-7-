import { MissionUtils } from "@woowacourse/mission-utils";
import FormatUtils from "../utils/FormatUtils.js";
import ViewMessage from "../constants/ViewMessage.js";

class OutputView {
  static print(message) {
    MissionUtils.Console.print(message);
  }
  static printProduct(product) {
    const [productQuantity, productPromotion] =
      product.getFormatQtyAndPromotion();
    MissionUtils.Console.print(
      `- ${product.name} ${FormatUtils.formatNumberWithCommas(
        product.price
      )}원 ${productQuantity} ${productPromotion}`
    );
  }

  static printReceipt(purchasedProducts, total) {
    this.#printStoreInfo();
    purchasedProducts.forEach((product) => {
      this.#printProductBuy(product);
    });
    MissionUtils.Console.print("============ 증      정 ============");
    purchasedProducts.forEach((product) => {
      this.#printFreeQtyProduct(product);
    });

    this.#printTotalInfo(total);
  }

  static #printStoreInfo() {
    MissionUtils.Console.print("\n============주희네편의점============");
    MissionUtils.Console.print(
      `${ViewMessage.RECEIPT_MESSGE.PRODUCT_NAME.padEnd(
        ViewMessage.RECEIPT_MESSGE.PAD_END_THREE -
          ViewMessage.RECEIPT_MESSGE.PRODUCT_NAME.length
      )}${ViewMessage.RECEIPT_MESSGE.QUANTITY.padEnd(
        ViewMessage.RECEIPT_MESSGE.PAD_END_THREE -
          ViewMessage.RECEIPT_MESSGE.QUANTITY.length
      )}${ViewMessage.RECEIPT_MESSGE.PRICE.padEnd(
        ViewMessage.RECEIPT_MESSGE.PAD_END_THREE -
          ViewMessage.RECEIPT_MESSGE.PRICE.length
      )}`
    );
  }
  static #printProductBuy(product) {
    const { name, finalQty, price } = product;
    const totalProductPrice = price * finalQty;

    MissionUtils.Console.print(
      `${name.padEnd(
        ViewMessage.RECEIPT_MESSGE.PAD_END_THREE - name.length
      )}${String(finalQty).padEnd(
        ViewMessage.RECEIPT_MESSGE.PAD_END_THREE - String(finalQty).length
      )}${FormatUtils.formatNumberWithCommas(totalProductPrice).padEnd(
        ViewMessage.RECEIPT_MESSGE.PAD_END_THREE -
          FormatUtils.formatNumberWithCommas(totalProductPrice).length
      )}`
    );
  }

  static #printFreeQtyProduct(product) {
    const { name, freeQty } = product;
    if (freeQty !== 0)
      MissionUtils.Console.print(
        `${name.padEnd(
          ViewMessage.RECEIPT_MESSGE.PAD_END_THREE - name.length
        )}${String(freeQty).padEnd(
          ViewMessage.RECEIPT_MESSGE.PAD_END_THREE - String(freeQty).length
        )}`
      );
  }
  static #printTotalInfo(total) {
    MissionUtils.Console.print("=".repeat(35));
    MissionUtils.Console.print(
      `${ViewMessage.RECEIPT_MESSGE.TOTAL_PRICE.padEnd(
        ViewMessage.RECEIPT_MESSGE.PAD_END_THREE -
          ViewMessage.RECEIPT_MESSGE.TOTAL_PRICE.length
      )}${FormatUtils.formatNumberWithCommas(total.quantity).padEnd(
        ViewMessage.RECEIPT_MESSGE.PAD_END_THREE -
          FormatUtils.formatNumberWithCommas(total.quantity).length
      )}${FormatUtils.formatNumberWithCommas(total.price).padEnd(
        ViewMessage.RECEIPT_MESSGE.PAD_END_THREE -
          FormatUtils.formatNumberWithCommas(total.price).length
      )}`
    );
    MissionUtils.Console.print(
      `${ViewMessage.RECEIPT_MESSGE.PRMOTION_DISCOUNT.padEnd(
        ViewMessage.RECEIPT_MESSGE.PAD_END_TWO -
          ViewMessage.RECEIPT_MESSGE.PRMOTION_DISCOUNT.length
      )}-${FormatUtils.formatNumberWithCommas(total.promotionDiscount)}`
    );
    MissionUtils.Console.print(
      `${ViewMessage.RECEIPT_MESSGE.MEBERSHIP_DISCOUNT.padEnd(
        ViewMessage.RECEIPT_MESSGE.PAD_END_TWO -
          ViewMessage.RECEIPT_MESSGE.MEBERSHIP_DISCOUNT.length
      )}-${FormatUtils.formatNumberWithCommas(total.memebrshipDiscount)}`
    );
    MissionUtils.Console.print(
      `${ViewMessage.RECEIPT_MESSGE.PAY_PRICE.padEnd(
        ViewMessage.RECEIPT_MESSGE.PAD_END_TWO -
          ViewMessage.RECEIPT_MESSGE.PAY_PRICE.length
      )}${FormatUtils.formatNumberWithCommas(
        total.price - total.promotionDiscount - total.memebrshipDiscount
      )}\n`
    );
  }
}

export default OutputView;
