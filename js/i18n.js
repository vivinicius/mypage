// js/i18n.js — EN / PT translations with browser language auto-detection

const T = {
    en: {
        // About Me
        'about.eyebrow':           'About Me',
        'about.line0':             'Quality is',
        'about.line1':             '<em>intelligent,</em>',
        'about.line2':             'not a checklist.',
        'about.p0':                'Test Automation Specialist focused on <span class="hl">Java</span>, working across <span class="hl">API, Mobile, and Web</span> automation — integrating tests into <span class="hl">CI/CD pipelines</span> and cloud environments.',
        'about.p1':                'I go beyond traditional QA. I build <span class="hl">AI-driven solutions</span> that generate test scenarios from Azure DevOps stories and automate code review from <span class="hl">GitHub &amp; GitLab</span> repositories.',
        'about.p2':                'Experience with <span class="hl">performance testing</span>, database validation, and active contribution to technical interviews and team onboarding.',
        'about.stat.years':        'Years of<br>Experience',
        'about.stat.companies':    'Companies<br>Served',
        'about.stat.platforms':    'Platforms<br><small>API · Web · Mobile</small>',
        'about.stat.cert':         'International<br>Certification',
        // CV button
        'cv.label':                'Download CV',
        'cv.meta':                 'PDF · 2026',
        // Side nav
        'nav.home':                'Home',
        'nav.about':               'About Me',
        'nav.board':               'My Board',
        // Skills section
        'skills.label':            'My Skill Board',
        // Board chrome
        'board.role':              'QA Automation Analyst',
        'board.tab.skills':        'Skills',
        'board.tab.experience':    'Experience',
        'board.tab.education':     'Education',
        'board.tab.extras':        'Extras',
        // Column headers
        'col.basic':               'BASIC',
        'col.intermediate':        'INTERMEDIATE',
        'col.advanced':            'ADVANCED',
        'col.current':             'CURRENT',
        'col.previous':            'PREVIOUS',
        'col.academic':            'ACADEMIC',
        'col.certifications':      'CERTIFICATIONS',
        // Modal
        'modal.description':       'Description',
        'modal.activity':          'Activity',
        'modal.show':              'Show:',
        'modal.all':               'All',
        'modal.comments':          'Comments',
        'modal.history':           'History',
        'modal.addComment':        'Add a comment...',
        'modal.noActivity':        'No activity yet.',
        'modal.attach':            'Attach',
        'modal.linkIssue':         'Link Issue',
        'modal.watch':             'Watch',
        'modal.assignee':          'Assignee',
        'modal.reporter':          'Reporter',
        'modal.labels':            'Labels',
        'modal.priority':          'Priority',
        'modal.points':            'Story Points',
        'modal.type':              'Type',
        'modal.createdAt':         'Created At',
        'modal.company':           'Company',
        // Footer
        'footer.wip':              'Site under development',
        // Card descriptions
        'card.SKL-001.desc': 'Automated end-to-end web testing using Selenium WebDriver with Java, applying Page Object Model and scalable test architecture.',
        'card.SKL-002.desc': 'Mobile test automation for Android and iOS using Appium, including device farms and cross-platform validation.',
        'card.SKL-003.desc': 'Automated API testing using Rest-Assured, including validation, chaining requests, and response assertions.',
        'card.SKL-004.desc': 'Behavior-driven development using Cucumber and Gherkin for readable and maintainable test scenarios.',
        'card.SKL-005.desc': 'Design and implementation of scalable automation frameworks using best practices like POM and layered architecture.',
        'card.SKL-006.desc': 'Definition of QA strategy, test planning, and quality processes across multiple squads and environments.',
        'card.SKL-007.desc': 'Source control management using Git, including branching strategies, pull requests, and code review practices.',
        'card.SKL-008.desc': 'Development of automation scripts and data processing using Python for testing and integrations.',
        'card.SKL-009.desc': 'Integration of automated tests into CI/CD pipelines using Jenkins and GitLab CI.',
        'card.SKL-010.desc': 'Execution of automated tests on cloud device farms for cross-platform validation.',
        'card.SKL-011.desc': 'Understanding of API testing concepts including validation, contract testing, and data handling.',
        'card.SKL-012.desc': 'Use of computer vision models (YOLO) for object detection and intelligent automation workflows.',
        'card.SKL-013.desc': 'Basic knowledge of HTML and CSS for building and customizing web interfaces.',
        'card.SKL-014.desc': 'Basic performance testing using Gatling for load and stress test scenarios.',
        'card.SKL-015.desc': 'Usage of ADB for interacting with Android devices and debugging automation flows.',
        'card.EXP-001.desc': 'Responsible for manual and automated testing of the Unicred app (consortium area). Developed Python automation scripts and CI/CD pipelines with Jenkins. Used Azure DevOps for task management and versioning. Worked with Web APIs and mobile feature validation.',
        'card.EXP-002.desc': 'Responsible for automating the Digiagro app (iOS and Android), integrating with BrowserStack device farm and GitLab CI pipeline. Worked in an agile squad focused on agile testing for digital banking portals. Used Jira for task management and automated execution report generation.',
        'card.EXP-003.desc': 'Responsible for automating the Meu Alelo and MeuEc apps (iOS and Android) and the full Web API layer. Developed mobile automation framework with Appium, Java, Cucumber and PageObjects (BDT). Built REST API framework with report generation and metrics. Integrated Jenkins CI/CD pipelines and used Azure DevOps for task management.',
        'card.EXP-004.desc': 'Responsible for automated test development for the PagBank app, covering backend and mobile frontend. Developed performance tests with Gatling. Managed activities in Jira (stories, bugs, tasks). Created BDD test scenarios and automated test pipelines with Jenkins.',
        'card.EXP-005.desc': 'Worked in an agile squad responsible for the full mobile app automation. Developed mobile automation framework with Appium, Java, Cucumber and PageObjects (BDT). Built REST API automation framework with report generation and prepared DeviceFarm and Jenkins CI/CD integration.',
        'card.EDU-001.desc': 'FIAP — College of Informatics and Business Administration.',
        'card.EDU-002.desc': 'Fundação Bradesco.',
        'card.CERT-001.desc': 'Quality Assurance Institute.',
    },

    pt: {
        // About Me
        'about.eyebrow':           'Sobre Mim',
        'about.line0':             'Qualidade é',
        'about.line1':             '<em>inteligente,</em>',
        'about.line2':             'não uma lista.',
        'about.p0':                'Especialista em Automação de Testes focado em <span class="hl">Java</span>, atuando em automação de <span class="hl">API, Mobile e Web</span> — integrando testes em <span class="hl">pipelines CI/CD</span> e ambientes cloud.',
        'about.p1':                'Vou além do QA tradicional. Desenvolvo <span class="hl">soluções baseadas em IA</span> que geram cenários de teste a partir de histórias no Azure DevOps e automatizam revisão de código em repositórios do <span class="hl">GitHub &amp; GitLab</span>.',
        'about.p2':                'Experiência com <span class="hl">testes de performance</span>, validação de banco de dados e contribuição ativa em entrevistas técnicas e onboarding de equipes.',
        'about.stat.years':        'Anos de<br>Experiência',
        'about.stat.companies':    'Empresas<br>Atendidas',
        'about.stat.platforms':    'Plataformas<br><small>API · Web · Mobile</small>',
        'about.stat.cert':         'Certificação<br>Internacional',
        // CV button
        'cv.label':                'Baixar CV',
        'cv.meta':                 'PDF · 2026',
        // Side nav
        'nav.home':                'Início',
        'nav.about':               'Sobre Mim',
        'nav.board':               'Meu Board',
        // Skills section
        'skills.label':            'Meu Skill Board',
        // Board chrome
        'board.role':              'Analista de Automação QA',
        'board.tab.skills':        'Habilidades',
        'board.tab.experience':    'Experiência',
        'board.tab.education':     'Formação',
        'board.tab.extras':        'Extras',
        // Column headers
        'col.basic':               'BÁSICO',
        'col.intermediate':        'INTERMEDIÁRIO',
        'col.advanced':            'AVANÇADO',
        'col.current':             'ATUAL',
        'col.previous':            'ANTERIORES',
        'col.academic':            'ACADÊMICO',
        'col.certifications':      'CERTIFICAÇÕES',
        // Modal
        'modal.description':       'Descrição',
        'modal.activity':          'Atividade',
        'modal.show':              'Exibir:',
        'modal.all':               'Tudo',
        'modal.comments':          'Comentários',
        'modal.history':           'Histórico',
        'modal.addComment':        'Adicionar comentário...',
        'modal.noActivity':        'Sem atividade ainda.',
        'modal.attach':            'Anexar',
        'modal.linkIssue':         'Vincular',
        'modal.watch':             'Observar',
        'modal.assignee':          'Responsável',
        'modal.reporter':          'Reportado por',
        'modal.labels':            'Labels',
        'modal.priority':          'Prioridade',
        'modal.points':            'Story Points',
        'modal.type':              'Tipo',
        'modal.createdAt':         'Criado em',
        'modal.company':           'Empresa',
        // Footer
        'footer.wip':              'Site em desenvolvimento',
        // Card descriptions
        'card.SKL-001.desc': 'Testes web automatizados end-to-end com Selenium WebDriver e Java, aplicando Page Object Model e arquitetura de testes escalável.',
        'card.SKL-002.desc': 'Automação de testes mobile para Android e iOS com Appium, incluindo device farms e validação cross-platform.',
        'card.SKL-003.desc': 'Testes de API automatizados com Rest-Assured, incluindo validação, encadeamento de requisições e asserções de resposta.',
        'card.SKL-004.desc': 'Desenvolvimento orientado a comportamento (BDD) com Cucumber e Gherkin para cenários de teste legíveis e de fácil manutenção.',
        'card.SKL-005.desc': 'Projeto e implementação de frameworks de automação escaláveis com boas práticas como POM e arquitetura em camadas.',
        'card.SKL-006.desc': 'Definição de estratégia de QA, planejamento de testes e processos de qualidade em múltiplos squads e ambientes.',
        'card.SKL-007.desc': 'Controle de versão com Git, incluindo estratégias de branching, pull requests e práticas de code review.',
        'card.SKL-008.desc': 'Desenvolvimento de scripts de automação e processamento de dados com Python para testes e integrações.',
        'card.SKL-009.desc': 'Integração de testes automatizados em pipelines CI/CD com Jenkins e GitLab CI.',
        'card.SKL-010.desc': 'Execução de testes automatizados em device farms na nuvem para validação cross-platform.',
        'card.SKL-011.desc': 'Compreensão de conceitos de testes de API incluindo validação, contract testing e manipulação de dados.',
        'card.SKL-012.desc': 'Uso de modelos de visão computacional (YOLO) para detecção de objetos e fluxos de automação inteligente.',
        'card.SKL-013.desc': 'Conhecimento básico de HTML e CSS para construção e customização de interfaces web.',
        'card.SKL-014.desc': 'Testes de performance básicos com Gatling para cenários de carga e stress.',
        'card.SKL-015.desc': 'Uso de ADB para interação com dispositivos Android e depuração de fluxos de automação.',
        'card.EXP-001.desc': 'Responsável por testes manuais e automatizados do app Unicred (área de consórcio). Desenvolveu scripts de automação em Python e pipelines CI/CD com Jenkins. Utilizou Azure DevOps para gestão de tarefas e versionamento. Trabalhou com Web APIs e validação de funcionalidades mobile.',
        'card.EXP-002.desc': 'Responsável pela automação do app Digiagro (iOS e Android), com integração ao BrowserStack device farm e pipeline GitLab CI. Trabalhou em squad ágil focado em testes para portais de banco digital. Utilizou Jira para gestão de tarefas e geração de relatórios.',
        'card.EXP-003.desc': 'Responsável pela automação dos apps Meu Alelo e MeuEc (iOS e Android) e toda a camada de Web APIs. Desenvolveu framework mobile com Appium, Java, Cucumber e PageObjects (BDT). Construiu framework REST com geração de relatórios e métricas. Integrou pipelines Jenkins CI/CD e utilizou Azure DevOps.',
        'card.EXP-004.desc': 'Responsável pelo desenvolvimento de testes automatizados para o app PagBank, cobrindo backend e frontend mobile. Desenvolveu testes de performance com Gatling. Gerenciou atividades no Jira (histórias, bugs, tarefas). Criou cenários BDD e pipelines de testes com Jenkins.',
        'card.EXP-005.desc': 'Trabalhou em squad ágil responsável pela automação mobile completa. Desenvolveu framework com Appium, Java, Cucumber e PageObjects (BDT). Construiu framework de automação REST com geração de relatórios e preparou integração DeviceFarm e Jenkins CI/CD.',
        'card.EDU-001.desc': 'FIAP — Faculdade de Informática e Administração Paulista.',
        'card.EDU-002.desc': 'Fundação Bradesco.',
        'card.CERT-001.desc': 'Quality Assurance Institute.',
    }
};

