import animation from "../../animation/animation.js";
import connection from "../../connection/connection.js";
import product from "./js/product.js";
import topBar from "./js/topBar.js";

(async () => {
  await connection.variables.load();
  animation.lottie.generate(
    "/modules/configuration/admin/json/lottie-icons.json"
  );
  product.init();
  topBar.init();
})();
