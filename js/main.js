const fallbackDeals = [
  {
    title: "Custom Embroidered Hats",
    price: "$30.78",
    discount: "60% off",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=80"
  },
  {
    title: "Personalized Family PJs",
    price: "$40.20",
    discount: "60% off",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=80"
  },
  {
    title: "Velvet Ribbon Flair",
    price: "$9.48",
    discount: "25% off",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=500&q=80"
  },
  {
    title: "Crochet Pattern Bundle",
    price: "$11.64",
    discount: "65% off",
    rating: 5,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=500&q=80"
  },
  {
    title: "Birth Flower Necklace",
    price: "$74.19",
    discount: "25% off",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=500&q=80"
  }
];

let deals = [...fallbackDeals];

// Paint the horizontal deal slider with the latest dataset.
function renderDeals() {
  const track = document.querySelector('[data-injection="deal-track"]');
  if (!track) return;
  track.innerHTML = deals
    .map(
      (deal) => `
        <article class="deal-card">
          <img src="${deal.image}" alt="${deal.title}" />
          <div>
            <p class="text-sm text-[#5c5c5c]">Biggest sale in 60+ days</p>
            <h3 class="font-semibold">${deal.title}</h3>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="font-semibold text-lg">${deal.price}</span>
            <span class="text-[#17846c] font-semibold">${deal.discount}</span>
          </div>
          <div class="text-xs text-[#5c5c5c]">${deal.rating} ★</div>
        </article>
      `
    )
    .join('');
}

function initSlider() {
  const track = document.querySelector('[data-injection="deal-track"]');
  const prev = document.querySelector('.deal-nav.prev');
  const next = document.querySelector('.deal-nav.next');
  if (!track || !prev || !next) return;

  let index = 0;
  const cardWidth = 240;
  const maxIndex = Math.max(0, deals.length - 3);

  const update = () => {
    track.style.transition = 'transform 0.4s ease';
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  };

  prev.addEventListener('click', () => {
    index = index <= 0 ? maxIndex : index - 1;
    update();
  });

  next.addEventListener('click', () => {
    index = index >= maxIndex ? 0 : index + 1;
    update();
  });
}

function initCountdown() {
  const el = document.querySelector('[data-countdown]');
  if (!el) return;
  let remaining = 17 * 3600 + 50 * 60 + 41;

  setInterval(() => {
    remaining = Math.max(remaining - 1, 0);
    const hours = String(Math.floor(remaining / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
    const seconds = String(remaining % 60).padStart(2, '0');
    el.textContent = `${hours}:${minutes}:${seconds}`;
  }, 1000);
}

function initPills() {
  document.querySelectorAll('.pill-button').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.pill-button').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
}

// Expose a tiny helper so the backend can push live content.
function registerInjectionAPI() {
  window.EtsyReplica = {
    inject(content) {
      if (!content) return;
      const selector = content.selector || '[data-injection="product-grid"]';
      const container = document.querySelector(selector);
      if (!container) return;
      const html = `
        <article class="product-card injected">
          <img src="${content.image_url || ''}" alt="${content.product_name || content.title || 'Injected product'}" />
          <h3>${content.product_name || content.title}</h3>
          <p>${content.description || ''}</p>
          <div class="flex items-center justify-between text-sm">
            <span class="font-semibold">${content.price ? `$${content.price}` : ''}</span>
            ${content.badge ? `<span class="text-[#17846c] font-semibold">${content.badge}</span>` : ''}
          </div>
        </article>`;
      container.insertAdjacentHTML('afterbegin', html);
    }
  };
}

async function hydrateDeals() {
  try {
    const response = await fetch('data/deals.json');
    if (response.ok) {
      const payload = await response.json();
      if (Array.isArray(payload) && payload.length) {
        deals = payload.map((deal) => ({
          title: deal.title,
          price: `$${deal.price?.toFixed ? deal.price.toFixed(2) : deal.price}`,
          discount: deal.discount ? `${deal.discount}% off` : 'Deal',
          rating: deal.rating || '5.0',
          image: deal.image_url || fallbackDeals[0].image
        }));
      }
    }
  } catch (_) {
    deals = [...fallbackDeals];
  }
  renderDeals();
  initSlider();
}

async function hydrateProductGrid() {
  const container = document.querySelector('[data-injection="product-grid"]');
  if (!container) return;
  try {
    const response = await fetch('data/products.json');
    if (!response.ok) return;
    const products = await response.json();
    products.forEach((product) => {
      const html = `
        <article class="product-card injected">
          <img src="${product.image_url}" alt="${product.product_name}" />
          <h3>${product.product_name}</h3>
          <p>${product.description}</p>
          <div class="flex items-center justify-between text-sm">
            <span class="font-semibold">$${product.price}</span>
            ${product.badge ? `<span class="text-[#17846c] font-semibold">${product.badge}</span>` : ''}
          </div>
        </article>`;
      container.insertAdjacentHTML('beforeend', html);
    });
  } catch (error) {
    console.error('Unable to hydrate product grid', error);
  }
}

function init() {
  hydrateDeals();
  hydrateProductGrid();
  initCountdown();
  initPills();
  registerInjectionAPI();
}

document.addEventListener('DOMContentLoaded', init);
