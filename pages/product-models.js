const previews = document.querySelectorAll('.product-preview');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function enablePreviewLink(preview, link) {
  const clickSlop = 6;
  let press;
  let canFollowLink = false;

  preview.addEventListener('pointerdown', event => {
    canFollowLink = false;
    press = event.isPrimary && event.button === 0
      ? { id: event.pointerId, x: event.clientX, y: event.clientY }
      : undefined;
  }, true);

  function movedTooFar(event) {
    return Math.hypot(event.clientX - press.x, event.clientY - press.y) > clickSlop;
  }

  preview.addEventListener('pointermove', event => {
    if (press?.id === event.pointerId && movedTooFar(event)) press = undefined;
  }, true);

  preview.addEventListener('pointercancel', () => {
    press = undefined;
    canFollowLink = false;
  }, true);

  preview.addEventListener('pointerup', event => {
    canFollowLink = press?.id === event.pointerId && !movedTooFar(event);
    press = undefined;
  }, true);

  preview.addEventListener('click', () => {
    if (!canFollowLink) return;
    canFollowLink = false;
    link.click();
  });
}

for (const preview of previews) {
  const viewer = preview.querySelector('model-viewer');
  const label = preview.querySelector('.product-preview-label');
  const link = preview.nextElementSibling;
  enablePreviewLink(preview, link);

  const updateRotation = () => viewer.toggleAttribute('auto-rotate', !reducedMotion.matches);
  updateRotation();
  reducedMotion.addEventListener('change', updateRotation);

  viewer.addEventListener('load', () => { label.hidden = false; });
  viewer.addEventListener('error', () => { label.hidden = true; });
}

if (previews.length && document.createElement('canvas').getContext('webgl2')) {
  import('./assets/models/model-viewer.min.js').catch(console.error);
}
