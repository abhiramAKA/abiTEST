/* ==========================================================================
   КХАМАЧ — МОДУЛЬ УЛЬТИМЕЙТОВ И ИСХОДОВ БИТВЫ (ИСПРАВЛЕН - v5.7.38-FIX)
   ========================================================================== */

function activateHeroSuperpower(heroId) {
    let hero = combatData.squad.find(h => h && h.id === heroId);
    if (!hero || hero.hp <= 0 || hero.sp < hero.maxSP) return;
    
    hero.sp = 0;
    if (typeof playMatch3Sound === 'function') playMatch3Sound(hero.icon);

    const damageLvl = typeof getBuildingLevel === 'function' ? getBuildingLevel('damage') : 0;
    const archerLvl = typeof getBuildingLevel === 'function' ? getBuildingLevel('archer') : 0;
    const mageLvl = typeof getBuildingLevel === 'function' ? getBuildingLevel('mage') : 0;

    let dmgUnyielding = 120 + damageLvl * 15;
    let archerUnyielding = 25 + archerLvl * 10;
    let mageHealAmount = 25 + mageLvl * 5;
    
    switch(heroId) {
        case "tank": combatData.tankTaunting = true; combatData.dragonHP = Math.max(0, combatData.dragonHP - 25); break;
        case "damage": combatData.dragonHP = Math.max(0, combatData.dragonHP - dmgUnyielding); break;
        case "archer": combatData.dragonBlinded = true; combatData.dragonHP = Math.max(0, combatData.dragonHP - archerUnyielding); break;
        case "mage":
            combatData.squad.forEach(h => { if (h && h.hp > 0) h.hp = Math.min(h.maxHP, h.hp + mageHealAmount); });
            combatData.dragonHP = Math.max(0, combatData.dragonHP - 25);
            break;
    }
    if (typeof updateCombatInterfaceDOM === 'function') updateCombatInterfaceDOM();
    checkBattleResolution();
}

function checkBattleResolution() {
    if (combatData.dragonHP <= 0) {
        let id = window.setTimeout(function() {}, 0);
        while (id--) {
            window.clearTimeout(id);
        }

        const lootTypes = ['plasma', 'blood', 'scale', 'tears']; 
        const lootNames = ['🛡️ Плазма', '🔥 Кровь', '🪶 Чешуя', '💚 Слезы'];
        const randIndex = Math.floor(Math.random() * lootTypes.length);
        
        let lootKey = lootTypes[randIndex];
        let lootName = lootNames[randIndex];

        if (typeof addPlayerResource === 'function') addPlayerResource(lootKey, 1);
        
        if (typeof window.addChronicleLog === 'function') {
            window.addChronicleLog(`ПОБЕДА: Ликвидирован дракон Тира ${activeSessionLevel}. На склад зачислена 1 шт. материала: ${lootName}`);
        } else if (typeof addChronicleLog === 'function') {
            addChronicleLog(`ПОБЕДА: Ликвидирован дракон Тира ${activeSessionLevel}. На склад зачислена 1 шт. материала: ${lootName}`);
        }
        
        const firstBattleDone = localStorage.getItem('khamach_combat_tutorial_done') === 'true';
        const missionsDone = localStorage.getItem('khamach_missions_tutorial_done') === 'true';

        if (!firstBattleDone) {
            localStorage.setItem('khamach_combat_tutorial_done', 'true');
            window.location.href = 'gate.html?t=' + Date.now();
        } else if (!missionsDone) {
            window.location.href = 'gate.html?t=' + Date.now();
        } else {
            // Если и первый бой выигран, и боец уже отправлен на Поручение (Этап 4) — открываем полный Хаб!
            localStorage.setItem('khamach_full_onboarding_complete', 'true');
            window.location.href = 'hub.html?t=' + Date.now();
        }
    } else if (combatData.squad.every(hero => hero.hp <= 0)) {
        let id = window.setTimeout(function() {}, 0);
        while (id--) {
            window.clearTimeout(id);
        }
        alert("ОТРЯД ПАЛ В БИТВЕ! Попробуйте еще раз.");
        window.location.href = 'gate.html?t=' + Date.now();
    }
}
