if (document.querySelector('model-viewer') && document.createElement('canvas').getContext('webgl2')) {
  import('./assets/models/model-viewer.min.js').catch(console.error);
}
