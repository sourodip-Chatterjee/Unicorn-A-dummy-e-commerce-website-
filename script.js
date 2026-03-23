/* ==========================================================================
   UNICORN E-COMMERCE - MASTER JAVASCRIPT
   ========================================================================== */

// ==========================================
// CHAPTER 1: GLOBAL VARIABLES & DATA
// ==========================================
let cart = JSON.parse(localStorage.getItem("unicornCart")) || [];
let wishlist = JSON.parse(localStorage.getItem("unicornWishlist")) || [];
let currentDiscount = parseFloat(localStorage.getItem("unicornDiscount")) || 0;
let isCustomCursor = localStorage.getItem("unicornCursor") !== "disabled";
let selectedProductSize = null;

const allProducts = [
  {
    name: "Sage Linen Wrap Dress",
    price: 65,
    color: "A3B18A",
    image: "img/sage-dress.jpg",
  },
  {
    name: "Terracotta Midi",
    price: 85,
    color: "D4A373",
    image: "img/terracotta-dress.jpg",
  },
  {
    name: "Ivory Cotton Sundress",
    price: 50,
    color: "FAEDCD",
    image: "img/ivory-dress.jpg",
  },
  {
    name: "Forest Fern Gown",
    price: 110,
    color: "588157",
    image: "img/fern-dress.jpg",
  },
  {
    name: "Willow Ruffle Dress",
    price: 75,
    color: "7D8A71",
    image: "img/willow-dress.jpg",
  },
  {
    name: "Midnight Silk Slip",
    price: 95,
    color: "344E41",
    image: "img/midnight-slip.jpg",
  },
  {
    name: "Amber Dawn Maxi",
    price: 80,
    color: "CB997E",
    image: "img/amber-maxi.jpg",
  },
  {
    name: "Stone Washed Tunic",
    price: 55,
    color: "B7B7A4",
    image: "img/stone-tunic.jpg",
  },
  {
    name: "Meadow Floral Mini",
    price: 60,
    color: "DDA15E",
    image: "img/meadow-mini.jpg",
  },
  {
    name: "Moss Pleated Dress",
    price: 90,
    color: "606C38",
    image: "img/moss-dress.jpg",
  },
  {
    name: "Clay Tiered Sundress",
    price: 70,
    color: "BC6C25",
    image: "img/clay-sundress.jpg",
  },
  {
    name: "River Slate Shift",
    price: 65,
    color: "6C7A89",
    image: "img/river-shift.jpg",
  },
  {
    name: "Hemp Woven Tote",
    price: 45,
    color: "E9EDC9",
    image: "img/hemp-tote.jpg",
  },
  {
    name: "Cork Crossbody Bag",
    price: 55,
    color: "C19A6B",
    image: "img/cork-bag.jpg",
  },
  {
    name: "Recycled Canvas Messenger",
    price: 50,
    color: "8A9A5B",
    image: "img/canvas-messenger.jpg",
  },
];

// ==========================================
// CHAPTER 2: UTILITIES (CURSOR & PROFANITY)
// ==========================================
const cursorToggleBtn = document.getElementById("cursor-toggle");

function applyCursorState() {
  if (isCustomCursor) document.body.classList.add("nature-cursor");
  else document.body.classList.remove("nature-cursor");

  if (cursorToggleBtn) {
    let iconCircle = cursorToggleBtn.querySelector(".circle-icon");
    if (!iconCircle) {
      cursorToggleBtn.className = "nav-action-wrapper";
      cursorToggleBtn.innerHTML = `
        <div class="circle-icon" style="width: 25px; height: 25px; font-size: 1.25rem; border-color: #A3B18A; background-color: #FAFAFA;"></div>
        <span class="nav-label">Cursor</span>`;
      iconCircle = cursorToggleBtn.querySelector(".circle-icon");
    }
    iconCircle.textContent = isCustomCursor ? "🖱️" : "🍀";
    cursorToggleBtn.title = isCustomCursor
      ? "Switch to Standard Cursor"
      : "Switch to Nature Cursor";
  }
}

if (cursorToggleBtn) {
  cursorToggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    isCustomCursor = !isCustomCursor;
    localStorage.setItem(
      "unicornCursor",
      isCustomCursor ? "enabled" : "disabled",
    );
    applyCursorState();
  });
}

const badWordsList = [
  "hate",
  "stupid",
  "dumb",
  "trash",
  "scam",
  "ugly",
  "terrible",
  "awful",
  "crap",
  "fuck",
  "bitch",
  "motherfucker",
];
function cleanText(text) {
  let safeText = text;
  badWordsList.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    safeText = safeText.replace(regex, "***");
  });
  return safeText;
}

// ==========================================
// CHAPTER 3: STATE MANAGEMENT (CART & WISHLIST)
// ==========================================
function updateCartCount() {
  const countElement = document.getElementById("cart-count");
  const cartIconImg = document.getElementById("cart-icon-img");
  const floatingCount = document.getElementById("floating-cart-count");
  const floatingImg = document.getElementById("floating-cart-img");

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (countElement) {
    countElement.textContent = totalItems;
    countElement.style.display = totalItems > 0 ? "flex" : "none";
  }
  if (cartIconImg)
    cartIconImg.src =
      totalItems > 0 ? "img/flower-basket.png" : "img/empty-basket.png";

  if (floatingCount) {
    floatingCount.textContent = totalItems;
    floatingCount.style.display = totalItems > 0 ? "flex" : "none";
  }
  if (floatingImg)
    floatingImg.src =
      totalItems > 0 ? "img/flower-basket.png" : "img/empty-basket.png";
}

function saveCart() {
  localStorage.setItem("unicornCart", JSON.stringify(cart));
  if (cart.length === 0) {
    currentDiscount = 0;
    localStorage.setItem("unicornDiscount", "0");
    const couponMsg = document.getElementById("coupon-message");
    if (couponMsg) couponMsg.style.display = "none";
  }
  updateCartCount();
}

