/* ==========================================================================
   КХАМАЧ — МОДУЛЬ ПРОГРЕССИИ, ГЛАВ ПРИКЛЮЧЕНИЙ И 30 ТИРОВ ТВАРЕЙ (v4.9.20-BETA)
   ========================================================================== */

// Состояние: null означает, что открыта доска выбора глав. Число — индекс запущенной главы.
window.currentActiveChapterView = null;

const ADVENTURE_CHAPTERS = [
    {
        id: "ch_1",
        title: "Глава I: Гнилые Топи",
        icon: "🐛",
        description: "Нижние ярусы затоплены ядовитой слизью. Здесь копошатся мерзкие насекомые и первые змеи-падальщики.",
        bosses: [
            { tier: 1, name: "Личинка Разлома", icon: "🐛", baseHP: 120 },
            { tier: 2, name: "Скорпион-Трупник", icon: "`🦂`", baseHP: 180 },
            { tier: 3, name: "Змей-Падальщик", icon: "🐲", baseHP: 240 },
            { tier: 4, name: "Изумрудный Слизень", icon: "🐍", baseHP: 300 },
            { tier: 5, name: "Паук Кровавых Нитей", icon: "🕷️", baseHP: 360 },
            { tier: 6, name: "Ядовитый Исполин", icon: "🦎", baseHP: 420 }
        ]
    },
    {
        id: "ch_2",
        title: "Глава II: Оплоты Безмолвия",
        icon: "🦇",
        description: "Заброшенные склепы древних правителей, облюбованные крылатыми бестиями и ископаемыми крокодилами.",
        bosses: [
            { tier: 7, name: "Адская Летучая Мышь", icon: "🦇", baseHP: 480 },
            { tier: 8, name: "Чешуйчатый Тиран", icon: "🐉", baseHP: 540 },
            { tier: 9, name: "Крокодил Бездны", icon: "🐊", baseHP: 600 },
            { tier: 10, name: "Вепрь-Людоед", icon: "🐷", baseHP: 660 },
            { tier: 11, name: "Змей Склепов", icon: "🐉", baseHP: 720 },
            { tier: 12, name: "Костяной Старейшина", icon: "💀", baseHP: 780 }
        ]
    },
    {
        id: "ch_3",
        title: "Глава III: Выжженные Скалы",
        icon: "🦖",
        description: "Раскаленная магма плавит гранит. Здесь бродят выжившие доисторические гиганты и огненные волки.",
        bosses: [
            { tier: 13, name: "Пепельный Волк", icon: "🐺", baseHP: 840 },
            { tier: 14, name: "Левиафан Стонущих Скал", icon: "🐲", baseHP: 900 },
            { tier: 15, name: "Тираннозавр Горнила", icon: "🦖", baseHP: 960 },
            { tier: 16, name: "Лавовый Диплодок", icon: "🦕", baseHP: 1020 },
            { tier: 17, name: "Огненный Лорд Стихий", icon: "👹", baseHP: 1080 },
            { tier: 18, name: "Магматический Ящер", icon: "🐊", baseHP: 1140 }
        ]
    },
    {
        id: "ch_4",
        title: "Глава IV: Чертоги Кошмаров",
        icon: "🧟",
        description: "Пространство искажено темным колдовством. Ожившие мертвецы и вампиры охраняют подступы к ядру.",
        bosses: [
            { tier: 19, name: "Некромант Ордена", icon: "👺", baseHP: 1200 },
            { tier: 20, name: "Гниющий Зомби-Исполин", icon: "🧟", baseHP: 1260 },
            { tier: 21, name: "Высший Вампир Разлома", icon: "🧛", baseHP: 1320 },
            { tier: 22, name: "Рогатый Демон Бездны", icon: "😈", baseHP: 1380 },
            { tier: 23, name: "Демонический Владыка", icon: "👿", baseHP: 1440 },
            { tier: 24, name: "Призрачный Жнец Душ", icon: "👻", baseHP: 1500 }
        ]
    },
    {
        id: "ch_5",
        title: "Глава V: Космический Шлюз",
        icon: "👽",
        description: "Высшая точка Горнила, где реальность трещит по швам. Инопланетные сущности, джинны и мифические фениксы.",
        bosses: [
            { tier: 25, name: "Джинн Иллюзий", icon: "🧞", baseHP: 1560 },
            { tier: 26, name: "Разведчик Иных Миров", icon: "👽", baseHP: 1620 },
            { tier: 27, name: "Космический Наблюдатель", icon: "🛸", baseHP: 1680 },
            { tier: 28, name: "Монолит Бездны", icon: "🗿", baseHP: 1740 },
            { tier: 29, name: "Пылающий Феникс Свет", icon: "🐦‍🔥", baseHP: 1800 },
            { tier: 30, name: "ЧЕМПИОН КХАМАЧА", icon: "👑", baseHP: 2000 }
        ]
    }
];

function getMaxUnlockedTier() {
    const saved = localStorage.getItem('khamach_max_tier');
    return saved ? parseInt(saved) : 1;
}

function saveCompletedTier(tier) {
    const currentMax = getMaxUnlockedTier();
    if (tier >= currentMax && tier < 30) {
        localStorage.setItem('khamach_max_tier', tier + 1);
    }
}

