// 壁纸设置管理
let wallpaperEnabled = localStorage.getItem('wallpaperEnabled') === 'true';
let blurLevel = localStorage.getItem('blurLevel') || 10;

// DOM 元素
const settingsBtn = document.querySelector('.settings-btn');
const settingsPanel = document.querySelector('.settings-panel');
const closeSettings = document.querySelector('.close-settings');
const wallpaperToggle = document.getElementById('wallpaperToggle');
const blurLevelInput = document.getElementById('blurLevel');

// 初始化设置
function initWallpaperSettings() {
    // 应用保存的设置
    document.body.classList.toggle('wallpaper-enabled', wallpaperEnabled);
    document.documentElement.style.setProperty('--blur-level', `${blurLevel}px`);
    wallpaperToggle.checked = wallpaperEnabled;
    blurLevelInput.value = blurLevel;

    // 设置面板开关
    settingsBtn.addEventListener('click', () => {
        settingsPanel.style.display = 'block';
    });

    closeSettings.addEventListener('click', () => {
        settingsPanel.style.display = 'none';
    });

    // 点击面板外关闭
    document.addEventListener('click', (e) => {
        if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
            settingsPanel.style.display = 'none';
        }
    });

    // 壁纸开关
    wallpaperToggle.addEventListener('change', () => {
        wallpaperEnabled = wallpaperToggle.checked;
        document.body.classList.toggle('wallpaper-enabled', wallpaperEnabled);
        localStorage.setItem('wallpaperEnabled', wallpaperEnabled);
    });

    // 模糊度调节
    blurLevelInput.addEventListener('input', () => {
        blurLevel = blurLevelInput.value;
        document.documentElement.style.setProperty('--blur-level', `${blurLevel}px`);
        localStorage.setItem('blurLevel', blurLevel);
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', initWallpaperSettings);