function updateWishlistCount() {
  const countElement = document.getElementById("wishlist-count");
  if (countElement) {
    countElement.textContent = wishlist.length;
    countElement.style.display = wishlist.length > 0 ? "flex" : "none";
  }
}

function saveWishlist() {
  localStorage.setItem("unicornWishlist", JSON.stringify(wishlist));
  updateWishlistCount();
}

// ==========================================
// CHAPTER 4: PRODUCT PAGE LOGIC
// ==========================================
const urlParams = new URLSearchParams(window.location.search);
const pName = urlParams.get("name");
const pPrice = urlParams.get("price");
const pColor = urlParams.get("color");
const pImage = urlParams.get("image");

if (document.getElementById("detail-name") && pName) {
  document.getElementById("detail-name").textContent = pName;
  document.getElementById("detail-price").textContent =
    `$${parseFloat(pPrice).toFixed(2)} CAD`;

  const imageBox = document.getElementById("detail-image-box");
  if (imageBox && pImage) {
    imageBox.src = pImage;
  } else if (imageBox) {
    imageBox.style.backgroundColor = `#${pColor}`;
  }

  const productSection = document.querySelector(".product-page-container");
  if (productSection)
    productSection.style.background = `linear-gradient(to bottom, #${pColor} 0%, #FAFAFA 100%)`;

  const detailAddBtn = document.getElementById("detail-add-btn");
  if (detailAddBtn) {
    detailAddBtn.setAttribute("data-name", pName);
    detailAddBtn.setAttribute("data-price", pPrice);
    detailAddBtn.setAttribute("data-color", `#${pColor}`);
  }

  // Buy Now
  const buyNowBtn = document.getElementById("detail-buy-btn");
  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", () => {
      const existingItem = cart.find((item) => item.name === pName);
      if (!existingItem) {
        cart.push({
          name: pName,
          price: parseFloat(pPrice),
          color: `#${pColor}`,
          quantity: 1,
        });
        saveCart();
      }
      window.location.href = "checkout.html";
    });
  }

  // Wishlist (Main Detail Page)
  const wishBtn = document.getElementById("detail-wishlist-btn");
  if (wishBtn) {
    let inWishlist = wishlist.some((item) => item.name === pName);
    if (inWishlist) {
      wishBtn.textContent = "❤️ Saved";
      wishBtn.classList.add("active");
    }

    wishBtn.addEventListener("click", () => {
      inWishlist = wishlist.some((item) => item.name === pName);
      if (inWishlist) {
        wishlist = wishlist.filter((item) => item.name !== pName);
        wishBtn.textContent = "🤍 Save";
        wishBtn.classList.remove("active");
      } else {
        wishlist.push({
          name: pName,
          price: parseFloat(pPrice),
          color: pColor,
          image: pImage,
        });
        wishBtn.textContent = "❤️ Saved";
        wishBtn.classList.add("active");
      }
      saveWishlist();
      syncGridWishlistButtons(); // Instantly syncs any suggestion grid hearts below!
    });
  }

  // Suggestions Grid
  const suggestionGrid = document.getElementById("suggestion-grid");
  if (suggestionGrid) {
    const availableProducts = allProducts.filter((p) => p.name !== pName);
    for (let i = availableProducts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableProducts[i], availableProducts[j]] = [
        availableProducts[j],
        availableProducts[i],
      ];
    }

    suggestionGrid.innerHTML = "";
    availableProducts.slice(0, 3).forEach((item) => {
      const inWishlist = wishlist.some((w) => w.name === item.name);
      const wishText = inWishlist ? "❤️" : "🤍";

      suggestionGrid.innerHTML += `
        <div class="product-card" style="background: linear-gradient(to bottom, #${item.color} 0%, #FFFFFF 100%); border: none; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
            <a href="product.html?name=${item.name}&price=${item.price}&color=${item.color}&image=${item.image}">
                <img src="${item.image}" alt="${item.name}" class="product-image">
            </a>
            <h3>${item.name}</h3>
            <p class="price">$${item.price.toFixed(2)} CAD</p>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
                <button class="action-btn buy-now-btn grid-buy-now-btn" style="padding: 10px; font-size: 0.95rem; border-radius: 6px;" data-name="${item.name}" data-price="${item.price}" data-color="#${item.color}">Buy Now</button>
                <div style="display: flex; gap: 8px;">
                    <div style="flex: 1;">
                        <button class="add-to-cart-btn" style="width: 100%; padding: 10px; border-radius: 6px;" data-name="${item.name}" data-price="${item.price}" data-color="#${item.color}">Add to Basket</button>
                    </div>
                    <button class="grid-wishlist-btn" style="background: white; border: 1px solid #DAD7CD; border-radius: 6px; width: 45px; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;" data-name="${item.name}" data-price="${item.price}" data-color="${item.color}" data-image="${item.image}">${wishText}</button>
                </div>
            </div>
        </div>`;
    });
  }
}

// ==========================================
// CHAPTER 5: UI INTERACTIONS (ZOOM, SIZES, EMOJIS)
// ==========================================
// Size Memory
const sizeBtns = document.querySelectorAll(".size-btn");
if (sizeBtns.length > 0) {
  sizeBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      sizeBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      selectedProductSize = this.textContent;
    });
  });
}

