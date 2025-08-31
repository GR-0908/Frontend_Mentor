const cart = new Map();

async function getData(){

    try{
        const response = await fetch("data.json");
        
        if(!response.ok){
            throw new Error("Error: " + response.status);
        }

        const result = await response.json();

        console.log(result);
        return result;

    }catch (error){
        console.error(error.message);
    }
} 

function placeProductsOnGrid(productsJson){
    
    const grid_product_div = document.querySelector(".grid_product");
    let article_counter = 0;

    productsJson.forEach((product) => {
        grid_product_div.innerHTML += 
        `<article  class="product" data-id="${article_counter}">
            <picture>  
                <img src=${product.image.mobile}>
                <button class="cart_button_empty">Add to Cart</button>
            </picture>

            <div class="product_text">
            <p class="product_category">${product.category}</p>
            <p class="product_title">${product.name}</p>
            <p class="product_price">$${product.price.toFixed(2)}</p>
            </div>
        </article>`;

        article_counter += 1;
    });
}

function buttonProductFunctionality(productsJson) {
  const productsList = document.querySelectorAll(".product");

  for(let i = 0; i < productsList.length; i++){
    const button_add_cart = productsList[i].querySelector("picture > button");

    button_add_cart.addEventListener("click", () => {
      updateCart(productsList[i], 1, productsJson[i]);  
      replaceButtonProduct(productsList[i], button_add_cart, productsJson[i]);
    });
  }

}

function replaceButtonProduct(product, button, productJson) {
  const picture_element = product.querySelector("picture");

  const new_button = document.createElement("div");
  new_button.classList.add("cart_button_with_elements");

  new_button.innerHTML = `
    <button class="minus_button"><img src="/images/icon-decrement-quantity.svg"></button>
    <span>1</span>
    <button class="plus_button"><img src="/images/icon-increment-quantity.svg"></button>
  `;

  picture_element.replaceChild(new_button, button);

  const minus_btn = new_button.querySelector(".minus_button");
  const plus_btn = new_button.querySelector(".plus_button");
  const quant_span = new_button.querySelector("span");

  minus_btn.addEventListener("click", () => {
    let quantity = parseInt(quant_span.innerText);

    if (quantity === 1) {
      picture_element.replaceChild(button, new_button);
      removeFromCart(product.dataset.id);
      renderCart();
    } else {
      quantity -= 1;  
      quant_span.innerText = quantity;
      updateCart(product, quantity, productJson);

    }
  });

  plus_btn.addEventListener("click", () => {
    let quantity = parseInt(quant_span.innerText) + 1;
    quant_span.innerText = quantity;
    updateCart(product, quantity, productJson);
  });
}

function resetButtonCart(productId, productJson){
     const productCard = document.querySelector(`.product[data-id="${productId}"]`);

    const container = productCard.querySelector(".cart_button_with_elements");
    if (container) {
        const newButton = document.createElement("button");
        newButton.classList.add("cart_button_empty");
        newButton.innerText = "Add to Cart";

        container.replaceWith(newButton);

        newButton.addEventListener("click", () => {
            updateCart(productCard, 1, productJson);
            replaceButtonProduct(productCard, newButton, productJson);
        });
    }
}

/************************************/


function updateCart(product, quantity, productJson){
    
    const id = product.dataset.id;

    if (quantity > 0){
        cart.set(id, {quantity, productJson})
    }else {
        cart.delete(id);
    }

    renderCart();
}

function removeFromCart(id){
    cart.delete(id);
}

function totalCartQuantity(){
    let totalQuantity = 0;
    for (let itemCart of cart){
        totalQuantity += itemCart[1].quantity;
    }
    return totalQuantity;
}

function calculateTotalOrderAmount(){
    let totalOrderAmount = 0;
    for (let itemCart of cart){
        totalOrderAmount += (itemCart[1].quantity * itemCart[1].productJson.price);
    }

    return totalOrderAmount;
}

/****************** Modal Conf *********************/

