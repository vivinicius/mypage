// js/board.js

// ── Tab switching ────────────────────────────────────────────
document.querySelectorAll('.board-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        document.querySelectorAll('.board-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.board-tab-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`panel-${target}`).classList.add('active');
    });
});

// ── Card detail modal ────────────────────────────────────────
const overlay  = document.getElementById('card-modal-overlay');
const modal    = document.getElementById('card-modal');
const closeBtn = modal.querySelector('.modal-close');

const TYPE_MAP = {
    'panel-skills':      { label: 'Skill',        icon: '' },
    'panel-experiencia': { label: 'Experiência',   icon: '' },
    'panel-formacao':    { label: 'Formação',      icon: '' },
    'panel-extras':      { label: 'Certificação',  icon: '' },
};

// "Criado Em" para cards sem meta-date
const CREATED_MAP = {
    'SKL-001': 'Mar, 2022', 'SKL-002': 'Jan, 2020', 'SKL-003': 'Mar, 2024',
    'SKL-004': 'Jan, 2019', 'SKL-005': 'Jan, 2020', 'SKL-006': 'Jan, 2019',
    'SKL-007': 'Jan, 2020', 'SKL-008': 'Jan, 2019', 'SKL-009': 'Jan, 2020',
    'SKL-010': 'Jan, 1998',
};

function priorityClass(el) {
    if (!el) return '';
    return ['low', 'medium', 'high', 'critical'].find(c => el.classList.contains(c)) || '';
}

function openModal(card) {
    const id         = card.querySelector('.card-id')?.textContent.trim()  || '';
    const title      = card.querySelector('.card-title')?.textContent.trim() || '';
    const desc       = card.querySelector('.card-desc')?.textContent.trim()  || 'Sem descrição adicional.';
    const points     = card.querySelector('.card-points')?.textContent.trim() || '—';
    const priorityEl = card.querySelector('.priority');
    const dateEl     = card.querySelector('.meta-date');
    const companyEl  = card.querySelector('.meta-company');

    const panelId = card.closest('.board-tab-panel')?.id || '';
    const typeInfo = TYPE_MAP[panelId] || { label: '', icon: '' };
    const colTitle = card.closest('.board-column')?.querySelector('.col-title')?.textContent.trim() || '';

    // Header
    modal.querySelector('.modal-type-icon').textContent  = typeInfo.icon;
    modal.querySelector('.modal-card-id').textContent    = id;
    modal.querySelector('.modal-col-status').textContent = colTitle;

    // Title
    modal.querySelector('.modal-title').textContent = title;

    // Descrição
    modal.querySelector('.modal-desc').textContent = desc;

    // Priority (dot + badge)
    const pClass = priorityClass(priorityEl);
    const pText  = priorityEl?.textContent.trim() || '—';
    const priorityContainer = modal.querySelector('.modal-priority');
    priorityContainer.innerHTML = pClass
        ? `<span class="priority-dot ${pClass}"></span><span class="priority ${pClass}">${pText}</span>`
        : `<span style="color:#8b949e;font-size:0.8rem">—</span>`;

    // Labels
    const tagsContainer = modal.querySelector('.modal-tags');
    tagsContainer.innerHTML = '';
    card.querySelectorAll('.card-tags .tag').forEach(t => tagsContainer.appendChild(t.cloneNode(true)));

    // Story Points
    modal.querySelector('.modal-points').textContent = points;

    // Tipo
    modal.querySelector('.modal-type').textContent = typeInfo.label;

    // Criado Em — usa data do meta-date (início) ou CREATED_MAP
    const createdField   = document.getElementById('modal-created-field');
    const createdEl      = modal.querySelector('.modal-created');
    let createdText = CREATED_MAP[id] || null;
    if (!createdText && dateEl) {
        createdText = dateEl.textContent.replace('📅', '').trim().split('-')[0].trim();
    }
    if (createdText) {
        createdEl.textContent     = createdText;
        createdField.style.display = '';
    } else {
        createdField.style.display = 'none';
    }

    // Empresa
    const companyField = document.getElementById('modal-company-field');
    if (companyEl) {
        modal.querySelector('.modal-company').textContent = companyEl.textContent.trim();
        companyField.style.display = '';
    } else {
        companyField.style.display = 'none';
    }

    overlay.classList.add('active');
}

function closeModal() {
    overlay.classList.remove('active');
}

// Activity tabs (inside modal)
modal.querySelectorAll('.activity-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        modal.querySelectorAll('.activity-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

// Open on card click
document.querySelectorAll('.board-card').forEach(card => {
    card.addEventListener('click', () => openModal(card));
});

closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Botões sem ação: tremida + vermelho ao clicar
modal.querySelectorAll('.modal-action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.remove('no-action');
        void btn.offsetWidth; // force reflow para reiniciar animação
        btn.classList.add('no-action');
        setTimeout(() => btn.classList.remove('no-action'), 600);
    });
});
