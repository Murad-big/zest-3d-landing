import { flavors, CAN_PRICE, MIX_SIZE } from './data.js';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const mediaQuery = matchMedia('(prefers-reduced-motion: reduce)');
let paused = mediaQuery.matches;
let selectedFlavor = 0;
let toastTimeout;

function applyMotion() {
  document.body.classList.toggle('motion-paused', paused);
  $('#motion-toggle').setAttribute('aria-pressed', String(paused));
  $('#motion-toggle').setAttribute('aria-label', paused ? 'Включить анимацию' : 'Приостановить анимацию');
  $('#motion-toggle > span').textContent = paused ? '▷' : 'Ⅱ';
  $('.motion-label').textContent = paused ? 'Продолжить' : 'Пауза';
  window.dispatchEvent(new CustomEvent('zest:motion', { detail: { paused } }));
}
$('#motion-toggle').addEventListener('click', () => { paused = !paused; applyMotion(); });
mediaQuery.addEventListener('change', (event) => { paused = event.matches; applyMotion(); });
applyMotion();

$$('[data-flavor]').forEach(button => button.addEventListener('click', () => {
  selectedFlavor = Number(button.dataset.flavor);
  const flavor = flavors[selectedFlavor];
  document.documentElement.style.setProperty('--hero', flavor.background);
  document.querySelector('meta[name="theme-color"]').content = flavor.background;
  $('#active-flavor').textContent = flavor.name;
  $('#flavor-number').textContent = `0${selectedFlavor + 1} / 03`;
  $('#product-stage').setAttribute('aria-label', `3D-модель ZEST, ${flavor.name}`);
  $('.can-fallback').alt = `Банка ZEST ${flavor.name}`;
  $('.can-fallback').style.filter = ['', 'hue-rotate(300deg) saturate(.65)', 'hue-rotate(40deg) saturate(.5)'][selectedFlavor];
  $$('[data-flavor]').forEach(item => {
    const active = item === button;
    item.setAttribute('aria-pressed', String(active));
    item.classList.toggle('selected', active);
  });
  window.dispatchEvent(new CustomEvent('zest:flavor', { detail: { index: selectedFlavor } }));
}));
$$('[data-flavor]').forEach((button, index, buttons) => button.addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
  buttons[next].focus(); buttons[next].click();
}));

const menuButton = $('.menu-toggle');
const mobileNav = $('#mobile-nav');
function closeMenu() { mobileNav.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Открыть меню'); }
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  mobileNav.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
$$('.mobile-nav a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

if ('IntersectionObserver' in window) {
  const reveals = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveals.unobserve(entry.target); }
    });
  }, { threshold: .08 });
  $$('.reveal').forEach(element => reveals.observe(element));
  document.body.classList.add('js-ready');
}

const dialog = $('#mix-dialog');
const STORAGE_KEY = 'zest.mix.v1';
function restoreMix() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(value) && value.length === flavors.length && value.every(n => Number.isInteger(n) && n >= 0 && n <= MIX_SIZE) && value.reduce((a, b) => a + b, 0) <= MIX_SIZE) return value;
  } catch { /* Storage may be unavailable in a private browser session. */ }
  return [0, 0, 0];
}
const quantities = restoreMix();
let previousFocus;
const money = value => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;
const totalCount = () => quantities.reduce((total, quantity) => total + quantity, 0);
$('#mix-items').innerHTML = flavors.map((flavor, index) => `
  <div class="mix-item">
    <span class="mix-dot" style="background:${flavor.color}" aria-hidden="true"></span>
    <span class="mix-item-name" id="mix-label-${index}">${flavor.name}</span>
    <div class="stepper" role="group" aria-labelledby="mix-label-${index}">
      <button data-step="-1" data-index="${index}" aria-label="Убрать: ${flavor.name}">−</button>
      <output id="quantity-${index}" aria-label="Количество: ${flavor.name}">0</output>
      <button data-step="1" data-index="${index}" aria-label="Добавить: ${flavor.name}">+</button>
    </div>
  </div>`).join('');

