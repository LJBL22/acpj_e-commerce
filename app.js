const BASE_URL = 'https://dummyjson.com/products'
const limit = 0
const select = 'title,price,images'
const INDEX_URL = `${BASE_URL}?limit=${limit}&select=${select}`
const productPanel = document.querySelector('#product-wrapper')
const productList = []

// 使用原生 fetch 方法
function getProducts() {
  fetch(INDEX_URL)
    // 返回 Promise，resolves 輸出成 JSON 物件
    .then(res => res.json())
    // // .then(data => console.log(data)) 相等於下面這行，直接印出 Promise 傳來的結果
    // .then(console.log)
    // 前一個 Promise 成功 return 的值是下一個 chain 調用的參數
    .then(data => {
      const items = data.products
      productList.push(...items);
      renderProducts(productList)
    })
    .catch((error) => console.log("Error:", error.message))
}

function renderProducts(products) {
  let htmlContent = ''
  products.forEach(product => {
    htmlContent += `
        <article class="item-card">
            <a href="#add-to-favourite">
              <div class="circle-btn">
                <i class="icon fa-regular fa-heart"></i>
              </div>
            </a>
            <a href="#item-id" class="direct-to-item">
              <div class="img-container img-item-a bg-cover">
                <img
                  src="${product.images[0]}"
                  alt="product-img"
                  class="product-img"
                />
              </div>
              <div class="item-details">
                <p class="item-heading">${product.title}</p>
                <p class="item-price">${product.price} USD</p>
              </div>
            </a>
          </article>
    `
  })
  productPanel.innerHTML = htmlContent
}

getProducts();