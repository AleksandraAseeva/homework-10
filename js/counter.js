// добавляем прослушку на всём окне
window.addEventListener("click", function (event) {
  //объявляем переменную для счетчика
  let counter;

  //проверяем клик строго по кнопке плюс или минус
  if (
    event.target.dataset.action === "plus" ||
    event.target.dataset.action === "minus"
  ) {
    //находим обертку счетчика
    const counterWrapper = event.target.closest(".counter-wrapper");
    //находим див с числом счетчика
    counter = counterWrapper.querySelector("[data-counter]");
  }

  // проверяем является ли элемент по которому был совершен клик кнопкой плюс
  if (event.target.dataset.action === "plus") {
    //изменяем текст в счетчике увеличивая его на 1
    counter.innerText = ++counter.innerText;
  }

  // проверяем является ли элемент по которому был совершен клик кнопкой минус
  if (event.target.dataset.action === "minus") {
    if (parseInt(counter.innerText) > 1) {
      //изменяем текст в счетчике уменьшая его на 1
      counter.innerText = --counter.innerText;
    } else if (parseInt(counter.innerText) === 1) {
      //удаляем товар из корзины
      event.target.closest(".cart-item").remove();

      //отображение статуса корзины Пустая/Полная
      togglelCartStatus();

      //пересчет общей стоимости товаров в корзине
      calcCartPriceAndDelivery();

      //уведомление начало
      let icon = {
        warning: '<span class="material-symbols-outlined">🗑</span>',
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

      showToast("product removed from cart", "warning", 5000);

      //уведомление конец
    }
  }

  //проверяем клик на + или - внутри корзины
  if (event.target.hasAttribute("data-action") && event.target.closest('.cart-wrapper')) {
    //пересчет общей стоимости товаров в корзине
    calcCartPriceAndDelivery();
  }
});
