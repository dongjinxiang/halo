// 管理员模块
(function() {
    // DOM元素
    const adminScreen = document.getElementById('admin-screen');
    const adminPassword = document.getElementById('admin-password');
    const adminAuthBtn = document.getElementById('admin-auth-btn');
    const adminBackBtn = document.getElementById('admin-back-btn');
    const adminContent = document.getElementById('admin-content');
    const statsContainer = document.getElementById('stats-container');
    const resultsTableBody = document.querySelector('#results-table tbody');
    const exportDataBtn = document.getElementById('export-data');
    const clearDataBtn = document.getElementById('clear-data');
    
    // 管理员密码
    const ADMIN_PASSWORD = 'halo2023'; // 实际应用中应该使用更安全的认证方式
    
    // 初始化管理员面板
    function initializeAdmin() {
        adminAuthBtn.addEventListener('click', authenticateAdmin);
        adminBackBtn.addEventListener('click', goBackToWelcome);
        exportDataBtn.addEventListener('click', exportData);
        clearDataBtn.addEventListener('click', confirmClearData);
    }
    
    // 验证管理员密码
    function authenticateAdmin() {
        const password = adminPassword.value.trim();
        
        if (password === ADMIN_PASSWORD) {
            adminContent.style.display = 'block';
            adminPassword.value = '';
            loadAdminData();
        } else {
            alert('密码错误，请重试');
        }
    }
    
    // 返回欢迎页面
    function goBackToWelcome() {
        adminScreen.classList.remove('active');
        adminContent.style.display = 'none';
        document.getElementById('welcome-screen').classList.add('active');
    }
    
    // 加载管理员数据
    async function loadAdminData() {
        try {
            const results = await API.getAllResults();
            displayStatistics(results);
            displayResultsTable(results);
        } catch (error) {
            console.error('加载数据失败:', error);
            alert('加载数据失败，请稍后重试');
        }
    }
    
    // 显示统计数据
    function displayStatistics(results) {
        // 计算统计数据
        const stats = {
            totalUsers: results.length,
            genderDistribution: {
                male: 0,
                female: 0
            },
            preferenceStats: {}
        };

        // 统计性别分布和偏好
        results.forEach(result => {
            // 统计性别
            if (result.userInfo.gender === 'male') {
                stats.genderDistribution.male++;
            } else {
                stats.genderDistribution.female++;
            }
            
            // 统计选项分布
            if (result.answers) {
                Object.keys(result.answers).forEach(questionId => {
                    const optionId = result.answers[questionId];
                    
                    if (!stats.preferenceStats[optionId]) {
                        stats.preferenceStats[optionId] = 0;
                    }
                    
                    stats.preferenceStats[optionId]++;
                });
            }
        });
        statsContainer.innerHTML = '';
        
        // 创建总用户数统计
        const totalUsers = document.createElement('div');
        totalUsers.classList.add('stat-item');
        totalUsers.innerHTML = `<strong>总参与人数:</strong> ${stats.totalUsers}人`;
        statsContainer.appendChild(totalUsers);
        
        // 创建性别分布统计
        const genderDist = document.createElement('div');
        genderDist.classList.add('stat-item');
        genderDist.innerHTML = `<strong>性别分布:</strong> 男性: ${stats.genderDistribution.male}人 (${calculatePercentage(stats.genderDistribution.male, stats.totalUsers)}%), 
                               女性: ${stats.genderDistribution.female}人 (${calculatePercentage(stats.genderDistribution.female, stats.totalUsers)}%)`;
        statsContainer.appendChild(genderDist);
        
        // 创建偏好统计
        if (Object.keys(stats.preferenceStats).length > 0) {
            const topPreferences = getTopPreferences(stats.preferenceStats, 5);
            const prefStat = document.createElement('div');
            prefStat.classList.add('stat-item');
            
            let prefHtml = '<strong>热门偏好:</strong> ';
            topPreferences.forEach((pref, index) => {
                const optionText = findOptionById(pref.id);
                prefHtml += `${optionText}: ${pref.count}次`;
                if (index < topPreferences.length - 1) {
                    prefHtml += ', ';
                }
            });
            
            prefStat.innerHTML = prefHtml;
            statsContainer.appendChild(prefStat);
        }
    }
    
    // 计算百分比
    function calculatePercentage(value, total) {
        if (total === 0) return 0;
        return Math.round((value / total) * 100);
    }
    
    // 获取最热门的偏好选项
    function getTopPreferences(prefStats, count) {
        const prefArray = Object.keys(prefStats).map(id => ({
            id: id,
            count: prefStats[id]
        }));
        
        return prefArray.sort((a, b) => b.count - a.count).slice(0, count);
    }
    
    // 查找选项名称
    function findOptionById(id) {
        for (const question of questions) {
            for (const option of question.options) {
                if (option.id === id) {
                    return option.text;
                }
            }
        }
        return id;
    }
    
    // 显示结果表格
    function displayResultsTable(results) {
        resultsTableBody.innerHTML = '';
        
        results.forEach(result => {
            const row = document.createElement('tr');
            
            // ID单元格
            const idCell = document.createElement('td');
            idCell.textContent = result.id.split('_')[0]; // 只显示时间戳部分
            row.appendChild(idCell);
            
            // 用户名单元格
            const nameCell = document.createElement('td');
            nameCell.textContent = result.userInfo.nickname;
            row.appendChild(nameCell);
            
            // 性别单元格
            const genderCell = document.createElement('td');
            genderCell.textContent = result.userInfo.gender === 'male' ? '男' : '女';
            row.appendChild(genderCell);
            
            // 时间单元格
            const timeCell = document.createElement('td');
            timeCell.textContent = formatDate(new Date(result.timestamp));
            row.appendChild(timeCell);
            
            // 推荐菜品单元格
            const dishCell = document.createElement('td');
            if (result.recommendations && result.recommendations.length > 0) {
                result.recommendations.forEach((dish, index) => {
                    dishCell.textContent += dish.name;
                    if (index < result.recommendations.length - 1) {
                        dishCell.textContent += ', ';
                    }
                });
            } else {
                dishCell.textContent = '无数据';
            }
            row.appendChild(dishCell);
            
            resultsTableBody.appendChild(row);
        });
    }
    
    // 格式化日期
    function formatDate(date) {
        return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
    }
    
    // 填充零
    function padZero(num) {
        return num < 10 ? '0' + num : num;
    }
    
    // 导出数据
    function exportData() {
        const results = DB.getAllResults();
        // 导出为Excel格式
        exportToExcel(results);
    }
    
    // 确认清除数据
    async function confirmClearData() {
        if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
            try {
                await API.clearAllData();
                await loadAdminData(); // 重新加载空数据
                alert('所有数据已清除');
            } catch (error) {
                console.error('清除数据失败:', error);
                alert('清除数据失败，请稍后重试');
            }
        }
    }
    
    // 初始化
    document.addEventListener('DOMContentLoaded', initializeAdmin);
})();