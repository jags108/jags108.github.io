// ! INITIALIZATION
var activeColor = null;

// ! GET PRODUCT NAME
const params = new URLSearchParams(window.location.search);
const product_name = params.get("name");

// ! CHAGNE APPEARANCE OF HEADER ON SCROLL
window.addEventListener("scroll", () => {
  const scrollPosition = window.pageYOffset;
  const header = document.querySelector("header");
  if (scrollPosition > 40) {
    header.classList.add("active");
    header.classList.add("solid");
  } else {
    if (header.classList.contains("active")) {
      header.classList.remove("active");
    }
    if (header.classList.contains("solid")) {
      header.classList.remove("solid");
    }
  }
});

//? IMAGE FUNCTIONALITY COMPLETE CODE ?//

function setMainImage(newActiveSideImage) {
  const oldActiveSideImage = document.querySelector(`.all-images .active`);
  if (oldActiveSideImage) {
    oldActiveSideImage.classList.remove("active");
  }

  const mainImage = document.querySelector(`.onscreen-image img`);
  mainImage.src = newActiveSideImage.src;
  newActiveSideImage.classList.add("active");
}

function generateSideImages(images) {
  const allImages = document.querySelector(`.all-images`);
  allImages.innerHTML = "";
  imageIndex = 0;
  firstImage = null;
  images.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.dataset.colorId = imageIndex + 1;
    img.addEventListener("click", () => {
      setMainImage(img);
    });
    allImages.appendChild(img);
    if (imageIndex === 0) {
      firstImage = img;
    }
    imageIndex++;
  });
  setMainImage(firstImage);
}

//? COLOR FUNCTIONALITY COMPLETE CODE ?//

// ! COLOR CLICK FUNCTION
function clickColor(colorId) {
  const currentActive = document.querySelector(`.product-colors .active`);
  if (currentActive) {
    currentActive.classList.remove("active");
  }
  activeColor = colorId;
  const newActive = document.querySelector(
    `.product-colors [data-color-id="${colorId}"]`
  );
  setMainImage(
    document.querySelector(`.all-images [data-color-id="${colorId}"]`)
  );
  if (newActive) {
    newActive.classList.add("active");
  }
}

// ! SET VALUES OF THE PAGE
function setValues(product) {
  document.querySelector(".title").textContent = product.name;
  document.querySelector(".price").textContent = `₹ ${product.price}/- `;

  let isOutOfStock = true;

  if (product.colors.length > 1) {
    product.colors.forEach((color) => {
      const div = document.createElement("div");
      div.classList.add("square");
      div.dataset.colorId = color.id;

      // Add Image or Named Color
      if (availableColors.includes(color.name)) {
        div.classList.add(`product-${color.name}`);
      } else {
        const image = document.createElement("img");
        image.src = color.name;
        div.appendChild(image);
      }

      // Button Functionality
      if (color.stock !== 0) {
        if (activeColor === null) {
          activeColor = color.id;
        }
        div.addEventListener("click", () => {
          clickColor(color.id);
        });
        isOutOfStock = false;
      } else {
        div.classList.add("out-of-stock");
      }

      document.querySelector(".product-colors").appendChild(div);
    });

    // Set Active Item
    if (activeColor !== null) {
      const firstActive = document.querySelector(
        `.product-colors [data-color-id="${activeColor}"]`
      );
      if (firstActive) {
        firstActive.classList.add("active");
      }
    }
  } else {
    document.querySelector(".color-details-conatainer").style.display = "none";
    if (product.colors[0].stock !== 0) {
      isOutOfStock = false;
    }
  }

  if (isOutOfStock) {
    document.querySelector(".buy-btn").classList.add("disabled");
    document.querySelector(".buy-btn a").textContent = "Out Of Stock";
  }
}

// ! FETCH PRODUCTS AND FIND MATCH
fetch("/assets/data/products.json")
  .then((res) => res.json())
  .then((products) => {
    const product = products.find((p) => p.name === product_name);
    setValues(product);
    generateSideImages(product.images);
  });