// Click-to-Zoom
const zoomContainer = document.getElementById("zoom-container");
const zoomImage = document.getElementById("detail-image-box");
if (zoomContainer && zoomImage) {
  let isZoomActive = false;
  zoomContainer.addEventListener("click", function (e) {
    isZoomActive = !isZoomActive;
    if (isZoomActive) {
      zoomContainer.style.cursor = "zoom-out";
      zoomImage.style.transform = "scale(2.0)";
      updateZoomPosition(e);
    } else {
      zoomContainer.style.cursor = "zoom-in";
      zoomImage.style.transform = "scale(1)";
      zoomImage.style.transformOrigin = "center center";
    }
  });

  zoomContainer.addEventListener("mousemove", function (e) {
    if (isZoomActive) updateZoomPosition(e);
  });

  zoomContainer.addEventListener("mouseleave", function () {
    if (isZoomActive) {
      isZoomActive = false;
      zoomContainer.style.cursor = "zoom-in";
      zoomImage.style.transform = "scale(1)";
      zoomImage.style.transformOrigin = "center center";
    }
  });

  function updateZoomPosition(e) {
    const rect = zoomContainer.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    zoomImage.style.transformOrigin = `${x}% ${y}%`;
  }
}

// Emoji Rating Click
const emojiContainer = document.getElementById("emoji-rating-input");
const starsInput = document.getElementById("review-stars");
if (emojiContainer && starsInput) {
  const emojis = emojiContainer.querySelectorAll("span");
  emojis.forEach((emoji) => {
    emoji.addEventListener("click", function () {
      starsInput.value = this.getAttribute("data-val");
      emojis.forEach((e) => e.classList.remove("selected"));
      this.classList.add("selected");
    });
  });
}

// ==========================================
// CHAPTER 6: REVIEWS SYSTEM
// ==========================================
function renderProductReviews() {
  const reviewsList = document.getElementById("reviews-list");
  if (!reviewsList || !pName) return;

  const storageKey = `unicornReviews_${pName}`;
  const productReviews = JSON.parse(localStorage.getItem(storageKey)) || [];
  reviewsList.innerHTML = "";

  if (productReviews.length === 0) {
    reviewsList.innerHTML =
      '<p style="color: #777; font-style: italic; text-align: center; padding: 40px 0;">No reviews yet. Be the first to share your thoughts!</p>';
    return;
  }

  [...productReviews].reverse().forEach((review, reversedIndex) => {
    const originalIndex = productReviews.length - 1 - reversedIndex;
    const emojiArray = ["😠", "🙁", "😐", "🙂", "😍"];
    const displayEmoji = emojiArray[review.stars - 1] || "😍";

    const imgHtml = review.image
      ? `<img src="${review.image}" class="review-uploaded-img" alt="Customer Photo">`
      : "";

    let repliesHtml = "";
    if (review.replies && review.replies.length > 0) {
      review.replies.forEach((reply) => {
        repliesHtml += `
          <div class="reply-card">
              <strong style="color: #344E41;">${reply.name}</strong> <span style="color: #888; font-size: 0.8rem;">(Reply)</span>
              <p style="margin: 5px 0 0; color: #555; line-height: 1.5;">${reply.text}</p>
          </div>`;
      });
    }

    reviewsList.innerHTML += `
        <div class="review-card">
            <div class="review-header">
                <div><strong style="color: #344E41; font-size: 1.1rem;">${review.name}</strong><span class="verified-badge">✓ Verified Buyer</span></div>
                <div class="review-stars-display">${displayEmoji}</div>
            </div>

            <div id="review-text-display-${originalIndex}"><p class="review-text">${review.text}</p>${imgHtml}</div>

            <div id="review-edit-form-${originalIndex}" style="display: none; margin-bottom: 15px;">
                <textarea id="edit-text-input-${originalIndex}" rows="3" style="width: 100%; padding: 10px; border: 1px solid #588157; border-radius: 6px; margin-bottom: 10px; font-family: inherit; resize: vertical;">${review.text}</textarea>
                <div style="display: flex; gap: 10px;">
                    <button onclick="saveEdit(${originalIndex})" style="background: #588157; color: white; border: none; padding: 6px 15px; border-radius: 4px; cursor: pointer; font-weight: bold;">Save</button>
                    <button onclick="toggleEditReview(${originalIndex})" style="background: white; color: #555; border: 1px solid #DAD7CD; padding: 6px 15px; border-radius: 4px; cursor: pointer;">Cancel</button>
                </div>
            </div>

            <div class="review-actions-bar">
                <button class="review-action-btn btn-reply" onclick="toggleReplyForm(${originalIndex})">↳ Reply</button>
                <button class="review-action-btn btn-edit" onclick="toggleEditReview(${originalIndex})">✎ Edit</button>
                <button class="review-action-btn btn-delete" onclick="deleteReview(${originalIndex})">🗑 Delete</button>
            </div>

            <div class="reply-form" id="reply-form-${originalIndex}">
                <input type="text" id="reply-name-${originalIndex}" placeholder="Your Name" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #DAD7CD; border-radius: 5px;">
                <textarea id="reply-text-${originalIndex}" rows="2" placeholder="Write a friendly reply..." style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #DAD7CD; border-radius: 5px; resize: vertical;"></textarea>
                <button onclick="submitReply(${originalIndex})" style="background-color: #DAD7CD; color: #333; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold;">Post Reply</button>
            </div>

            <div class="reply-section">${repliesHtml}</div>
        </div>`;
  });
}

// Window functions for inline HTML buttons
window.toggleReplyForm = function (index) {
  const form = document.getElementById(`reply-form-${index}`);
  form.style.display = form.style.display === "block" ? "none" : "block";
};

window.submitReply = function (index) {
  const storageKey = `unicornReviews_${pName}`;
  const productReviews = JSON.parse(localStorage.getItem(storageKey)) || [];
  const rawName =
    document.getElementById(`reply-name-${index}`).value || "Anonymous";
  const rawText = document.getElementById(`reply-text-${index}`).value;

  if (!rawText.trim()) return;
  productReviews[index].replies.push({
    name: cleanText(rawName),
    text: cleanText(rawText),
  });
  localStorage.setItem(storageKey, JSON.stringify(productReviews));
  renderProductReviews();
};

