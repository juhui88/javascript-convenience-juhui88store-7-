import ERROR_MESSAGE from "../constants/ErrorMessage.js";
import ANSWER from "../constants/InputMessage.js";

class AnswerValidator {
  static validate(answer) {
    switch (answer) {
      case ANSWER.YES:
        return true;
      case ANSWER.NO:
        return false;
      case ANSWER.EMPTY:
        throw new Error(ERROR_MESSAGE.INVALID_EMPTY_STRING);
      default:
        throw new Error(ERROR_MESSAGE.INVALID_INPUT);
    }
  }
}

export default AnswerValidator;