function updateMix() {
  const count = totalCount();
  quantities.forEach((quantity, index) => { $(`#quantity-${index}`).textContent = quantity; });
  $$('[data-step]').forEach(button => {
    button.disabled = Number(button.dataset.step) === 1 ? count >= MIX_SIZE : quantities[Number(button.dataset.index)] === 0;
  });
  $('#mix-count').textContent = `${count} из ${MIX_SIZE} банок`;
  $('#mix-total').textContent = money(count * CAN_PRICE);
  const colors = flavors.flatMap((flavor, index) => Array(quantities[index]).fill(flavor.color));
  $$('.mix-progress span').forEach((bar, index) => { bar.style.background = colors[index] || ''; });
  $$('.dock-dots i').forEach((bar, index) => { bar.style.background = colors[index] || ''; });
  $('#mix-dock').hidden = count === 0;
  document.body.classList.toggle('has-mix', count > 0);
  $('#dock-count').textContent = `${count} / ${MIX_SIZE}`;
  $('#dock-price').textContent = money(count * CAN_PRICE);
  $('#clear-mix').disabled = count === 0;
  $$('[data-add]').forEach((button, index) => {
    button.textContent = quantities[index] ? String(quantities[index]) : '+';
    button.classList.toggle('has-items', quantities[index] > 0);
    const noun = ['Юдзу и лимон', 'Розовый грейпфрут', 'Лайм и мяту'][index];
    button.setAttribute('aria-label', `Добавить ${noun} в набор${quantities[index] ? `. В наборе: ${quantities[index]}` : ''}`);
  });
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(quantities)); } catch { /* Core UI remains usable without storage. */ }
  const remaining = MIX_SIZE - count;
  $('#save-mix').disabled = remaining > 0;
  $('#save-mix').innerHTML = remaining ? `Выбери ещё ${remaining} ${remaining === 1 ? 'банку' : remaining < 5 ? 'банки' : 'банок'} <span aria-hidden="true">↗</span>` : 'Сохранить мой набор <span aria-hidden="true">↗</span>';
  $('#save-status').textContent = '';
}
$('#balanced-mix').addEventListener('click', () => { quantities.fill(2); updateMix(); });
$('#clear-mix').addEventListener('click', () => { quantities.fill(0); updateMix(); });
function openMix() {
  closeMenu();
  previousFocus = document.activeElement;
  updateMix();
  dialog.showModal();
  document.body.classList.add('dialog-open');
}
$$('[data-open-mix]').forEach(button => button.addEventListener('click', openMix));
$('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  const focusTarget = previousFocus?.closest('[hidden]') ? $('.header [data-open-mix]') : previousFocus;
  focusTarget?.focus({ preventScroll: true });
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
$$('[data-step]').forEach(button => button.addEventListener('click', () => {
  const index = Number(button.dataset.index);
  const step = Number(button.dataset.step);
  if (step === 1 && totalCount() >= MIX_SIZE || step === -1 && quantities[index] <= 0) return;
  quantities[index] += step;
  updateMix();
}));
function toast(message) {
  clearTimeout(toastTimeout);
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  toastTimeout = setTimeout(() => $('#toast').classList.remove('visible'), 3000);
}
$$('[data-add]').forEach(button => button.addEventListener('click', () => {
  const index = Number(button.dataset.add);
  if (totalCount() >= MIX_SIZE) { openMix(); return; }
  quantities[index] += 1;
  updateMix();
  toast(`${flavors[index].name} в наборе · ${totalCount()} / ${MIX_SIZE}`);
  if (totalCount() === MIX_SIZE) openMix();
}));
$('#save-mix').addEventListener('click', () => {
  if (totalCount() !== MIX_SIZE) return;
  const contents = ['ZEST — моё маленькое лето', '', ...flavors.map((flavor, index) => `${flavor.name}: ${quantities[index]} × 330 мл`), '', `Итого: ${money(totalCount() * CAN_PRICE)}`, '', 'Портфолио-концепт. Подборка сохранена локально; заказ не отправлен, оплата не производится.'].join('\n');
  const url = URL.createObjectURL(new Blob(['\uFEFF', contents], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url; link.download = 'zest-my-mix.txt';
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  $('#save-status').textContent = 'Подборка готова — файл скачивается. Твоё лето уже ближе.';
});
updateMix();

// Keep the full landing page usable if WebGL is unavailable.
import('./scene.js').then(({ initScene }) => initScene({ getState: () => ({ paused, selectedFlavor }) })).catch(() => {
  $('#product-stage').setAttribute('aria-label', 'Банка ZEST. На этом устройстве показана фотография продукта.');
  $('#product-stage').removeAttribute('tabindex');
  $('#rotation-help').hidden = true;
});
