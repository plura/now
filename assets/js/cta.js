// ─── CTA / Contact ───────────────────────────────────────────

import { openMorph, closeMorph } from './morph.js';
import { t, basePath } from './lang.js';

const ctaMain    = document.getElementById('plura-cta-main');
const ctaMorph   = document.getElementById('plura-cta-morph');
const ctaTrigger = document.getElementById('plura-cta-trigger');
const ctaClose   = document.getElementById('plura-cta-close');

// ─── Toggle ──────────────────────────────────────────────────

const ctaFormWrapper = document.querySelector('.plura-cta-form-wrapper');

let formW = 0, formH = 0;

const ro = new ResizeObserver(entries => {
  for (const entry of entries) {
    const box = entry.borderBoxSize[0];
    formW = box.inlineSize;
    formH = box.blockSize;
  }
});

ro.observe(ctaFormWrapper);

function openCta() {
  openMorph(ctaMain, ctaMorph, ctaTrigger.getBoundingClientRect(), { width: formW, height: formH });
  ctaTrigger.setAttribute('aria-expanded', 'true');
}

function closeCta() {
  closeMorph(ctaMain, ctaMorph);
  ctaTrigger.setAttribute('aria-expanded', 'false');
}

lucide.createIcons();

ctaTrigger.addEventListener('click', openCta);
ctaClose.addEventListener('click', closeCta);
ctaMain.addEventListener('click', e => { if (e.target === ctaMain) closeCta(); });

// ─── Form submission ──────────────────────────────────────────

const ctaForm  = document.getElementById('plura-cta-form');
const ctaAlert = ctaMain.querySelector('.plura-cta-alert');

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

  const submit = ctaForm.querySelector('.plura-cta-submit');
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