function renderDragonSelectionGrid() {
    const gridContainer = document.getElementById('dragon-levels-grid');
    const backBtn = document.getElementById('from-select-to-menu-btn');
    if (!gridContainer) return;
    
    gridContainer.innerHTML = '';
    const maxUnlocked = getMaxUnlockedTier();
    
    // ЭКРАН 1: Если глава не выбрана, рисуем сочный список глав с описаниями (Никакого серого фона!)
    if (window.currentActiveChapterView === null) {
        if (backBtn) {
            backBtn.innerText = "Назад в меню";
            backBtn.onclick = function() { showScreen('main-menu'); };
        }
        
        document.getElementById('adventure-screen-title').innerText = "РЕЖИМ ПРИКЛЮЧЕНИЯ";
        document.getElementById('adventure-screen-subtitle').innerText = "Выберите Пространство или Бестиарий";

        ADVENTURE_CHAPTERS.forEach((ch, idx) => {
            const card = document.createElement('div');
            card.className = "chapter-gothic-card";
            
            // Проверяем, доступна ли глава (открыт ли хотя бы первый босс этой главы)
            const firstBossTier = ch.bosses[0].tier;
            const isChapterLocked = firstBossTier > maxUnlocked;
            
            if (isChapterLocked) {
                card.style.opacity = "0.4";
                card.style.filter = "grayscale(1)";
                card.style.cursor = "not-allowed";
                card.innerHTML = `
                    <div class="chapter-card-icon">🔒</div>
                    <div style="flex:1;">
                        <div style="color:#6a5335; font-weight:bold; font-size:13px;">${ch.title}</div>
                        <div style="color:#4a3f2c; font-size:10px; margin-top:2px;">Победите предыдущие тиры для открытия доступа.</div>
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <div class="chapter-card-icon">${ch.icon}</div>
                    <div style="flex:1;">
                        <div style="color:#e6c280; font-weight:bold; font-size:13px;">${ch.title}</div>
                        <div style="color:#cdb38c; font-size:10px; line-height:1.2; margin-top:2px;">${ch.description}</div>
                    </div>
                `;
                card.onclick = function() {
                    window.currentActiveChapterView = idx;
                    renderDragonSelectionGrid();
                };
            }
            gridContainer.appendChild(card);
        });
        return;
    }
    
    // ЭКРАН 2: Окно конкретной выбранной главы приключений
    const activeChapter = ADVENTURE_CHAPTERS[window.currentActiveChapterView];
    
    if (backBtn) {
        backBtn.innerText = "↩️ Назад к списку глав";
        backBtn.onclick = function() {
            window.currentActiveChapterView = null;
            renderDragonSelectionGrid();
        };
    }
    
    document.getElementById('adventure-screen-title').innerText = activeChapter.icon + " СИЛЫ ГЛАВЫ";
    document.getElementById('adventure-screen-subtitle').innerText = activeChapter.title;

    const elements = ["Огонь", "Лед", "Тьма", "Свет"];
    
    activeChapter.bosses.forEach(boss => {
        const isLocked = boss.tier > maxUnlocked;
        
        const row = document.createElement('div');
        row.className = 'menu-row';
        row.style.margin = '4px 0';
        
        const btn = document.createElement('button');
        btn.className = 'menu-btn dragon-level-btn';
        btn.style.transition = 'all 0.15s ease';
        btn.style.padding = "10px";
        btn.style.fontSize = "12px";
        
        if (isLocked) {
            btn.classList.add('disabled');
            btn.innerHTML = `🔒 Тир ${boss.tier} (Заблокировано в этой главе)`;
        } else {
            const element = elements[(boss.tier - 1) % elements.length];
            btn.innerHTML = `${boss.icon} Тир ${boss.tier}: ${boss.name} [${element}] — ${boss.baseHP} HP`;
            btn.dataset.level = boss.tier;
            
            if (element === "Огонь") {
                btn.style.background = "linear-gradient(to bottom, #3b1717, #1c0a0a)";
                btn.style.borderColor = "#9c2a2a";
                btn.style.color = "#ff8c8c";
            } else if (element === "Лед") {
                btn.style.background = "linear-gradient(to bottom, #162436, #0b121c)";
                btn.style.borderColor = "#2a629c";
                btn.style.color = "#8cd1ff";
            } else if (element === "Тьма") {
                btn.style.background = "linear-gradient(to bottom, #28173b, #130a1c)";
                btn.style.borderColor = "#6d2a9c";
                btn.style.color = "#e58cff";
            } else if (element === "Свет") {
                btn.style.background = "linear-gradient(to bottom, #362e19, #1a160c)";
                btn.style.borderColor = "#9c7f2a";
                btn.style.color = "#ffe88c";
            }
            
            btn.addEventListener('click', (e) => {
                selectedDragonLevel = parseInt(e.currentTarget.dataset.level);
                if (typeof startBackgroundMusic === 'function') startBackgroundMusic();
                showScreen('combat-screen');
                if (typeof startCombatSession === 'function') {
                    startCombatSession(selectedDragonLevel);
                }
            });
        }
        
        row.appendChild(btn);
        gridContainer.appendChild(row);
    });
}
