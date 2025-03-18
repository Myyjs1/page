// 初始化搜索引擎配置
let searchEngines = {
    google: {
        name: 'Google',
        url: 'https://www.google.com/search?q='
    },
    baidu: {
        name: '百度',
        url: 'https://www.baidu.com/s?wd='
    },
    bing: {
        name: 'Bing',
        url: 'https://www.bing.com/search?q='
    }
};

// 初始化本地存储数据
let currentEngine = localStorage.getItem('currentEngine') || 'google';
let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {};
let customEngines = JSON.parse(localStorage.getItem('customEngines')) || {};
Object.assign(searchEngines, customEngines);

// 初始化书签显示状态
const bookmarksVisible = localStorage.getItem('bookmarksVisible') !== 'false';
const bookmarksContainer = document.querySelector('.bookmarks-container');
if (!bookmarksVisible) {
    bookmarksContainer.classList.add('hidden');
}

// 添加切换书签显示/隐藏功能
document.getElementById('toggleBookmarks').addEventListener('click', (e) => {
    const isHidden = bookmarksContainer.classList.toggle('hidden');
    localStorage.setItem('bookmarksVisible', !isHidden);
    e.target.textContent = isHidden ? '👁️' : '👁️';
});

// DOM 元素
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const currentEngineSpan = document.querySelector('.current-engine');
const engineOptions = document.querySelector('.engine-options');
const addBookmarkBtn = document.getElementById('addBookmark');
const addBookmarkModal = document.getElementById('addBookmarkModal');
const categoriesContainer = document.querySelector('.categories-container');

// 搜索功能
function performSearch() {
    const query = searchInput.value.trim();
    if (query) {
        const searchUrl = searchEngines[currentEngine].url + encodeURIComponent(query);
        window.open(searchUrl, '_blank');
    }
}

searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

// 搜索引擎设置
const searchEngineModal = document.getElementById('searchEngineModal');
const engineSettingsBtn = document.querySelector('.engine-settings-btn');
const manageSearchEnginesBtn = document.getElementById('manageSearchEngines');
const searchEnginesList = document.querySelector('.search-engines-list');
const addEngineForm = document.querySelector('.add-engine-form');
const engineNameInput = document.getElementById('engineName');
const engineUrlInput = document.getElementById('engineUrl');
const addNewEngineBtn = document.getElementById('addNewEngine');
const cancelEngineSettingsBtn = document.getElementById('cancelEngineSettings');

// 打开搜索引擎设置模态框
function openSearchEngineModal() {
    searchEngineModal.style.display = 'flex';
    setTimeout(() => {
        searchEngineModal.classList.add('show');
        renderSearchEngines();
    }, 10);
}

// 关闭搜索引擎设置模态框
function closeSearchEngineModal() {
    searchEngineModal.classList.remove('show');
    setTimeout(() => {
        searchEngineModal.style.display = 'none';
        addEngineForm.style.display = 'none';
        engineNameInput.value = '';
        engineUrlInput.value = '';
    }, 300);
}

// 渲染搜索引擎列表
function renderSearchEngines() {
    searchEnginesList.innerHTML = '';
    Object.entries(searchEngines).forEach(([key, engine]) => {
        const engineDiv = document.createElement('div');
        engineDiv.className = 'engine-item';
        engineDiv.innerHTML = `
            <div class="engine-info">
                <span class="engine-name">${engine.name}</span>
                <span class="engine-url">${engine.url}</span>
            </div>
            <div class="engine-actions">
                ${key in customEngines ? '<button class="delete-engine">🗑️</button>' : ''}
                <button class="select-engine" data-engine="${key}">选择</button>
            </div>
        `;
        searchEnginesList.appendChild(engineDiv);

        // 选择搜索引擎
        const selectBtn = engineDiv.querySelector('.select-engine');
        selectBtn.addEventListener('click', () => {
            currentEngine = key;
            currentEngineSpan.textContent = engine.name;
            localStorage.setItem('currentEngine', key);
            closeSearchEngineModal();
        });

        // 删除自定义搜索引擎
        const deleteBtn = engineDiv.querySelector('.delete-engine');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                showConfirmDialog('删除搜索引擎', `确定要删除搜索引擎 "${engine.name}" 吗？`).then(confirmed => {
                    if (confirmed) {
                        delete searchEngines[key];
                        delete customEngines[key];
                        localStorage.setItem('customEngines', JSON.stringify(customEngines));
                        renderSearchEngines();
                    }
                });
            });
        }
    });
}

