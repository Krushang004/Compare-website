// app.js

document.addEventListener('DOMContentLoaded', () => {
    const filterForm = document.getElementById('filter-form');
    let products = [];

    // Fetch product data from JSON file
    const fetchProducts = async () => {
        const response = await fetch('data/products.json');
        products = await response.json();
        displayProducts(products);
    };

    // Display products in the DOM
    const displayProducts = (products) => {
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';
        products.forEach(product => {
            let imagesHtml = '';
            if (product.images && product.images.Amazon) {
                imagesHtml += `<img src="${product.images.Amazon}" alt="${product.name} Amazon" class="product-img"/>`;
            }
            if (product.images && product.images.Flipkart) {
                imagesHtml += `<img src="${product.images.Flipkart}" alt="${product.name} Flipkart" class="product-img"/>`;
            }
            const reviewsHtml = product.reviews && product.reviews.length
                ? `<ul>${product.reviews.map(r => `<li>${r}</li>`).join('')}</ul>`
                : '<p>No user reviews yet.</p>';
            const influencerHtml = product.influencer_reviews && product.influencer_reviews.length
                ? `<div class="influencer-review"><b>${product.influencer_reviews[0].influencer}:</b> ${product.influencer_reviews[0].review}</div>`
                : '';
            const linksHtml = Object.entries(product.links).map(([site, url]) =>
                `<a href="${url}" target="_blank"><button>${site}</button></a>`
            ).join(' ');
            productList.innerHTML += `
                <div class="product">
                    <div>
                        ${imagesHtml}
                    </div>
                    <div class="product-info">
                        <div class="product-title">${product.name}</div>
                        <div class="product-rating">Overall: ${product.rating} / 5</div>
                        <div>Price: $${product.price}</div>
                        ${influencerHtml}
                        <div class="user-reviews"><b>User Reviews:</b> ${reviewsHtml}</div>
                    </div>
                    <div>${linksHtml}</div>
                </div>
            `;
        });
    };

    // Apply filters based on user input
    const applyFilters = (e) => {
        if (e) e.preventDefault();
        const category = document.getElementById('category').value;
        const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
        const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
        const minRating = parseFloat(document.getElementById('min-rating').value) || 0;
        const influencerOnly = document.getElementById('influencer-filter').checked;

        const filteredProducts = products.filter(product => {
            const meetsCategory = category === 'all' || (product.category && product.category === category);
            const meetsPrice = product.price >= minPrice && product.price <= maxPrice;
            const meetsRating = product.rating >= minRating;
            const meetsInfluencer = !influencerOnly || (product.influencer_reviews && product.influencer_reviews.length > 0);
            return meetsCategory && meetsPrice && meetsRating && meetsInfluencer;
        });
        displayProducts(filteredProducts);
    };

    filterForm.addEventListener('submit', applyFilters);
    fetchProducts();
});