// [selector, key, useHTML]
const ELEMENTS = [
    ['.about-eyebrow span',                                         'about.eyebrow',        false],
    ['.about-line[data-about-line="0"]',                            'about.line0',          false],
    ['.about-line[data-about-line="1"]',                            'about.line1',          true],
    ['.about-line[data-about-line="2"]',                            'about.line2',          false],
    ['.about-p[data-about-body="0"]',                               'about.p0',             true],
    ['.about-p[data-about-body="1"]',                               'about.p1',             true],
    ['.about-p[data-about-body="2"]',                               'about.p2',             true],
    ['.about-col-stats .stat-card:nth-child(1) .stat-label',        'about.stat.years',     true],
    ['.about-col-stats .stat-card:nth-child(2) .stat-label',        'about.stat.companies', true],
    ['.about-col-stats .stat-card:nth-child(3) .stat-label',        'about.stat.platforms', true],
    ['.about-col-stats .stat-card:nth-child(4) .stat-label',        'about.stat.cert',      true],
    ['.cv-btn-label',                                               'cv.label',             false],
    ['.cv-btn-meta',                                                'cv.meta',              false],
    ['.snav-item[data-section="hero"]  .snav-label',                'nav.home',             false],
    ['.snav-item[data-section="about"] .snav-label',                'nav.about',            false],
    ['.snav-item[data-section="board"] .snav-label',                'nav.board',            false],
    ['.skills-label',                                               'skills.label',         false],
    ['.board-role',                                                 'board.role',           false],
    ['.board-tab[data-tab="skills"]',                               'board.tab.skills',     false],
    ['.board-tab[data-tab="experiencia"]',                          'board.tab.experience', false],
    ['.board-tab[data-tab="formacao"]',                             'board.tab.education',  false],
    ['.board-tab[data-tab="extras"]',                               'board.tab.extras',     false],
    ['#panel-skills     .board-column:nth-child(1) .col-title',     'col.basic',            false],
    ['#panel-skills     .board-column:nth-child(2) .col-title',     'col.intermediate',     false],
    ['#panel-skills     .board-column:nth-child(3) .col-title',     'col.advanced',         false],
    ['#panel-experiencia .board-column:nth-child(1) .col-title',    'col.current',          false],
    ['#panel-experiencia .board-column:nth-child(2) .col-title',    'col.previous',         false],
    ['#panel-formacao   .board-column:nth-child(1) .col-title',     'col.academic',         false],
    ['#panel-extras     .board-column:nth-child(1) .col-title',     'col.certifications',   false],
    ['.modal-section:nth-child(1) .modal-section-label',            'modal.description',    false],
    ['.modal-section:nth-child(2) .modal-section-label',            'modal.activity',       false],
    ['.activity-exibir',                                            'modal.show',           false],
    ['.activity-tab[data-activity="all"]',                          'modal.all',            false],
    ['.activity-tab[data-activity="comments"]',                     'modal.comments',       false],
    ['.activity-tab[data-activity="history"]',                      'modal.history',        false],
    ['.comment-placeholder',                                        'modal.addComment',     false],
    ['.modal-activity-empty',                                       'modal.noActivity',     false],
    ['.modal-action-btn:nth-child(1)',                              'modal.attach',         false],
    ['.modal-action-btn:nth-child(2)',                              'modal.linkIssue',      false],
    ['.modal-action-btn:nth-child(3)',                              'modal.watch',          false],
    ['.modal-sidebar .sidebar-field:nth-child(1) .sidebar-label',   'modal.assignee',       false],
    ['.modal-sidebar .sidebar-field:nth-child(2) .sidebar-label',   'modal.reporter',       false],
    ['.modal-sidebar .sidebar-field:nth-child(3) .sidebar-label',   'modal.labels',         false],
    ['.modal-sidebar .sidebar-field:nth-child(4) .sidebar-label',   'modal.priority',       false],
    ['.modal-sidebar .sidebar-field:nth-child(5) .sidebar-label',   'modal.points',         false],
    ['.modal-sidebar .sidebar-field:nth-child(6) .sidebar-label',   'modal.type',           false],
    ['#modal-created-field .sidebar-label',                         'modal.createdAt',      false],
    ['#modal-company-field .sidebar-label',                         'modal.company',        false],
    ['.wip-label',                                                  'footer.wip',           false],
];

