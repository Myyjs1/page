// 壁纸预览和切换功能
let currentWallpaper = localStorage.getItem('currentWallpaper') || 'th.jpg';

// 创建壁纸预览模态框
const wallpaperModal = document.createElement('div');
wallpaperModal.className = 'modal';
wallpaperModal.id = 'wallpaperModal';
wallpaperModal.innerHTML = `
    <div class="modal-content">
        <h3>选择壁纸</h3>
        <div class="wallpapers-grid"></div>
        <div class="modal-buttons">
            <button id="closeWallpaperModal" class="cancel-btn">关闭</button>
        </div>
    </div>
`;
document.body.appendChild(wallpaperModal);

// 获取壁纸列表
function loadWallpapers() {
    try {
        // 直接从本地文件加载壁纸列表
        const wallpapers = [
            "th.jpg",
            "th1.jpg",
            "th2.jpg",
            "th3.jpg",
            "th4.jpg",
            "th5.jpg",
            "th1.png",
            "th2.png",
            "th3.png",
            "th4.png"
        ];
        displayWallpapers(wallpapers);
    } catch (error) {
        console.error('加载壁纸列表失败:', error);
        alert('加载壁纸列表失败，请刷新页面重试');
    }
}

// 显示壁纸预览
function displayWallpapers(wallpapers) {
    const grid = document.querySelector('.wallpapers-grid');
    grid.innerHTML = '';

    wallpapers.forEach(wallpaper => {
        const wallpaperItem = document.createElement('div');
        wallpaperItem.className = 'wallpaper-item';
        wallpaperItem.style.backgroundImage = `url('img/${wallpaper}')`;
        
        if (wallpaper === currentWallpaper) {
            wallpaperItem.classList.add('active');
        }

        wallpaperItem.addEventListener('click', () => {
            // 更新当前壁纸
            currentWallpaper = wallpaper;
            localStorage.setItem('currentWallpaper', wallpaper);
            // 更新伪元素背景
            const style = document.createElement('style');
            style.textContent = `body::before { background-image: url(img/${wallpaper}) !important; }`;
            document.head.appendChild(style);
            
            // 更新选中状态
            document.querySelectorAll('.wallpaper-item').forEach(item => {
                item.classList.remove('active');
            });
            wallpaperItem.classList.add('active');
        });

        grid.appendChild(wallpaperItem);
    });
}

// 初始化壁纸设置
function initWallpaperPreview() {
    // 应用当前壁纸
    if (wallpaperEnabled) {
        document.body.style.backgroundImage = `url('../img/${currentWallpaper}')`;
    }

    // 添加壁纸预览按钮
    const wallpaperSection = document.querySelector('.settings-section');
    const previewButton = document.createElement('div');
    previewButton.className = 'setting-item';
    previewButton.innerHTML = `
        <button id="previewWallpaper" class="data-action-btn">预览壁纸</button>
    `;
    wallpaperSection.appendChild(previewButton);

    // 壁纸预览模态框事件
    const wallpaperModal = document.getElementById('wallpaperModal');
    const closeWallpaperModal = document.getElementById('closeWallpaperModal');
    const previewWallpaperBtn = document.getElementById('previewWallpaper');

    previewWallpaperBtn.addEventListener('click', () => {
        wallpaperModal.classList.add('show');
        loadWallpapers();
    });

    closeWallpaperModal.addEventListener('click', () => {
        wallpaperModal.classList.remove('show');
    });

    // 点击模态框外部关闭
    wallpaperModal.addEventListener('click', (e) => {
        if (e.target === wallpaperModal) {
            wallpaperModal.classList.remove('show');
        }
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', initWallpaperPreview);