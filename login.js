(function () {
  'use strict';

  const form = document.getElementById('loginForm');
  const status = document.getElementById('status');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const resetBtn = document.getElementById('resetBtn');
  const expiryLabel = document.getElementById('expiryLabel');

  function getReturnTo() {
    const params = new URLSearchParams(location.search);
    return SSIDC_AUTH.sanitizeReturnTo(decodeURIComponent(params.get('returnTo') || ''));
  }

  function showStatus(message, ok) {
    status.textContent = message;
    status.style.color = ok ? '#1e8449' : '#c0392b';
  }

  if (expiryLabel) {
    expiryLabel.textContent = SSIDC_AUTH.formatShanghai(SSIDC_AUTH.accountExpiresAt);
  }

  const existing = SSIDC_AUTH.getSession();
  if (existing) {
    location.replace(getReturnTo());
    return;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      showStatus('请输入用户名和密码', false);
      return;
    }

    const result = SSIDC_AUTH.login(username, password);
    if (!result.ok) {
      showStatus(result.message || '登录失败', false);
      return;
    }

    showStatus('登录成功，正在进入……', true);
    const target = getReturnTo();
    setTimeout(() => location.replace(target), 320);
  });

  resetBtn.addEventListener('click', () => {
    usernameInput.value = '';
    passwordInput.value = '';
    status.textContent = '';
    usernameInput.focus();
  });

  usernameInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') passwordInput.focus();
  });

  passwordInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') form.requestSubmit();
  });
})();