window.deleteReview = function (index) {
  if (confirm("Are you sure you want to permanently delete this review?")) {
    const storageKey = `unicornReviews_${pName}`;
    let productReviews = JSON.parse(localStorage.getItem(storageKey)) || [];
    productReviews.splice(index, 1);
    localStorage.setItem(storageKey, JSON.stringify(productReviews));
    renderProductReviews();
  }
};

window.toggleEditReview = function (index) {
  const displayDiv = document.getElementById(`review-text-display-${index}`);
  const editDiv = document.getElementById(`review-edit-form-${index}`);
  if (displayDiv.style.display !== "none") {
    displayDiv.style.display = "none";
    editDiv.style.display = "block";
  } else {
    displayDiv.style.display = "block";
    editDiv.style.display = "none";
  }
};

window.saveEdit = function (index) {
  const newText = document.getElementById(`edit-text-input-${index}`).value;
  if (!newText.trim()) return;
  const storageKey = `unicornReviews_${pName}`;
  let productReviews = JSON.parse(localStorage.getItem(storageKey)) || [];
  productReviews[index].text = cleanText(newText);
  localStorage.setItem(storageKey, JSON.stringify(productReviews));
  renderProductReviews();
};

// Review Form Submit Listener
const reviewForm = document.getElementById("review-form");
if (reviewForm) {
  reviewForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const storageKey = `unicornReviews_${pName}`;
    const productReviews = JSON.parse(localStorage.getItem(storageKey)) || [];

    const newReview = {
      name: cleanText(document.getElementById("review-name").value),
      text: cleanText(document.getElementById("review-text").value),
      stars: parseInt(document.getElementById("review-stars").value),
      image: null,
      replies: [],
    };

    const imageFile = document.getElementById("review-image").files[0];
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function (event) {
        newReview.image = event.target.result;
        productReviews.push(newReview);
        localStorage.setItem(storageKey, JSON.stringify(productReviews));
        reviewForm.reset();
        renderProductReviews();
      };
      reader.readAsDataURL(imageFile);
    } else {
      productReviews.push(newReview);
      localStorage.setItem(storageKey, JSON.stringify(productReviews));
      reviewForm.reset();
      renderProductReviews();
    }
  });
}

// Custom Upload Button Text
const imageInput = document.getElementById("review-image");
const fileNameDisplay = document.getElementById("file-name-display");
if (imageInput && fileNameDisplay) {
  imageInput.addEventListener("change", function () {
    fileNameDisplay.textContent =
      this.files && this.files[0] ? "✓ " + this.files[0].name : "";
  });
}

// ==========================================
// CHAPTER 7: GLOBAL UI (PAGES, GRIDS, SEARCH, AUTH)
// ==========================================

// 1. DYNAMIC HOME PAGE GRID
function renderHomeGrid() {
  const homeGrid = document.getElementById("home-product-grid");
  if (!homeGrid) return;

  homeGrid.innerHTML = "";
  allProducts.forEach((item) => {
    const inWishlist = wishlist.some((w) => w.name === item.name);
    const wishText = inWishlist ? "❤️" : "🤍";

    homeGrid.innerHTML += `
      <div class="product-card">
          <a href="product.html?name=${item.name}&price=${item.price}&color=${item.color}&image=${item.image}">
              <img src="${item.image}" alt="${item.name}" class="product-image" />
          </a>
          <h3>${item.name}</h3>
          <p class="price">$${item.price.toFixed(2)} CAD</p>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
              <button class="action-btn buy-now-btn grid-buy-now-btn" style="padding: 10px; font-size: 0.95rem; border-radius: 6px;" data-name="${item.name}" data-price="${item.price}" data-color="#${item.color}">Buy Now</button>
              <div style="display: flex; gap: 8px;">
                  <div style="flex: 1;">
                      <button class="add-to-cart-btn" style="width: 100%; padding: 10px; border-radius: 6px;" data-name="${item.name}" data-price="${item.price}" data-color="#${item.color}">Add to Basket</button>
                  </div>
                  <button class="grid-wishlist-btn" style="background: white; border: 1px solid #DAD7CD; border-radius: 6px; width: 45px; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;" data-name="${item.name}" data-price="${item.price}" data-color="${item.color}" data-image="${item.image}">${wishText}</button>
              </div>
          </div>
      </div>`;
  });
}

// 2. WISHLIST PAGE RENDERER
const wishlistContainer = document.getElementById("wishlist-container");
function renderWishlistPage() {
  if (!wishlistContainer) return;
  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = `<div class="wishlist-empty"><span style="font-size: 3rem;">🌬️</span><p>Your wishlist is currently blowing in the wind.</p></div>`;
    return;
  }
  wishlistContainer.innerHTML = "";
  wishlist.forEach((item) => {
    const cardStyle =
      wishlist.length === 1 ? 'style="max-width: 400px; margin: 0 auto;"' : "";
    wishlistContainer.innerHTML += `
      <div class="product-card" ${cardStyle}>
          <a href="product.html?name=${item.name}&price=${item.price}&color=${item.color}&image=${item.image}">
              <img src="${item.image}" alt="${item.name}" class="product-image" style="width: 100%; height: auto; max-height: 280px; object-fit: contain; border-radius: 8px; margin-bottom: 10px;">
          </a>
          <h3 style="margin-bottom: 5px;">${item.name}</h3>
          <p class="price" style="margin-bottom: 15px;">$${item.price.toFixed(2)} CAD</p>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
              <button class="action-btn buy-now-btn grid-buy-now-btn" style="padding: 10px; font-size: 0.95rem; border-radius: 6px;" data-name="${item.name}" data-price="${item.price}" data-color="#${item.color}">Buy Now</button>
              <button class="add-to-cart-btn" style="width: 100%; padding: 10px; border-radius: 6px;" data-name="${item.name}" data-price="${item.price}" data-color="${item.color}">Add to Basket</button>
              <button class="remove-wishlist-btn" data-name="${item.name}" style="background: none; border: 0.5px solid #e63946; color: #e63946; padding: 10px; border-radius: 6px; cursor: pointer; transition: all 0.2s;">Remove from Wishlist</button>
          </div>
      </div>`;
  });
  document.querySelectorAll(".remove-wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      wishlist = wishlist.filter(
        (i) => i.name !== e.target.getAttribute("data-name"),
      );
      saveWishlist();
      renderWishlistPage();
    });
  });
}

