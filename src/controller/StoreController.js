import ViewMessage from "../constants/ViewMessage.js";
import ConveniencStore from "../models/ConveniencStore.js";
import FormatUtils from "../utils/FormatUtils.js";
import InputView from "../views/InputView.js";
import BuyController from "./BuyConstroller.js";

class StoreController {
  constructor() {
    this.store = new ConveniencStore();
    this.shoppingList = [];
  }

  async run() {
    do {
      this.initializeList();
      this.store.showInventory();
      await this.buy();
    } while (조건);
  }

  initializeList() {
    this.shoppingList = [];
  }

  async buy() {
    const input = await InputView.readInput(ViewMessage.READ_ITEM_MESSAGE);
    const buyList = this.#getItemsToBuy(input);

    const buyController = new BuyController(buyList);
    console.log(buyList);
    buyController.run();
  }

  #getItemsToBuy(input) {
    return FormatUtils.splitByComma(input).map((string) => {
      this.#validateBuyInput(string);
      const [name, quantity] = FormatUtils.splitByDashSlice(1, -1, string);
      return { name, quantity: this.#validateParseQuantity(quantity) };
    });
  }

  #validateBuyInput(item) {
    if (!item.startsWith("[") || !item.endsWith("]"))
      throw new Error(ERROR_MESSAGE.IMPROPER_FORM_INPUT);
  }

  #validateParseQuantity(quantity) {
    const quantityToNum = Number(quantity);
    if (isNaN(quantityToNum)) {
      throw new Error(ERROR_MESSAGE.IMPROPER_FORM_INPUT);
    }
    return quantityToNum;
  }
}

export default StoreController;
