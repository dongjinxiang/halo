// 数据库管理模块 - 使用localStorage作为简易数据库
const DB = {
    // 存储用户信息和问卷结果
    saveUserResult: function(userData) {
        // 生成唯一ID
        const resultId = new Date().getTime() + '_' + Math.random().toString(36).substring(2, 9);
        userData.id = resultId;
        userData.timestamp = new Date().toISOString();
        
        // 获取现有数据
        let results = this.getAllResults();
        
        // 添加新数据
        results.push(userData);
        
        // 保存到localStorage
        localStorage.setItem('haloSurveyResults', JSON.stringify(results));
        
        return resultId;
    },
    
    // 获取所有问卷结果
    getAllResults: function() {
        const data = localStorage.getItem('haloSurveyResults');
        return data ? JSON.parse(data) : [];
    },
    
    // 获取特定用户的问卷结果
    getResultById: function(id) {
        const results = this.getAllResults();
        return results.find(result => result.id === id);
    },
    
    // 获取结果统计数据
    getStatistics: function() {
        const results = this.getAllResults();
        const stats = {
            totalUsers: results.length,
            genderDistribution: {
                male: 0,
                female: 0
            },
            preferenceStats: {}
        };
        
        // 统计性别分布
        results.forEach(result => {
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
        
        return stats;
    },
    
    // 清除所有数据 (仅供管理员使用)
    clearAllData: function() {
        localStorage.removeItem('haloSurveyResults');
        return true;
    }
}; 