function renderModalConfiguration(){
    const conf_modal = document.createElement("div");
    conf_modal.classList.add("confirmation_modal");

    conf_modal.innerHTML = `<img src="/images/icon-order-confirmed.svg">
                            <div>
                            <h1>Order Confirmed</h1>
                            <p>We hope you enjoy food!</p>
                            </div>`

    const conf_modal_wrapper = document.createElement("div");
    conf_modal_wrapper.classList.add("purchased_products_wrapper");
    conf_modal.appendChild(conf_modal_wrapper);

    for (itemCart of cart){
       const product_card_conf = document.createElement("div");
       product_card_conf.classList.add("card_product_purchased_conf_modal");

       product_card_conf.innerHTML = `
        <img src="${itemCart[1].productJson.image.thumbnail}">
        <div>
          <p class="cart_product_purchased_title modal_conf">${itemCart[1].productJson.name}</p>
          <p class="info_price modal_conf"><span>${itemCart[1].quantity}x</span><span>@$${(itemCart[1].productJson.price).toFixed(2)}</span></p>
        </div>
        <p>$${(itemCart[1].quantity * itemCart[1].productJson.price).toFixed(2)}</p>  
       `
        
       conf_modal_wrapper.appendChild(product_card_conf);
    }

    const order_total_modal = document.createElement("div");
    order_total_modal.classList.add("order_total");
    order_total_modal.innerHTML = `
        <p>Order Total</p>
        <p>$${calculateTotalOrderAmount().toFixed(2)}</p>
    `;
    conf_modal_wrapper.appendChild(order_total_modal);

    const order_button_modal = document.createElement("button");
    order_button_modal.classList.add("confirm_order_button");
    order_button_modal.innerText = "Start New Order";
    conf_modal.appendChild(order_button_modal);

    order_button_modal.addEventListener("click", () => {
        window.location.reload();
    })

    return conf_modal;

}

/**********************************************************/

function renderCart(){

    const cartHTML = document.querySelector(".cart")

    if(cart.size !== 0){
        cartHTML.classList.add("cart_products");

        cartHTML.innerHTML = `<p class="cart_title">Your Cart (${totalCartQuantity()})</p>` 
        
        for (let itemCart of cart){
            let itemCartNode = cartHTML.querySelector(`.card_product_purchased[data-product-id="${itemCart[0]}"]`)

            if(itemCartNode == null){
                const new_cart_entry = document.createElement("div");
                new_cart_entry.classList.add("card_product_purchased");
                new_cart_entry.dataset.productId = itemCart[0];

                new_cart_entry.innerHTML = `<div>
                    <p class="cart_product_purchased_title">${itemCart[1].productJson.name}</p>
                    <p class="info_price">
                    <span class="quantity">${itemCart[1].quantity}x</span>
                    <span class="price">@$${itemCart[1].productJson.price.toFixed(2)}</span>
                    <span class="subtotal">$${((itemCart[1].quantity * itemCart[1].productJson.price).toFixed(2))}</span></p>
                    </div>
                    <button class="remove_button"><img src="/images/icon-remove-item.svg"></button> `;

                cartHTML.appendChild(new_cart_entry);

                const rem_button = new_cart_entry.querySelector(".remove_button");
                rem_button.addEventListener("click", () => {
                    removeFromCart(itemCart[0]);
                    resetButtonCart(itemCart[0], itemCart[1].productJson);
                    renderCart();
                });


            }else{
                
                const subtotal = itemCartNode.querySelector(".subtotal");
                const quantity = itemCartNode.querySelector(".quantity");

                quantity.innerText = itemCart[1].quantity;
                subtotal.innerText = (itemCart[1].quantity * itemCart[1].productJson.price).toFixed(2);

            }
        }

        const order_total_element = document.createElement("div");
        order_total_element.classList.add("order_total");
        order_total_element.innerHTML = `<p>Order Total</p>
                                         <p>$${calculateTotalOrderAmount().toFixed(2)}</p>`;
        cartHTML.appendChild(order_total_element);

        const carbon_neutral_element = document.createElement("div");
        carbon_neutral_element.classList.add("carbon_neutral");
        carbon_neutral_element.innerHTML = `<img src="/images/icon-carbon-neutral.svg">
                                            <p>This is a <span>carbon-neutral</span> delivery</p>`;
        cartHTML.appendChild(carbon_neutral_element);

        const confirm_order_button = document.createElement("button");
        confirm_order_button.classList.add("confirm_order_button");
        confirm_order_button.innerText = "Confirm Order"
        cartHTML.appendChild(confirm_order_button);

        confirm_order_button.addEventListener("click", () => {
            const conf_modal_child = renderModalConfiguration();
            const grid_page_div = document.querySelector("body");
            grid_page_div.appendChild(conf_modal_child);
        })

    } else if(cart.size === 0){
        cartHTML.classList.add("cart_empty");
        
        cartHTML.innerHTML = `<p class="cart_title">Your Cart (0)</p>
        <div class="cart_image_legend">
            <img src="/images/illustration-empty-cart.svg">
            <p class="cart_legend">Your added items will appear here</p>
        </div>`
    }

}



document.addEventListener("DOMContentLoaded", async (e) => {
    const productsJson = await getData();
    placeProductsOnGrid(productsJson);
    buttonProductFunctionality(productsJson);
    renderCart();



})
    