// 添加新搜索引擎
addNewEngineBtn.addEventListener('click', () => {
    if (addEngineForm.style.display === 'none') {
        addEngineForm.style.display = 'block';
        addNewEngineBtn.textContent = '确认添加';
    } else {
        const name = engineNameInput.value.trim();
        const url = engineUrlInput.value.trim();
        
        if (name && url) {
            const key = name.toLowerCase().replace(/\s+/g, '_');
            searchEngines[key] = { name, url };
            customEngines[key] = { name, url };
            localStorage.setItem('customEngines', JSON.stringify(customEngines));
            
            addEngineForm.style.display = 'none';
            engineNameInput.value = '';
            engineUrlInput.value = '';
            addNewEngineBtn.textContent = '添加新引擎';
            renderSearchEngines();
        }
    }
});

// 绑定事件
engineSettingsBtn.addEventListener('click', openSearchEngineModal);
manageSearchEnginesBtn.addEventListener('click', openSearchEngineModal);
cancelEngineSettingsBtn.addEventListener('click', closeSearchEngineModal);

// 点击模态框外部关闭
searchEngineModal.addEventListener('click', (e) => {
    if (e.target === searchEngineModal) {
        closeSearchEngineModal();
    }
});

// 收藏夹管理
// 获取网站图标的函数
async function getFavicon(url) {
    try {
        const domain = new URL(url).hostname;
        // 尝试获取Google Favicon服务提供的图标
        const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
        return googleFaviconUrl;
    } catch (e) {
        console.error('获取网站图标失败:', e);
        return ''; // 返回空字符串作为默认值
    }
}

function renderBookmarks() {
    categoriesContainer.innerHTML = '';
    
    // 确保常用类别存在
    if (!bookmarks['常用']) {
        bookmarks['常用'] = [];
    }
    
    // 先渲染常用类别
    renderCategory('常用', 'frequently-used');
    
    // 渲染其他类别
    for (const category in bookmarks) {
        if (category !== '常用') {
            renderCategory(category, 'folder-style');
        }
    }
}

function renderCategory(category, styleClass) {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = `category ${styleClass}`;
    categoryDiv.innerHTML = `
        <div class="category-header">
            <span>${category}</span>
            <div class="category-actions">
                <button class="category-edit" title="编辑分类">✏️</button>
                <button class="category-delete" title="删除分类">🗑️</button>
            </div>
        </div>
        <div class="bookmarks-grid"></div>
    `;
    
    // 为文件夹样式添加点击展开/收起功能
    if (styleClass === 'folder-style') {
        const categoryHeader = categoryDiv.querySelector('.category-header');
        categoryHeader.addEventListener('click', (e) => {
            if (!e.target.matches('.category-edit, .category-delete')) {
                categoryDiv.classList.toggle('expanded');
            }
        });
    }
    
    // 添加分类编辑功能
    const editCategoryBtn = categoryDiv.querySelector('.category-edit');
    editCategoryBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const categoryElement = e.target.closest('.category');
        const isEditing = categoryElement.classList.contains('editing');
        
        // 移除所有分类的编辑状态
        document.querySelectorAll('.category').forEach(cat => cat.classList.remove('editing'));
        
        if (!isEditing) {
            // 进入编辑模式
            categoryElement.classList.add('editing');
        }
    });
    
    // 添加分类删除功能
    const deleteCategoryBtn = categoryDiv.querySelector('.category-delete');
    deleteCategoryBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (category === '常用') {
            alert('常用类别不能删除！');
            return;
        }
        showConfirmDialog('删除分类', `确定要删除 "${category}" 分类及其所有书签吗？`).then(confirmed => {
            if (confirmed) {
                delete bookmarks[category];
                localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
                renderBookmarks();
            }
        });
    });
    
    const bookmarksGrid = categoryDiv.querySelector('.bookmarks-grid');
    bookmarks[category].forEach((bookmark, index) => {
        const bookmarkDiv = document.createElement('div');
        bookmarkDiv.className = 'bookmark-item';
        bookmarkDiv.innerHTML = `
            <div class="bookmark-content">
                <img class="bookmark-icon" src="" alt="" onerror="this.style.display='none'">
                <div class="bookmark-info">
                    <div class="bookmark-title">${bookmark.name}</div>
                </div>
            </div>
            <div class="bookmark-actions">
                <button class="bookmark-edit" title="编辑书签"></button>
                <button class="bookmark-delete" title="删除书签">🗑️</button>
            </div>
        `;
        
        // 获取并设置网站图标
        const iconImg = bookmarkDiv.querySelector('.bookmark-icon');
        getFavicon(bookmark.url).then(iconUrl => {
            if (iconUrl) {
                iconImg.src = iconUrl;
                iconImg.style.display = 'block';
            }
        });
        
        // 点击书签跳转
        const bookmarkContent = bookmarkDiv.querySelector('.bookmark-content');
        bookmarkContent.addEventListener('click', () => {
            window.open(bookmark.url, '_blank');
        });
        
        // 编辑书签
        const editBtn = bookmarkDiv.querySelector('.bookmark-edit');
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            editBookmark(category, index);
        });
        
        // 删除书签
        const deleteBtn = bookmarkDiv.querySelector('.bookmark-delete');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showConfirmDialog('删除书签', `确定要删除 "${bookmark.name}" 书签吗？`).then(confirmed => {
                if (confirmed) {
                    bookmarks[category].splice(index, 1);
                    if (bookmarks[category].length === 0 && category !== '常用') {
                        delete bookmarks[category];
                    }
                    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
                    renderBookmarks();
                }
            });
        });
        
        bookmarksGrid.appendChild(bookmarkDiv);
    });
    
    categoriesContainer.appendChild(categoryDiv);
}

