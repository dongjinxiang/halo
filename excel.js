// Excel导出模块
function exportToExcel(data) {
    // 引入SheetJS库
    const script = document.createElement('script');
    script.src = 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js';
    script.onload = function() {
        // 创建工作簿
        const wb = XLSX.utils.book_new();
        
        // 准备数据
        const excelData = data.map(item => ({
            '提交时间': new Date(item.timestamp).toLocaleString(),
            '昵称': item.userInfo.nickname,
            '性别': item.userInfo.gender === 'male' ? '男' : '女',
            '口味偏好': findOptionById(item.answers[1]),
            '主食偏好': findOptionById(item.answers[2]),
            '肉类偏好': findOptionById(item.answers[3]),
            '烹饪方式': findOptionById(item.answers[4]),
            '用餐场景': findOptionById(item.answers[5]),
            '推荐菜品': item.recommendations.map(dish => dish.name).join(', ')
        }));
        
        // 创建工作表
        const ws = XLSX.utils.json_to_sheet(excelData);
        
        // 将工作表添加到工作簿
        XLSX.utils.book_append_sheet(wb, ws, '问卷调查结果');
        
        // 生成Excel文件并下载
        const fileName = `halo_survey_${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(wb, fileName);
    };
    
    document.head.appendChild(script);
}