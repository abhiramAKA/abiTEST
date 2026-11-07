/* ==========================================================================
   КХАМАЧ — АВТОНОМНЫЕ ОКНА ОБУЧЕНИЯ И СЛУЖЕБНЫЕ ПОП-АПЫ (v1.0.0-NEW)
   ========================================================================== */

function injectCombatPopupsDOM() {
    const popupSlot = document.getElementById('dynamic-combat-popups');
    if (!popupSlot) return;

    popupSlot.innerHTML = `
        <!-- ================= СПРАВОЧНИК В БОЮ ================= -->
        <div id="combat-help-screen" class="game-window combat-help-popup" style="display: none;">
            <div class="combat-help-content">
                <h2>ГОРНИЛО РУН</h2>
                <span class="subtitle">Справочник Сил</span>
                <div style="text-align: left; font-size: 13px; line-height: 1.4; display: flex; flex-direction: column; gap: 8px; color: #cdb38c;">
                    <div>🛡️ <strong>Защитник:</strong> Блокирует урон Дракона.</div>
                    <div>🔥 <strong>Воин:</strong> Наносит чистый урон.</div>
                    <div>⚡ <strong>Стрелок:</strong> Ослепляет змея молнией.</div>
                    <div>💚 <strong>Маг:</strong> Массовое исцеление.</div>
                </div>
                <button id="close-combat-help-btn" class="menu-btn back-btn" style="margin-top: 15px; width: 100%;">Вернуться в бой</button>
            </div>
        </div>

        <!-- ================= ОКНО ОБУЧЕНИЯ ПЕРВОГО БОЯ ================= -->
        <div id="combat-welcome-tutorial-screen" class="game-window combat-help-popup" style="display: none;">
            <div class="combat-help-content" style="max-width: 380px; padding: 20px; text-align: center;">
                <h2>ОБУЧЕНИЕ БОЯ</h2>
                <span class="subtitle">Первый Вход в Горнило</span>
                <div style="font-size: 13px; color: #cdb38c; line-height: 1.5; display: flex; flex-direction: column; gap: 10px; background: rgba(0,0,0,0.5); padding: 14px; border: 1px solid #544432; border-radius: 4px; margin-bottom: 15px; text-align: left;">
                    <div><strong>1. Собирай одинаковые триады рун:</strong> Это не наносит урона, но копит энергию для соответсвующих героев твоего боевого отряда (🔥 🛡️ ⚡ 💚).</div>
                    <div><strong>2. Нажимай на карточку героя, когда она засияет:</strong> Значит шкала энергии дошла до 100%, и можно применить способность героя.</div>
                    <div><strong>3. Действуй обдуманно:</strong>После каждых трех твоих действий с рунами враг тоже совершает одну атаку.</div>          
                </div>
                <button id="close-combat-tutorial-btn" class="menu-btn" style="width:100%; background: linear-gradient(to bottom, #1d3a1e, #0f2110); border-color: #316e34; padding: 10px;">В Бой!</button>
            </div>
        </div>

        <!-- ================= ОКНО ОСОБЫХ КОМБИНАЦИЙ ================= -->
        <div id="combat-combo-tutorial-screen" class="game-window combat-help-popup" style="display: none;">
            <div class="combat-help-content" style="max-width: 380px; padding: 20px; text-align: center;">
                <h2>Продвинутое Комбо!</h2>
                <span class="subtitle">Усиленный ряд рун</span>
                <div style="font-size: 13px; color: #ffb3ba; line-height: 1.4; background: rgba(40,10,10,0.5); padding: 14px; border: 1px solid #6e3131; border-radius: 4px; margin-bottom: 15px; text-align: left;">
                    Вы собрали усиленный ряд из 4 или 5 рун! В данный момент эти продвинутые комбинации <strong>неактивны</strong>. Чтобы разблокировать их силу, посети 🏋"Тренировочный лагерь" после сражения и усиль своих бойцов!
                </div>
                <button id="close-combat-combo-tutorial-btn" class="menu-btn" style="width:100%; background: linear-gradient(to bottom, #2d2621, #171311); padding: 10px;">Понятно</button>
            </div>
        </div>
    `;

    document.getElementById('combat-help-btn').onclick = function() {
        document.getElementById('combat-help-screen').style.display = 'flex';
    };
    document.getElementById('close-combat-help-btn').onclick = function() {
        document.getElementById('combat-help-screen').style.display = 'none';
    };
    document.getElementById('close-combat-tutorial-btn').onclick = function() {
        document.getElementById('combat-welcome-tutorial-screen').style.display = 'none';
        isBoardLocked = false;
        localStorage.setItem('khamach_combat_tutorial_done', 'true');
    };
    document.getElementById('close-combat-combo-tutorial-btn').onclick = function() {
        document.getElementById('combat-combo-tutorial-screen').style.display = 'none';
        localStorage.setItem('khamach_combo_tut_done', 'true');
        isBoardLocked = false;
        if (typeof window.executePostComboGravity === 'function') window.executePostComboGravity();
    };
}
