/* ==========================================================================
   КХАМАЧ — АВТОНОМНЫЙ МОДУЛЬ ОБРАБОТЧИКОВ ИНТЕРФЕЙСА (СТАБИЛИЗИРОВАН)
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

function setupAllGameListeners() {
    // Полностью очищаем старые глобальные перехватчики
    document.onclick = null;
    document.body.onclick = null;

    function bind(id, callback, checkLock = false) {
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

    // НАДЕЖНОЕ ПРЯМОЕ НАЗНАЧЕНИЕ КЛИКОВ ДЛЯ КАЖДОЙ КНОПКИ ГЛАВНОГО МЕНЮ
    bind('to-settings-btn', function() {
        const musicSlider = document.getElementById('volume-music-slider');
        const fxSlider = document.getElementById('volume-fx-slider');
        if (musicSlider) musicSlider.value = (parseFloat(localStorage.getItem('khamach_vol_music') || '0.5') * 100);
        if (fxSlider) fxSlider.value = (parseFloat(localStorage.getItem('khamach_vol_fx') || '0.7') * 100);
        if (typeof initAudioContext === 'function') initAudioContext();
        
        document.getElementById('main-menu').style.display = 'none';
        document.getElementById('settings-screen').style.display = 'flex';
    });

    bind('info-btn', function() {
        const textContainer = document.getElementById('info-screen-text');
        if (textContainer) textContainer.innerHTML = typeof getTownText === 'function' ? getTownText('mainInfo') : '';
        showScreen('info-screen');
    });

    bind('to-combat-btn', function() {
        showScreen('dragon-select-screen');
    });

    bind('to-missions-btn', function() {
        showScreen('missions-screen');
    }, true);

    bind('to-squad-btn', function() {
        showScreen('squad-screen');
    }, true);

    bind('to-storage-btn', function() {
        if (typeof window.updateSquadHeroesSpecScreenDOM === 'function') {
            window.updateSquadHeroesSpecScreenDOM();
        }
        showScreen('squad-heroes-spec-screen');
    }, true);

    bind('to-chronicle-btn', function() {
        showScreen('chronicle-screen');
    }, true);

    bind('to-clans-btn', function() {
        if (typeof window.openModeDescription === 'function') {
            window.openModeDescription('clans');
        }
    }, true);

    // СЕРВИСНЫЕ КНОПКИ НАЗАД И ЗАКРЫТИЯ ОКН
    bind('from-select-to-menu-btn', function() { showScreen('main-menu'); });
    bind('from-info-to-menu-btn', function() { showScreen('main-menu'); });
    bind('close-settings-btn', function() {
        document.getElementById('settings-screen').style.display = 'none';
        document.getElementById('main-menu').style.display = 'flex';
        if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
    });
    
    bind('close-heroes-spec-btn', function() { showScreen('main-menu'); });
    bind('close-storage-btn', function() { showScreen('main-menu'); });
    bind('close-missions-btn', function() { showScreen('main-menu'); });
    bind('close-chronicle-btn', function() { showScreen('main-menu'); });

    // СЛАЙДЕРЫ НАСТРОЕК ЗВУКА
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

    bind('clear-chronicle-btn', function() {
        if (confirm("Очистить все записи в Летописи Цитадели?")) {
            localStorage.setItem('khamach_chronicle_logs', JSON.stringify(new Array()));
            if (typeof renderChronicleDOM === 'function') renderChronicleDOM();
        }
    });

    // ОСТАЛЬНЫЕ КЛИКАБЕЛЬНЫЕ КЛИЕНТСКИЕ ЭЛЕМЕНТЫ
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
    
    bind('close-fatigue-screen-btn', function() {
        const screen = document.getElementById('squad-fatigue-screen');
        if (screen) screen.style.display = 'none';
    });

    setupCombatHelpListeners();
}

function setupCombatHelpListeners() {
    bind('combat-help-btn', function() {
        const container = document.getElementById('combat-help-text-container');
        if (container) container.innerHTML = typeof getTownText === 'function' ? getTownText('combatHelp') : '';
        const screen = document.getElementById('combat-help-screen');
        if (screen) screen.style.display = 'flex';
    });

    bind('close-combat-help-btn', function() {
        const screen = document.getElementById('combat-help-screen');
        if (screen) screen.style.display = 'none';
    });

    bind('combat-escape-top-btn', function() {
        if (confirm("Вы уверены, что хотите сбежать из рейда?")) showScreen('main-menu');
    });

    bind('close-combat-tutorial-btn', function() {
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
