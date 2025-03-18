// 更新时钟显示
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    document.getElementById('clock').textContent = `${hours}:${minutes}`;
}

// 初始化时钟
updateClock();

// 每秒更新一次时钟
setInterval(updateClock, 1000);