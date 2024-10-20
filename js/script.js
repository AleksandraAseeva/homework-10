const categorySelect = document.getElementById("category-select");
const filterBtn = document.getElementById("filter-btn");
const productsContainer = document.getElementById("products-container");
const savedCategory = localStorage.getItem("selectedCategory");

// Fetch categories start

// function getCategories() {
//   fetch("https://fakestoreapi.com/products/categories")
//     .then((res) => res.json())
//     .then((categories) => renderCategories(categories));
// }

async function getCategories() {
  try {
    fetch("https://fakestoreapi.com/products/categories")
    .then((res) => res.json())
    .then((categories) => renderCategories(categories));
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Ошибка:', error);
  }
}

function renderCategories(categories) {
  categorySelect.innerHTML = "";
  categorySelect.innerHTML += `
    <option value="">All</option>
    `;
  categories.forEach((category) => {
    categorySelect.innerHTML += `<option value="${category}">${category}</option>`;
  });
  if (savedCategory) {
    categorySelect.value = savedCategory;
  }
}

getCategories();

// Fetch categories end

filterBtn.addEventListener("click", () => {
  const selectedCategory = categorySelect.value;

  localStorage.setItem("selectedCategory", selectedCategory);

  fetchProducts(categorySelect.value);
});

function fetchProducts(category) {
  let apiUrl = "https://fakestoreapi.com/products";
  if (category) {
    apiUrl += "/category/" + category;
  }
  fetch(apiUrl)
    .then((response) => response.json())
    .then((products) => displayProducts(products))
    .catch((error) => console.log("Error Fetching products: " + error));
}

function displayProducts(products) {
  productsContainer.innerHTML = "";
  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.setAttribute('data-id', `${product.id}`);
    card.innerHTML = `
        <img
          class="product-img"
          src="${product.image}"
          alt="${product.title}"
        />
        <h3 class="item-title">${product.title}</h3>
        <p class="item-price">$${product.price}</p>
        <p class="item-category">Category: ${product.category}</p>
        <p class="item-description">${product.description.slice(0,150)}...</p>
        
        <button data-cart type="button" class="custom-toast success-toast btn-outline-warning">+ в
									корзину</button>
    `;
    productsContainer.appendChild(card);
  });
}

fetchProducts(savedCategory);

// корзина
//div снутри корзины, в который мы добавляем товары
const cartWrapper = document.querySelector(".cart-wrapper");

//отслеживаем клик на странице
window.addEventListener("click", function (event) {
  //проверяем что клик был совершен по кнопке "добавить в корзину"
  if (event.target.hasAttribute("data-cart")) {

    //уведомление начало
    let icon = {
      success: '<span class="material-symbols-outlined">✅</span>',
    };

    const showToast = (
      message = "Sample Message",
      toastType = "info",
      duration = 5000
    ) => {
      if (!Object.keys(icon).includes(toastType)) toastType = "info";

      let box = document.createElement("div");
      box.classList.add("toast", `toast-${toastType}`);
      box.innerHTML = ` <div class="toast-content-wrapper">
                    <div class="toast-icon">
                    ${icon[toastType]}
                    </div>
                    <div class="toast-message">${message}</div>
                    <div class="toast-progress"></div>
                    </div>`;
      duration = duration || 5000;
      box.querySelector(".toast-progress").style.animationDuration = `${
        duration / 1000
      }s`;

      let toastAlready = document.body.querySelector(".toast");
      if (toastAlready) {
        toastAlready.remove();
      }

      document.body.appendChild(box);
    };

    showToast("product added to cart", "success", 5000);
    //уведомление конец

    //находим карточку с товаром, внутри которой был совершен клик
    const card = event.target.closest(".product-card");

    //собираем данные с этого товара и записываем их в единый объект productInfo
    const productInfo = {
      id: card.dataset.id,
      imgSrc: card.querySelector(".product-img").getAttribute("src"),
      // counter: card.querySelector('[data-counter]').innerText,
      title: card.querySelector(".item-title").innerText,
      price: card.querySelector(".item-price").innerText,
      category: card.querySelector(".item-category").innerText,
    };

    //проверяем есть ли уже такой товар в корзине
    const itemInCart = cartWrapper.querySelector(`[data-id="${productInfo.id}"]`);
    
    // если товар есть в корзине
    if (itemInCart) {
      const counterElem = itemInCart.querySelector('[data-counter]');
      counterElem.innerText = parseInt(counterElem.innerText);
      counterElem.innerText = ++counterElem.innerText;
    } else {
      // если товара нет в корзине
   

    //собранные данные подставим в шаблон для товара в корзине
    const cartItemHTML = `
    <div class="cart-item" data-id="${productInfo.id}">
              <div class="cart-item__top">
                <div class="cart-item-img">
                  <img src="${productInfo.imgSrc}" alt="${productInfo.title}">
                </div>
                <div class="cart-item__desc">
                  <div class="cart-item__title">${productInfo.title}</div>
                  <div class="cart-item__details">
                    <div class="items items--small counter-wrapper">
                      <div type="button" class="items__control custom-toast success-toast " data-action="minus">-</div>
                      <div class="items__current" data-counter="">1</div>
                      <div class="items__control" data-action="plus">+</div>
                    </div>
                    <div class="price">
                     <p><span class="rouble">$</span><span class="price__currency">${productInfo.price.slice(1,)}</span> </p>
                     
                    </div>
                  </div>
                </div>
              </div>
            </div>
            `;

    //отобразим товар в корзине
    // этот метод позволяет вставлять кусок html разметки внутрь элемента
    cartWrapper.insertAdjacentHTML("beforeend", cartItemHTML);
    } 

    //отображение статуса корзины Пустая/Полная
    togglelCartStatus();

    //пересчет общей стоимости товаров в корзине
    calcCartPriceAndDelivery();
  }
});

