/* ==========================================================================
   КХАМАЧ — ДИНАМИЧЕСКИЙ DOM ГОРОДСКИХ ЭКРАНОВ И СПРАВОЧНИКОВ (v5.2.0-ALPHA)
   ========================================================================== */

function injectTownScreensDOM() {
    const target = document.getElementById('dynamic-town-screens');
    if (!target) return;

    target.innerHTML = `
        <!-- ЭКРАН ВЫБОРА ГЛАВ / ДРАКОНОВ -->
        <div id="dragon-select-screen" class="game-window" style="display: none;">
            <h2 id="adventure-screen-title">РЕЖИМ ПРИКЛЮЧЕНИЯ</h2>
            <span id="adventure-screen-subtitle" class="subtitle">Выберите Пространство</span>
            <div id="dragon-levels-grid" style="display: flex; flex-direction: column; width: 100%; gap: 4px; max-height: 60vh; overflow-y: auto;"></div>
            <button id="from-select-to-menu-btn" class="menu-btn back-btn" style="width: 100%; margin-top: 15px;">Назад в меню</button>
        </div>

        <!-- ЭКРАН ХРАНИЛИЩА ЦИТАДЕЛИ -->
        <div id="storage-screen" class="game-window" style="display: none;">
            <h2>СКЛАД ЦИТАДЕЛИ</h2>
            <span class="subtitle">Трофеи и Ресурсы Рейдов</span>
            <div id="storage-resources-list" style="text-align: left; background: rgba(0,0,0,0.4); padding: 10px; border: 1px solid #544432; border-radius: 4px;"></div>
            <button id="close-storage-btn" class="menu-btn back-btn" style="width: 100%; margin-top: 15px;">Назад в меню</button>
        </div>

        <!-- ЭКРАН ВОЕННОГО ЛАГЕРИЯ (ПОКАЗ СТАТУСОВ) -->
        <div id="squad-heroes-spec-screen" class="game-window" style="display: none;">
            <h2>ВОЕННЫЙ ЛАГЕРЬ</h2>
            <span class="subtitle">Развитие Навыков Бойцов</span>
            <div id="heroes-upgrade-list-container"></div>
            <button id="close-heroes-spec-btn" class="menu-btn back-btn" style="width: 100%; margin-top: 15px;">Назад в меню</button>
        </div>

        <!-- ЭКРАН ЛЕТОПИСИ ГОРОДА -->
        <div id="chronicle-screen" class="game-window" style="display: none;">
            <h2>ЛЕТОПИСЬ РЕЙДОВ</h2>
            <span class="subtitle">Хронология Подвигов</span>
            <div id="chronicle-list-container" style="display: flex; flex-direction: column; width: 100%; gap: 4px; max-height: 55vh; overflow-y: auto; text-align: left; font-size: 11px; background: rgba(0,0,0,0.5); padding: 8px; border: 1px solid #3a3025;"></div>
            <div style="display: flex; gap: 8px; margin-top: 15px; width: 100%;">
                <button id="clear-chronicle-btn" class="menu-btn" style="background: #3b1c1c; border-color: #5c2323; font-size: 12px; padding: 10px;">Очистить</button>
                <button id="close-chronicle-btn" class="menu-btn back-btn" style="flex: 2; margin-top: 0; padding: 10px;">Назад</button>
            </div>
        </div>

        <!-- ЭКРАН СПРАВКИ -->
        <div id="info-screen" class="game-window" style="display: none;">
            <h2>СПРАВКА</h2>
            <span class="subtitle">Древние Свитки</span>
            <div id="info-screen-text" style="text-align: left; font-size: 13px; max-height: 60vh; overflow-y: auto;"></div>
            <button id="from-info-to-menu-btn" class="menu-btn back-btn" style="width: 100%; margin-top: 15px;">Закрыть</button>
        </div>

        <!-- ЭКРАН НАСТРОЕК ЗВУКА -->
        <div id="settings-screen" class="game-window" style="display: none;">
            <h2>⚙️ НАСТРОЙКИ</h2>
            <span class="subtitle">Аудио-микшер Цитадели</span>
            <div style="display: flex; flex-direction: column; gap: 12px; text-align: left; font-size: 13px; color: #cdb38c;">
                <div>
                    <label>Музыка (Эмбиент):</label>
                    <input type="range" id="volume-music-slider" min="0" max="100" style="width: 100%; margin-top: 4px;">
                </div>
                <div>
                    <label>Звуковые эффекты рун:</label>
                    <input type="range" id="volume-fx-slider" min="0" max="100" style="width: 100%; margin-top: 4px;">
                </div>
            </div>
            <button id="close-settings-btn" class="menu-btn back-btn" style="width: 100%; margin-top: 20px;">Сохранить и Выйти</button>
        </div>

        <!-- ОКНО ТЕКУЩЕЙ УСТАЛОСТИ ОТРЯДА -->
        <div id="squad-fatigue-screen" class="game-window combat-help-popup" style="display: none;">
            <div class="combat-help-content" style="max-width: 340px; padding: 16px;">
                <h2>ОТЧЕТ СВЕЖЕСТИ ОТРЯДА</h2>
                <div id="individual-fatigue-list-container" style="font-size: 12px; color: #cdb38c; display: flex; flex-direction: column; gap: 6px; background: rgba(0,0,0,0.4); padding: 10px; border: 1px solid #544432; border-radius: 4px; text-align: left;"></div>
                <button id="close-fatigue-screen-btn" class="menu-btn back-btn" style="width: 100%; margin-top: 12px; padding: 8px;">Закрыть свиток</button>
            </div>
        </div>

        <!-- ЭКРАН ОПИСАНИЙ СТРОЕНИЙ (ЗДАНИЯ / КЛАНЫ) -->
        <div id="mode-desc-screen" class="game-window" style="display: none;">
            <h2 id="mode-desc-title">СТРОЕНИЕ</h2>
            <span class="subtitle">Архивы Отрекшихся</span>
            <div id="mode-desc-text" style="text-align: left; font-size: 12px; line-height: 1.5; color: #cdb38c; background: rgba(0,0,0,0.4); padding: 12px; border: 1px solid #4a3f2c; border-radius: 4px; max-height: 50vh; overflow-y: auto; margin-bottom: 10px;"></div>
            <div style="display: flex; flex-direction: column; gap: 4px; width: 100%;">
                <button id="mode-buy-btn" class="menu-btn" style="background: linear-gradient(to bottom, #1d3a1e, #0f2110); border-color: #316e34; display: none;">⚒️ ДЕЙСТВИЕ</button>
                <button class="menu-btn back-btn" style="margin-top: 5px;" onclick="closeModeDescriptionUnified()">Назад</button>
            </div>
        </div>
    `;
}