// 3. GLOBAL GRID EVENT LISTENERS (Buy Now & Wishlist Heart)
function syncGridWishlistButtons() {
  document.querySelectorAll(".grid-wishlist-btn").forEach((btn) => {
    const name = btn.getAttribute("data-name");
    const inWishlist = wishlist.some((item) => item.name === name);
    btn.textContent = inWishlist ? "❤️" : "🤍";
  });

  const mainWishBtn = document.getElementById("detail-wishlist-btn");
  if (mainWishBtn && pName) {
    const inWishlist = wishlist.some((item) => item.name === pName);
    mainWishBtn.textContent = inWishlist ? "❤️ Saved" : "🤍 Save";
    if (inWishlist) mainWishBtn.classList.add("active");
    else mainWishBtn.classList.remove("active");
  }
}

function attachGlobalGridListeners() {
  // Grid Buy Now
  document.querySelectorAll(".grid-buy-now-btn").forEach((btn) => {
    const newBtn = btn.cloneNode(true);
    btn.replaceWith(newBtn);
    newBtn.addEventListener("click", (e) => {
      const name = newBtn.getAttribute("data-name");
      const price = parseFloat(newBtn.getAttribute("data-price"));
      const color = newBtn.getAttribute("data-color");
      const existingItem = cart.find((item) => item.name === name);
      if (!existingItem) {
        cart.push({ name, price, color, quantity: 1 });
        saveCart();
      }
      window.location.href = "checkout.html";
    });
  });

  // Grid Wishlist Heart
  document.querySelectorAll(".grid-wishlist-btn").forEach((btn) => {
    const newBtn = btn.cloneNode(true);
    btn.replaceWith(newBtn);
    newBtn.addEventListener("click", (e) => {
      const name = newBtn.getAttribute("data-name");
      const price = parseFloat(newBtn.getAttribute("data-price"));
      const color = newBtn.getAttribute("data-color");
      const image = newBtn.getAttribute("data-image");

      const index = wishlist.findIndex((item) => item.name === name);
      if (index > -1) {
        wishlist.splice(index, 1);
      } else {
        wishlist.push({ name, price, color, image });
      }
      saveWishlist();
      syncGridWishlistButtons();
    });
  });
}

// 4. CART & CHECKOUT RENDERING
function syncAllCartButtons() {
  // THE BRAIN: Check if the screen is Mobile or Desktop
  const isMobile = window.innerWidth <= 768;

  document
    .querySelectorAll(".add-to-cart-btn, .in-cart-controls, .added-toggle-btn")
    .forEach((el) => {
      const name = el.getAttribute("data-name");
      const price = el.getAttribute("data-price");
      const color = el.getAttribute("data-color");
      const isFullWidth = el.classList.contains("full-width");
      const elId = el.getAttribute("id");

      const cartItem = cart.find((item) => item.name === name);

      if (cartItem) {
        if (isMobile) {
          // --- MOBILE VIEW: Render the simple Toggle Button ---
          const btn = document.createElement("button");
          btn.className = `added-toggle-btn ${isFullWidth ? "btn full-width" : ""}`;
          if (elId) btn.id = elId;
          btn.setAttribute("data-name", name);
          btn.setAttribute("data-price", price);
          btn.setAttribute("data-color", color);
          if (isFullWidth) {
            btn.style.fontSize = "1.2rem";
            btn.style.padding = "15px";
          }
          btn.textContent = "Added ✓";

          el.replaceWith(btn);
        } else {
          // --- DESKTOP VIEW: Render the full +/- Controls ---
          const controlDiv = document.createElement("div");
          controlDiv.className = `in-cart-controls ${isFullWidth ? "full-width" : ""}`;
          if (elId) controlDiv.id = elId;
          controlDiv.setAttribute("data-name", name);
          controlDiv.setAttribute("data-price", price);
          controlDiv.setAttribute("data-color", color);
          controlDiv.innerHTML = `<button class="control-btn minus" data-name="${name}">-</button><span class="control-qty">${cartItem.quantity} in Basket</span><button class="control-btn plus" data-name="${name}" data-price="${price}" data-color="${color}">+</button>`;

          el.replaceWith(controlDiv);
        }
      } else {
        // --- NOT IN CART: Render standard Add to Basket ---
        const btn = document.createElement("button");
        btn.className = `add-to-cart-btn ${isFullWidth ? "btn full-width" : ""}`;
        if (elId) btn.id = elId;
        btn.setAttribute("data-name", name);
        btn.setAttribute("data-price", price);
        btn.setAttribute("data-color", color);
        if (isFullWidth) {
          btn.style.fontSize = "1.2rem";
          btn.style.padding = "15px";
        }
        btn.textContent = "Add to Basket";

        el.replaceWith(btn);
      }
    });

  attachSmartCartListeners();
}

