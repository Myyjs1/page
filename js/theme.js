// 主题切换功能
const themeToggle = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
let currentTheme = localStorage.getItem('theme') || 'auto';

// 初始化主题设置
function initTheme() {
    // 创建主题切换按钮
    if (!themeToggle) {
        const themeToggleContainer = document.createElement('div');
        themeToggleContainer.className = 'theme-toggle-container';
        themeToggleContainer.innerHTML = `
            <button id="themeToggle" class="theme-toggle-btn" title="切换主题">
                <span class="theme-icon light-icon">☀️</span>
                <span class="theme-icon dark-icon">🌙</span>
                <span class="theme-icon auto-icon">🔄</span>
            </button>
            <div class="theme-options" style="display: none;">
                <div class="theme-option" data-theme="light">浅色模式 ☀️</div>
                <div class="theme-option" data-theme="dark">深色模式 🌙</div>
                <div class="theme-option" data-theme="auto">跟随系统 🔄</div>
            </div>
        `;
        
        document.querySelector('.container').appendChild(themeToggleContainer);
    }
    
    // 获取DOM元素
    const themeToggle = document.getElementById('themeToggle');
    const themeOptions = document.querySelector('.theme-options');
    
    // 设置当前主题图标
    updateThemeIcon();
    
    // 应用当前主题
    applyTheme();
    
    // 添加事件监听
    themeToggle.addEventListener('click', () => {
        themeOptions.style.display = themeOptions.style.display === 'none' ? 'block' : 'none';
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.theme-toggle-container')) {
            themeOptions.style.display = 'none';
        }
    });
    
    themeOptions.addEventListener('click', (e) => {
        if (e.target.classList.contains('theme-option')) {
            currentTheme = e.target.dataset.theme;
            localStorage.setItem('theme', currentTheme);
            updateThemeIcon();
            applyTheme();
            themeOptions.style.display = 'none';
        }
    });
    
    // 监听系统主题变化
    prefersDarkScheme.addEventListener('change', (e) => {
        if (currentTheme === 'auto') {
            applyTheme();
        }
    });
}

// 更新主题图标
function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const lightIcon = themeToggle.querySelector('.light-icon');
    const darkIcon = themeToggle.querySelector('.dark-icon');
    const autoIcon = themeToggle.querySelector('.auto-icon');
    
    lightIcon.style.display = 'none';
    darkIcon.style.display = 'none';
    autoIcon.style.display = 'none';
    
    switch (currentTheme) {
        case 'light':
            lightIcon.style.display = 'inline';
            break;
        case 'dark':
            darkIcon.style.display = 'inline';
            break;
        case 'auto':
            autoIcon.style.display = 'inline';
            break;
    }
}

// 应用主题
function applyTheme() {
    const isDarkMode = currentTheme === 'dark' || 
                      (currentTheme === 'auto' && prefersDarkScheme.matches);
    
    document.body.classList.toggle('dark-theme', isDarkMode);
}

// 页面加载完成后初始化主题
document.addEventListener('DOMContentLoaded', initTheme);