import ERROR_MESSAGE from "../constants/ErrorMessage.js";
import ViewMessage from "../constants/ViewMessage.js";
import DataLoader from "../utils/DataLoader.js";
import OutputView from "../views/OutputView.js";

class ConvenienceStore {
  constructor() {
    this.products = DataLoader.getProducts("./public/products.md");
  }

  showInventory() {
    OutputView.print(ViewMessage.CONVENIENCE_STORE_MESSAGE);
    this.products.forEach((product) => {
      OutputView.printProduct(product);
    });
  }

  findProduct(name) {
    return this.products.filter((product) => product.name === name);
  }

  validateTotalQty() {
    const totalQty = this.products.reduce(
      (total, product) => total + product.quantity,
      0
    );
    if (totalQty <= 0) throw new Error(ERROR_MESSAGE.STORE_NO_STOCK);
    return true;
  }
}

export default ConvenienceStore;
