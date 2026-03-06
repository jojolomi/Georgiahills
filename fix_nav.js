    applyNavbarLayoutState();
    window.__GH_SHARED_NAVBAR__ = true;
  }

  function applyNavbarLayoutState() {
    const sharedNav = document.querySelector('nav[data-shared-navbar="true"]') || document.querySelector('.navbar');
    if (!sharedNav) return;

    document.body.classList.add('has-shared-navbar');

    const setOffset = () => {
      const navHeight = Math.max(80, Math.ceil(sharedNav.getBoundingClientRect().height || 88));
      document.documentElement.style.setProperty('--gh-nav-height', \\px\);
    };

    setOffset();
    window.addEventListener('resize', setOffset, { passive: true });
    window.addEventListener('orientationchange', setOffset, { passive: true });
  }
