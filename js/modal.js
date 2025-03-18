// 通用确认对话框函数
function showConfirmDialog(title, message) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        modal.innerHTML = `
            <div class="custom-modal-content">
                <div class="custom-modal-header">
                    <h3 class="custom-modal-title">${title}</h3>
                </div>
                <div class="custom-modal-body">
                    <p class="custom-modal-message">${message}</p>
                </div>
                <div class="custom-modal-footer">
                    <button class="custom-modal-btn cancel-btn">取消</button>
                    <button class="custom-modal-btn confirm-btn">确认</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        requestAnimationFrame(() => {
            modal.style.display = 'flex';
            requestAnimationFrame(() => {
                modal.classList.add('show');
            });
        });

        const closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        };

        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            closeModal();
            resolve(false);
        });

        modal.querySelector('.confirm-btn').addEventListener('click', () => {
            closeModal();
            resolve(true);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
                resolve(false);
            }
        });
    });
}

// 错误提示对话框函数
function showErrorDialog(message) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        modal.innerHTML = `
            <div class="custom-modal-content">
                <div class="custom-modal-header">
                    <h3 class="custom-modal-title">错误</h3>
                </div>
                <div class="custom-modal-body">
                    <p class="custom-modal-message">${message}</p>
                </div>
                <div class="custom-modal-footer">
                    <button class="custom-modal-btn confirm-btn">确定</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        requestAnimationFrame(() => {
            modal.style.display = 'flex';
            requestAnimationFrame(() => {
                modal.classList.add('show');
            });
        });

        const closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        };

        modal.querySelector('.confirm-btn').addEventListener('click', () => {
            closeModal();
            resolve();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
                resolve();
            }
        });
    });
}