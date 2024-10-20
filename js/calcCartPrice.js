function calcCartPriceAndDelivery() {
    const cartItems = document.querySelectorAll('.cart-item');
    const totalPriceEl = document.querySelector('.total-price');
    const deliveryCost = document.querySelector('.delivery-cost');
    const cartDelivery = document.querySelector('[data-cart-delivery]');

    //общая стоимость товаров
    let totalPrice = 0;
    let smallCart = 0;

    //обходим все блоки с ценами в корзине
    cartItems.forEach(function (item) {
        //находим количество товаров
        const amountEl = item.querySelector('[data-counter]');
        const priceEl = item.querySelector('.price__currency');
        //добавляем стоимость товара в общую стоимость (кол-во * цену)
        const currentPrice = parseInt(amountEl.innerText) * parseInt(priceEl.innerText);
        totalPrice += currentPrice;
        smallCart += parseInt(amountEl.innerText);
    })

    
    //отображаем цену на странице
    totalPriceEl.innerText = totalPrice;

    //отображаем кол-во товаров в маленькой корзине
    let dynamicCount = document.querySelector(".dynamic-count");
    dynamicCount.innerText = smallCart

    //скрываем/показываем блок со стоимостью доставки
    if (totalPrice > 0) {
        cartDelivery.classList.remove('none');
    } else {
        cartDelivery.classList.add('none');
    }

    //указываем стоимость доставки
    if (totalPrice >= 300) {
        deliveryCost.classList.add('free');
        deliveryCost.innerText = 'бесплатно';
    } else {
        deliveryCost.classList.remove('free');
        deliveryCost.innerText = '$30'
    }
}