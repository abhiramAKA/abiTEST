/* ==========================================================================
   КХАМАЧ — МОДУЛЬ РЕАКТИВНОГО МОНТИРОВАНИЯ И РЕНДЕРА ИНТЕРФЕЙСА ГОРОДА (v5.4.2)
   ========================================================================== */

function injectTownScreensDOM() {
    // Монтирование экрана выбора драконов
    const selectScreen = document.getElementById('dragon-select-screen');
    if (selectScreen) {
        selectScreen.innerHTML = `
            <h2 id="adventure-screen-title">Выбор Рейда</h2>
            <span id="adventure-screen-subtitle" class="subtitle">Выберите тир дракона</span>
            <div id="dragon-levels-grid" style="display: flex; flex-direction: column; width: 100%; max-height: 50vh; overflow-y: auto; gap: 4px;"></div>
            <button id="from-select-to-menu-btn" class="menu-btn back-btn" style="width: 100%;">Назад в меню</button>
        `;
    }

    // Монтирование экрана общей справки
    const infoScreen = document.getElementById('info-screen');
    if (infoScreen) {
        infoScreen.innerHTML = `
            <h2>Справка Мира</h2>
            <div id="info-screen-text" style="text-align: left; font-size: 13px; max-height: 50vh; overflow-y: auto; margin-bottom: 15px;"></div>
            <button id="from-info-to-menu-btn" class="menu-btn back-btn" style="width: 100%;">Закрыть</button>
        `;
    }

    // Монтирование экрана подтверждения постройки
    const modeScreen = document.getElementById('mode-desc-screen');
    if (modeScreen) {
        modeScreen.innerHTML = `
            <h2 id="mode-desc-title">Строение</h2>
            <div id="mode-desc-text" style="text-align: left; font-size: 13px; margin-bottom: 15px; color: #bfae96;"></div>
            <button id="mode-buy-btn" class="menu-btn" style="width: 100%; background: linear-gradient(to bottom, #1d3a1e, #0f2110); border-color: #316e34; margin-bottom: 8px; display: none;">Действие</button>
            <button class="menu-btn back-btn" style="width: 100%; margin-top: 0;" onclick="window.closeModeDescriptionUnified()">Назад</button>
        `;
    }

    // Монтирование экрана склада ресурсов
    const storageScreen = document.getElementById('storage-screen');
    if (storageScreen) {
        storageScreen.innerHTML = `
            <h2>Склад Цитадели</h2>
            <div id="storage-resources-list" style="text-align: left; margin-bottom: 15px;"></div>
            <button id="close-storage-btn" class="menu-btn back-btn" style="width: 100%;">Назад в меню</button>
        `;
    }

    // Монтирование экрана прокачки уровней воинов
    const heroesSpecScreen = document.getElementById('squad-heroes-spec-screen');
    if (heroesSpecScreen) {
        heroesSpecScreen.innerHTML = `
            <h2>Военный Лагерь</h2>
            <span class="subtitle">Тренировка и развитие характеристик отряда</span>
            <div id="heroes-upgrade-list-container" style="margin-bottom: 15px;"></div>
            <button id="close-heroes-spec-btn" class="menu-btn back-btn" style="width: 100%;">Назад в меню</button>
        `;
    }

    // Монтирование экрана летописи цитадели
    const chronicleScreen = document.getElementById('chronicle-screen');
    if (chronicleScreen) {
        chronicleScreen.innerHTML = `
            <h2>Летопись Цитадели</h2>
            <span class="subtitle">История ваших великих свершений</span>
            <div id="chronicle-list-container" style="text-align: left; font-size: 11px; max-height: 50vh; overflow-y: auto; background: rgba(0,0,0,0.4); padding: 8px; border: 1px solid #3a3025; display: flex; flex-direction: column; gap: 4px; margin-bottom: 15px;"></div>
            <div style="display: flex; gap: 8px; width: 100%;">
                <button id="clear-chronicle-btn" class="menu-btn" style="font-size: 12px; padding: 10px; background: #421e1e; border-color: #6e3131;">Очистить</button>
                <button id="close-chronicle-btn" class="menu-btn back-btn" style="width: 100%; margin-top: 0; padding: 10px;">Закрыть</button>
            </div>
        `;
    }

    // Монтирование экрана настроек эквалайзера и громкости
    const settingsScreen = document.getElementById('settings-screen');
    if (settingsScreen) {
        settingsScreen.innerHTML = `
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
            <button id="close-settings-btn" class="menu-btn back-btn" style="width: 100%; margin-top: 5px;">Сохранить настройки</button>
        `;
    }

    // Монтирование всплывающего окна индивидуальной усталости
    const fatigueScreen = document.getElementById('squad-fatigue-screen');
    if (fatigueScreen) {
        fatigueScreen.innerHTML = `
            <div class="combat-help-content" style="max-width: 360px; padding: 20px;">
                <h2 style="font-size: 20px;">🥱 Свежесть Отряда</h2>
                <div id="individual-fatigue-list-container" style="text-align: left; font-size: 13px; display: flex; flex-direction: column; gap: 6px; margin: 15px 0; background: rgba(0,0,0,0.4); padding: 10px; border: 1px solid #4a3e31;"></div>
                <button id="close-fatigue-screen-btn" class="menu-btn back-btn" style="width:100%; margin-top:0; padding:8px;">Закрыть</button>
            </div>
        `;
    }
}
