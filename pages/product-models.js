const previews = document.querySelectorAll('.product-preview');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const pendingModels = new Set();
let activeModels = 0;
let viewerModule;

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

async function paintPreview(image) {
  await image.decode().catch(() => {});
  // Give the browser a frame to show the preview before starting the full asset.
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

async function upgradeImage(preview) {
  await paintPreview(preview);
  const image = new Image(Number(preview.getAttribute('width')), Number(preview.getAttribute('height')));
  image.alt = preview.alt;
  image.fetchPriority = 'low';
  if (preview.dataset.fullSrcset) {
    image.sizes = preview.dataset.fullSizes;
    image.srcset = preview.dataset.fullSrcset;
  }
  image.src = preview.dataset.fullSrc;
  try {
    await image.decode();
    preview.replaceWith(image);
  } catch {
    // Keep the preview if the larger image cannot be loaded or decoded.
  }
}

async function importModelViewer() {
  if (!document.createElement('canvas').getContext('webgl2')) return false;

  window.ModelViewerElement ??= {};
  window.ModelViewerElement.meshoptDecoderLocation = new URL('./assets/models/meshopt_decoder.js', import.meta.url).href;
  await import('./assets/models/model-viewer.min.js');
  return true;
}

async function loadModel(preview) {
  await paintPreview(preview.querySelector('.product-poster'));
  viewerModule ??= importModelViewer().catch(() => false);
  if (!await viewerModule) return;

  const viewer = preview.querySelector('model-viewer');
  const label = preview.querySelector('.product-preview-label');
  const updateRotation = () => viewer.toggleAttribute('auto-rotate', !reducedMotion.matches);
  updateRotation();
  reducedMotion.addEventListener('change', updateRotation);

  await new Promise(resolve => {
    viewer.addEventListener('load', () => {
      preview.classList.add('model-ready');
      label.hidden = false;
      resolve();
    }, { once: true });
    viewer.addEventListener('error', () => {
      preview.classList.remove('model-ready');
      label.hidden = true;
      reducedMotion.removeEventListener('change', updateRotation);
      resolve();
    }, { once: true });
    viewer.src = viewer.dataset.src;
  });
}

function startPendingModels() {
  while (activeModels < 2 && pendingModels.size) {
    const [preview] = pendingModels;
    pendingModels.delete(preview);
    mediaObserver.unobserve(preview);
    activeModels++;
    loadModel(preview).finally(() => {
      activeModels--;
      startPendingModels();
    });
  }
}

const mediaObserver = new IntersectionObserver(entries => {
  for (const { target, isIntersecting } of entries) {
    if (target.matches('.product-preview')) {
      if (isIntersecting) pendingModels.add(target);
      else pendingModels.delete(target);
    } else if (isIntersecting) {
      mediaObserver.unobserve(target);
      upgradeImage(target);
    }
  }
  startPendingModels();
});

for (const preview of previews) {
  const link = preview.nextElementSibling;
  if (link?.matches('a[href]')) enablePreviewLink(preview, link);
  mediaObserver.observe(preview);
}

for (const image of document.querySelectorAll('img[data-full-src]')) {
  mediaObserver.observe(image);
}
