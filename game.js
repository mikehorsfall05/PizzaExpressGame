/**
 * Pizza Express Game
 * A browser-based pizza restaurant management game.
 */

'use strict';

// ── Constants ──────────────────────────────────────────────────────────────

const TOTAL_DAYS = 7;
const ORDERS_PER_DAY = 5;
const ORDER_TIMEOUT_SECONDS = 30;

const PIZZA_BASES = {
  thin:    { label: 'Thin Crust',    price: 0 },
  thick:   { label: 'Thick Crust',   price: 0 },
  stuffed: { label: 'Stuffed Crust', price: 1 },
};

const PIZZA_SAUCES = {
  tomato: { label: 'Tomato' },
  bbq:    { label: 'BBQ' },
  white:  { label: 'White Garlic' },
};

const PIZZA_TOPPINGS = {
  cheese:    { label: 'Cheese',    price: 0 },
  pepperoni: { label: 'Pepperoni', price: 0 },
  mushrooms: { label: 'Mushrooms', price: 0 },
  peppers:   { label: 'Peppers',   price: 0 },
  olives:    { label: 'Olives',    price: 0 },
  chicken:   { label: 'Chicken',   price: 1 },
};

const BASE_PIZZA_PRICE = 8;
const WIN_SCORE = 200;

// Customer name pool for flavour
const CUSTOMER_NAMES = [
  'Alice', 'Bob', 'Charlie', 'Diana', 'Eve',
  'Frank', 'Grace', 'Henry', 'Isla', 'Jack',
];

// ── State ──────────────────────────────────────────────────────────────────

let state = {};

function initState() {
  state = {
    score: 0,
    money: 50,
    day: 1,
    isOpen: false,
    orders: [],          // { id, customer, base, sauce, toppings, timer, intervalId }
    selectedOrderId: null,
    ordersServedToday: 0,
    orderIdCounter: 0,
  };
}

// ── DOM Refs ───────────────────────────────────────────────────────────────

const scoreEl       = document.getElementById('score');
const moneyEl       = document.getElementById('money');
const dayEl         = document.getElementById('day');
const ordersEl      = document.getElementById('orders-container');
const serveBtn      = document.getElementById('serve-btn');
const openBtn       = document.getElementById('open-btn');
const nextDayBtn    = document.getElementById('next-day-btn');
const logList       = document.getElementById('log-list');
const overlay       = document.getElementById('overlay');
const overlayTitle  = document.getElementById('overlay-title');
const overlayMsg    = document.getElementById('overlay-msg');
const restartBtn    = document.getElementById('restart-btn');
const selectBase    = document.getElementById('select-base');
const selectSauce   = document.getElementById('select-sauce');
const toppingInputs = document.querySelectorAll('#toppings-list input[type="checkbox"]');

// ── Render ─────────────────────────────────────────────────────────────────

function render() {
  scoreEl.textContent = state.score;
  moneyEl.textContent = `$${state.money}`;
  dayEl.textContent   = state.day;

  // Orders
  if (state.orders.length === 0) {
    ordersEl.innerHTML = '<p class="empty-msg">No orders yet. Open the restaurant!</p>';
  } else {
    ordersEl.innerHTML = '';
    state.orders.forEach(order => {
      const card = document.createElement('div');
      card.className = 'order-card' + (order.id === state.selectedOrderId ? ' selected' : '');
      card.dataset.id = order.id;
      card.innerHTML = `
        <h3>👤 ${order.customer}</h3>
        <p>Base: ${PIZZA_BASES[order.base].label}</p>
        <p>Sauce: ${PIZZA_SAUCES[order.sauce].label}</p>
        <p>Toppings: ${order.toppings.map(t => PIZZA_TOPPINGS[t].label).join(', ') || 'none'}</p>
        <p class="timer">⏳ ${order.timer}s</p>
      `;
      card.addEventListener('click', () => selectOrder(order.id));
      ordersEl.appendChild(card);
    });
  }

  // Serve button
  serveBtn.disabled = state.selectedOrderId === null || !state.isOpen;

  // Next day button – enable once all orders for the day are handled
  nextDayBtn.disabled = state.isOpen;
}

// ── Logging ────────────────────────────────────────────────────────────────

function log(msg, type = 'info') {
  const li = document.createElement('li');
  li.textContent = msg;
  li.className = type;
  logList.prepend(li);
}

// ── Order helpers ──────────────────────────────────────────────────────────

function generateOrder() {
  const bases    = Object.keys(PIZZA_BASES);
  const sauces   = Object.keys(PIZZA_SAUCES);
  const toppingKeys = Object.keys(PIZZA_TOPPINGS);

  const base    = bases[Math.floor(Math.random() * bases.length)];
  const sauce   = sauces[Math.floor(Math.random() * sauces.length)];
  const count   = Math.floor(Math.random() * 4);  // 0–3 toppings
  const shuffled = toppingKeys.sort(() => Math.random() - 0.5);
  const toppings = shuffled.slice(0, count);
  const customer = CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)];

  return { base, sauce, toppings, customer };
}

function addOrder() {
  if (state.orders.length >= ORDERS_PER_DAY) return;

  const spec  = generateOrder();
  const id    = ++state.orderIdCounter;
  const order = { id, timer: ORDER_TIMEOUT_SECONDS, ...spec };

  const intervalId = setInterval(() => tickOrder(id), 1000);
  order.intervalId = intervalId;

  state.orders.push(order);
  log(`New order from ${order.customer}!`, 'info');
  render();
}

