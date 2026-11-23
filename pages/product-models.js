const previews = document.querySelectorAll('.product-preview');

if (previews.length && document.createElement('canvas').getContext('webgl2')) {
  for (const preview of previews) {
    const viewer = preview.querySelector('model-viewer');
    viewer.addEventListener('load', () => {
      preview.classList.add('is-model-ready');
    });
    viewer.addEventListener('error', () => {
      preview.classList.remove('is-model-ready');
    });
  }

  // The product images stay visible if the 3D viewer cannot load.
  import('./assets/models/model-viewer.min.js').catch(console.error);
}
