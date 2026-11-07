/* ==========================================================================
   КХАМАЧ — ЦЕНТРАЛЬНЫЙ ДИСПЕТЧЕР СТЭЙТА И ТАЙМЕРОВ (СТАБИЛИЗИРОВАН - v5.4.0)
   ========================================================================== */

const BOARD_ROWS = 8;
const BOARD_COLS = 8;
const RUNE_TYPES = ['🔥', '🛡️', '⚡', '💚'];

let combatData = {
    dragonHP: 120, 
    dragonMaxHP: 120,
    playerAP: 1, 
    playerMaxAP: 1,
    currentRound: 1,
    tankTaunting: false, 
    dragonBlinded: false, 
    pendingComboTutorial: false, 
    squad: [
        { id: "tank", name: "Защитник", hp: 150, maxHP: 150, sp: 0, maxSP: 100, icon: "🛡️", color: "#4a90e2" },
        { id: "damage", name: "Воин", hp: 90, maxHP: 90, sp: 0, maxSP: 100, icon: "🔥", color: "#ff4500" },
        { id: "archer", name: "Стрелок", hp: 100, maxHP: 100, sp: 0, maxSP: 100, icon: "⚡", color: "#f1c40f" },
        { id: "mage", name: "Маг", hp: 80, maxHP: 80, sp: 0, maxSP: 100, icon: "💚", color: "#2ecc71" }
    ]
};

let match3BoardData = null;
let selectedCell = null;
let selectedDragonLevel = 1;
window.currentOpenedModeKey = null;

function sanitizeAndMigrateStorage() {
    const currentGold = localStorage.getItem('khamach_gold') || '0';
    const currentMaxTier = localStorage.getItem('khamach_max_tier') || '1';
    const plasma = localStorage.getItem('khamach_res_plasma') || '0';
    const blood = localStorage.getItem('khamach_res_blood') || '0';
    const scale = localStorage.getItem('khamach_res_scale') || '0';
    const tears = localStorage.getItem('khamach_res_tears') || '0';

    localStorage.setItem('khamach_gold', currentGold);
    localStorage.setItem('khamach_max_tier', currentMaxTier);
    localStorage.setItem('khamach_res_plasma', plasma);
    localStorage.setItem('khamach_res_blood', blood);
    localStorage.setItem('khamach_res_scale', scale);
    localStorage.setItem('khamach_res_tears', tears);
}

function initDispatcherModule() {
    sanitizeAndMigrateStorage();

    // Защищенный вызов инъекций — падение одного UI-окна больше не рушит всю игру
    try { if (typeof injectTownScreensDOM === 'function') injectTownScreensDOM(); } catch(e) { console.error(e); }
    try { if (typeof injectCombatInterfaceBaseDOM === 'function') injectCombatInterfaceBaseDOM(); } catch(e) { console.error(e); }
    try { if (typeof injectSquadInterfaceDOM === 'function') injectSquadInterfaceDOM(); } catch(e) { console.error(e); }
    try { if (typeof injectMissionsInterfaceBaseDOM === 'function') injectMissionsInterfaceBaseDOM(); } catch(e) { console.error(e); }
    
    // Принудительно и сразу обновляем золото и усталость на экране
    if (typeof updateTownGoldDisplay === 'function') {
        updateTownGoldDisplay();
    }

    // Навешиваем клики
    if (typeof setupAllGameListeners === 'function') {
        try { setupAllGameListeners(); } catch (e) { console.error("Ошибка листенеров:", e); }
    }

    setInterval(() => {
        if (typeof checkAndProcessMissionsBackground === 'function') {
            checkAndProcessMissionsBackground();
        }
    }, 1000);
}

function showScreen(screenId) {
    const screens = ['main-menu', 'dragon-select-screen', 'info-screen', 'mode-desc-screen', 'squad-screen', 'combat-screen', 'storage-screen', 'missions-screen', 'chronicle-screen', 'squad-heroes-spec-screen'];
    screens.forEach(id => {
        const screenEl = document.getElementById(id);
        if (screenEl) screenEl.style.display = (id === screenId) ? 'flex' : 'none';
    });
    if (screenId === 'dragon-select-screen' && typeof renderDragonSelectionGrid === 'function') {
        renderDragonSelectionGrid();
    }
    if (screenId === 'squad-screen') {
        if (typeof injectSquadInterfaceDOM === 'function') injectSquadInterfaceDOM();
        if (typeof setupSquadInterfaceListeners === 'function') setupSquadInterfaceListeners();
        if (typeof updateSquadVisualStyles === 'function') updateSquadVisualStyles();
    }
    if (screenId === 'storage-screen' && typeof updateStorageScreenDOM === 'function') {
        updateStorageScreenDOM();
    }
    if (screenId === 'squad-heroes-spec-screen' && typeof updateSquadHeroesSpecScreenDOM === 'function') {
        updateSquadHeroesSpecScreenDOM();
    }
    if (screenId === 'missions-screen' && typeof renderMissionsDOM === 'function') {
        renderMissionsDOM();
    }
    if (screenId === 'chronicle-screen' && typeof renderChronicleDOM === 'function') {
        renderChronicleDOM();
    }
    if (screenId === 'main-menu' || screenId === 'squad-screen' || screenId === 'mode-desc-screen' || screenId === 'storage-screen') {
        if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
    }
}