export function applyTranslations(lang) {
    const t = T[lang];

    for (const [selector, key, useHTML] of ELEMENTS) {
        const el = document.querySelector(selector);
        if (!el || t[key] === undefined) continue;
        if (useHTML) el.innerHTML  = t[key];
        else         el.textContent = t[key];
    }

    // Card descriptions — matched by .card-id text, no HTML changes needed
    document.querySelectorAll('.board-card').forEach(card => {
        const id     = card.querySelector('.card-id')?.textContent.trim();
        const descEl = card.querySelector('.card-desc');
        if (id && descEl && t[`card.${id}.desc`]) {
            descEl.textContent = t[`card.${id}.desc`];
        }
    });

    // Toggle button active state
    document.querySelectorAll('.lang-opt').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === lang);
    });

    localStorage.setItem('lang', lang);
}

function detectLanguage() {
    const saved = localStorage.getItem('lang');
    if (saved === 'en' || saved === 'pt') return saved;
    return navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

// Whole-button click toggles between the two languages
document.getElementById('lang-toggle')?.addEventListener('click', () => {
    const current = localStorage.getItem('lang') || detectLanguage();
    applyTranslations(current === 'en' ? 'pt' : 'en');
});

// Individual option click sets that specific language
document.querySelectorAll('.lang-opt').forEach(opt => {
    opt.addEventListener('click', e => {
        e.stopPropagation();
        applyTranslations(opt.dataset.lang);
    });
});

// Init on load
applyTranslations(detectLanguage());
