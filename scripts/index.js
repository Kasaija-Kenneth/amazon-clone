import * as cartModule from "../data/cart.js";
import { products } from "../data/products.js";
import * as utilsModule from "./utils/money.js";

let productsHtml = "";
products.forEach((product) => {
	const { image, name, rating, priceCents, id } = product;
	productsHtml += `
    <div class="product-container">
    <div class="product-image-container">
      <img class="product-image"
        src=${image}>
    </div>

    <div class="product-name limit-text-to-2-lines">
      ${name}
    </div>

    <div class="product-rating-container">
      <img class="product-rating-stars"
        src="images/ratings/rating-${rating.stars * 10}.png">
      <div class="product-rating-count link-primary">
        ${rating.count}
      </div>
    </div>

    <div class="product-price">
      $${utilsModule.formatCurrency(priceCents)}
    </div>

    <div class="product-quantity-container">
      <select>
        <option selected value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
    </div>

    <div class="product-spacer"></div>

    <div class="added-to-cart">
      <img src="images/icons/checkmark.png">
      Added
    </div>

    <button class="add-to-cart-button button-primary"
    data-product-id="${id}">
      Add to Cart
    </button>
  </div>
  `;
});

document.querySelector(".products-grid").innerHTML = productsHtml;
document.querySelectorAll(".add-to-cart-button").forEach((btn) => {
	btn.addEventListener("click", () => {
		const productId = btn.dataset.productId;
		cartModule.addToCart(productId);
		updateCartQuantity();
		console.log(cartModule.cart);
	});
});

function updateCartQuantity() {
	//Total cart quantity
	let cartQuantity = 0;
	cartModule.cart.forEach((cartItem) => {
		cartQuantity += cartItem.quantity;
	});

	//cart quantity indicator in the browser
	document.querySelector(".cart-quantity").innerHTML = cartQuantity;
}