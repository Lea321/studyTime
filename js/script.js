window.addEventListener('DOMContentLoaded', function() {
    init();
    setDate();
})

window.onresize = () => {
    let fullBtn = document.querySelector('#fullBtn')
    if (isFull()) {
        fullBtn.children[0].classList.remove('fa-expand')
        fullBtn.children[0].classList.add('fa-compress')
    } else {
        fullBtn.children[0].classList.add('fa-expand')
        fullBtn.children[0].classList.remove('fa-compress')
    }
}

window.addEventListener('keyup', (e) => {
    if (e.code == 'F11' || e.key == 'F11') {
        fullBtn.children[0].classList.remove('fa-expand')
        fullBtn.children[0].classList.add('fa-compress')
    }
})


var exports = {},
    week = { 0: '星期日', 1: '星期一', 2: '星期二', 3: '星期三', 4: '星期四', 5: '星期五', 6: '星期六' },
    textls = ['时间不在于你拥有多少，而在于你怎么使用。',
        '书山有路勤为径，学海无涯苦作舟。',
        '天才就是百分之九十九的汗水加百分之一的灵感。',
        '凡事勤则易，凡事惰则难。',
        '只要春天还在，我就不会悲哀，纵使黑夜吞噬了一切，太阳还可以重新回来。',
        '前行，不要停下。', '为你指明路的，不是停止，而是前进。',
        '我不去想是否能够成功，既然选择了远方，便只顾风雨兼程。',
        '果能日日留心，则一日有一日之长进；事事留心，则一事有一事之长进。'
    ],
    startTime = passTime = 0,
    t;

function init() {
    let data = loadData('studyTime')
    if (loadData('studyStyle')) document.querySelector('footer').classList.add('footerHide');
    let text = localStorage.getItem('studyText')
    if (text) document.querySelector('.bottom').innerHTML = text
    else randomText();
    if (data) {
        // 判断是否是今天
        if (new Date(data.start).toDateString() != new Date().toDateString()) {
            localStorage.removeItem('studyTime');
            PostbirdAlertBox.alert({
                'title': '你好，自律的人',
                'content': '又是新的一天，快开始学习吧！',
                'okBtn': '关闭'
            });
        }
        // 判断是否继续计时
        else if (data.status) begin();
        // 不继续计时则渲染时间
        else timer(new Date().getTime() - data.pass);
    }
}

// 设置日期
function setDate() {
    var d = new Date();
    let y = d.getFullYear(),
        m = d.getMonth() + 1,
        day = d.getDate(),
        w = week[d.getDay()];
    document.querySelector('.today').innerHTML = `${y}年${m}月${day}日 ${w}`;
}

// 存储时间数据
function saveTime(status) {
    localStorage.setItem('studyTime', JSON.stringify({ 'start': startTime, 'pass': passTime, 'status': status }));
}

// 获取数据
function loadData(name) {
    return JSON.parse(localStorage.getItem(name));
}

// 时间渲染
function timer(s) {
    var nol = function(h) { return h > 9 ? h : '0' + h; };
    second = Math.floor((new Date().getTime() - s) / 1000);
    if (second >= 3600) {
        document.querySelector('.hour').innerHTML = nol(parseInt(second / 3600));
        second %= 3600;
    }
    if (second >= 60) {
        document.querySelector('.minute').innerHTML = nol(parseInt(second / 60));
        second %= 60;
    } else { document.querySelector('.minute').innerHTML = '00'; }
    if (second >= 0) document.querySelector('.second').innerHTML = nol(second);
}

// 菜单显隐
function toggleMenu() {
    document.querySelector('menu .btns .hidebtns').classList.toggle('open');
}

function hideFooter() {
    document.querySelector('footer').classList.toggle('footerHide');
    if (loadData('studyStyle')) {
        localStorage.removeItem('studyStyle')
    } else {
        localStorage.setItem('studyStyle', 1)
    }
}

// 开始计时
function begin() {
    let data = loadData('studyTime')
    if (data) {
        // 如果passTime不为空则重新计算startTime
        if (data.pass) {
            startTime = new Date().getTime() - data.pass;
            passTime = 0
            saveTime(1);
        } else startTime = data.start;
    } else {
        startTime = new Date().getTime();
        saveTime(1);
    }

    // 开始计时
    timer(startTime);
    t = setInterval(() => { timer(startTime) }, 1000);
    document.querySelector('.start').style.display = 'none';
    document.querySelector('.pause').style.display = 'flex';
}

