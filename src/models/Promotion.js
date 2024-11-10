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

  calculateQtyAfterPromotion(buyQty, productQty) {
    let setCount;
    if (buyQty <= productQty) {
      setCount = Math.floor(buyQty / (this.buy + this.get));
    } else {
      setCount = Math.floor(productQty / (this.buy + this.get));
    }
    const freeQty = setCount * this.get;
    const promotionQty = setCount * (this.buy + this.get);
    return { freeQty, promotionQty };
  }
}

export default Promotion;
