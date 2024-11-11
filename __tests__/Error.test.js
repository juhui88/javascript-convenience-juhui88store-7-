import App from "../src/App.js";
import { MissionUtils } from "@woowacourse/mission-utils";
import { EOL as LINE_SEPARATOR } from "os";
import ERROR_MESSAGE from "../src/constants/ErrorMessage.js";

const mockQuestions = (inputs) => {
  const messages = [];

  MissionUtils.Console.readLineAsync = jest.fn((prompt) => {
    messages.push(prompt);
    const input = inputs.shift();

    if (input === undefined) {
      throw new Error("NO INPUT");
    }

    return Promise.resolve(input);
  });

  MissionUtils.Console.readLineAsync.messages = messages;
};

const getLogSpy = () => {
  const logSpy = jest.spyOn(MissionUtils.Console, "print");
  logSpy.mockClear();
  return logSpy;
};

const runExceptions = async ({
  inputs = [],
  inputsToTerminate = [],
  expectedErrorMessage = "",
}) => {
  // given
  const logSpy = getLogSpy();
  mockQuestions([...inputs, ...inputsToTerminate]);

  // when
  const app = new App();
  await app.run();

  // then
  expect(logSpy).toHaveBeenCalledWith(
    expect.stringContaining(expectedErrorMessage)
  );
};

describe("편의점", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test("예외 테스트 - 올바르지 않은 형식 입력", async () => {
    await runExceptions({
      inputs: ["올바르지않은형식", "N", "N"],
      expectedErrorMessage: ERROR_MESSAGE.IMPROPER_FORM_INPUT,
    });
  });

  test("예외 테스트 - 대답이 입력되지 않음", async () => {
    await runExceptions({
      inputs: ["[콜라-12]", "", ""],
      expectedErrorMessage: ERROR_MESSAGE.INVALID_EMPTY_STRING,
    });
  });

  test("예외 테스트 - 존재하지 않은 상품 구매", async () => {
    await runExceptions({
      inputs: ["[존재하지 않는 상품-12]", "N", "N"],
      expectedErrorMessage: ERROR_MESSAGE.DONT_EXIST,
    });
  });

  test("예외 테스트 - 제품 수량 초과", async () => {
    await runExceptions({
      inputs: ["[감자칩-13]", "N", "N"],
      expectedErrorMessage: ERROR_MESSAGE.EXCEED_INVENTORY_QUANTITY,
    });
  });
  test("예외 테스트 - 규정된 것 이외의 대답", async () => {
    await runExceptions({
      inputs: ["[감자칩-5]", "이외", "이외"],
      expectedErrorMessage: ERROR_MESSAGE.INVALID_INPUT,
    });
  });
  test("예외 테스트 - 편의점 모든 재고 소진", async () => {
    await runExceptions({
      inputs: [
        "[콜라-20],[사이다-15],[오렌지주스-9],[탄산수-5],[물-10],[비타민워터-6],[감자칩-10],[초코바-10],[에너지바-5],[정식도시락-8],[컵라면-11]",
        "Y",
        "Y",
        "Y",
        "Y",
        "Y",
        "Y",
        "Y",
        "Y",
      ],
      expectedErrorMessage: ERROR_MESSAGE.STORE_NO_STOCK,
    });
  });
});