function attachSmartCartListeners() {
  // 1. Add to Basket
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      cart.push({
        name: e.target.dataset.name,
        price: parseFloat(e.target.dataset.price),
        color: e.target.dataset.color,
        quantity: 1,
      });
      saveCart();
      renderCartPage();
      syncAllCartButtons();
    });
  });

  // 2. Mobile: Remove from Basket (Toggle Off)
  document.querySelectorAll(".added-toggle-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = cart.findIndex((i) => i.name === e.target.dataset.name);
      if (index > -1) cart.splice(index, 1);
      saveCart();
      renderCartPage();
      syncAllCartButtons();
    });
  });

  // 3. Desktop: Plus Button
  document.querySelectorAll(".in-cart-controls .plus").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const item = cart.find((i) => i.name === e.target.dataset.name);
      if (item) item.quantity += 1;
      saveCart();
      renderCartPage();
      syncAllCartButtons();
    });
  });

  // 4. Desktop: Minus Button
  document.querySelectorAll(".in-cart-controls .minus").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = cart.findIndex((i) => i.name === e.target.dataset.name);
      if (index > -1) {
        if (cart[index].quantity > 1) cart[index].quantity -= 1;
        else cart.splice(index, 1);
        saveCart();
        renderCartPage();
        syncAllCartButtons();
      }
    });
  });
}

// Automatically switch button styles if the user resizes their browser window!
window.addEventListener("resize", () => {
  syncAllCartButtons();
});

function renderCartPage() {
  const cartWrapper = document.getElementById("cart-items-wrapper");
  const checkoutItemsList = document.getElementById("checkout-items-list");
  let subtotal = 0;

  // --- 1. RENDER THE MAIN BASKET PAGE ---
  if (cartWrapper) {
    if (cart.length === 0) {
      cartWrapper.innerHTML =
        "<p style='padding: 20px 0; color: #555;'>Your basket is currently empty.</p>";
      updateTotals(0);
      return;
    }
    cartWrapper.innerHTML = "";

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      // Look up the master product info to build the link properly
      const productInfo = allProducts.find((p) => p.name === item.name) || item;
      const cleanColor = productInfo.color
        ? productInfo.color.replace("#", "")
        : "";
      const productLink = `product.html?name=${encodeURIComponent(item.name)}&price=${item.price}&color=${cleanColor}&image=${productInfo.image || ""}`;

      cartWrapper.innerHTML += `
        <div class="cart-item">
            <div class="cart-item-info">
                <a href="${productLink}" style="display: flex; align-items: center; gap: 15px; text-decoration: none; color: inherit;">
                    <img src="${productInfo.image || ""}" alt="${item.name}" class="cart-item-img" onerror="this.style.display='none'">
                    <div class="cart-item-details">
                        <h4 style="margin: 0; color: #344E41; transition: color 0.2s;" onmouseover="this.style.color='#588157'" onmouseout="this.style.color='#344E41'">${item.name}</h4>
                        <span class="cart-item-price" style="color: #588157; font-weight: bold;">$${item.price.toFixed(2)} CAD</span>
                    </div>
                </a>
            </div>
            <div class="cart-controls">
                <button class="qty-btn minus-btn" data-index="${index}">-</button>
                <span style="width: 20px; text-align: center;">${item.quantity}</span>
                <button class="qty-btn plus-btn" data-index="${index}">+</button>
                <span style="margin-left: 20px; font-weight: bold; color:#344E41; width: 80px;">$${itemTotal.toFixed(2)} CAD</span>
                <button class="remove-btn" data-index="${index}" style="margin-left: 15px;">Remove</button>
            </div>
        </div>`;
    });

    // Re-attach Event Listeners for Cart Controls
    document.querySelectorAll(".plus-btn").forEach((b) =>
      b.addEventListener("click", (e) => {
        cart[e.target.dataset.index].quantity += 1;
        saveCart();
        renderCartPage();
        syncAllCartButtons();
      }),
    );
    document.querySelectorAll(".minus-btn").forEach((b) =>
      b.addEventListener("click", (e) => {
        if (cart[e.target.dataset.index].quantity > 1)
          cart[e.target.dataset.index].quantity -= 1;
        else cart.splice(e.target.dataset.index, 1);
        saveCart();
        renderCartPage();
        syncAllCartButtons();
      }),
    );
    document.querySelectorAll(".remove-btn").forEach((b) =>
      b.addEventListener("click", (e) => {
        cart.splice(e.target.dataset.index, 1);
        saveCart();
        renderCartPage();
        syncAllCartButtons();
      }),
    );
  }

  // --- 2. RENDER THE CHECKOUT PAGE SUMMARY ---
  if (checkoutItemsList) {
    checkoutItemsList.innerHTML = "";

    // Safety check so we don't double the subtotal if both exist on one page somehow
    if (!cartWrapper) {
      subtotal = 0;
    }

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      if (!cartWrapper) {
        subtotal += itemTotal;
      }

      const productInfo = allProducts.find((p) => p.name === item.name) || item;
      const cleanColor = productInfo.color
        ? productInfo.color.replace("#", "")
        : "";
      const productLink = `product.html?name=${encodeURIComponent(item.name)}&price=${item.price}&color=${cleanColor}&image=${productInfo.image || ""}`;

      checkoutItemsList.innerHTML += `
        <div class="checkout-mini-item">
            <div style="display: flex; align-items: center;">
                <a href="${productLink}" style="display: flex; align-items: center; text-decoration: none; color: inherit; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                    <img src="${productInfo.image || ""}" class="checkout-mini-img" alt="${item.name}">
                    <span><strong style="color: #588157;">${item.quantity}x</strong> <span style="text-decoration: underline; text-decoration-color: transparent; transition: text-decoration-color 0.2s;" onmouseover="this.style.textDecorationColor='#344E41'" onmouseout="this.style.textDecorationColor='transparent'">${item.name}</span></span>
                </a>
            </div>
            <span style="font-weight: bold; color: #344E41;">$${itemTotal.toFixed(2)} CAD</span>
        </div>`;
    });
  }

  updateTotals(subtotal);
}

