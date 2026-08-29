(function () {
  'use strict';

  const STORAGE_KEY = 'ssidc_ad_session';
  const LOGIN_PAGE = 'login.html';
  const ACCOUNT_EXPIRES_AT = Date.parse('2026-08-30T23:59:59+08:00');
  const SESSION_EXPIRES_AT = ACCOUNT_EXPIRES_AT;
  const ACCOUNTS = Array.from({ length: 20 }, (_, index) => {
    const suffix = String(index + 1).padStart(2, '0');
    return {
      username: `202608${suffix}`,
      password: '666888'
    };
  });

  function isLoginPage() {
    return location.pathname.split('/').pop() === LOGIN_PAGE;
  }

  function sanitizeReturnTo(value) {
    if (!value) return 'index.html';
    try {
      const url = new URL(value, location.origin);
      if (url.origin !== location.origin) return 'index.html';
      return `${url.pathname.replace(/^\/+/, '')}${url.search}${url.hash}`;
    } catch {
      return 'index.html';
    }
  }

  function readSession() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed.username !== 'string') return null;
      if (Date.now() > Number(parsed.expiresAt || 0)) return null;
      const account = ACCOUNTS.find(item => item.username === parsed.username);
      if (!account) return null;
      return {
        username: account.username,
        expiresAt: Number(parsed.expiresAt || 0),
        issuedAt: Number(parsed.issuedAt || 0)
      };
    } catch {
      return null;
    }
  }

  function writeSession(username) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      username,
      issuedAt: Date.now(),
      expiresAt: SESSION_EXPIRES_AT
    }));
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function login(username, password) {
    const account = ACCOUNTS.find(item => item.username === username);
    if (!account) {
      return { ok: false, message: '账号或密码错误' };
    }
    if (Date.now() > ACCOUNT_EXPIRES_AT) {
      return { ok: false, message: '临时账号已过期，请联系管理员重新分配' };
    }
    if (account.password !== password) {
      return { ok: false, message: '账号或密码错误' };
    }
    writeSession(account.username);
    return { ok: true, account };
  }

  function logout() {
    clearSession();
    location.replace(`${LOGIN_PAGE}?returnTo=index.html`);
  }

  function enforce() {
    const session = readSession();
    if (session) {
      if (isLoginPage()) {
        location.replace('index.html');
      }
      return session;
    }
    if (!isLoginPage()) {
      const returnTo = encodeURIComponent(`${location.pathname.replace(/^\/+/, '')}${location.search}${location.hash}`);
      location.replace(`${LOGIN_PAGE}?returnTo=${returnTo}`);
    }
    return null;
  }

  function formatShanghai(ts) {
    return new Intl.DateTimeFormat('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(ts));
  }

  window.SSIDC_AUTH = {
    accounts: ACCOUNTS,
    accountExpiresAt: ACCOUNT_EXPIRES_AT,
    formatShanghai,
    getSession: readSession,
    login,
    logout,
    sanitizeReturnTo
  };

  enforce();
})();
