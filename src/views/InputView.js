import { MissionUtils } from "@woowacourse/mission-utils";

class InputView {
  static async readInput(message) {
    const input = await MissionUtils.Console.readLineAsync(message);
    return input;
  }

  static async askAdditionalPromotion(name, quantity) {
    const input = await MissionUtils.Console.readLineAsync(
      `현재 ${name}은(는) ${quantity}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)`
    );
    return input;
  }

  static async askBuyNonPromotion(name, nontPromotionQty) {
    const input = await MissionUtils.Console.readLineAsync(
      `현재 ${name} ${nontPromotionQty}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)`
    );
    return input;
  }
  static async askMembershipDiscount() {
    const input = await MissionUtils.Console.readLineAsync(
      "멤버십 할인을 받으시겠습니까? (Y/N)"
    );

    return input;
  }

  static async askAdditionalBuy() {
    const input = await MissionUtils.Console.readLineAsync(
      "감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)"
    );

    return input;
  }
}

export default InputView;
