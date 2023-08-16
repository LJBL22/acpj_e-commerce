const BASE_URL = 'https://dummyjson.com/products'
const limit = 0
const select = 'title,price,images'
const INDEX_URL = `${BASE_URL}?limit=${limit}&select=${select}`
const PRODUCTS_PER_PAGE = 20

const productList = []
let currentPage = 1

const productPanel = document.querySelector('#product-wrapper')
const paginator = document.querySelector('#paginator')

function getProducts() {
  fetch(INDEX_URL)
    .then(res => res.json())
    .then(data => {
      const items = data.products
      productList.push(...items);
      renderPaginator(productList.length, currentPage)
      renderProducts(getProductsByPage(currentPage))
      intersectionObserve()
    })
    .catch((error) => console.log("Error:", error.message))
}
function intersectionObserve() {
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
function getProductsByPage(page) {
  const startIndex = (page - 1) * PRODUCTS_PER_PAGE
  return productList.slice(startIndex, startIndex + PRODUCTS_PER_PAGE) //傳出分頁完的該頁產品供渲染
}
function renderPaginator(amount, currentPage) {
  const totalPages = Math.ceil(amount / PRODUCTS_PER_PAGE) //100 = 20 * 5
  let HTMLContent = ''
  for (let page = 1; page <= totalPages; page++) { //這裡不寫 i ，直接語意化命名 page
    if (page === currentPage) {
      HTMLContent += `<li class="page-item active"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
    } else {
      HTMLContent += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>` //新增 data-* 屬性是關鍵，方便未來取
    }
  }
  paginator.innerHTML = HTMLContent
}
function goToPage(event) {
  if (event.target.tagName !== 'A') return // 錯誤處理 i.e 我們只要 tagName = A 的時候才執行此函式；否則跳出結束
  const page = Number(event.target.dataset.page)
  currentPage = page //MA
  renderPaginator(productList.length, currentPage)
  renderProducts(getProductsByPage(currentPage))
  intersectionObserve()
}

// main code & eventListener
getProducts();
paginator.addEventListener('click', goToPage)
