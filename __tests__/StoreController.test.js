import StoreController from "../src/controller/StoreController.js";
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

const getOutput = (logSpy) => {
  return [...logSpy.mock.calls].join(LINE_SEPARATOR);
};

const expectLogContains = (received, expects) => {
  expects.forEach((exp) => {
    expect(received).toContain(exp);
  });
};

const expectLogContainsWithoutSpacesAndEquals = (received, expects) => {
  const processedReceived = received.replace(/[\s=]/g, "");
  expects.forEach((exp) => {
    expect(processedReceived).toContain(exp);
  });
};

const run = async ({
  inputs = [],
  inputsToTerminate = [],
  expected = [],
  expectedIgnoringWhiteSpaces = [],
}) => {
  const logSpy = getLogSpy();
  mockQuestions([...inputs, ...inputsToTerminate]);

  const storeController = new StoreController();
  await storeController.run();

  const output = getOutput(logSpy);

  if (expectedIgnoringWhiteSpaces.length > 0) {
    expectLogContainsWithoutSpacesAndEquals(
      output,
      expectedIgnoringWhiteSpaces
    );
  }
  if (expected.length > 0) {
    expectLogContains(output, expected);
  }
};

describe("StoreController 클래스", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  test("프로모션 적용하여 구매하고 나머지 물품에 대해 멤버십 적용하는 경우", async () => {
    await run({
      inputs: ["[콜라-11]", "Y", "Y", "N"],
      expectedIgnoringWhiteSpaces: [
        "콜라1111,000",
        "콜라3",
        "총구매액1111,000",
        "행사할인-3,000",
        "멤버십할인-600",
        "내실돈7,400",
      ],
    });
  });
  test("멤버십이나 프로모션 할인 없이 구매하는 경우", async () => {
    await run({
      inputs: ["[에너지바-5]", "N", "N"],
      expectedIgnoringWhiteSpaces: [
        "총구매액510,000",
        "행사할인-0",
        "멤버십할인-0",
        "내실돈10,000",
      ],
    });
  });

  test("여러개 구매 로직", async () => {
    await run({
      inputs: [
        "[콜라-3],[에너지바-5]",
        "Y",
        "Y",
        "[콜라-10]",
        "Y",
        "N",
        "Y",
        "[오렌지주스-1]",
        "Y",
        "Y",
        "N",
      ],
      expectedIgnoringWhiteSpaces: [
        "총구매액813,000",
        "행사할인-1,000",
        "멤버십할인-3,000",
        "내실돈9,000",
        "총구매액1010,000",
        "행사할인-2,000",
        "멤버십할인-0",
        "내실돈8,000",
        "총구매액23,600",
        "행사할인-1,800",
        "멤버십할인-0",
        "내실돈1,800",
      ],
    });
  });
});