// 添加网站模态框管理
addBookmarkBtn.addEventListener('click', () => {
    addBookmarkModal.style.display = 'flex';
    // 使用 requestAnimationFrame 确保 display 更改后再添加 show 类
    requestAnimationFrame(() => {
        addBookmarkModal.classList.add('show');
    });
    const categorySelect = document.getElementById('siteCategory');
    categorySelect.innerHTML = '<option value="常用">常用</option><option value="new">新建分类</option>';
    
    // 添加现有分类到选择框
    for (const category in bookmarks) {
        if (category !== '常用') {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        }
    }
});

document.getElementById('siteCategory').addEventListener('change', (e) => {
    const newCategoryInput = document.getElementById('newCategory');
    newCategoryInput.style.display = e.target.value === 'new' ? 'block' : 'none';
});

document.getElementById('cancelAdd').addEventListener('click', () => {
    addBookmarkModal.classList.remove('show');
    setTimeout(() => {
        addBookmarkModal.style.display = 'none';
        resetModalForm();
    }, 300);
});

document.getElementById('confirmAdd').addEventListener('click', async () => {
    let url = document.getElementById('siteUrl').value.trim();
    let category = document.getElementById('siteCategory').value;
    
    // 规范化URL格式
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    
    // 验证URL格式
    try {
        new URL(url);
    } catch (e) {
        const modalContent = document.querySelector('.modal-content');
        modalContent.classList.add('shake');
        setTimeout(() => modalContent.classList.remove('shake'), 500);
        return;
    }

    // 自动获取网站标题
    let name = '';
    try {
        const domain = new URL(url).hostname;
        // 移除www.和.com等后缀，并将首字母大写
        name = domain.replace(/^www\./, '').split('.')[0];
        name = name.charAt(0).toUpperCase() + name.slice(1);
    } catch (e) {
        name = url;
    }
    
    if (category === 'new') {
        category = document.getElementById('newCategory').value.trim();
    }
    
    if (name && url && category) {
        if (!bookmarks[category]) {
            bookmarks[category] = [];
        }
        
        bookmarks[category].push({ name: name, url: url });
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        renderBookmarks();
        addBookmarkModal.classList.remove('show');
        setTimeout(() => {
            addBookmarkModal.style.display = 'none';
            resetModalForm();
        }, 300);
    } else {
        const modalContent = document.querySelector('.modal-content');
        modalContent.classList.add('shake');
        setTimeout(() => modalContent.classList.remove('shake'), 500);
    }
});

