/* ==========================================================================
   КХАМАЧ — МОДУЛЬ РЕНДЕРИНГА ГОРОДСКИХ ИНТЕРФЕЙСОВ И НАСТРОЕК (v5.5.0-BETA)
   ========================================================================== */

window.currentActiveChapterView = null;

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

function injectTownScreensDOM() {
    const infoScr = document.getElementById('info-screen');
    if (infoScr) {
        infoScr.innerHTML = `
            <h2>Справка Мира</h2>
            <div id="info-screen-text" style="text-align: left; font-size: 13px; max-height: 50vh; overflow-y: auto; margin-bottom: 15px;"></div>
            <button id="from-info-to-menu-btn" class="menu-btn back-btn" style="width: 100%;">Закрыть</button>
        `;
    }

    const selectScr = document.getElementById('dragon-select-screen');
    if (selectScr) {
        selectScr.innerHTML = `
            <h2 id="adventure-screen-title">Выбор Рейда</h2>
            <span id="adventure-screen-subtitle" class="subtitle">Выберите тир дракона</span>
            <div id="dragon-levels-grid" style="display: flex; flex-direction: column; width: 100%; max-height: 50vh; overflow-y: auto; gap: 4px;"></div>
            <button id="from-select-to-menu-btn" class="menu-btn back-btn" style="width: 100%;">Назад в меню</button>
        `;
    }

    const modeScr = document.getElementById('mode-desc-screen');
    if (modeScr) {
        modeScr.innerHTML = `
            <h2 id="mode-desc-title">Строение</h2>
            <div id="mode-desc-text" style="text-align: left; font-size: 13px; margin-bottom: 15px; color: #bfae96;"></div>
            <button id="mode-buy-btn" class="menu-btn" style="width: 100%; background: linear-gradient(to bottom, #1d3a1e, #0f2110); border-color: #316e34; margin-bottom: 8px; display: none;">Действие</button>
            <button class="menu-btn back-btn" style="width: 100%; margin-top: 0;" onclick="window.closeModeDescriptionUnified()">Назад</button>
        `;
    }

    const storageScr = document.getElementById('storage-screen');
    if (storageScr) {
        storageScr.innerHTML = `
            <h2>Склад Цитадели</h2>
            <div id="storage-resources-list" style="text-align: left; margin-bottom: 15px;"></div>
            <button id="close-storage-btn" class="menu-btn back-btn" style="width: 100%;">Назад в меню</button>
        `;
    }

    const settingsScr = document.getElementById('settings-screen');
    if (settingsScr) {
        settingsScr.innerHTML = `
            <h2>⚙️ Звуковой Пульт</h2>
            <span class="subtitle">Настройка частот и громкости движка</span>
            <div style="display: flex; flex-direction: column; gap: 12px; text-align: left; color: #cdb38c; font-size: 13px; margin-bottom: 20px;">
                <div>
                    <label>Громкость Эмбиента:</label>
                    <input type="range" id="volume-music-slider" min="0" max="100" style="width: 100%; accent-color: #e6c280;">
                </div>
                <div>
                    <label>Громкость Эффектов Рун:</label>
                    <input type="range" id="volume-fx-slider" min="0" max="100" style="width: 100%; accent-color: #e6c280;">
                </div>
            </div>
            <button id="close-settings-btn" class="menu-btn back-btn" style="width: 100%; margin-top: 0;">Сохранить настройки</button>
        `;
    }

    const fatigueScr = document.getElementById('squad-fatigue-screen');
    if (fatigueScr) {
        fatigueScr.innerHTML = `
            <div class="combat-help-content" style="max-width: 360px;">
                <h2>🥱 Свежесть Отряда</h2>
                <div id="individual-fatigue-list-container" style="text-align: left; font-size: 13px; display: flex; flex-direction: column; gap: 6px; margin: 15px 0; background: rgba(0,0,0,0.5); padding: 10px; border: 1px solid #544432;"></div>
                <button id="close-fatigue-screen-btn" class="menu-btn back-btn" style="width: 100%; margin-top: 5px;">Закрыть</button>
            </div>
        `;
    }

    const specScr = document.getElementById('squad-heroes-spec-screen');
    if (specScr) {
        specScr.innerHTML = `
            <h2>Военный Лагерь</h2>
            <span class="subtitle">Тренировка и развитие характеристик отряда</span>
            <div id="heroes-upgrade-list-container" style="margin-bottom: 15px;"></div>
            <button id="close-heroes-spec-btn" class="menu-btn back-btn" style="width: 100%;">Назад в меню</button>
        `;
    }
}

function renderDragonSelectionGrid() {
    const gridContainer = document.getElementById('dragon-levels-grid');
    const backBtn = document.getElementById('from-select-to-menu-btn');
    if (!gridContainer || !window.ADVENTURE_CHAPTERS) return;
    
    gridContainer.innerHTML = '';
    const maxUnlocked = getMaxUnlockedTier();
    
    if (window.currentActiveChapterView === null) {
        if (backBtn) {
            backBtn.innerText = "Назад в меню";
            backBtn.onclick = function() { showScreen('main-menu'); };
        }
        
        document.getElementById('adventure-screen-title').innerText = "РЕЖИМ ПРИКЛЮЧЕНИЯ";
        document.getElementById('adventure-screen-subtitle').innerText = "Выберите Пространство или Бестиарий";

        window.ADVENTURE_CHAPTERS.forEach((ch, idx) => {
            const card = document.createElement('div');
            card.className = "chapter-gothic-card";
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
    
    const activeChapter = window.ADVENTURE_CHAPTERS[window.currentActiveChapterView];
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
            btn.innerHTML = `🔒 Тир ${boss.tier} (Заблокировано)`;
        } else {
            const element = elements[(boss.tier - 1) % elements.length];
            btn.innerHTML = `${boss.icon} Тир ${boss.tier}: ${boss.name} [${element}] — ${boss.baseHP} HP`;
            btn.dataset.level = boss.tier;
            
            if (element === "Огонь") { btn.style.background = "linear-gradient(to bottom, #3b1717, #1c0a0a)"; btn.style.borderColor = "#9c2a2a"; btn.style.color = "#ff8c8c"; }
            else if (element === "Лед") { btn.style.background = "linear-gradient(to bottom, #162436, #0b121c)"; btn.style.borderColor = "#2a629c"; btn.style.color = "#8cd1ff"; }
            else if (element === "Тьма") { btn.style.background = "linear-gradient(to bottom, #28173b, #130a1c)"; btn.style.borderColor = "#6d2a9c"; btn.style.color = "#e58cff"; }
            else if (element === "Свет") { btn.style.background = "linear-gradient(to bottom, #362e19, #1a160c)"; btn.style.borderColor = "#9c7f2a"; btn.style.color = "#ffe88c"; }
            
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
