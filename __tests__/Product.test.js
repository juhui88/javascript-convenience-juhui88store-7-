import Product from "../src/models/Product.js";

describe("Product 클래스", () => {
  let product;

  beforeEach(() => {
    product = new Product("콜라", 1000, 10, "탄산2+1");
  });

  test("hasSufficientQuantity: 구매 수량이 재고보다 적거나 같으면 true를 반환", () => {
    expect(product.hasSufficientQuantity(5)).toBe(true);
    expect(product.hasSufficientQuantity(10)).toBe(true);
  });

  test("hasSufficientQuantity: 구매 수량이 재고보다 많으면 false 반환", () => {
    expect(product.hasSufficientQuantity(11)).toBe(false);
  });

  test("reduceQuantity: 주어진 수량만큼 재고 감소", () => {
    product.reduceQuantity(3);
    expect(product.quantity).toBe(7);

    product.reduceQuantity(2);
    expect(product.quantity).toBe(5);
  });

  test("isNull: 'null' 문자열이 전달되면 null을 반환, 아니면 원래 값을 반환", () => {
    expect(product.isNull("null")).toBe(null);
    expect(product.isNull("탄산2+1")).toBe("탄산2+1");
  });

  test("getFormatQtyAndPromotion: 프로모션과 재고에 대한 올바른 형식 반환", () => {
    const result = product.getFormatQtyAndPromotion();
    expect(result).toEqual(["10개", "탄산2+1"]);
  });

  test("getFormatQtyAndPromotion: 재고가 0일 때 '재고 없음' 반환 프로모션 정보 포함", () => {
    product.quantity = 0;
    const result = product.getFormatQtyAndPromotion();
    expect(result).toEqual(["재고 없음", "탄산2+1"]);
  });

  test("getFormatQtyAndPromotion: 프로모션이 없을 때 프로모션 문자열이 빈 채로 반환", () => {
    const productWithoutPromotion = new Product("사이다", 1000, 5, "null");
    const result = productWithoutPromotion.getFormatQtyAndPromotion();
    expect(result).toEqual(["5개", ""]);
  });
});
