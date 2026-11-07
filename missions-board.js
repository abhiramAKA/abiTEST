/* ==========================================================================
   КХАМАЧ — МОДУЛЬ ИНТЕРФЕЙСА ДОСКИ ПОРУЧЕНИЙ (DOM) (ИСПРАВЛЕННЫЙ СИНТАКСИС)
   ========================================================================== */

function renderMissionsDOM() {
    const container = document.getElementById('missions-list-container');
    if (!container) return;
    container.innerHTML = '';
    
    if (!localStorage.getItem('khamach_combat_tutorial_done')) {
        container.innerHTML = `
            <div style="padding: 20px 10px; text-align: center; color: #ff6666;">
                <div style="font-size: 32px; margin-bottom: 10px;">📜</div>
                <div style="font-size: 14px; font-weight: bold; text-transform: uppercase; color: #e6c280;">Доска пуста</div>
                <p style="font-size: 12px; line-height: 1.5; color: #bfae96; margin: 0;">
                    Совершите свой <strong>первый боевой рейд против Дракона</strong>, чтобы открыть доступ к городским поручениям!
                </p>
            </div>
        `;
        return;
    }
    
    let activeMissionsJSON = localStorage.getItem('khamach_active_triad_ids');
    let currentTriad = [];
    if (activeMissionsJSON) {
        try { currentTriad = JSON.parse(activeMissionsJSON); } catch(e) { currentTriad = []; }
    }
    
    if (!currentTriad || currentTriad.length !== 2) {
        currentTriad = [];
        let tempPool = [...CITY_MISSIONS_POOL];
        for (let i = 0; i < 2; i++) {
            if (tempPool.length === 0) tempPool = [...CITY_MISSIONS_POOL];
            const randIdx = Math.floor(Math.random() * tempPool.length);
            currentTriad.push(tempPool[randIdx].id);
            tempPool.splice(randIdx, 1);
        }
        localStorage.setItem('khamach_active_triad_ids', JSON.stringify(currentTriad));
    }
    
    let globalMissionActive = currentTriad.some(mId => localStorage.getItem(`khamach_mission_active_${mId}`) === 'true');
    const costData = getCurrentResetResourceCost();
    const currentResCount = typeof getPlayerResource === 'function' ? getPlayerResource(costData.key) : 0;
    
    const resetBlock = document.createElement('div');
    resetBlock.style.padding = "4px";
    resetBlock.innerHTML = `
        <button class="menu-btn" style="width:100%; font-size:11px; padding:6px; background:linear-gradient(to bottom, #3a2214, #1a0f08); border-color:#8a7350;" onclick="triggerBoardRerollByLoot()">
            🔄 Сбросить доску (Цена: 1 шт ${costData.icon} ${costData.name}) [Есть: ${currentResCount}]
        </button>
    `;
    container.appendChild(resetBlock);
    
    currentTriad.forEach(mId => {
        const mission = CITY_MISSIONS_POOL.find(m => m.id === mId);
        if (!mission) return;
        
        const isThisMissionActive = localStorage.getItem(`khamach_mission_active_${mission.id}`) === 'true';
        const isHeroBusy = localStorage.getItem(`khamach_hero_busy_${mission.allowedHero}`) === 'true';
        const currentFatigue = Math.round(getHeroFatigue(mission.allowedHero));
        const reductionMultiplier = 1 - (currentFatigue / 100);
        const calculatedReward = Math.max(0, Math.round(mission.reward * reductionMultiplier));
        
        const card = document.createElement('div');
        card.style = "background: rgba(25, 20, 18, 0.9); border: 1px solid #544432; padding: 8px 10px; border-radius: 3px; display: flex; flex-direction: column; gap: 4px;";
        
        let actionHTML = '';
        if (isThisMissionActive) {
            const startTimestamp = parseInt(localStorage.getItem(`khamach_mission_start_${mission.id}`) || '0');
            const remaining = Math.max(0, mission.durationMs - (Date.now() - startTimestamp));
            if (remaining > 0) {
                actionHTML = `<div style="color:#ff4500; font-weight:bold; font-size:11px; text-align:center; padding:4px; border:1px dashed #ff4500;">⏱️ В пути: ${Math.floor(remaining / 60000).toString().padStart(2,'0')}:${Math.floor((remaining % 60000) / 1000).toString().padStart(2,'0')}</div>`;
            }
        } else if (globalMissionActive) {
            actionHTML = `<button class="menu-btn disabled" style="padding:4px; font-size:11px;" disabled>Очередь занята</button>`;
        } else if (isHeroBusy) {
            actionHTML = `<button class="menu-btn disabled" style="padding:4px; font-size:11px;" disabled>Боец занят</button>`;
        } else {
            actionHTML = `<button class="menu-btn" style="padding:4px; font-size:14px; background:#1d3a1e; height:28px;" onclick="startMission('${mission.id}', '${mission.allowedHero}', ${calculatedReward})">Отправить ${mission.heroIcon}</button>`;
        }
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-weight: bold; color: #e6c280; font-size: 12px;">
                <span>${mission.title}</span>
                <span style="color: #ffd700;">🪙 ${calculatedReward}</span>
            </div>
            <div style="font-size: 11px; color: #bfae96; line-height: 1.2;">${mission.text}</div>
            <div style="font-size: 10px; color: #ffb3ba;">Усталость: ${currentFatigue}%</div>
        `;
        container.appendChild(card);
    });
}

function triggerBoardRerollByLoot() {
    const costData = getCurrentResetResourceCost();
    const currentResCount = typeof getPlayerResource === 'function' ? getPlayerResource(costData.key) : 0;
    if (currentResCount < 1) { alert(`Недостаточно трофеев!`); return; }
    
    let activeMissionsJSON = localStorage.getItem('khamach_active_triad_ids');
    if (activeMissionsJSON) {
        try {
            let triad = JSON.parse(activeMissionsJSON);
            if (triad.some(mId => localStorage.getItem(`khamach_mission_active_${mId}`) === 'true')) {
                alert("Нельзя сбросить доску, пока идет выполнение контракта!"); return;
            }
        } catch(e) {}
    }
    if (confirm(`Сменить список поручений за 1 шт. ${costData.icon}?`)) {
        if (typeof addPlayerResource === 'function') addPlayerResource(costData.key, -1);
        localStorage.removeItem('khamach_active_triad_ids');
        if (typeof addChronicleLog === 'function') addChronicleLog(`РЕРOЛЛ: Смена доски.`);
        renderMissionsDOM();
    }
}
