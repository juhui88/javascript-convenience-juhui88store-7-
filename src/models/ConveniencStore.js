import ViewMessage from "../constants/ViewMessage.js";
import DataLoader from "../utils/DataLoader.js";
import OutputView from "../views/OutputView.js";

class ConveniencStore {
  constructor() {
    this.products = DataLoader.getProducts("./public/products.md");
    this.promotions = DataLoader.getPromotions("./public/promotions.md");
  }

  showInventory() {
    OutputView.print(ViewMessage.CONVENIENCE_STORE_MESSAGE);
    this.products.forEach((product) => {
      OutputView.printProduct(product);
    });
  }

  findProduct(name) {
    return this.products.find((product) => product.name === name);
  }

  findPromotion(name) {
    return this.promotions.find((promo) => promo.name === name);
  }
}

export default ConveniencStore;
