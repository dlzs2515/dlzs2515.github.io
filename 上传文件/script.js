let files = []; // 保存上传的文件信息
let editingFile = null; // 当前正在编辑的文件索引

// 处理文件上传
function handleFileSelect() {
    const selectedFiles = Array.from(document.getElementById('upload-button').files);
    selectedFiles.forEach(file => {
        files.push({
            name: file.name,
            size: file.size,
            type: file.type,
            blob: file, // 存储二进制文件
            id: Date.now() + Math.random(), // 模拟文件 ID
        });
    });
    renderFileList();
}

// 渲染文件列表
function renderFileList() {
    const tbody = document.getElementById('file-body');
    tbody.innerHTML = ''; // 清空现有内容

    files.forEach((file, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            ${editingFile === index ? `
                <td>
                    <input 
                        type="text" 
                        value="${file.name}" 
                        id="edit-name-${index}"
                        onkeypress="if (event.key === 'Enter') handleEdit(${index})"
                    >
                </td>
            ` : `
                <td>${file.name}</td>
            `}
            <td>${(file.size / 1024).toFixed(2)}</td>
            <td class="file-actions">
                ${editingFile !== index ? `
                    <button onclick="handleDownload(${index})">下载</button>
                    <button onclick="handleEdit(${index})">修改</button>
                    <button onclick="handleDelete(${index})">删除</button>
                ` : `
                    <button onclick="cancelEdit(${index})">取消</button>
                `}
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 下载文件
function handleDownload(index) {
    const file = files[index];
    if (file.blob) {
        const url = URL.createObjectURL(file.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
}

// 修改文件名
function handleEdit(index) {
    if (editingFile === null) {
        const oldName = files[index].name;
        editingFile = index;
        renderFileList();
        setTimeout(() => {
            document.getElementById(`edit-name-${index}`).focus();
        }, 0);
    } else {
        // 保存修改
        const newName = document.getElementById(`edit-name-${index}`).value;
        if (newName && newName !== files[index].name) {
            files[index].name = newName;
        }
        editingFile = null;
        renderFileList();
    }
}

// 取消编辑
function cancelEdit(index) {
    editingFile = null;
    renderFileList();
}

// 删除文件
function handleDelete(index) {
    files.splice(index, 1);
    renderFileList();
}

// 初始化文件列表
renderFileList();

// 点击上传区域触发选择文件
document.getElementById('file-input').addEventListener('click', () => {
    document.getElementById('upload-button').click();
});