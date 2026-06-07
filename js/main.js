/* ── Mobile menu ── */
const ham = document.getElementById('ham');
const mobileNav = document.getElementById('mobileNav');

ham.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('is-open');
  ham.setAttribute('aria-expanded', open);
});

document.querySelectorAll('#mobileNav a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('is-open');
    ham.setAttribute('aria-expanded', false);
  });
});

/* ── Header scroll shadow ── */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* ── Scroll reveal ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-reveal], [data-stagger]').forEach(el => observer.observe(el));

/* ── Stats counter ── */
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      let current = 0;
      const step = target / 40;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = prefix + Math.round(current) + suffix;
        if (current >= target) clearInterval(timer);
      }, 30);
    });
    statObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statObserver.observe(statsBar);

/* ── Copy command ── */
document.querySelectorAll('[data-copy]').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.dataset.copy;
    navigator.clipboard.writeText(text).then(() => {
      const original = btn.innerHTML;
      btn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Copiado!
      `;
      setTimeout(() => { btn.innerHTML = original; }, 2200);
    });
  });
});

/* ── Chat animation ── */
const chatMessages = document.getElementById('chatMessages');
const chatActions  = document.getElementById('chatActions');

if (chatMessages) { // only runs on pages that have the chat widget

const script = [
  {
    type: 'user',
    text: 'Meu PC está demorando muito pra iniciar o Windows',
    delay: 720,
  },
  { type: 'typing', delay: 1680 },
  {
    type: 'ai',
    text: 'Analisando sua máquina...',
    delay: 1080,
  },
  { type: 'typing', delay: 2160 },
  {
    type: 'ai-diagnosis',
    intro: 'Encontrei três pontos que estão causando lentidão na inicialização:',
    items: [
      { cls: 'issue-dot--red',    text: '11 GB de arquivos temporários acumulados' },
      { cls: 'issue-dot--amber',  text: '14 programas pesados rodando na inicialização' },
      { cls: 'issue-dot--yellow', text: 'Disco com 91% de capacidade utilizada' },
    ],
    delay: 840,
  },
  {
    type: 'ai',
    text: 'Posso limpar os temporários e desativar os programas desnecessários agora. Quer autorizar?',
    delay: 1320,
  },
  { type: 'actions', delay: 600 },
];

function createUserMsg(text) {
  const el = document.createElement('div');
  el.className = 'chat-msg chat-msg--user';
  el.textContent = text;
  return el;
}

function createAiMsg(content) {
  const el = document.createElement('div');
  el.className = 'chat-msg chat-msg--ai';
  el.innerHTML = `<div class="chat-msg__from">PC Resolve IA</div>${content}`;
  return el;
}

function createTyping() {
  const el = document.createElement('div');
  el.className = 'chat-typing';
  el.innerHTML = '<span></span><span></span><span></span>';
  return el;
}

let typingEl = null;
let timeouts = [];

function clearTimeouts() {
  timeouts.forEach(clearTimeout);
  timeouts = [];
}

function runScript() {
  chatMessages.innerHTML = '';
  chatActions.style.display = 'none';
  clearTimeouts();

  let elapsed = 0;

  script.forEach(step => {
    elapsed += step.delay;

    timeouts.push(setTimeout(() => {

      if (step.type === 'typing') {
        typingEl = createTyping();
        chatMessages.appendChild(typingEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return;
      }

      if (typingEl) { typingEl.remove(); typingEl = null; }

      if (step.type === 'user') {
        chatMessages.appendChild(createUserMsg(step.text));
      }

      if (step.type === 'ai') {
        chatMessages.appendChild(createAiMsg(step.text));
      }

      if (step.type === 'ai-diagnosis') {
        const issuesHtml = step.items.map(i =>
          `<div class="chat-issue"><div class="issue-dot ${i.cls}"></div>${i.text}</div>`
        ).join('');
        chatMessages.appendChild(createAiMsg(
          `${step.intro}<div class="chat-issues">${issuesHtml}</div>`
        ));
      }

      if (step.type === 'actions') {
        chatActions.style.display = 'flex';
      }

      chatMessages.scrollTop = chatMessages.scrollHeight;

    }, elapsed));
  });
}

runScript();

} // end if (chatMessages)
