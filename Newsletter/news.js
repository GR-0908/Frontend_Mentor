const initial_container = document.getElementById("container");
const success_card = document.getElementById("success_card");
const form = document.getElementById("email_form");
const input_form = document.getElementById("email_input");
const button_sucess = document.getElementById("success_btn");
const address = document.getElementById("address");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (input_form.value !== "" && (input_form.checkValidity())){
        address.textContent = input_form.value;
        initial_container.hidden = true;
        success_card.hidden = false;
    }
})

button_sucess.addEventListener("click", () => {
     initial_container.hidden = false;
     success_card.hidden = true;
     form.reset();
})

