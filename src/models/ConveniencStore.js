import ViewMessage from "../constants/ViewMessage.js";
import DataLoader from "../utils/DataLoader.js";
import OutputView from "../views/OutputView.js";

class ConveniencStore {
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
}

export default ConveniencStore;
