document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('user') === null) {
      window.location.href = "index.html";
  }
});
