'use strict';


const themeButton = document.querySelector('#theme-toggle');
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('#nav-links');
const form = document.querySelector('#contact-form');
const feedback = document.querySelector('#form-feedback');

document.querySelector('#year').textContent = new Date().getFullYear();

// حفظ اختيار الوضع الفاتح أو الداكن.
try {
  if (localStorage.getItem('portfolio-theme') === 'light') {
    document.body.classList.add('light');
  }
} catch (_) { /* يعمل الموقع حتى عند تعطيل التخزين */ }

function updateThemeIcon() {
  const light = document.body.classList.contains('light');
  themeButton.textContent = light ? '☀' : '☾';
  themeButton.setAttribute('aria-label', light ? 'تفعيل الوضع الداكن' : 'تفعيل الوضع الفاتح');
}
updateThemeIcon();
themeButton.addEventListener('click', () => {
  document.body.classList.toggle('light');
  try { localStorage.setItem('portfolio-theme', document.body.classList.contains('light') ? 'light' : 'dark'); } catch (_) {}
  updateThemeIcon();
});

menuButton.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

// إظهار الأقسام تدريجياً عند التمرير.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

// تحديث رابط القسم النشط في القائمة.
const sections = document.querySelectorAll('main section[id]');
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-30% 0px -55% 0px' });
  sections.forEach(section => sectionObserver.observe(section));
}

// إرسال الرسائل فعلياً إلى خادم Python.
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  feedback.textContent = 'جارٍ إرسال الرسالة...';
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        message: form.elements.message.value.trim()
      })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'تعذر إرسال الرسالة');
    feedback.textContent = 'تم استلام رسالتك بنجاح!';
    form.reset();
  } catch (error) {
    feedback.textContent = error.message || 'حدث خطأ. حاول مرة أخرى.';
  } finally {
    button.disabled = false;
  }
});
