import { MissionUtils } from "@woowacourse/mission-utils";
import FormatUtils from "../utils/FormatUtils.js";

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
    this.printStoreInfo();
    purchasedProducts.forEach((product) => {
      this.printProductBuy(product);
    });
    MissionUtils.Console.print("============ 증      정 ============");
    purchasedProducts.forEach((product) => {
      this.printFreeQtyProduct(product);
    });

    MissionUtils.Console.print("=".repeat(35));
    MissionUtils.Console.print(
      `${"총구매액".padEnd(15 - 4)}${FormatUtils.formatNumberWithCommas(
        total.quantity
      ).padEnd(
        16 - FormatUtils.formatNumberWithCommas(total.quantity).length
      )}${FormatUtils.formatNumberWithCommas(total.price).padEnd(
        16 - FormatUtils.formatNumberWithCommas(total.price).length
      )}`
    );
    MissionUtils.Console.print(
      `${"행사할인".padEnd(30 - 4)}-${FormatUtils.formatNumberWithCommas(
        total.promotionDiscount
      )}`
    );
    MissionUtils.Console.print(
      `${"멤버십할인".padEnd(30 - 5)}-${FormatUtils.formatNumberWithCommas(
        total.memebrshipDiscount
      )}`
    );
    MissionUtils.Console.print(
      `${"내실돈".padEnd(30 - 3)}${FormatUtils.formatNumberWithCommas(
        total.price - total.promotionDiscount - total.memebrshipDiscount
      )}\n`
    );
  }

  static printStoreInfo() {
    MissionUtils.Console.print("\n============주희네편의점============");
    MissionUtils.Console.print(
      `${"상품명".padEnd(15 - 3)}${"수량".padEnd(15 - 2)}${"금액".padEnd(
        15 - 2
      )}`
    );
  }
  static printProductBuy(product) {
    const { name, finalQty, price } = product;
    const totalProductPrice = price * finalQty;

    MissionUtils.Console.print(
      `${name.padEnd(15 - name.length)}${String(finalQty).padEnd(
        16 - String(finalQty).length
      )}${FormatUtils.formatNumberWithCommas(totalProductPrice).padEnd(
        16 - FormatUtils.formatNumberWithCommas(totalProductPrice).length
      )}`
    );
  }

  static printFreeQtyProduct(product) {
    const { name, freeQty } = product;
    if (freeQty !== 0)
      MissionUtils.Console.print(
        `${name.padEnd(15 - name.length)}${String(freeQty).padEnd(
          15 - String(freeQty).length
        )}`
      );
  }
}

export default OutputView;
