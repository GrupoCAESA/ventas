import variables from "./js/variables.js";
import menu from "../../modules/menu/menu.js";
import animation from "../../modules/animation/animation.js";
import price from "./js/price.js";
import product from "./js/product.js";
import filters from "./js/filters.js";

(async () => {
  await variables.load();
  menu.init();
  animation.lottie.generate("/app/catalogue/json/lottie-icons.json");
  price.init();
  product.init();
  filters.init();
})();
