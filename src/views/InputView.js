import { MissionUtils } from "@woowacourse/mission-utils";

class InputView {
  static async readInput(message) {
    const input = await MissionUtils.Console.readLineAsync(message);
    return input;
  }
}

export default InputView;
