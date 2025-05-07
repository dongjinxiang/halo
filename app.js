// DOM元素
const welcomeScreen = document.getElementById('welcome-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionTitle = document.getElementById('question-title');
const optionsContainer = document.getElementById('options-container');
const progressBar = document.getElementById('progress');
const recommendationsContainer = document.getElementById('recommendations');
const nicknameInput = document.getElementById('nickname');
const resultGreeting = document.getElementById('result-greeting');
const adminLogin = document.getElementById('admin-login');
const adminScreen = document.getElementById('admin-screen');

// 问卷状态
let currentQuestionIndex = 0;
let userAnswers = {};
let userInfo = {
    nickname: '',
    gender: 'male'
};
let currentResultId = null;
let recommendedDishes = [];

// 初始化事件监听
function initializeEventListeners() {
    startBtn.addEventListener('click', validateAndStartQuiz);
    prevBtn.addEventListener('click', goToPreviousQuestion);
    nextBtn.addEventListener('click', goToNextQuestion);
    restartBtn.addEventListener('click', restartQuiz);
    adminLogin.addEventListener('click', showAdminLogin);
    
    // 性别选择监听
    document.querySelectorAll('input[name="gender"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            userInfo.gender = e.target.value;
        });
    });
}

// 显示管理员登录
function showAdminLogin(e) {
    e.preventDefault();
    welcomeScreen.classList.remove('active');
    adminScreen.classList.add('active');
}

// 验证用户信息并开始问卷
function validateAndStartQuiz() {
    const nickname = nicknameInput.value.trim();
    if (!nickname) {
        alert('请输入您的昵称');
        return;
    }
    
    // 获取选中的性别
    userInfo.nickname = nickname;
    userInfo.gender = document.querySelector('input[name="gender"]:checked').value;
    
    startQuiz();
}

// 开始问卷
function startQuiz() {
    welcomeScreen.classList.remove('active');
    questionScreen.classList.add('active');
    currentQuestionIndex = 0;
    userAnswers = {};
    loadQuestion(currentQuestionIndex);
}

// 加载当前问题
function loadQuestion(index) {
    const question = questions[index];
    questionTitle.textContent = question.title;
    optionsContainer.innerHTML = '';
    
    // 更新进度条
    const progress = ((index + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    
    // 添加选项
    question.options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.dataset.id = option.id;
        
        // 如果用户已选择此选项，则标记为选中
        if (userAnswers[question.id] === option.id) {
            optionElement.classList.add('selected');
        }
        
        optionElement.textContent = option.text;
        optionElement.addEventListener('click', () => selectOption(question.id, option.id, optionElement));
        optionsContainer.appendChild(optionElement);
    });
    
    // 更新导航按钮状态
    prevBtn.style.display = index === 0 ? 'none' : 'block';
    nextBtn.textContent = index === questions.length - 1 ? '查看结果' : '下一题';
}

// 选择选项
function selectOption(questionId, optionId, element) {
    // 移除之前的选中状态
    const options = optionsContainer.querySelectorAll('.option');
    options.forEach(opt => opt.classList.remove('selected'));
    
    // 添加新的选中状态
    element.classList.add('selected');
    
    // 记录用户选择
    userAnswers[questionId] = optionId;
    
    // 选择选项后短暂延迟，然后自动进入下一题或显示结果
    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            loadQuestion(currentQuestionIndex);
        } else {
            showResults();
        }
    }, 300); // 300毫秒延迟，提供视觉反馈
}

// 前往上一题
function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion(currentQuestionIndex);
    }
}

// 前往下一题或显示结果
function goToNextQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    
    // 确保用户已经选择了一个选项
    if (!userAnswers[currentQuestion.id]) {
        alert('请选择一个选项继续');
        return;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
    } else {
        showResults();
    }
}

// 显示结果
function showResults() {
    questionScreen.classList.remove('active');
    resultScreen.classList.add('active');
    
    // 添加个性化问候
    const greetingText = `${userInfo.gender === 'male' ? '尊敬的' : '亲爱的'} ${userInfo.nickname} ${userInfo.gender === 'male' ? '先生' : '女士'}，根据您的口味偏好，我们为您推荐以下菜品：`;
    resultGreeting.textContent = greetingText;
    
    // 计算推荐菜品
    recommendedDishes = calculateRecommendations();
    displayRecommendations(recommendedDishes);
    
    // 保存用户数据到数据库
    saveResultToDatabase();
}

// 保存结果到数据库
function saveResultToDatabase() {
    const resultData = {
        userInfo: { ...userInfo },
        answers: { ...userAnswers },
        recommendations: recommendedDishes.map(dish => ({
            id: dish.id,
            name: dish.name,
            matchScore: dish.matchScore
        }))
    };
    
    // 使用数据库模块保存数据
    currentResultId = DB.saveUserResult(resultData);
    console.log('数据已保存，ID:', currentResultId);
}

// 计算推荐菜品
function calculateRecommendations() {
    // 从用户答案创建用户喜好配置文件
    const userPreferences = {};
    
    // 遍历每个问题的答案
    Object.keys(userAnswers).forEach(questionId => {
        const optionId = userAnswers[questionId];
        userPreferences[optionId] = 1; // 将用户选择的选项值设为1
    });
    
    // 为每个菜品计算匹配分数
    const scoredItems = menuItems.map(item => {
        let matchScore = 0;
        
        // 根据用户选择的选项分数来增加匹配度
        Object.keys(userPreferences).forEach(pref => {
            if (item.score[pref]) {
                matchScore += item.score[pref];
            }
        });
        
        // 添加与用户标签匹配的额外分数
        item.tags.forEach(tag => {
            if (userPreferences[tag]) {
                matchScore += 3; // 额外加分
            }
        });
        
        return {
            ...item,
            matchScore
        };
    });
    
    // 按匹配分数降序排序并返回前3个
    return scoredItems.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
}

// 显示推荐菜品
function displayRecommendations(recommendations) {
    recommendationsContainer.innerHTML = '';
    
    recommendations.forEach(dish => {
        const dishElement = document.createElement('div');
        dishElement.classList.add('dish-item');
        
        const nameElement = document.createElement('div');
        nameElement.classList.add('dish-name');
        nameElement.textContent = dish.name;
        
        const descElement = document.createElement('div');
        descElement.classList.add('dish-desc');
        descElement.textContent = dish.description;
        
        const tagsElement = document.createElement('div');
        tagsElement.classList.add('tags');
        
        // 添加标签
        dish.tags.forEach(tagId => {
            const foundOption = findOptionById(tagId);
            if (foundOption) {
                const tagElement = document.createElement('span');
                tagElement.classList.add('tag');
                tagElement.textContent = foundOption;
                tagsElement.appendChild(tagElement);
            }
        });
        
        dishElement.appendChild(nameElement);
        dishElement.appendChild(descElement);
        dishElement.appendChild(tagsElement);
        
        recommendationsContainer.appendChild(dishElement);
    });
}

// 根据ID查找选项文本
function findOptionById(id) {
    for (const question of questions) {
        for (const option of question.options) {
            if (option.id === id) {
                return option.text;
            }
        }
    }
    return id; // 如果找不到，返回ID本身
}

// 重新开始问卷
function restartQuiz() {
    resultScreen.classList.remove('active');
    welcomeScreen.classList.add('active');
    
    // 重置表单
    nicknameInput.value = userInfo.nickname;
    document.querySelector(`input[name="gender"][value="${userInfo.gender}"]`).checked = true;
}

// 初始化应用
document.addEventListener('DOMContentLoaded', initializeEventListeners); 