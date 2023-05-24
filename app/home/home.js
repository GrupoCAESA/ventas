import lottie from "../../modules/animation/js/lottie.js";
import mouseWhell from "../../modules/animation/js/mouse_whell.js";
import menu from "../../modules/menu/menu.js";
import search from "./js/search.js";

(() => {
  menu();
  search();
  lottie("/app/home/json/icons.json");
  mouseWhell.horizontal(document.querySelector("#best_seller-list"));
})();
