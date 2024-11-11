import { MissionUtils } from "@woowacourse/mission-utils";
import Promotion from "../src/models/Promotion";

describe("Promotion 클래스", () => {
  let promotion;

  beforeEach(() => {
    promotion = new Promotion("탄산2+1", 2, 1, "2024-01-01", "2024-12-31");
  });

  test("isApplicable: 현재 날짜가 프로모션 기간에 포함될 때 true 반환", () => {
    jest.spyOn(MissionUtils.DateTimes, "now").mockReturnValue("2024-06-01");
    expect(promotion.isApplicable()).toBe(true);
  });

  test("isApplicable: 현재 날짜가 프로모션 시작일 이전이면 false 반환", () => {
    jest.spyOn(MissionUtils.DateTimes, "now").mockReturnValue("2023-12-31");
    expect(promotion.isApplicable()).toBe(false);
  });

  test("isApplicable: 현재 날짜가 프로모션 종료일 이후면 false 반환", () => {
    jest.spyOn(MissionUtils.DateTimes, "now").mockReturnValue("2025-01-01");
    expect(promotion.isApplicable()).toBe(false);
  });

  test("calculateQtyAfterPromotion: 프로모션 수량 올바르게 계산", () => {
    const result = promotion.calculateQtyAfterPromotion(10, 20);
    expect(result).toEqual({ freeQty: 3, promotionQty: 9 });
  });
});
