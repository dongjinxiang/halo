// API处理模块
const API = {
    // API基础URL，实际使用时替换为真实的服务器地址
    BASE_URL: 'https://dongjinxiang.github.io/halo/api',

    // 保存问卷结果
    async saveUserResult(resultData) {
        try {
            const response = await fetch(`${this.BASE_URL}/survey`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(resultData)
            });

            if (!response.ok) {
                throw new Error('保存失败');
            }

            const data = await response.json();
            return data.id; // 返回服务器生成的ID
        } catch (error) {
            console.error('保存问卷结果失败:', error);
            // 如果API调用失败，回退到本地存储
            return DB.saveUserResult(resultData);
        }
    },

    // 获取所有问卷结果
    async getAllResults() {
        try {
            const response = await fetch(`${this.BASE_URL}/survey`);
            
            if (!response.ok) {
                throw new Error('获取数据失败');
            }

            return await response.json();
        } catch (error) {
            console.error('获取问卷结果失败:', error);
            // 如果API调用失败，回退到本地存储
            return DB.getAllResults();
        }
    },

    // 清除所有数据
    async clearAllData() {
        try {
            const response = await fetch(`${this.BASE_URL}/survey`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('清除数据失败');
            }

            return true;
        } catch (error) {
            console.error('清除数据失败:', error);
            // 如果API调用失败，回退到本地存储
            return DB.clearAllData();
        }
    }
};