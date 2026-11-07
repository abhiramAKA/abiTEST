/* ==========================================================================
   КХАМАЧ — ВЫЧИСЛИТЕЛЬНЫЙ МОДУЛЬ ТРЕНИРОВОК И ПОТОЛКА ОТРЯДА (ИСПРАВЛЕН - v5.7.33-FIX)
   ========================================================================== */

const SQUAD_HERO_LORE = {
    tank: { name: "🛡️ Гарнизон", title: "🛡️ ЗАЩИТНИК", resourceKey: "plasma", resourceIcon: "🌋", resourceName: "Плазма", statBonus: "+20 Max HP", lore: "Латные рукавицы намертво сжимают ростовой щит из костей." },
    damage: { name: "🔥 Казармы", title: "🔥 ВОИН", resourceKey: "blood", resourceIcon: "🩸", resourceName: "Кровь", statBonus: "+15 урон ульты", lore: "Одержимый первобытным гневом рун Кхамача, жаждет лишь крови." },
    archer: { name: "⚡ Стрельбище", title: "⚡ СТРЕЛОК", resourceKey: "scale", resourceIcon: "🪶", resourceName: "Чешуя", statBonus: "+10 урон молнии", lore: "Его стрелы оперены чешуей драконов света." },
    damage_mage: { name: "💚 Обитель", title: "💚 МАГ", resourceKey: "tears", resourceIcon: "💧", resourceName: "Слезы", statBonus: "+5 к масс-хилу", lore: "Тайные эссенции жизни текут по его венам." }
};

window.getHeroLevel = function(id) { return parseInt(localStorage.getItem(`khamach_hero_lvl_${id}`) || '1'); };
window.getBuildingLevel = function(id) { return parseInt(localStorage.getItem(`khamach_build_${id}`) || '0'); };

window.updateStorageScreenDOM = function() {
    const listContainer = document.getElementById('storage-resources-list');
    if (!listContainer) return;
    listContainer.innerHTML = `
        <div style="color: #e6c280; font-weight: bold; border-bottom: 1px solid #544432; padding-bottom: 4px; margin-bottom: 8px; text-transform: uppercase; font-size: 12px;">📜 Материалы Хранилища:</div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 6px; font-size: 13px; color: #cdb38c;">
            <div>🌋 Плазма дракона: <strong style="color:#fff; float: right;">${window.getPlayerResource('plasma')} шт.</strong></div>
            <div>🩸 Кровь дракона: <strong style="color:#fff; float: right;">${window.getPlayerResource('blood')} шт.</strong></div>
            <div>🪶 Чешуя дракона: <strong style="color:#fff; float: right;">${window.getPlayerResource('scale')} шт.</strong></div>
            <div>💧 Слезы дракона: <strong style="color:#fff; float: right;">${window.getPlayerResource('tears')} шт.</strong></div>
        </div>
    `;
};

