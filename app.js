const BASE_URL = 'https://dummyjson.com/products'
const limit = 0
const select = 'title,price,images'
const INDEX_URL = `${BASE_URL}?limit=${limit}&select=${select}`
const productPanel = document.querySelector('#product-wrapper')
const productList = []

function getProducts() {
  fetch(INDEX_URL)
    .then(res => res.json())
    .then(data => {
      const items = data.products
      productList.push(...items);
      renderProducts(productList)

      // 選到每一個 item-card
      const targetList = document.querySelectorAll('.item-card')
      const observer = new IntersectionObserver(callbackFunc, {
        threshold: .6
      })

      function callbackFunc(entries, observer) {
        // 現在的問題是沒有一個在可視範圍(值為false)，因為全部在最剛開始都是沒有 show 的。
        // => display: none 會使 InterOb 觀察不到該元素，進而無法觸發後續 callback func
        // iterate 每一個 entry ，如果在可視範圍 isInter: true，即加上 show opacity: 1
        entries.forEach(entry => {
          entry.target.classList.toggle("show", entry.isIntersecting);
          // 讓已出現的元素保留
          if (entry.isIntersecting) observer.unobserve(entry.target)
        })
      }
      targetList.forEach(target => { observer.observe(target) })
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