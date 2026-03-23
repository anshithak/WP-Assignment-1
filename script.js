/* ==========================================
   EduSphere — script.js
   Web Programming Assignment I, CBIT 2025-26
   ========================================== */

/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ── Hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id], div[id="login"]');
const navItems = document.querySelectorAll('.nav-link');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navItems.forEach(n => n.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => observer.observe(s));

/* ── In-memory user store ── */
const registeredUsers = []; // stores { name, email, password } on successful register

/* ── Auth Tab switch ── */
function switchTab(tab) {
  const rForm = document.getElementById('registerForm');
  const lForm = document.getElementById('loginForm');
  const rTab  = document.getElementById('registerTab');
  const lTab  = document.getElementById('loginTab');
  if (tab === 'register') {
    rForm.classList.remove('hidden');
    lForm.classList.add('hidden');
    rTab.classList.add('active');
    lTab.classList.remove('active');
  } else {
    lForm.classList.remove('hidden');
    rForm.classList.add('hidden');
    lTab.classList.add('active');
    rTab.classList.remove('active');
  }
}

/* ── Helpers ── */
function showErr(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}
function clearErr(id) { showErr(id, ''); }

function markInput(id, hasErr) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('input-error', hasErr);
}

/* ── Register Validation ── */
function validateRegister(e) {
  e.preventDefault();
  let valid = true;

  const name  = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass  = document.getElementById('reg-pass').value;
  const conf  = document.getElementById('reg-conf').value;

  // Name
  if (!name) {
    showErr('reg-name-err', '⚠ Full name is required.');
    markInput('reg-name', true); valid = false;
  } else if (name.length < 3) {
    showErr('reg-name-err', '⚠ Name must be at least 3 characters.');
    markInput('reg-name', true); valid = false;
  } else { clearErr('reg-name-err'); markInput('reg-name', false); }

  // Email — strict validation
  // Rules: local@domain.tld
  //   local: letters, digits, . _ % + - (no consecutive dots, no leading/trailing dot)
  //   domain: letters/digits/hyphens, no leading/trailing hyphen
  //   TLD: 2–6 letters only
  const emailRe = /^[a-zA-Z0-9]([a-zA-Z0-9._%+\-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,6}$/;
  if (!email) {
    showErr('reg-email-err', '⚠ Email is required.');
    markInput('reg-email', true); valid = false;
  } else if (email.includes('..')) {
    showErr('reg-email-err', '⚠ Email cannot contain consecutive dots.');
    markInput('reg-email', true); valid = false;
  } else if (!emailRe.test(email)) {
    showErr('reg-email-err', '⚠ Enter a valid email (e.g. name@domain.com).');
    markInput('reg-email', true); valid = false;
  } else { clearErr('reg-email-err'); markInput('reg-email', false); }

  // Password
  const passRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!pass) {
    showErr('reg-pass-err', '⚠ Password is required.');
    markInput('reg-pass', true); valid = false;
  } else if (!passRe.test(pass)) {
    showErr('reg-pass-err', '⚠ Min 8 chars, one uppercase, one number.');
    markInput('reg-pass', true); valid = false;
  } else { clearErr('reg-pass-err'); markInput('reg-pass', false); }

  // Confirm Password
  if (!conf) {
    showErr('reg-conf-err', '⚠ Please confirm your password.');
    markInput('reg-conf', true); valid = false;
  } else if (pass !== conf) {
    showErr('reg-conf-err', '⚠ Passwords do not match.');
    markInput('reg-conf', true); valid = false;
  } else { clearErr('reg-conf-err'); markInput('reg-conf', false); }

  if (valid) {
    // Prevent duplicate registrations
    const alreadyExists = registeredUsers.some(u => u.email === email.toLowerCase());
    if (alreadyExists) {
      showErr('reg-email-err', '⚠ This email is already registered. Please login.');
      markInput('reg-email', true);
      return;
    }
    // Save to in-memory store
    registeredUsers.push({ name, email: email.toLowerCase(), password: pass });
    document.getElementById('reg-success').textContent = '✅ Account created! You can now login.';
    document.getElementById('registerForm').reset();
  } else {
    document.getElementById('reg-success').textContent = '';
  }
}

/* ── Login Validation ── */
function validateLogin(e) {
  e.preventDefault();
  let valid = true;

  const email = document.getElementById('log-email').value.trim();
  const pass  = document.getElementById('log-pass').value;

  const emailRe = /^[a-zA-Z0-9]([a-zA-Z0-9._%+\-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,6}$/;
  if (!email) {
    showErr('log-email-err', '⚠ Email is required.');
    markInput('log-email', true); valid = false;
  } else if (email.includes('..')) {
    showErr('log-email-err', '⚠ Email cannot contain consecutive dots.');
    markInput('log-email', true); valid = false;
  } else if (!emailRe.test(email)) {
    showErr('log-email-err', '⚠ Enter a valid email (e.g. name@domain.com).');
    markInput('log-email', true); valid = false;
  } else { clearErr('log-email-err'); markInput('log-email', false); }

  if (!pass) {
    showErr('log-pass-err', '⚠ Password is required.');
    markInput('log-pass', true); valid = false;
  } else if (pass.length < 8) {
    showErr('log-pass-err', '⚠ Password must be at least 8 characters.');
    markInput('log-pass', true); valid = false;
  } else { clearErr('log-pass-err'); markInput('log-pass', false); }

  if (valid) {
    // Check if email is registered
    const user = registeredUsers.find(u => u.email === email.toLowerCase());
    if (!user) {
      showErr('log-email-err', '⚠ No account found with this email. Please register first.');
      markInput('log-email', true);
      return;
    }
    // Check if password matches
    if (user.password !== pass) {
      showErr('log-pass-err', '⚠ Incorrect password. Please try again.');
      markInput('log-pass', true);
      return;
    }
    document.getElementById('log-success').textContent = `✅ Welcome back, ${user.name}! Login successful.`;
    document.getElementById('loginForm').reset();
  } else {
    document.getElementById('log-success').textContent = '';
  }
}

/* ── Contact form ── */
function submitContact(e) {
  e.preventDefault();
  const name    = document.getElementById('c-name').value.trim();
  const email   = document.getElementById('c-email').value.trim();
  const subject = document.getElementById('c-subject').value.trim();
  const msg     = document.getElementById('c-msg').value.trim();
  const success = document.getElementById('contact-success');

  if (!name || !email || !subject || !msg) {
    success.style.color = 'var(--accent2)';
    success.textContent = '⚠ Please fill in all fields before submitting.';
    return;
  }

  success.style.color = '#06d6a0';
  success.textContent = '✅ Message sent! We\'ll get back to you within 24 hours.';
  e.target.reset();
}

/* ── Course filter ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const courseCards = document.querySelectorAll('.course-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    courseCards.forEach(card => {
      const match = filter === 'all' || card.dataset.cat === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

/* ── Curriculum accordion ── */
document.querySelectorAll('.curr-head').forEach(head => {
  head.addEventListener('click', () => {
    const item = head.closest('.curr-item');
    item.classList.toggle('open');
  });
});

/* ── Scroll reveal ── */
const revealEls = document.querySelectorAll('.course-card, .cinfo-item, .curr-item, .detail-card');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObs.observe(el);
});
