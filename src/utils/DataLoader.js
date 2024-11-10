import fs from "fs";
import path from "path";
import Product from "../models/Product.js";
import Promotion from "../models/Promotion.js";
import FormatUtils from "./FormatUtils.js";

class DataLoader {
  static #PRODUCT_PATH = "./public/products.md";
  static #PROMOTION_PATH = "./public/promotions.md";
  // 상품 객체 생성
  static getProducts() {
    const data = this.#readFile(this.#PRODUCT_PATH);
    const lines = this.#parseLines(data);

    const products = lines.slice(1).map((line) => this.#readProductLine(line));

    return products;
  }

  // 프로모션에 대한 각 객체 생성
  static getPromotions() {
    const data = this.#readFile(this.#PROMOTION_PATH);
    const lines = this.#parseLines(data);

    const promotions = lines
      .slice(1)
      .map((line) => this.#readPromotionLine(line));

    return promotions;
  }

  static #readPromotionLine(line) {
    const [name, buy, get, startDate, endDate] = FormatUtils.splitByComma(line);

    return new Promotion(name, buy, get, startDate, endDate);
  }

  static #readFile(filePath) {
    return fs.readFileSync(path.resolve(filePath), "utf-8");
  }

  static #parseLines(data) {
    return data.trim().split("\n");
  }

  static #readProductLine(line) {
    const [name, price, quantity, promotion] = FormatUtils.splitByComma(line);

    const product = new Product(name, price, quantity, promotion);

    return product;
  }
}

export default DataLoader;
