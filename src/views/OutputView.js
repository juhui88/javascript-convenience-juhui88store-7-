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
}

export default OutputView;