function updateTotals(subtotal) {
  const discountAmount = subtotal * currentDiscount;
  const priceAfterDiscount = subtotal - discountAmount;
  let shippingCost = subtotal === 0 || priceAfterDiscount >= 150.0 ? 0 : 15.0;
  let shippingText =
    subtotal === 0
      ? "$0.00"
      : shippingCost === 0
        ? "<span style='color: #588157; font-weight: bold;'>Free (Unlocked!) 🎉</span>"
        : `$15.00 <br><span style="font-size: 0.85rem; color: #e63946;">Add $${(150 - priceAfterDiscount).toFixed(2)} more for Free Shipping!</span>`;

  if (document.getElementById("cart-subtotal"))
    document.getElementById("cart-subtotal").textContent =
      `$${subtotal.toFixed(2)} CAD`;
  if (document.getElementById("checkout-subtotal"))
    document.getElementById("checkout-subtotal").textContent =
      `$${subtotal.toFixed(2)} CAD`;
  if (document.getElementById("cart-shipping"))
    document.getElementById("cart-shipping").innerHTML = shippingText;

  const finalTotal = priceAfterDiscount + shippingCost;
  if (document.getElementById("cart-total"))
    document.getElementById("cart-total").textContent =
      `$${finalTotal.toFixed(2)} CAD`;
  if (document.getElementById("checkout-final-total"))
    document.getElementById("checkout-final-total").textContent =
      `$${finalTotal.toFixed(2)} CAD`;
  if (document.getElementById("checkout-total-display"))
    document.getElementById("checkout-total-display").textContent =
      `$${finalTotal.toFixed(2)}`;

  const discountRow = document.getElementById("discount-row"),
    cartDiscountAmt = document.getElementById("cart-discount");
  const checkoutDiscountRow = document.getElementById("checkout-discount-row"),
    checkoutDiscountAmt = document.getElementById("checkout-discount");

  if (currentDiscount > 0 && subtotal > 0) {
    if (discountRow) {
      discountRow.style.display = "flex";
      cartDiscountAmt.textContent = `-$${discountAmount.toFixed(2)} CAD`;
    }
    if (checkoutDiscountRow) {
      checkoutDiscountRow.style.display = "flex";
      checkoutDiscountAmt.textContent = `-$${discountAmount.toFixed(2)} CAD`;
    }
  } else {
    if (discountRow) discountRow.style.display = "none";
    if (checkoutDiscountRow) checkoutDiscountRow.style.display = "none";
  }
}

// Coupons & Checkout Submission
const couponBtn = document.getElementById("apply-coupon-btn");
if (couponBtn) {
  couponBtn.addEventListener("click", () => {
    const code = document
      .getElementById("coupon-code")
      .value.trim()
      .toUpperCase();
    const couponMsg = document.getElementById("coupon-message");
    if (code === "NATURE20") {
      currentDiscount = 0.2;
      localStorage.setItem("unicornDiscount", "0.20");
      couponMsg.style.display = "block";
      couponMsg.style.color = "#588157";
      couponMsg.textContent = "🌿 Coupon applied! 20% off your order.";
    } else {
      currentDiscount = 0;
      localStorage.setItem("unicornDiscount", "0");
      couponMsg.style.display = "block";
      couponMsg.style.color = "#e63946";
      couponMsg.textContent = "Invalid coupon code.";
    }
    renderCartPage();
  });
}

const proceedBtn = document.getElementById("proceed-to-checkout-btn");
if (proceedBtn) {
  proceedBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert(
        "Your basket is empty! Add some nature to your wardrobe to go forward. 🌿",
      );
    } else {
      window.location.href = "checkout.html";
    }
  });
}

const checkoutForm = document.getElementById("checkout-form");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your basket is empty! Add some nature before checking out.");
      window.location.href = "index.html";
      return;
    }

    const payBtn = document.getElementById("pay-now-btn");
    payBtn.textContent = "Processing Payment... 🌿";
    payBtn.style.backgroundColor = "#A3B18A";
    payBtn.disabled = true;

    setTimeout(() => {
      const successModal = document.getElementById("success-modal");
      if (successModal) {
        successModal.classList.add("show"); // MAGIC FIX: This triggers the fade-in animation!
      }
      cart = [];
      currentDiscount = 0;
      localStorage.setItem("unicornDiscount", "0");
      saveCart();
      renderCartPage();
    }, 2500);
  });
}

// 5. SEARCH & HELP MENUS
const searchInput = document.getElementById("search-input"),
  searchResults = document.getElementById("search-results"),
  searchIconBtn = document.getElementById("search-icon-btn");
if (searchInput && searchResults && searchIconBtn) {
  searchIconBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    searchInput.classList.toggle("active");
    if (searchInput.classList.contains("active")) searchInput.focus();
    else {
      searchResults.style.display = "none";
      searchInput.value = "";
    }
  });
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    searchResults.innerHTML = "";
    if (query.length === 0) {
      searchResults.style.display = "none";
      return;
    }
    searchResults.style.display = "block";
    const matches = allProducts.filter((p) =>
      p.name.toLowerCase().includes(query),
    );
    if (matches.length > 0) {
      matches.forEach(
        (m) =>
          (searchResults.innerHTML += `<a href="product.html?name=${m.name}&price=${m.price}&color=${m.color}&image=${m.image}" class="search-result-item"><img src="${m.image}" class="search-result-img" alt="${m.name}"><div><div style="font-size: 0.9rem; font-weight: bold; color: #344E41;">${m.name}</div><div style="font-size: 0.85rem; color: #588157;">$${m.price.toFixed(2)} CAD</div></div></a>`),
      );
    } else {
      searchResults.innerHTML = `<div class="no-results"><span style="font-size: 2rem;">🍂</span><br><br>Looks like that leaf hasn't grown yet.</div>`;
    }
  });
}

const helpBtn = document.getElementById("help-menu-btn"),
  helpMenu = document.getElementById("help-dropdown-menu");
