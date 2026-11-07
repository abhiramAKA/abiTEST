/* ==========================================================================
   КХАМАЧ — ВЫДЕЛЕННЫЙ ДВИЖОК ПОЭТАПНОГО ОБУЧЕНИЯ (ИСПРАВЛЕН - v5.7.45-FIX)
   ========================================================================== */

window.GAME_VERSION = "v5.7.45-FIX";

const ONBOARDING_MISSIONS_LOCAL_POOL = [
    { id: "m_t1", allowedHero: "tank", heroName: "Защитник", heroIcon: "🛡️", reward: 133, text: "Кузнец просит придержать тяжелую наковальню.", title: "Помощь в кузнице" },
    { id: "m_d1", allowedHero: "damage", heroName: "Воин", heroIcon: "🔥", reward: 133, text: "Дровосеки боятся идти на вырубку из-за волков.", title: "Очистка лесопилки" },
    { id: "m_a1", allowedHero: "archer", heroName: "Стрелок", heroIcon: "⚡", reward: 133, text: "Старый мельник просит перестрелять летучих мышей.", title: "Отстрел вредителей" },
    { id: "m_m1", allowedHero: "mage", heroName: "Маг", heroIcon: "💚", reward: 133, text: "В лазарете вспыхнула хворь. Нужна магия жизни.", title: "Полевое исцеление" }
];

function loadGameModulesAndExecute(modeType) {
    const enforceBuster = Date.now() + '_' + Math.floor(Math.random() * 999999);
    const scripts = [
        'game.js', 'background.js', 'audio-engine.js', 'match3-fx.js',
        'match3-input.js', 'match3.js', 'match3-logic.js', 'match3-data.js',
        'campaign.js', 'town-engine.js', 'town-chronicle.js',
        'missions-pool.js', 'missions-engine.js', 'town-dom.js',
        'squad-dom.js', 'combat-popups.js', 'combat-dom.js', 'missions-board.js',
        'squad-logic.js', 'squad-core.js', 'combat-actions.js', 
        'combat.js', 'game-listeners.js'
    ];

    function injectScriptSequentially(index) {
        if (index >= scripts.length) {
            if (modeType === 'battle' && typeof initDispatcherModule === 'function') {
                initDispatcherModule();
            }
            if (modeType === 'battle') { launchBattle(); } 
            else if (modeType === 'camp') { launchCamp(); }
            else if (modeType === 'missions') { launchMissions(); }
            return;
        }
        const script = document.createElement('script');
        script.src = scripts[index] + '?v=' + window.GAME_VERSION + '&t=' + enforceBuster;
        script.async = false; 
        script.onload = function() { injectScriptSequentially(index + 1); };
        document.head.appendChild(script);
    }
    injectScriptSequentially(0);
}

function launchBattle() {
    document.getElementById('onboarding-gothic-window').style.display = 'none';
    const isMissionsDone = localStorage.getItem('khamach_missions_tutorial_done') === 'true';
    if (!isMissionsDone) {
        if (typeof injectCombatInterfaceBaseDOM === 'function') injectCombatInterfaceBaseDOM();
        if (typeof startBackgroundMusic === 'function') startBackgroundMusic();
        if (typeof showScreen === 'function') showScreen('combat-screen');
        if (typeof startCombatSession === 'function') startCombatSession(1); 
    } else {
        if (typeof injectTownScreensDOM === 'function') injectTownScreensDOM();
        if (typeof showScreen === 'function') showScreen('dragon-select-screen');
        if (typeof renderDragonSelectionGrid === 'function') renderDragonSelectionGrid();
    }
}

function launchCamp() {
    document.getElementById('onboarding-gothic-window').style.display = 'none';
    if (typeof injectTownScreensDOM === 'function') injectTownScreensDOM();
    if (typeof updateSquadHeroesSpecScreenDOM === 'function') updateSquadHeroesSpecScreenDOM();
    document.getElementById('squad-heroes-spec-screen').style.display = 'flex';
}

