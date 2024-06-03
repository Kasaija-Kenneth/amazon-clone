import dayjs from "https://unpkg.com/dayjs@1.11.11/esm/index.js";
import { cart, deleteCartItem, updateDeliveryOption } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import { deliveryOptions } from "../data/deliveryOptions.js";

let cartSummaryHtml = " ";
cart.forEach((cartItem) => {
	let matchedProduct;
	products.forEach((product) => {
		if (product.id === cartItem.productId) {
			matchedProduct = product;
		}
	});

	let deliveryOption;
	deliveryOptions.forEach((option) => {
		if (option.id === cartItem.deliveryOptionId) deliveryOption = option;
	});

	const dateString = deliverBy(
		deliveryOption.deliveryDays,
		"days",
		"D MMM YYYY"
	);

	cartSummaryHtml += `
    <div 
      class="cart-item-container cart-item-container-${matchedProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image" src="${matchedProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">${matchedProduct.name}</div>
          <div class="product-price">
            $${formatCurrency(matchedProduct.priceCents)}
          </div>

          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary">
              Update
            </span>
            <span 
              class="delete-quantity-link link-primary" 
              data-product-id="${cartItem.productId}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">Choose a delivery option:</div>
          ${deliveryOptionsHTML(matchedProduct, cartItem)}
        </div>
      </div>
    </div>
  `;
});

document.querySelector(".order-summary").innerHTML = cartSummaryHtml;

//implement delete button
document.querySelectorAll(".delete-quantity-link").forEach((btn) => {
	btn.addEventListener("click", function () {
		const productId = btn.dataset.productId;

		//update the cart
		deleteCartItem(productId);

		//remove the item from the dom
		document.querySelector(`.cart-item-container-${productId}`).remove();
	});
});

//deliveryOptions HTML
function deliveryOptionsHTML(matchedProduct, cartItem) {
	let html = "";
	deliveryOptions.forEach((deliveryOption) => {
		const { deliveryDays, priceCents, id } = deliveryOption;
		const { deliveryOptionId } = cartItem;
		const isChecked = deliveryOptionId === id;

		const dateString = deliverBy(deliveryDays, "days", "ddd, D MMM YYYY");
		const priceString =
			priceCents === 0 ? "Free" : `$${formatCurrency(priceCents)}`;

		html += `
      <div class="delivery-option" data-product-id="${
				matchedProduct.id
			}" data-delivery-option-id="${deliveryOptionId}">
        <input 
          type="radio"
          ${isChecked ? "checked" : ""}
          class="delivery-option-input" 
          name="delivery-option-${matchedProduct.id}">
        <div>
          <div class="delivery-option-date">${dateString}</div>
          <div class="delivery-option-price">${priceString} - Shipping</div>
        </div>
      </div>
    `;
	});
	return html;
}

//delivery date
function deliverBy() {
	const [dayCount, durationStr, dateString] = arguments;
	const today = dayjs();
	const deliveryDate = today.add(dayCount, durationStr);
	return deliveryDate.format(dateString);
}

//Add event listeners to radio buttons
document.querySelectorAll(".delivery-option").forEach((element) => {
	element.addEventListener("click", () => {
		const { productId, deliveryOptionId } = element.dataset;
		updateDeliveryOption(productId, deliveryOptionId);
	});
});
