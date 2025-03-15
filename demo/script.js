// DOM 元素
const commentsInput = document.getElementById('comments-input');
const clearBtn = document.getElementById('clear-btn');
const analyzeBtn = document.getElementById('analyze-btn');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const summaryContent = document.getElementById('summary-content');
const representativesContent = document.getElementById('representatives-content');
const shareModal = document.getElementById('share-modal');
const shareContent = document.getElementById('share-content');
const closeModal = document.querySelector('.close');
const shareSummaryBtn = document.getElementById('share-summary');
const shareRepresentativesBtn = document.getElementById('share-representatives');
const copyLinkBtn = document.getElementById('copy-link');

// 按钮事件监听
clearBtn.addEventListener('click', clearComments);
analyzeBtn.addEventListener('click', analyzeComments);
shareSummaryBtn.addEventListener('click', () => showShareModal('summary'));
shareRepresentativesBtn.addEventListener('click', () => showShareModal('representatives'));
closeModal.addEventListener('click', hideShareModal);
copyLinkBtn.addEventListener('click', copyShareContent);

// 点击模态框外部关闭模态框
window.addEventListener('click', (event) => {
    if (event.target === shareModal) {
        hideShareModal();
    }
});

// 清空评论
function clearComments() {
    commentsInput.value = '';
    results.style.display = 'none';
}

// 分析评论
function analyzeComments() {
    const comments = commentsInput.value.trim();
    if (comments === '') {
        alert('请先粘贴评论内容！');
        return;
    }

    // 显示加载动画
    loading.style.display = 'flex';
    results.style.display = 'none';

    // 模拟AI处理时间
    setTimeout(() => {
        // 隐藏加载动画
        loading.style.display = 'none';
        
        // 生成分析结果
        generateResults(comments);
        
        // 显示结果
        results.style.display = 'flex';
        
        // 滚动到结果区域
        results.scrollIntoView({ behavior: 'smooth' });
    }, 2000);
}

// 生成分析结果
function generateResults(comments) {
    // 这里只是模拟AI生成的结果
    // 在实际应用中，这里会调用后端API
    
    // 基于评论内容模拟生成不同的结果
    let summary = '';
    let representatives = [];

    // 简单分析评论内容，基于关键词生成不同的结果
    const commentsLower = comments.toLowerCase();

    // 模拟一句话总结生成
    if (commentsLower.includes('好看') || commentsLower.includes('漂亮')) {
        summary = '一众颜值爱好者组成的追星团，疯狂吹捧博主神仙颜值的同时，顺带打探美妆和穿搭秘籍！🌟';
    } else if (commentsLower.includes('哪里买') || commentsLower.includes('链接') || commentsLower.includes('购买')) {
        summary = '一场由种草引发的"剁手"潮！大家都想知道同款在哪买，钱包已经准备好了！💸';
    } else if (commentsLower.includes('拍照') || commentsLower.includes('姿势') || commentsLower.includes('角度')) {
        summary = '摄影技术探讨大会，人人都想知道博主是怎么拍出这种"欺骗性"照片的！📷';
    } else if (commentsLower.includes('笑') || commentsLower.includes('哈哈') || commentsLower.includes('搞笑')) {
        summary = '一群被逗乐的网友，笑得前仰后合还不忘夸博主是段子手本手！🤣';
    } else {
        summary = '一场评论区的狂欢派对，大家热情高涨地讨论、提问和互动，好不热闹！🎉';
    }

    // 模拟生成人民代表
    if (commentsLower.includes('好看') || commentsLower.includes('漂亮')) {
        representatives = [
            {
                name: '颜值鉴赏家 王美丽',
                icon: '👩‍🎨',
                comment: '博主这颜值真的绝了！这是我看过的小红书最高颜值top3，不接受反驳！想请问一下用的什么粉底液呀？'
            },
            {
                name: '穿搭研究员 张时尚',
                icon: '👔',
                comment: '这身搭配也太绝了吧！求博主分享一下上衣的链接，已经被种草了，钱包准备好了！'
            },
            {
                name: '理性评价师 李客观',
                icon: '🧐',
                comment: '确实很好看，但我觉得如果第三张角度再调整一下会更好。不过还是给博主点赞，期待更多美照！'
            }
        ];
    } else if (commentsLower.includes('哪里买') || commentsLower.includes('链接')) {
        representatives = [
            {
                name: '剁手达人 刘败家',
                icon: '💳',
                comment: '博主快给链接！我要把这套都买下来！这也太适合我的风格了，看到就是命中注定！'
            },
            {
                name: '精打细算 赵省钱',
                icon: '🧮',
                comment: '请问这个价格是多少呀？有没有平替推荐？学生党预算有限...'
            },
            {
                name: '质量鉴定师 钱实用',
                icon: '🔍',
                comment: '这个质量怎么样啊？我之前买过类似的，用了两周就坏了，希望博主能给个中肯评价～'
            }
        ];
    } else if (commentsLower.includes('拍照') || commentsLower.includes('姿势')) {
        representatives = [
            {
                name: '摄影爱好者 孙构图',
                icon: '📸',
                comment: '博主这个角度太绝了，请问是用什么相机拍的？后期有做什么调整吗？'
            },
            {
                name: '修图大师 周P图',
                icon: '🖼️',
                comment: '这个滤镜我太爱了！求博主分享一下修图思路和使用的软件，太赞了！'
            },
            {
                name: '摆拍学徒 吴姿势',
                icon: '🤳',
                comment: '请问博主第三张是怎么摆的pose呀？我试了好多次都拍不出这种感觉，有什么技巧吗？'
            }
        ];
    } else {
        representatives = [
            {
                name: '热情粉丝 陈追星',
                icon: '⭐',
                comment: '博主的内容真的太棒了！我每天都在刷你的帖子，简直是我的小红书启动页！'
            },
            {
                name: '挑剔评论家 徐批评',
                icon: '🔮',
                comment: '内容还行，但是感觉和上一篇重复了。希望博主能有更多创新，我看好你哦！'
            },
            {
                name: '路过吃瓜 林围观',
                icon: '🍉',
                comment: '不知道为什么这个帖子会推送给我，但看完觉得挺有意思的，已关注博主～'
            },
            {
                name: '专业讨论者 马专家',
                icon: '👨‍🏫',
                comment: '从专业角度来看，博主分享的内容有一定参考价值。建议可以再深入讲解一下原理部分。'
            }
        ];
    }

    // 更新内容
    summaryContent.innerHTML = `<p>${summary}</p>`;

    representativesContent.innerHTML = '';
    representatives.forEach(rep => {
        representativesContent.innerHTML += `
        <div class="representative-card">
            <h3>${rep.icon} ${rep.name}</h3>
            <p>${rep.comment}</p>
        </div>
        `;
    });
}