if (helpBtn && helpMenu) {
  helpBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    helpMenu.style.display =
      helpMenu.style.display === "flex" ? "none" : "flex";
  });
}
document.addEventListener("click", (e) => {
  if (
    searchInput &&
    !searchInput.contains(e.target) &&
    !searchResults.contains(e.target) &&
    !searchIconBtn.contains(e.target)
  ) {
    searchResults.style.display = "none";
    searchInput.classList.remove("active");
    searchInput.value = "";
  }
  if (
    helpBtn &&
    helpMenu &&
    !helpBtn.contains(e.target) &&
    !helpMenu.contains(e.target)
  )
    helpMenu.style.display = "none";
});

// 6. DUAL MODAL AUTHENTICATION
const authModal = document.getElementById("auth-modal");
if (authModal) {
  document
    .querySelectorAll(".nav-action-wrapper[href='signup.html'], .login-nav")
    .forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        authModal.classList.add("show");
      }),
    );
  document
    .getElementById("close-modal")
    .addEventListener("click", () => authModal.classList.remove("show"));
  window.addEventListener("click", (e) => {
    if (e.target === authModal) authModal.classList.remove("show");
  });

  const toggleLogin = document.getElementById("toggle-login"),
    toggleSignup = document.getElementById("toggle-signup");
  const formLogin = document.getElementById("modal-login-form"),
    formSignup = document.getElementById("modal-signup-form");

  if (toggleSignup && toggleLogin) {
    toggleSignup.addEventListener("click", (e) => {
      e.preventDefault();
      toggleLogin.classList.remove("active");
      toggleSignup.classList.add("active");
      formLogin.classList.remove("active-view");
      formSignup.classList.add("active-view");
    });
    toggleLogin.addEventListener("click", (e) => {
      e.preventDefault();
      toggleSignup.classList.remove("active");
      toggleLogin.classList.add("active");
      formSignup.classList.remove("active-view");
      formLogin.classList.add("active-view");
    });
  }

  const signupPassInput = document.getElementById("signup-password");
  if (signupPassInput) {
    // 1. Store the base text for the rules
    const ruleText = {
      "rule-length": "At least 8 characters",
      "rule-upper": "One uppercase letter",
      "rule-number": "One number",
      "rule-special": "One special char (!@#$%)",
    };

    signupPassInput.addEventListener("input", function () {
      const val = this.value;

      // 2. The Smart Updater Function
      const updateRule = (id, isValid) => {
        const el = document.getElementById(id);
        if (!el) return;

        if (val.length === 0) {
          // NEUTRAL STATE: Password box is empty
          el.className = "rule";
          el.textContent = "• " + ruleText[id];
        } else if (isValid) {
          // SUCCESS STATE: Rule is met
          el.className = "rule valid";
          el.textContent = "✓ " + ruleText[id];
        } else {
          // INVALID STATE: User is typing, but rule is not met yet
          el.className = "rule invalid";
          el.textContent = "✗ " + ruleText[id];
        }
      };

      // 3. Run the checks!
      updateRule("rule-length", val.length >= 8);
      updateRule("rule-upper", /[A-Z]/.test(val));
      updateRule("rule-number", /[0-9]/.test(val));
      updateRule("rule-special", /[!@#$%^&*(),.?":{}|<>]/.test(val));
    });
  }

  document.querySelectorAll(".toggle-password-btn").forEach((btn) =>
    btn.addEventListener("click", function () {
      const t = document.getElementById(this.getAttribute("data-target"));
      const type = t.getAttribute("type") === "password" ? "text" : "password";
      t.setAttribute("type", type);
      this.textContent = type === "password" ? "🤫" : "👀";
    }),
  );

  const phoneInput = document.getElementById("signup-phone");
  if (phoneInput)
    phoneInput.addEventListener("input", function (e) {
      let x = e.target.value
        .replace(/\D/g, "")
        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      e.target.value = !x[2]
        ? x[1]
        : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
    });

  const postalInput = document.getElementById("signup-postal");
  if (postalInput)
    postalInput.addEventListener("input", function (e) {
      let val = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
      if (val.length > 3) val = val.substring(0, 3) + " " + val.substring(3, 6);
      e.target.value = val;
    });

  if (formLogin)
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Welcome back! You are now logged in.");
      authModal.classList.remove("show");
    });
  if (formSignup)
    formSignup.addEventListener("submit", (e) => {
      e.preventDefault();
      if (document.querySelectorAll(".rule.invalid").length > 0) {
        alert(
          "Please make sure your password meets all the security requirements.",
        );
        return;
      }
      const name = document.getElementById("signup-name").value;
      alert(`Welcome to the family, ${name}! Your account has been created.`);
      authModal.classList.remove("show");
    });
}

// ==========================================
// SMART MOBILE HEADER (HIDE ON SCROLL DOWN)
// ==========================================
let lastScrollY = window.scrollY;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  // We only want this effect on mobile screens
  if (window.innerWidth <= 768 && header) {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      // User is scrolling down: Slide header up and out of view
      header.style.transform = "translateY(-100%)";
      header.style.transition = "transform 0.3s ease-in-out";
    } else {
      // User is scrolling up: Slide header back down into view
      header.style.transform = "translateY(0)";
    }
  } else if (header) {
    // Desktop view: Always keep it visible
    header.style.transform = "translateY(0)";
  }
  lastScrollY = window.scrollY;
});

// ==========================================
// CHAPTER 8: INITIALIZATION
// ==========================================
applyCursorState();
renderHomeGrid(); // We draw the Home Page grid dynamically first!
updateCartCount();
updateWishlistCount();
renderCartPage();
renderWishlistPage();
syncAllCartButtons(); // This turns the raw buttons into +/- smart controls
attachGlobalGridListeners(); // This wires up all the Buy Now and Wishlist buttons
renderProductReviews();
