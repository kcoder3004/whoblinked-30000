// FTC 14481 — Don't Blink — shared site behavior

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeaderScroll();
  initActiveLink();
  initReveal();
  initCounters();
  initBackToTop();
  initInquiryForm();
});

/* Mobile nav toggle + dropdown accordions */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('.has-dropdown > .nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth > 860) return;
      e.preventDefault();
      link.parentElement.classList.toggle('dropdown-open');
    });
  });

  links.querySelectorAll('a:not(.has-dropdown > .nav-link)').forEach((a) => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* Shrink / solidify header on scroll */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => {
    if (window.scrollY > 20) {
      header.style.background = 'rgba(5, 7, 13, 0.85)';
      header.style.borderBottomColor = 'rgba(255,255,255,0.12)';
    } else {
      header.style.background = 'rgba(5, 7, 13, 0.55)';
      header.style.borderBottomColor = 'rgba(255,255,255,0.09)';
    }
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* Highlight current page in nav */
function initActiveLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* Fade/slide elements in as they enter viewport */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((el) => observer.observe(el));
}

/* Animate numeric stats counting up */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (Number.isInteger(target) ? Math.round(value) : value.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => observer.observe(el));
}

/* Contact page inquiry form — builds a pre-filled email since the site has no backend */
function initInquiryForm() {
  const form = document.getElementById('inquiryForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const inquiryType = form.inquiryType.value;
    const message = form.message.value.trim();

    const subject = `${inquiryType} - Who Blinked FTC 30000`;
    const body =
      `Name: ${firstName} ${lastName}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone || 'N/A'}\n` +
      `Inquiry Type: ${inquiryType}\n\n` +
      `Message:\n${message}`;

    const mailto = `mailto:whoblinked30000@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    status.textContent = 'Opening your email app to send this message…';
    status.className = 'form-status success';
    window.location.href = mailto;
  });
}

/* Back-to-top button */
function initBackToTop() {
  const btn = document.querySelector('.to-top');
  if (!btn) return;
  document.addEventListener(
    'scroll',
    () => btn.classList.toggle('show', window.scrollY > 600),
    { passive: true }
  );
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
