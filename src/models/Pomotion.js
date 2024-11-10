import { MissionUtils } from "@woowacourse/mission-utils";

class Promotion {
  constructor(name, buy, get, startDate, endDate) {
    this.name = name;
    this.buy = Number(buy);
    this.get = Number(get);
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
  }

  isApplicable(currentDate = new Date(MissionUtils.DateTimes.now())) {
    return currentDate >= this.startDate && currentDate <= this.endDate;
  }

  calculatePromotionSets(buyQuantity) {
    const setCount = Math.floor(buyQuantity / (this.buy + this.get));
    const remainder = buyQuantity % (this.buy + this.get);
    return { setCount, remainder };
  }
}

export default Promotion;