function tickOrder(id) {
  const order = state.orders.find(o => o.id === id);
  if (!order) return;

  order.timer -= 1;

  // Update just the timer text without full re-render for smoothness
  const card = ordersEl.querySelector(`[data-id="${id}"] .timer`);
  if (card) card.textContent = `⏳ ${order.timer}s`;

  if (order.timer <= 0) {
    expireOrder(id);
  }
}

function expireOrder(id) {
  const order = state.orders.find(o => o.id === id);
  if (!order) return;

  clearInterval(order.intervalId);
  state.orders = state.orders.filter(o => o.id !== id);
  if (state.selectedOrderId === id) state.selectedOrderId = null;
  state.score = Math.max(0, state.score - 5);

  log(`⌛ ${order.customer}'s order expired! -5 score`, 'error');
  checkDayEnd();
  render();
}

function selectOrder(id) {
  state.selectedOrderId = (state.selectedOrderId === id) ? null : id;
  render();
}

// ── Pizza price ────────────────────────────────────────────────────────────

function calcPizzaPrice(base, toppings) {
  let price = BASE_PIZZA_PRICE;
  price += PIZZA_BASES[base]?.price ?? 0;
  toppings.forEach(t => { price += PIZZA_TOPPINGS[t]?.price ?? 0; });
  return price;
}

// ── Serve pizza ────────────────────────────────────────────────────────────

function getSelectedToppings() {
  return Array.from(toppingInputs)
    .filter(i => i.checked)
    .map(i => i.value);
}

function pizzaMatchesOrder(base, sauce, toppings, order) {
  if (base !== order.base) return false;
  if (sauce !== order.sauce) return false;

  const a = [...toppings].sort().join(',');
  const b = [...order.toppings].sort().join(',');
  return a === b;
}

function servePizza() {
  const base     = selectBase.value;
  const sauce    = selectSauce.value;
  const toppings = getSelectedToppings();

  if (!base || !sauce) {
    log('⚠️ Please choose a base and sauce!', 'error');
    return;
  }

  const order = state.orders.find(o => o.id === state.selectedOrderId);
  if (!order) {
    log('⚠️ No order selected.', 'error');
    return;
  }

  clearInterval(order.intervalId);
  state.orders = state.orders.filter(o => o.id !== order.id);
  state.selectedOrderId = null;
  state.ordersServedToday += 1;

  const price = calcPizzaPrice(base, toppings);

  if (pizzaMatchesOrder(base, sauce, toppings, order)) {
    const points = 10 + order.timer;   // faster = more points
    state.score += points;
    state.money += price;
    log(`✅ ${order.customer} loved it! +${points} score, +$${price}`, 'success');
  } else {
    const points = 2;
    state.score += points;
    state.money += Math.floor(price / 2);
    log(`😕 ${order.customer} got the wrong pizza. +${points} score`, 'error');
  }

  resetBuilder();
  checkDayEnd();
  render();
}

function resetBuilder() {
  selectBase.value  = '';
  selectSauce.value = '';
  toppingInputs.forEach(i => { i.checked = false; });
}

// ── Day management ─────────────────────────────────────────────────────────

function openRestaurant() {
  state.isOpen = true;
  state.ordersServedToday = 0;
  openBtn.disabled = true;
  nextDayBtn.disabled = true;
  log(`🔓 Day ${state.day} – Restaurant is open!`, 'info');

  // Drip orders in over a few seconds
  let spawned = 0;
  const spawnInterval = setInterval(() => {
    if (spawned >= ORDERS_PER_DAY) {
      clearInterval(spawnInterval);
      closeRestaurant();
      return;
    }
    addOrder();
    spawned++;
  }, 3000);

  render();
}

function closeRestaurant() {
  // Clear remaining order timers
  state.orders.forEach(o => clearInterval(o.intervalId));
  state.isOpen = false;
  openBtn.disabled = true;
  nextDayBtn.disabled = false;
  log(`🔒 Restaurant closed for the day.`, 'info');
  render();
}

function nextDay() {
  // Clear any remaining order timers
  state.orders.forEach(o => clearInterval(o.intervalId));
  state.orders = [];
  state.selectedOrderId = null;

  if (state.score >= WIN_SCORE) {
    showOverlay('🏆 You Win!', `Amazing work! You finished with ${state.score} points and $${state.money}. Your Pizza Express is a hit!`);
    return;
  }

  if (state.day >= TOTAL_DAYS) {
    showOverlay('Game Over', `The week is done. You scored ${state.score} points. Keep practising to reach ${WIN_SCORE}!`);
    return;
  }

  state.day += 1;
  state.isOpen = false;
  openBtn.disabled = false;
  nextDayBtn.disabled = true;
  log(`📅 Starting Day ${state.day}`, 'info');
  render();
}

function checkDayEnd() {
  // If all spawned orders are resolved, let the player proceed
  if (!state.isOpen && state.orders.length === 0) {
    nextDayBtn.disabled = false;
  }
}

// ── Overlay ────────────────────────────────────────────────────────────────

function showOverlay(title, msg) {
  overlayTitle.textContent = title;
  overlayMsg.textContent   = msg;
  overlay.classList.remove('hidden');
}

function hideOverlay() {
  overlay.classList.add('hidden');
}

// ── Event listeners ────────────────────────────────────────────────────────

openBtn.addEventListener('click', openRestaurant);
nextDayBtn.addEventListener('click', nextDay);
serveBtn.addEventListener('click', servePizza);
restartBtn.addEventListener('click', () => {
  hideOverlay();
  startGame();
});

// ── Init ───────────────────────────────────────────────────────────────────

function startGame() {
  initState();
  resetBuilder();
  logList.innerHTML = '';
  openBtn.disabled  = false;
  nextDayBtn.disabled = true;
  log('🍕 Welcome to Pizza Express! Press "Open Restaurant" to start.', 'info');
  render();
}

startGame();
