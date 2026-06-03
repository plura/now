// ─── CTA / Contact ───────────────────────────────────────────

import { createFloat } from './layers/float.js';
import { t } from './lang.js';
import { basePath } from './config.js';

const ctaContainer = document.getElementById('plura-contacts-cta');
const ctaFrame     = document.getElementById('plura-contacts-cta-morph');
const ctaTrigger   = document.getElementById('plura-contacts-cta-trigger');
const ctaCloseBtn  = document.getElementById('plura-contacts-cta-close');

// ─── Toggle ──────────────────────────────────────────────────

const ctaContent = document.querySelector('.plura-contacts-cta-content .plura-panel');

let formW = 0, formH = 0;

const ro = new ResizeObserver(entries => {
  for (const entry of entries) {
    const box = entry.borderBoxSize[0];
    formW = box.inlineSize;
    formH = box.blockSize;
  }
});

ro.observe(ctaContent);

createFloat(
  { container: ctaContainer, frame: ctaFrame, trigger: ctaTrigger, closeBtn: ctaCloseBtn },
  () => ({ width: formW, height: formH })
);

lucide.createIcons();

// ─── Form submission ──────────────────────────────────────────

const ctaForm  = document.getElementById('plura-contacts-cta-form');
const ctaAlert = ctaContainer.querySelector('.plura-contacts-cta-alert');

function showAlert(message, type = 'error') {
  ctaAlert.textContent  = message;
  ctaAlert.dataset.type = type;
  ctaAlert.hidden       = false;
}

function hideAlert() {
  ctaAlert.hidden = true;
  delete ctaAlert.dataset.type;
}

ctaForm.addEventListener('submit', async e => {
  e.preventDefault();
  hideAlert();

  const submit = ctaForm.querySelector('.plura-form-submit');
  submit.disabled    = true;
  submit.textContent = t('Sending…');

  try {
    const res  = await fetch(`${basePath}/api/contact.php`, { method: 'POST', body: new FormData(ctaForm) });
    const data = await res.json();

    if (data.success) {
      showAlert(t("Message sent! We'll be in touch shortly."), 'success');
      ctaForm.reset();
    } else {
      showAlert(data.message ?? t('Something went wrong. Please try again.'));
    }
  } catch {
    showAlert(t('Network error. Please try again.'));
  } finally {
    submit.disabled    = false;
    submit.textContent = t('Send');
  }
});
