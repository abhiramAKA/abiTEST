/* ==========================================================================
   КХАМАЧ — ЦЕНТРАЛЬНАЯ ЭКОНОМИКА ЦИТАДЕЛИ И ХРАНИЛИЩЕ РЕСУРСОВ (v5.4.0)
   ========================================================================== */

const TOWN_BUILDING_PRICES = {
    1: 100, 2: 300, 3: 900, 4: 2700, 5: 11000, 6: 30000, 7: 75000,
    8: 125000, 9: 200000, 10: 310000, 11: 540000, 12: 850000,
    13: 1385000, 14: 2300000, 15: 3590500
};

const INLINE_TOWN_TEXTS = {
    mainInfo: `<p><strong>«КХАМАЧ: Восхождение Рейдов»</strong></p><p>В недрах древних подземелий Абхирамбурга пробудился великий закон змея. Соберите свой верный отряд, заряжайте шкалы суперсил через камни стихий и сокрушите огнедышащих тварей в пошаговых тактических битвах Горнила!</p>`,
    combatHelp: `<div style="text-align: left; font-size: 13px; line-height: 1.4; display: flex; flex-direction: column; gap: 8px; color: #cdb38c;"><div>🛡️ <strong>Защитник:</strong> Блокирует урон Дракона.</div><div>🔥 <strong>Воин:</strong> Наносит чистый урон.</div><div>⚡ <strong>Стрелок:</strong> Ослепляет змея молнией.</div><div>💚 <strong>Маг:</strong> Массовое исцеление.</div></div>`
};

const INLINE_MODE_DESCRIPTIONS = {
    clans: { title: "🛡️ ОРДЕН КХАМАЧА (КЛАНЫ)", reqText: "⚠️ Доступ заблокирован. Клановый шлюз открывается на 12-м уровне развития отряда!", isLocked: true },
    alchemy: { title: "🧪 ЛАБОРАТОРИЯ АЛХИМИИ", isLocked: false, isHero: false, heroId: "alchemy", lore: "Полки уставлены древними фолиантами. Необходима для будущей дистилляции ресурсов." },
    tank: { title: "🛡️ ГАРНИЗОН", isLocked: false, isHero: true, heroId: "tank" },
    damage: { title: "🔥 КАЗАРМЫ", isLocked: false, isHero: true, heroId: "damage" },
    archer: { title: "⚡ СТРУКТУРА СТРЕЛЬБИЩА", isLocked: false, isHero: true, heroId: "archer" },
    mage: { title: "💚 ОБИТЕЛЬ", isLocked: false, isHero: true, heroId: "mage" }
};

window.getTownText = function(key) { return INLINE_TOWN_TEXTS[key] || ''; };
window.getPlayerGold = function() { return parseInt(localStorage.getItem('khamach_gold') || '0'); };
window.addPlayerGold = function(amount) { localStorage.setItem('khamach_gold', window.getPlayerGold() + amount); window.updateTownGoldDisplay(); };
window.getPlayerResource = function(key) { return parseInt(localStorage.getItem(`khamach_res_${key}`) || '0'); };
window.addPlayerResource = function(key, amount) { localStorage.setItem(`khamach_res_${key}`, window.getPlayerResource(key) + amount); if (typeof window.updateTownGoldDisplay === 'function') window.updateTownGoldDisplay(); };

window.updateTownGoldDisplay = function() {
    // 1. Обновляем счетчики золота по всему DOM
    const goldVal = window.getPlayerGold();
    document.querySelectorAll('.gold-counter-display').forEach(el => { 
        el.innerText = `🪙 ${goldVal.toLocaleString('ru-RU')}`; 
    });
    
    // 2. Считываем усталость
    const tFat = Math.round(parseFloat(localStorage.getItem('khamach_fatigue_tank') || '0'));
    const dFat = Math.round(parseFloat(localStorage.getItem('khamach_fatigue_damage') || '0'));
    const aFat = Math.round(parseFloat(localStorage.getItem('khamach_fatigue_archer') || '0'));
    const mFat = Math.round(parseFloat(localStorage.getItem('khamach_fatigue_mage') || '0'));
    
    const fatigueContainer = document.getElementById('team-fatigue-display');
    if (fatigueContainer) {
        const averageFatigue = Math.round((tFat + dFat + aFat + mFat) / 4);
        fatigueContainer.innerHTML = `🥱 ${averageFatigue}%`;
    }

    const listContainer = document.getElementById('individual-fatigue-list-container');
    if (listContainer) {
        listContainer.innerHTML = `
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #3a3025; padding-bottom:4px;"><span>🛡️ Защитник:</span><strong>${tFat}%</strong></div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #3a3025; padding-bottom:4px;"><span>🔥 Воин:</span><strong>${dFat}%</strong></div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #3a3025; padding-bottom:4px;"><span>⚡ Стрелок:</span><strong>${aFat}%</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>💚 Maг:</span><strong>${mFat}%</strong></div>
        `;
    }
    if (typeof window.updateStorageScreenDOM === 'function') {
        try { window.updateStorageScreenDOM(); } catch(e){}
    }
};

window.openModeDescription = function(id) {
    window.currentOpenedModeKey = id;
    const config = INLINE_MODE_DESCRIPTIONS[id];
    if (!config) return;

    const titleEl = document.getElementById('mode-desc-title');
    const textEl = document.getElementById('mode-desc-text');
    const buyBtn = document.getElementById('mode-buy-btn');

    if (titleEl) titleEl.innerText = config.title;
    if (textEl) {
        if (config.isLocked) {
            textEl.innerHTML = config.reqText;
            if (buyBtn) buyBtn.style.display = 'none';
            showScreen('mode-desc-screen');
            return;
        }
        const bldId = config.heroId || id;
        const bldLvl = parseInt(localStorage.getItem(`khamach_build_${bldId}`) || '0');
        let loreText = config.lore || "Оборонительное сооружение Цитадели.";

        if (bldLvl === 0) {
            let price = TOWN_BUILDING_PRICES[1];
            textEl.innerHTML = `${loreText}`;
            if (buyBtn) { buyBtn.style.display = 'block'; buyBtn.innerText = `⚒️ ПОСТРОИТЬ (🪙 ${price})`; }
        } else if (bldLvl >= 15) {
            textEl.innerHTML = `${loreText}<br><br>Максимальный уровень строения достигнут!`;
            if (buyBtn) buyBtn.style.display = 'none';
        } else {
            let nextPrice = TOWN_BUILDING_PRICES[bldLvl + 1];
            textEl.innerHTML = `${loreText}<br><br>Текущий уровень: ${bldLvl}`;
            if (buyBtn) { buyBtn.style.display = 'block'; buyBtn.innerText = `⚒️ УЛУЧШИТЬ ДО УР. ${bldLvl + 1} (🪙 ${nextPrice.toLocaleString('ru-RU')})`; }
        }
    }
    showScreen('mode-desc-screen');
};
