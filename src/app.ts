if ('addEventListener' in window) {
  window.addEventListener('load', function () {
    document.body.classList.remove('loading');
    document.body.classList.add('random-background');
  });
}
