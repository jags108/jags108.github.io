const container = document.querySelector(".products-container");
products = [];
let currentIndex = 0;
const chunkSize = 6;

// ! CHAGNE APPEARANCE OF HEADER ON SCROLL
window.addEventListener("scroll", () => {
  const scrollPosition = window.pageYOffset;
  const header = document.querySelector("header");
  if (scrollPosition > 350) {
    header.classList.add("active");
  } else {
    if (header.classList.contains("active")) {
      header.classList.remove("active");
    }
  }
  if (scrollPosition > 500) {
    header.classList.add("solid");
  } else {
    if (header.classList.contains("solid")) {
      header.classList.remove("solid");
    }
  }
});

function getColorsHTML(product) {
  let colorsHTML = "";
  let isOutOfStock = true;
  if (product.colors && Array.isArray(product.colors)) {
    product.colors.forEach((color) => {
      // Create a div for each color
      let divHTML = `<div class="`;
      if (color.stock === 0) {
        divHTML += "out-of-stock ";
      } else {
        isOutOfStock = false;
      }
      if (availableColors.includes(color.name)) {
        divHTML += `product-${color.name}`;
      }
      divHTML += '" ';

      divHTML += ">";

      // If it's a named color, use a class
      if (!availableColors.includes(color.name)) {
        divHTML += `<img src="${color.name}" alt="color image" />`;
      }

      divHTML += "</div>";
      colorsHTML += divHTML;
    });
  }
  return [colorsHTML, isOutOfStock];
}

function generateProductCards(dataChunk, append = false) {
  if (!append) container.innerHTML = "";

  dataChunk.forEach((product) => {
    const [colorsHTML, isOutOfStock] = getColorsHTML(product);
    let hasDiscount = false;
    let styleOfContainer = "";
    let isOutOfStockText = "";
    if ("discount" in product) hasDiscount = true;
    if (product.colors.length > 1) styleOfContainer += 'style="opacity:1"';
    if (isOutOfStock) isOutOfStockText = "out-of-stock";

    const card = document.createElement("div");
    card.className = "product";
    card.innerHTML = `
        <div class="product-image">
    <img src="${product.image}" />
    <div class="product-colors" ${styleOfContainer}>
      ${colorsHTML}
    </div>
  </div>
  <div class="product-content">
    <div class="product-info">
      <h6>${product.name}</h6>
      <div class="product-prices">
      <p class="${hasDiscount ? "discount" : ""}">₹ ${product.price}</p>
      ${hasDiscount ? `<p> ₹ ${product.discount}</p>` : ""}
      </div>
    </div>
    <a><i class="ri-shopping-cart-line ${isOutOfStockText}"></i></a>
  </div>
    `;

    container.appendChild(card);
  });

  const productCards = document.querySelectorAll(".product");
  productCards.forEach((productCard, idx) => {
    productCard.addEventListener("click", () => {
      const product = products[currentIndex - chunkSize + idx];
      window.location.href = `/product.html?name=${encodeURIComponent(
        product.name
      )}`;
    });
  });
}

function loadNextChunk() {
  const loadMoreBtn = document.querySelector(".load-more-btn");
  const nextChunk = products.slice(currentIndex, currentIndex + chunkSize);
  generateProductCards(nextChunk, true);
  currentIndex += chunkSize;

  if (currentIndex >= products.length) {
    loadMoreBtn.style.display = "none";
  }
}

fetch("./assets/data/products.json")
  .then((res) => res.json())
  .then((data) => {
    products = data;
    loadNextChunk();
  });

document.addEventListener("DOMContentLoaded", () => {
  const loadMoreBtn = document.querySelector(".load-more-btn");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      loadNextChunk();
    });
  }
});
