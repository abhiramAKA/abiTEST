/* ==========================================================================
   КХАМАЧ — АВТОНОМНЫЙ МОДУЛЬ ОБРАБОТЧИКОВ ИНТЕРФЕЙСА (СТАБИЛИЗИРОВАН - v5.5.5)
   ========================================================================== */

window.closeModeDescriptionUnified = function() {
    const squadScreen = document.getElementById('squad-screen');
    const activeKey = window.currentOpenedModeKey || '';
    const isInsideSquad = (squadScreen && squadScreen.style.display !== 'none') || 
                          ['tank', 'damage', 'archer', 'mage', 'forge', 'alchemy'].includes(activeKey);
    
    if (activeKey === 'clans') {
        showScreen('main-menu');
    } else if (isInsideSquad) {
        showScreen('squad-screen');
    } else {
        showScreen('main-menu');
    }
};

// ИСПРАВЛЕНО: Глобальная функция привязки вынесена на уровень модуля, чтобы её видели абсолютно все субфункции
function safeBindElementClick(id, callback, checkLock = false) {
    const el = document.getElementById(id);
    if (!el) return;
    el.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (checkLock && el.classList.contains('progression-locked')) {
            return false;
        }
        callback();
    };
}

function setupAllGameListeners() {
    document.onclick = null;
    document.body.onclick = null;

    document.addEventListener('click', function initAudioOnFirstClick() {
        if (typeof startBackgroundMusic === 'function') {
            startBackgroundMusic();
        }
        document.removeEventListener('click', initAudioOnFirstClick);
    }, { once: true });

    safeBindElementClick('to-settings-btn', function() {
        const musicSlider = document.getElementById('volume-music-slider');
        const fxSlider = document.getElementById('volume-fx-slider');
        if (musicSlider) musicSlider.value = (parseFloat(localStorage.getItem('khamach_vol_music') || '0.5') * 100);
        if (fxSlider) fxSlider.value = (parseFloat(localStorage.getItem('khamach_vol_fx') || '0.7') * 100);
        if (typeof initAudioContext === 'function') initAudioContext();
        
        document.getElementById('main-menu').style.display = 'none';
        document.getElementById('settings-screen').style.display = 'flex';
    });

    safeBindElementClick('info-btn', function() {
        const textContainer = document.getElementById('info-screen-text');
        if (textContainer) textContainer.innerHTML = typeof getTownText === 'function' ? getTownText('mainInfo') : '';
        showScreen('info-screen');
    });

    safeBindElementClick('to-combat-btn', function() {
        showScreen('dragon-select-screen');
    });

    safeBindElementClick('to-missions-btn', function() {
        showScreen('missions-screen');
        if (typeof renderMissionsDOM === 'function') {
            renderMissionsDOM();
        }
    }, true);

    safeBindElementClick('to-squad-btn', function() {
        showScreen('squad-screen');
    }, true);

    safeBindElementClick('to-storage-btn', function() {
        if (typeof window.updateSquadHeroesSpecScreenDOM === 'function') {
            window.updateSquadHeroesSpecScreenDOM();
        }
        showScreen('squad-heroes-spec-screen');
    }, true);

    safeBindElementClick('to-chronicle-btn', function() {
        showScreen('chronicle-screen');
    }, true);

    safeBindElementClick('to-clans-btn', function() {
        if (typeof window.openModeDescription === 'function') {
            window.openModeDescription('clans');
        }
    }, true);

    safeBindElementClick('from-select-to-menu-btn', function() { showScreen('main-menu'); });
    safeBindElementClick('from-info-to-menu-btn', function() { showScreen('main-menu'); });
    safeBindElementClick('close-settings-btn', function() {
        document.getElementById('settings-screen').style.display = 'none';
        document.getElementById('main-menu').style.display = 'flex';
        if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
    });
    
    safeBindElementClick('close-heroes-spec-btn', function() { showScreen('main-menu'); });
    safeBindElementClick('close-storage-btn', function() { showScreen('main-menu'); });
    safeBindElementClick('close-missions-btn', function() { showScreen('main-menu'); });
    safeBindElementClick('close-chronicle-btn', function() { showScreen('main-menu'); });

    const musicSlider = document.getElementById('volume-music-slider');
    if (musicSlider) {
        musicSlider.oninput = function(e) {
            if (typeof updateEngineVolumeValues === 'function') updateEngineVolumeValues('music', e.target.value);
        };
    }
    
    const fxSlider = document.getElementById('volume-fx-slider');
    if (fxSlider) {
        fxSlider.oninput = function(e) {
            if (typeof updateEngineVolumeValues === 'function') updateEngineVolumeValues('fx', e.target.value);
        };
        fxSlider.onchange = function() {
            if (typeof playMatch3Sound === 'function') playMatch3Sound('swap');
        };
    }

    safeBindElementClick('clear-chronicle-btn', function() {
        if (confirm("Очистить все записи в Летописи Цитадели?")) {
            localStorage.setItem('khamach_chronicle_logs', JSON.stringify(new Array()));
            if (typeof renderChronicleDOM === 'function') renderChronicleDOM();
        }
    });

    const goldDisplayLink = document.getElementById('main-gold-display');
    if (goldDisplayLink) {
        goldDisplayLink.onclick = function() {
            if (typeof updateStorageScreenDOM === 'function') updateStorageScreenDOM();
            showScreen('storage-screen');
        };
    }

    const teamFatigueBtn = document.getElementById('team-fatigue-display');
    if (teamFatigueBtn) {
        teamFatigueBtn.onclick = function() {
            if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
            const screen = document.getElementById('squad-fatigue-screen');
            if (screen) screen.style.display = 'flex';
        };
    }
    
    safeBindElementClick('close-fatigue-screen-btn', function() {
        const screen = document.getElementById('squad-fatigue-screen');
        if (screen) screen.style.display = 'none';
    });

    setupCombatHelpListeners();
}

function setupCombatHelpListeners() {
    // ИСПРАВЛЕНО: Заменен вызов локального bind на глобальную safeBindElementClick
    safeBindElementClick('combat-help-btn', function() {
        const container = document.getElementById('combat-help-text-container');
        if (container) container.innerHTML = typeof getTownText === 'function' ? getTownText('combatHelp') : '';
        const screen = document.getElementById('combat-help-screen');
        if (screen) screen.style.display = 'flex';
    });

    safeBindElementClick('close-combat-help-btn', function() {
        const screen = document.getElementById('combat-help-screen');
        if (screen) screen.style.display = 'none';
    });

    safeBindElementClick('combat-escape-top-btn', function() {
        if (confirm("Вы уверены, что хотите сбежать из рейда?")) showScreen('main-menu');
    });

    safeBindElementClick('close-combat-tutorial-btn', function() {
        localStorage.setItem('khamach_combat_tutorial_done', 'true');
        if (typeof isBoardLocked !== 'undefined') isBoardLocked = false;
        const screen = document.getElementById('combat-welcome-tutorial-screen');
        if (screen) screen.style.display = 'none';
        
        ['to-squad-btn', 'to-storage-btn', 'to-chronicle-btn', 'to-clans-btn'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.classList.remove('progression-locked');
        });
    });
}