// 暂停计时
function pause() {
    clearInterval(t)
    passTime = new Date().getTime() - startTime;
    saveTime(0);
    document.querySelector('.start').style.display = 'flex';
    document.querySelector('.pause').style.display = 'none';
}

// 解答
function question() {
    PostbirdAlertBox.alert({
        'title': '问题解答',
        'content': `
        <p style="font-size:14px;line-height: 1.5;text-align:left;margin-bottom:5px;"><b>1. </b>开始之后可以不暂停关闭网站，将会继续为您计时。</p>
        <p style="font-size:14px;line-height: 1.5;text-align:left;margin-bottom:5px;"><b>2. </b>时间回溯：如果你中途有一段时间没有学习但是忘了暂停，可使用此功能减去那一段时间。</p>
        <p style="font-size:14px;line-height: 1.5;text-align:left;margin-bottom:5px;"><b>3. </b>全屏和旋转：顾名思义。开始计时后可以全屏 + 旋转，方便随时查看。<br>（有的手机可能开启了自动旋转，如已开启且生效就无需再点击旋转按钮）</p>
        <p style="font-size:14px;line-height: 1.5;text-align:left;margin-bottom:5px;"><b>4. </b>时间下面的文字点击可编辑，回车进行确认。不编辑则默认显示随机励志文本。</p>
        <p style="font-size:14px;line-height: 1.5;text-align:left;margin-bottom:5px;"><b>5. </b>时间问题先更新这么多，目前来看已经够用，以后有空了慢慢更新。</p>
        <p style="font-size:14px;line-height: 1.5;text-align:left;margin-bottom:5px;"><b>6. </b>本站由<a href="https://vercel.com/"> Vercel </a> 提供托管服务</p>
        <p style="font-size:14px;line-height: 1.5;text-align:left;margin-bottom:5px;"><b>7. </b>问题反馈（Q/V同号）：<span style="color:#2196f3">990320751</span></p>
        <div style="display: flex;align-items: center;justify-content: space-between;"><button id="hideFooterBtn" onclick="hideFooter()">显/隐版权信息</button><button id="cleerData" onclick="clearData()">清除本地数据</button></div>
        `,
        'okBtn': '关闭',
    });
}

// 时间回溯
function subTime() {
    PostbirdAlertBox.prompt({
        'title': '<h4 style="margin-bottom:5px;">时间回溯</h4>若您在计时中做了其他的事情，可以使用此功能进行时间回溯。<br> <span style="color:grey;">如：中途玩了20分钟，输入20并提交计时将会减去20分钟。</span> <br>请输入您想回溯的时间（单位：分钟）',
        'okBtn': '确认',
        onConfirm: function(data) {
            if (!data) {
                alert('回溯时间不能为空！')
                return
            }
            let st = loadData('studyTime')
            if (!st) {
                alert('还未开始计时，无法回溯！')
                return
            }
            if (((st.start + (Number(data) * 60000)) > new Date().getTime()) || st.pass && st.pass < (Number(data) * 60000)) {
                alert('回溯失败，回溯时间超出已计时时间')
                return
            }
            if (confirm("确认回溯吗？") == true) {
                if (st.status) {
                    startTime = st.start + (Number(data) * 60000)
                    pause()
                    begin()
                } else {
                    passTime = st.pass - (Number(data) * 60000)
                    startTime = new Date().getTime() - passTime
                    pause()
                    timer(startTime);
                }
            }
        }
    });
}

// 随机文本
function randomText() {
    document.querySelector('.bottom').innerHTML = textls[Math.floor(Math.random() * textls.length)]
}

// 改变文本
function changeText() {
    PostbirdAlertBox.prompt({
        'title': '<h4 style="margin-bottom:5px;">更改文本</h4>请输入一段文字替换此区域内容，清除文本则恢复随机显示。',
        'okBtn': '确认',
        onConfirm: function(data) {
            if (data) {
                localStorage.setItem('studyText', data)
                document.querySelector('.bottom').innerHTML = data
            } else {
                localStorage.removeItem('studyText')
                randomText()
            }
        }
    });
    let text = localStorage.getItem('studyText')
    if (text) document.querySelector('.postbird-box-text input').value = text
}

// 清除数据
function clearData() {
    if (confirm("确认清除本地数据吗？\n包括计时时间、设置的文本等。") == true) {
        localStorage.removeItem('studyStyle')
        localStorage.removeItem('studyText')
        localStorage.removeItem('studyTime')
        alert("已清除!");
        window.location.reload()
    }
}