// ─── CTA / Contact ───────────────────────────────────────────

const ctaMain    = document.getElementById('plura-cta-main');
const ctaMorph   = document.getElementById('plura-cta-morph');
const ctaTrigger = document.getElementById('plura-cta-trigger');
const ctaClose   = document.getElementById('plura-cta-close');

// ─── Toggle ──────────────────────────────────────────────────

const ctaFormWrapper = document.querySelector('.plura-cta-form-wrapper');

let btnW = 0, btnH = 0, formW = 0, formH = 0;

const ro = new ResizeObserver(entries => {
  for (const entry of entries) {
    const box = entry.borderBoxSize[0];
    if (entry.target === ctaTrigger)     { btnW = box.inlineSize; btnH = box.blockSize; }
    if (entry.target === ctaFormWrapper) { formW = box.inlineSize; formH = box.blockSize; }
  }
  if (!ctaMain.classList.contains('active')) setMorphSize(false);
});

ro.observe(ctaTrigger);
ro.observe(ctaFormWrapper);

function setMorphSize(active) {
  if (active) {
    const rect = ctaMorph.getBoundingClientRect();
    // morph is anchored by right/bottom — use those edges as the fixed reference
    const dx   = window.innerWidth  / 2 - rect.right  + formW / 2;
    const dy   = window.innerHeight / 2 - rect.bottom + formH / 2;
    ctaMorph.style.width     = `${formW}px`;
    ctaMorph.style.height    = `${formH}px`;
    ctaMorph.style.transform = `translate(${dx}px, ${dy}px)`;
  } else {
    ctaMorph.style.width     = `${btnW}px`;
    ctaMorph.style.height    = `${btnH}px`;
    ctaMorph.style.transform = 'translate(0, 0)';
  }
}

function openCta() {
  setMorphSize(true);
  ctaMain.classList.add('active');
  ctaTrigger.setAttribute('aria-expanded', 'true');
}

function closeCta() {
  setMorphSize(false);
  ctaMain.classList.remove('active');
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
  submit.disabled     = true;
  submit.textContent  = 'Sending…';

  try {
    const res  = await fetch('api/contact.php', { method: 'POST', body: new FormData(ctaForm) });
    const data = await res.json();

    if (data.success) {
      showAlert('Message sent! We\'ll be in touch shortly.', 'success');
      ctaForm.reset();
    } else {
      showAlert(data.message ?? 'Something went wrong. Please try again.');
    }
  } catch {
    showAlert('Network error. Please try again.');
  } finally {
    submit.disabled    = false;
    submit.textContent = 'Send';
  }
});
