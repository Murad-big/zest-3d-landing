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
  $('.motion-label').textContent = paused ? 'Играть' : 'Пауза';
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
  $('#product-stage').setAttribute('aria-label', `Объёмная банка ZEST, вкус ${flavor.name}. Реагирует на движение курсора.`);
  $('.can-fallback').alt = `Банка ZEST ${flavor.name}`;
  $('.can-fallback').style.filter = ['', 'hue-rotate(300deg) saturate(.65)', 'hue-rotate(40deg) saturate(.5)'][selectedFlavor];
  $$('[data-flavor]').forEach(item => {
    const active = item === button;
    item.setAttribute('aria-pressed', String(active));
    item.classList.toggle('selected', active);
  });
  window.dispatchEvent(new CustomEvent('zest:flavor', { detail: { index: selectedFlavor } }));
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
const quantities = [0, 0, 0];
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
  const remaining = MIX_SIZE - count;
  $('#save-mix').disabled = remaining > 0;
  $('#save-mix').innerHTML = remaining ? `Выбери ещё ${remaining} ${remaining === 1 ? 'банку' : remaining < 5 ? 'банки' : 'банок'} <span aria-hidden="true">↗</span>` : 'Сохранить мой набор <span aria-hidden="true">↗</span>';
  $('#save-status').textContent = '';
}
function openMix() {
  closeMenu();
  previousFocus = document.activeElement;
  updateMix();
  dialog.showModal();
  document.body.classList.add('dialog-open');
}
$$('[data-open-mix]').forEach(button => button.addEventListener('click', openMix));
$('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); previousFocus?.focus(); });
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
import('./scene.js').then(({ initScene }) => initScene({ paused, selectedFlavor })).catch(() => {
  $('#product-stage').setAttribute('aria-label', 'Банка ZEST. На этом устройстве показана фотография продукта.');
});
