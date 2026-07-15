document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icons = btn.querySelectorAll('.eye-icon');

      if (input.type === 'password') {
        input.type = 'text';
        icons[0].classList.add('d-none');
        icons[1].classList.remove('d-none');
      } else {
        input.type = 'password';
        icons[0].classList.remove('d-none');
        icons[1].classList.add('d-none');
      }
    });
  });
});
