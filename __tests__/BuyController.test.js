import Promotion from "../src/models/Promotion.js";
import Product from "../src/models/Product.js";
import DataLoader from "../src/utils/DataLoader.js";
import InputView from "../src/views/InputView.js";
import AnswerValidator from "../src/utils/AnswerValidator.js";
import BuyController from "../src/controller/BuyConstroller.js";

jest.mock("../src/utils/DataLoader.js", () => ({
  getPromotions: jest.fn(),
}));
jest.mock("../src/views/InputView.js", () => ({
  askBuyNonPromotion: jest.fn(),
  askAdditionalPromotion: jest.fn(),
}));
jest.mock("../src/utils/AnswerValidator.js", () => ({
  validate: jest.fn().mockReturnValue(true),
}));

const mockPromotions = [
  new Promotion("탄산2+1", 2, 1, "2024-01-01", "2024-12-31"),
];

describe("BuyController 클래스", () => {
  let mockProducts = [
    new Product("콜라", 1000, 10, "탄산2+1"),
    new Product("콜라", 1000, 10, "null"),
  ];

  beforeEach(() => {
    mockProducts = [
      new Product("콜라", 1000, 10, "탄산2+1"), // 10개 재고
      new Product("콜라", 1000, 10, "null"), // 10개 재고
    ];
    DataLoader.getPromotions.mockReturnValue(mockPromotions);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  async function createControllerAndRun(buyQty) {
    const controller = new BuyController(mockProducts, buyQty);
    return await controller.run();
  }

  test("프로모션 적용되지 않는 제품 구매 여부 판단 (Y)", async () => {
    AnswerValidator.validate.mockReturnValue(true);
    InputView.askBuyNonPromotion.mockResolvedValue("Y");

    const result = await createControllerAndRun(7);

    expect(result).toEqual({
      price: 1000,
      finalQty: 7,
      freeQty: 2,
      promotionQty: 6,
    });
  });

  test("프로모션 적용되지 않는 제품 구매 여부 판단 (N)", async () => {
    InputView.askBuyNonPromotion.mockResolvedValue("N");
    AnswerValidator.validate.mockReturnValue(false);

    const result = await createControllerAndRun(7);

    expect(result).toEqual({
      price: 1000,
      finalQty: 6,
      freeQty: 2,
      promotionQty: 6,
    });
  });

  test("프로모션 수량이 딱 맞아 떨어지는 경우", async () => {
    const result = await createControllerAndRun(9);

    expect(result).toEqual({
      price: 1000,
      finalQty: 9,
      freeQty: 3,
      promotionQty: 9,
    });
  });

  test("추가 프로모션을 받을 수 있는 경우(Y)", async () => {
    AnswerValidator.validate.mockReturnValue(true);
    InputView.askAdditionalPromotion.mockResolvedValue("Y");

    const result = await createControllerAndRun(8);

    expect(result).toEqual({
      price: 1000,
      finalQty: 9,
      freeQty: 3,
      promotionQty: 9,
    });
  });

  test("추가 프로모션을 받을 수 있는 경우(N)", async () => {
    InputView.askAdditionalPromotion.mockResolvedValue("N");
    AnswerValidator.validate.mockReturnValue(false);

    const result = await createControllerAndRun(8);

    expect(result).toEqual({
      price: 1000,
      finalQty: 8,
      freeQty: 2,
      promotionQty: 6,
    });
  });

  test("프로모션 수량을 초과하여 구매하는 경우(Y)", async () => {
    InputView.askBuyNonPromotion.mockResolvedValue("Y");
    AnswerValidator.validate.mockReturnValue(true);

    const result = await createControllerAndRun(13);

    expect(result).toEqual({
      price: 1000,
      finalQty: 13,
      freeQty: 3,
      promotionQty: 9,
    });
  });

  test("프로모션 수량을 초과하여 구매하는 경우(N)", async () => {
    InputView.askBuyNonPromotion.mockResolvedValue("N");
    AnswerValidator.validate.mockReturnValue(false);

    const result = await createControllerAndRun(13);

    expect(result).toEqual({
      price: 1000,
      finalQty: 9,
      freeQty: 3,
      promotionQty: 9,
    });
  });
});