// 编辑书签功能
function editBookmark(category, index) {
    const bookmark = bookmarks[category][index];
    
    // 显示模态框并填充现有数据
    document.getElementById('siteName').value = bookmark.name;
    document.getElementById('siteUrl').value = bookmark.url;
    
    const categorySelect = document.getElementById('siteCategory');
    categorySelect.value = category;
    
    // 显示模态框
    addBookmarkModal.style.display = 'flex';
    requestAnimationFrame(() => {
        addBookmarkModal.classList.add('show');
    });
    
    // 修改确认按钮的行为
    const confirmBtn = document.getElementById('confirmAdd');
    const originalClickHandler = confirmBtn.onclick;
    
    confirmBtn.onclick = () => {
        const newName = document.getElementById('siteName').value.trim();
        let newUrl = document.getElementById('siteUrl').value.trim();
        let newCategory = document.getElementById('siteCategory').value;
        
        // 规范化URL格式
        if (newUrl && !newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
            newUrl = 'https://' + newUrl;
        }
        
        // 验证URL格式
        try {
            new URL(newUrl);
        } catch (e) {
            const modalContent = document.querySelector('.modal-content');
            modalContent.classList.add('shake');
            setTimeout(() => modalContent.classList.remove('shake'), 500);
            return;
        }
        
        if (newCategory === 'new') {
            newCategory = document.getElementById('newCategory').value.trim();
        }
        
        if (newName && newUrl && newCategory) {
            // 从原分类中删除
            bookmarks[category].splice(index, 1);
            if (bookmarks[category].length === 0) {
                delete bookmarks[category];
            }
            
            // 添加到新分类
            if (!bookmarks[newCategory]) {
                bookmarks[newCategory] = [];
            }
            bookmarks[newCategory].push(Object.assign({}, { name: newName, url: newUrl }));
            
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            renderBookmarks();
            
            // 关闭模态框
            addBookmarkModal.classList.remove('show');
            setTimeout(() => {
                addBookmarkModal.style.display = 'none';
                resetModalForm();
                // 恢复原始点击处理程序
                confirmBtn.onclick = originalClickHandler;
            }, 300);
        } else {
            const modalContent = document.querySelector('.modal-content');
            modalContent.classList.add('shake');
            setTimeout(() => modalContent.classList.remove('shake'), 500);
        }
    };
}

function resetModalForm() {
    document.getElementById('siteUrl').value = '';
    document.getElementById('siteCategory').value = '';
    document.getElementById('newCategory').value = '';
    document.getElementById('newCategory').style.display = 'none';
}

// 数据导入导出功能
function exportData() {
    const exportData = {
        bookmarks: bookmarks,
        customEngines: customEngines,
        currentEngine: currentEngine
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'startpage-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = event => {
            try {
                const data = JSON.parse(event.target.result);
                
                // 验证数据格式
                if (data.bookmarks && data.customEngines && data.currentEngine) {
                    bookmarks = data.bookmarks;
                    customEngines = data.customEngines;
                    currentEngine = data.currentEngine;
                    
                    // 合并搜索引擎
                    Object.assign(searchEngines, customEngines);
                    
                    // 保存到本地存储
                    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
                    localStorage.setItem('customEngines', JSON.stringify(customEngines));
                    localStorage.setItem('currentEngine', currentEngine);
                    
                    // 更新UI
                    renderBookmarks();
                    currentEngineSpan.textContent = searchEngines[currentEngine].name;
                    
                    alert('数据导入成功！');
                } else {
                    alert('导入的数据格式不正确！');
                }
            } catch (error) {
                alert('导入失败：' + error.message);
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// 添加导入导出按钮
const bookmarksHeader = document.querySelector('.bookmarks-header');
const dataActionsDiv = document.createElement('div');
dataActionsDiv.className = 'data-actions';
// dataActionsDiv.innerHTML = `
//     <button id="exportData" class="data-action-btn" title="导出数据">导出数据</button>
//     <button id="importData" class="data-action-btn" title="导入数据">导入数据</button>
// `;
bookmarksHeader.appendChild(dataActionsDiv);

// 添加事件监听
document.getElementById('exportData').addEventListener('click', exportData);
document.getElementById('importData').addEventListener('click', importData);

// 初始化渲染
renderBookmarks();
currentEngineSpan.textContent = searchEngines[currentEngine].name;