// 显示分享模态框
function showShareModal(type) {
    const content = type === 'summary' ? 
        summaryContent.innerHTML : 
        representativesContent.innerHTML;
    
    const title = type === 'summary' ? 
        '【评论说了啥】一句话总结' : 
        '【评论说了啥】评论人民代表制';
    
    shareContent.innerHTML = `
        <h3>${title}</h3>
        <div>${content}</div>
        <p style="margin-top: 10px; font-size: 0.9rem; color: #777;">- 来自"评论说了啥？"</p>
    `;
    
    shareModal.style.display = 'block';
}

// 隐藏分享模态框
function hideShareModal() {
    shareModal.style.display = 'none';
}

// 复制分享内容
function copyShareContent() {
    // 创建一个临时元素用于选择和复制
    const tempElement = document.createElement('div');
    tempElement.innerHTML = shareContent.innerHTML;
    
    // 去除HTML标签，只保留文本
    const textToCopy = tempElement.textContent || tempElement.innerText;
    
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            copyLinkBtn.textContent = '✓ 已复制';
            setTimeout(() => {
                copyLinkBtn.innerHTML = '<i class="fas fa-copy"></i> 复制文本';
            }, 2000);
        })
        .catch(err => {
            alert('复制失败，请手动复制');
            console.error('复制失败:', err);
        });
}

// 添加一些初始评论示例
commentsInput.value = `@红星闪闪: 博主这也太好看了吧！请问用的什么口红色号？
@时尚达人: 第三张真的绝了，请问拍照姿势怎么摆的呀？
@买买买: 衣服链接求分享！
@修图小能手: 这个滤镜感觉好特别，是用什么软件修的呀？
@颜值粉: 这颜值我能舔屏三天！绝绝子！
@实用党: 衣服好看是好看，但是实用吗？适合日常穿吗？
@好奇宝宝: 博主是在哪里拍的呀？背景好好看！
@挑剔的我: 感觉博主上一条发的裙子更好看一些，这个颜色不太衬肤色。
@理性粉丝: 真的很漂亮，博主的气质把衣服都提升了一个档次！`; 