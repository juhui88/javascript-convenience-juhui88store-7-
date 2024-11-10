import ConveniencStore from "./models/ConveniencStore.js";

class App {
  async run() {
    const store = new ConveniencStore();
    store.showInventory();
  }
}

export default App;
