# 🌿 Unicorn | Sustainable E-Commerce Architecture

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Status: Prototype](https://img.shields.io/badge/Status-High_Fidelity_Prototype-success?style=for-the-badge)

A high-fidelity, fully responsive e-commerce frontend prototype designed for sustainable fashion brands. This project serves as a white-label template and architectural proof-of-concept, demonstrating advanced frontend state management, dynamic DOM rendering, and mobile-first UX design.

## 🔗 Live Demo
<!-- WIll be added soon.-->

---

## ✨ Key Features & UX Engineering

This project goes beyond static HTML/CSS, implementing real-world application logic using vanilla JavaScript:

### 🛒 Dynamic Cart & Checkout Flow
* **State Management:** Cart data is persistently stored using browser `localStorage`.
* **Device-Aware UI:** Renders granular `[ - | 1 | + ]` controls on desktop, and seamlessly swaps to a touch-friendly `Added ✓` toggle on mobile devices.
* **Real-time Mathematics:** Automatically calculates subtotal, conditional shipping thresholds (Free shipping over $150), and discount code applications (e.g., `NATURE20`).

### 📱 Advanced Mobile Responsiveness
* **Fluid Grids:** Utilizes CSS `grid-template-columns: repeat(auto-fit, ...)` for seamless scaling across devices without rigid media queries.
* **Smart Header:** Navigation banner detects scroll direction, hiding on scroll-down to maximize screen real-estate, and reappearing on scroll-up.
* **Touch-Optimized:** Disables custom aesthetic cursors on touch-devices to prevent UX friction.

### 🔐 Interactive Authentication Modal
* **Dual-View UI:** Seamlessly toggles between Login and Sign Up states without page reloads.
* **Real-Time Validation:** Password security rules actively update from grey bullets to green ticks (`✓`) or red crosses (`✗`) as the user types.

### 🛍️ Product & Engagement Systems
* **Dynamic Routing:** URL parameter parsing (`?name=...&price=...`) allows a single `product.html` template to render infinite product variations.
* **Review Engine:** Local-storage backed review system featuring emoji ratings, image uploads, and threaded admin replies.
* **Wishlist:** Heart-toggle system synchronized globally across the Home grid, Product pages, and a dedicated Wishlist page.

---

## 🛠️ Technical Architecture (Current Phase)

Currently, the application operates as a Serverless Frontend Application:
* **UI/Layout:** Semantic HTML5, CSS3 (Flexbox & CSS Grid).
* **Styling Strategy:** Extensive use of CSS Variables (`var(--color)`) allows for one-click global theme changes (White-label ready).
* **Logic:** Vanilla JavaScript (ES6+).
* **Data Storage:** Window `localStorage` API for Session/Cart/Wishlist persistence.

---

## 🚀 Installation & Local Development

To run this project locally, no build tools or package managers are required.
Just clone it and Go Live!
