import ERROR_MESSAGE from "../constants/ErrorMessage.js";
import ANSWER from "../constants/InputMessage.js";
import ViewMessage from "../constants/ViewMessage.js";
import ConveniencStore from "../models/ConveniencStore.js";
import AnswerValidator from "../utils/AnswerValidator.js";
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
    } while (await this.#confirmAdditionalBuy());
  }

  async #confirmAdditionalBuy() {
    const input = await InputView.askAdditionalBuy();
    return AnswerValidator.validate(input);
  }

  initializeList() {
    this.shoppingList = [];
  }

  async buy() {
    const input = await InputView.readInput(ViewMessage.READ_ITEM_MESSAGE);
    const buyList = this.#getItemsToBuy(input);

    buyList.forEach((item) => {
      const buyProducts = this.store.findProduct(item.name);
      this.#validateBuyProduct(buyProducts);
      const buyController = new BuyController(buyProducts, item.quantity);
      const { finalQty, freeQty } = buyController.run(); // 최종 구매수량과 증정수량 반환
      this.shoppingList.push({ name: item.name, finalQty, freeQty });
    });
  }

  #validateBuyProduct(buyProducts, itemQuantity) {
    if (buyProducts === undefined) throw new Error(ERROR_MESSAGE.DONT_EXIST);
    if (this.#getProductTotalQTY(buyProducts) < itemQuantity)
      throw new Error(ERROR_MESSAGE.EXCEED_INVENTORY_QUANTITY);
  }

  #getProductTotalQTY(buyProducts) {
    return buyProducts.reduce((total, product) => total + product.quantity, 0);
  }

  #getItemsToBuy(input) {
    return FormatUtils.splitByComma(input).map((string) => {
      this.#validateBuyInput(string);
      const [name, quantity] = FormatUtils.splitByDashSlice(1, -1, string);
      this.#validateParseQuantity(quantity);
      return { name, quantity };
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