window.updateSquadHeroesSpecScreenDOM = function() {
    const container = document.getElementById('heroes-upgrade-list-container');
    if (!container) return;
    container.innerHTML = '';
    
    container.style.display = "grid";
    container.style.gridTemplateColumns = "1fr 1fr";
    container.style.gap = "6px";
    
    const heroesData = [{ id: "tank" }, { id: "damage" }, { id: "archer" }, { id: "mage" }];
    const isTrainingPhase = localStorage.getItem('khamach_training_tutorial_done') !== 'true';
    
    const closeBtn = document.getElementById('close-heroes-spec-btn');
    if (closeBtn) closeBtn.style.display = isTrainingPhase ? 'none' : 'block';
    
    heroesData.forEach(h => {
        const lore = SQUAD_HERO_LORE[h.id === 'mage' ? 'damage_mage' : h.id];
        if (!lore) return;
        
        const heroLvl = window.getHeroLevel(h.id);
        const buildLvl = window.getBuildingLevel(h.id);
        const currentRes = typeof window.getPlayerResource === 'function' ? window.getPlayerResource(lore.resourceKey) : 0;
        
        let actionBtnHTML = '';
        if (heroLvl >= 15) {
            actionBtnHTML = `<button class="menu-btn disabled" style="padding:2px; font-size:10px;" disabled>МАКС УР</button>`;
        } else if (currentRes < 1) {
            // ЖЕСТКАЯ БЛОКИРОВКА: Если у игрока 0 штук нужного ресурса, кнопка выключается даже на 1 уровне!
            actionBtnHTML = `<button class="menu-btn disabled" style="padding:2px; font-size:10px; background:#221111; border-color:#441111;" disabled>Нет трофеев</button>`;
        } else if (heroLvl >= 1 && heroLvl < 2) {
            // Здание не нужно на 1 уровне, но кнопка активна только если трофей есть (проверено строчкой выше)
            actionBtnHTML = `<button class="menu-btn" style="padding:2px; font-size:10px; background:#1d3a1e; height:22px; line-height:1;" onclick="window.triggerHeroLevelUpgrade('${h.id}')">Прокачать</button>`;
        } else if (heroLvl >= buildLvl) {
            actionBtnHTML = `<button class="menu-btn disabled" style="padding:2px; font-size:9px; background:#421e1e; border-color:#6e3131; line-height:1.1;" disabled>Нужен ${buildLvl + 1} ур. здания</button>`;
        } else {
            actionBtnHTML = `<button class="menu-btn" style="padding:2px; font-size:10px; background:#1d3a1e; height:22px; line-height:1;" onclick="window.triggerHeroLevelUpgrade('${h.id}')">Прокачать</button>`;
        }
        
        cardInner = `
            <div style="display:flex; justify-content:space-between; font-weight:bold; color:#e6c280; font-size:11px;">
                <span>${lore.title}</span>
                <span style="color:#ffd700;">Ур. ${heroLvl}</span>
            </div>
            <div style="font-size:9px; color:#8a7350; margin-top:-2px; margin-bottom:2px;">Лимит: ${heroLvl < 2 ? 'Без лимита' : buildLvl}</div>
            <div style="font-size:10px; color:#2ecc71; line-height:1.1;">Бонус: ${lore.statBonus}</div>
            <div style="font-size:10px; color:#cdb38c; margin-bottom:3px;">Доступно: ${lore.resourceIcon} ${currentRes}</div>
            <div style="margin-top:auto;">${actionBtnHTML}</div>
        `;
        
        const card = document.createElement('div');
        card.style = "background: rgba(25, 20, 18, 0.95); border: 1px solid #544432; padding: 6px 8px; border-radius: 3px; display: flex; flex-direction: column; justify-content: space-between; gap: 2px; box-sizing: border-box;";
        card.innerHTML = cardInner;
        container.appendChild(card);
    });
};

window.triggerHeroLevelUpgrade = function(heroId) {
    const heroesData = { tank: { resKey: "plasma" }, damage: { resKey: "blood" }, archer: { resKey: "scale" }, mage: { resKey: "tears" } };
    const target = heroesData[heroId];
    if (!target) return;

    const currentRes = typeof window.getPlayerResource === 'function' ? window.getPlayerResource(target.resKey) : 0;
    const heroLvl = window.getHeroLevel(heroId);

    if (currentRes < 1) {
        alert(`Недостаточно трофеев! Требуется 1 шт.`);
        return;
    }

    if (typeof addPlayerResource === 'function') addPlayerResource(target.resKey, -1);
    localStorage.setItem(`khamach_hero_lvl_${heroId}`, heroLvl + 1);

    if (typeof addChronicleLog === 'function') {
        addChronicleLog(`ТРЕНИРОВКА: Боец повысил уровень до ${heroLvl + 1}-го.`);
    }

    alert(`Боец успешно развил навыки до ${heroLvl + 1} уровня!`);
    
    const isTrainingPhase = localStorage.getItem('khamach_training_tutorial_done') !== 'true';
    if (isTrainingPhase) {
        localStorage.setItem('khamach_training_tutorial_done', 'true');
        alert("Навыки развиты! Следующий шаг — заработок золота для Цитадели.");
        
        // РЕДИРЕКТ НА ЭТАП 3: возвращаем в gate.html для переключения на мешочек с деньгами
        document.getElementById('squad-heroes-spec-screen').style.display = 'none';
        window.location.href = 'gate.html?t=' + Date.now();
        return;
    }

    window.updateSquadHeroesSpecScreenDOM();
};
