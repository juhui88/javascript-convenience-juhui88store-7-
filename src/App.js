import { MissionUtils } from "@woowacourse/mission-utils";
import StoreController from "./controller/StoreController.js";

class App {
  async run() {
    try {
      const storeController = new StoreController();
      await storeController.run();
    } catch (error) {
      MissionUtils.Console.print(error.message);
      throw error;
    }
  }
}

export default App;
