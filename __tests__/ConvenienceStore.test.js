import OutputView from "../src/views/OutputView.js";
import ViewMessage from "../src/constants/ViewMessage.js";
import DataLoader from "../src/utils/DataLoader.js";
import ConvenienceStore from "../src/models/ConvenienceStore.js";

jest.mock("../src/utils/DataLoader");
jest.mock("../src/views/OutputView");

describe("ConveniencStore 클래스", () => {
  let convenienceStore;

  beforeEach(() => {
    // 가상 제품 목록 설정
    const mockProducts = [
      { name: "콜라", price: 1000, quantity: 10, promotion: "탄산2+1" },
      { name: "콜라", price: 1000, quantity: 10, promotion: "null" },
      { name: "사이다", price: 1000, quantity: 8, promotion: "탄산2+1" },
      { name: "물", price: 500, quantity: 20, promotion: null },
    ];
    DataLoader.getProducts.mockReturnValue(mockProducts);

    // 편의점 인스턴스 생성
    convenienceStore = new ConvenienceStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("constructor: DataLoader를 통해 제품 목록 로드", () => {
    expect(DataLoader.getProducts).toHaveBeenCalledWith("./public/products.md");
    expect(convenienceStore.products).toHaveLength(4);
  });

  test("showInventory: 재고 목록을 출력다", () => {
    convenienceStore.showInventory();

    expect(OutputView.print).toHaveBeenCalledWith(
      ViewMessage.CONVENIENCE_STORE_MESSAGE
    );
    convenienceStore.products.forEach((product) => {
      expect(OutputView.printProduct).toHaveBeenCalledWith(product);
    });
  });

  test("findProduct: 이름 해당하는 제품 탐색", () => {
    const foundProducts = convenienceStore.findProduct("콜라");
    expect(foundProducts).toEqual([
      { name: "콜라", price: 1000, quantity: 10, promotion: "탄산2+1" },
      { name: "콜라", price: 1000, quantity: 10, promotion: "null" },
    ]);
  });

  test("findProduct: 존재하지 않는 제품을 찾을 경우 빈 배열 반환", () => {
    const foundProducts = convenienceStore.findProduct("없는 제품");
    expect(foundProducts).toEqual([]);
  });
});
