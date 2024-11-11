import ERROR_MESSAGE from "../constants/ErrorMessage.js";
import ViewMessage from "../constants/ViewMessage.js";
import ConvenienceStore from "../models/ConvenienceStore.js";
import AnswerValidator from "../utils/AnswerValidator.js";
import FormatUtils from "../utils/FormatUtils.js";
import InputView from "../views/InputView.js";
import OutputView from "../views/OutputView.js";
import BuyController from "./BuyConstroller.js";

class StoreController {
  constructor() {
    this.store = new ConvenienceStore();
    this.shoppingList = [];
    this.total = {
      price: 0,
      promotionDiscount: 0,
      quantity: 0,
      memebrshipDiscount: 0,
    };
  }

  async run() {
    do {
      this.#initializeList();
      this.store.showInventory();
      await this.#buy();
      OutputView.printReceipt(this.shoppingList, this.total);
    } while (await this.#confirmAdditionalBuy());
  }

  async #confirmAdditionalBuy() {
    const input = await InputView.askAdditionalBuy();
    return AnswerValidator.validate(input);
  }

  #initializeList() {
    this.shoppingList = [];
  }

  async #buy() {
    const input = await InputView.readInput(ViewMessage.READ_ITEM_MESSAGE);
    const buyList = this.#getItemsToBuy(input);

    for (const item of buyList) {
      const buyProducts = this.store.findProduct(item.name);
      this.#validateBuyProduct(buyProducts, item.quantity);
      const buyController = new BuyController(buyProducts, item.quantity);
      const { finalQty, freeQty, promotionQty, price } =
        await buyController.run(); // 최종 구매수량과 증정수량 반환

      this.shoppingList.push({
        name: item.name,
        finalQty,
        freeQty,
        price,
        promotionQty,
      });
    }
    await this.#setTotal();
  }

  async #setTotal() {
    let totalPrice = 0;
    let discount = 0;
    let totalQuantity = 0;
    let memberShip = 0;

    const answer = await this.#confirmMembershipDiscount();

    this.shoppingList.forEach((item) => {
      const { itemTotalPrice, itemDiscount, itemQuantity, itemMemberShip } =
        this.#calculateTotal(item, answer);

      totalPrice += itemTotalPrice;
      discount += itemDiscount;
      totalQuantity += itemQuantity;
      memberShip += itemMemberShip;
    });

    if (memberShip > 8000) memberShip = 8000;

    this.total = {
      price: totalPrice,
      promotionDiscount: discount,
      quantity: totalQuantity,
      memebrshipDiscount: memberShip,
    };
  }

  #calculateTotal(item, answer) {
    const { finalQty, freeQty, promotionQty, price } = item;

    const itemTotalPrice = price * finalQty;
    const itemQuantity = finalQty;
    const itemDiscount = price * freeQty;
    const itemMemberShip = answer ? (finalQty - promotionQty) * price * 0.3 : 0;

    return {
      itemTotalPrice,
      itemDiscount,
      itemQuantity,
      itemMemberShip,
    };
  }

  async #confirmMembershipDiscount() {
    const answer = AnswerValidator.validate(
      await InputView.askMembershipDiscount()
    );
    return answer;
  }

  #validateBuyProduct(buyProducts, itemQuantity) {
    if (buyProducts.length === 0) throw new Error(ERROR_MESSAGE.DONT_EXIST);

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