function launchMissions() {
    document.getElementById('onboarding-gothic-window').style.display = 'none';
    if (typeof injectTownScreensDOM === 'function') injectTownScreensDOM();
    
    const container = document.getElementById('missions-list-container');
    if (container) {
        container.innerHTML = '';
        let selectedMissions = [];
        let tempPool = [...ONBOARDING_MISSIONS_LOCAL_POOL];
        for (let i = 0; i < 2; i++) {
            const randIdx = Math.floor(Math.random() * tempPool.length);
            selectedMissions.push(tempPool[randIdx]);
            tempPool.splice(randIdx, 1);
        }

        selectedMissions.forEach(mission => {
            const currentFatigue = Math.min(100, Math.max(0, parseInt(localStorage.getItem('khamach_fatigue_' + mission.allowedHero) || '0')));
            const calculatedReward = Math.max(0, Math.round(mission.reward * (1 - (currentFatigue / 100))));
            
            const card = document.createElement('div');
            card.style = "background: rgba(25, 20, 18, 0.9); border: 1px solid #544432; padding: 8px 10px; border-radius: 3px; display: flex; flex-direction: column; gap: 4px;";
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; font-weight: bold; color: #e6c280; font-size: 12px;">
                    <span>${mission.title}</span>
                    <span style="color: #ffd700;">🪙 ${calculatedReward}</span>
                </div>
                <div style="font-size: 11px; color: #bfae96; line-height: 1.2;">${mission.text}</div>
                <button class="menu-btn" style="padding:4px; font-size:13px; background:#1d3a1e; height:28px;" onclick="executeOnboardingMission('${mission.id}', '${mission.allowedHero}', ${calculatedReward}, '${mission.title}', '${mission.heroName}')">Отправить ${mission.heroIcon}</button>
            `;
            container.appendChild(card);
        });
    }
    document.getElementById('missions-screen').style.display = 'flex';
}

function executeOnboardingMission(missionId, heroId, finalExpectedReward, missionTitle, heroName) {
    localStorage.setItem(`khamach_hero_busy_${heroId}`, 'true');
    localStorage.setItem(`khamach_mission_active_${missionId}`, 'true');
    localStorage.setItem(`khamach_mission_start_${missionId}`, Date.now().toString());
    localStorage.setItem(`khamach_mission_reward_frozen_${missionId}`, finalExpectedReward.toString());
    
    const currentFatigue = Math.min(100, Math.max(0, parseFloat(localStorage.getItem(`khamach_fatigue_${heroId}`) || '0')));
    localStorage.setItem(`khamach_fatigue_${heroId}`, Math.min(100, Math.round(currentFatigue + 15)));
    
    let logs = [];
    try { logs = JSON.parse(localStorage.getItem('khamach_chronicle_logs') || '[]'); } catch(e) { logs = []; }
    const timeStr = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    logs.unshift(`[${timeStr}] ОПОВЕЩЕНИЕ: Боец [${heroName}] ушел на поручение "${missionTitle}" на 1 час.`);
    localStorage.setItem('khamach_chronicle_logs', JSON.stringify(logs.slice(0, 50)));

    localStorage.setItem('khamach_missions_tutorial_done', 'true');
    document.getElementById('missions-screen').style.display = 'none';
    window.location.href = 'gate.html?t=' + Date.now();
}

document.addEventListener("DOMContentLoaded", function() {
    const isVictory = localStorage.getItem('khamach_combat_tutorial_done') === 'true';
    const isTrained = localStorage.getItem('khamach_training_tutorial_done') === 'true';
    const isMissionsDone = localStorage.getItem('khamach_missions_tutorial_done') === 'true';
    const btnZone = document.getElementById('onboarding-buttons-zone');
    
    if (!isVictory) {
        btnZone.innerHTML = `<button class="emoji-grid-btn" style="width: 110px; height: 110px; font-size: 54px; border-radius: 4px;" onclick="loadGameModulesAndExecute('battle')">🌋</button>`;
    } else if (!isTrained) {
        document.getElementById('onboarding-title').innerText = "ЦИТАДЕЛЬ";
        document.getElementById('onboarding-subtitle').innerText = "Управление Прогрессом";
        document.getElementById('onboarding-description').innerText = "Дракон повержен! На склад доставлены первые трофеи. Отправляйтесь прямиком в Спортзал, чтобы развить навыки и поднять уровень того героя, на прокачку которого у вас хватает добытых материалов.";
        btnZone.innerHTML = `<button class="emoji-grid-btn" style="width: 110px; height: 110px; font-size: 54px; border-radius: 4px;" title="Спортзал" onclick="loadGameModulesAndExecute('camp')">🏋️</button>`;
    } else if (!isMissionsDone) {
        document.getElementById('onboarding-title').innerText = "РАТУША";
        document.getElementById('onboarding-subtitle').innerText = "Городские Контракты";
        document.getElementById('onboarding-description').innerText = "Герой успешно развил свои навыки! Теперь Цитадели нужно золото для восстановления инфраструктуры. Загляните на Доску Поручений и отправьте свободного бойца на его первое оплачиваемое задание.";
        btnZone.innerHTML = `<button class="emoji-grid-btn" style="width: 110px; height: 110px; font-size: 54px; border-radius: 4px;" title="Поручения" onclick="loadGameModulesAndExecute('missions')">💰</button>`;
    } else {
        document.getElementById('onboarding-title').innerText = "В ПУТИ";
        document.getElementById('onboarding-subtitle').innerText = "Выбор Бестиария";
        document.getElementById('onboarding-description').innerText = "Твой герой ушёл выполнять поручение, запись об этом занесена в Летопись. Пока он добывает золото, ты можешь отправить оставшуюся команду в новый рейд. Открой карту Кампании и выбери главу, но помни — отряд будет сражаться в меньшинстве!";
        btnZone.innerHTML = `<button class="emoji-grid-btn" style="width: 110px; height: 110px; font-size: 54px; border-radius: 4px;" title="Открыть карту" onclick="loadGameModulesAndExecute('battle')">🌋</button>`;
    }
});
