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
    startTime = passTime = 0,
    t;

function init() {
    let data = loadData('studyTime')
    if (loadData('studyStyle')) document.body.classList.add('beautiful');
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
        // 判断是否直接开始计时
        else if (data.status) begin();
        // 都没问题则渲染时间
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
    }
    if (second >= 0) document.querySelector('.second').innerHTML = nol(second);
}

// 菜单显隐
function toggleMenu() {
    document.querySelector('menu .btns .hidebtns').classList.toggle('open');
}

function changeBg() {
    document.body.classList.toggle('beautiful');
    if (loadData('studyStyle')) localStorage.removeItem('studyStyle')
    else localStorage.setItem('studyStyle', 1)
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
        <p style="font-size:14px;line-height: 1.5;text-align:left;margin-bottom:5px;"><b>1.</b>开始之后可以关闭网站，仍会进行计时。</p>
        <p style="font-size:14px;line-height: 1.5;text-align:left;margin-bottom:5px;"><b>2.</b>样式目前有两种：默认/图片，更多待开发。</p>
        <p style="font-size:14px;line-height: 1.5;text-align:left;margin-bottom:5px;"><b>3.</b>时间回溯：如果你中途有一段时间没学习但是忘了暂停，可使用此功能减去那一段时间。</p>
        <p style="font-size:14px;line-height: 1.5;text-align:left;margin-bottom:5px;"><b>4.</b>全屏和旋转：顾名思义。开始计时后可以全屏 + 旋转，方便随时查看。<br>（有的手机可能开启了自动旋转，如已开启且生效就无需再点击旋转按钮）</p>
        <p style="font-size:14px;line-height: 1.5;text-align:left;margin-bottom:5px;"><b>5.</b>时间问题先更新这么多，目前来看已经够用，以后有空了慢慢更新。</p>
        <p style="font-size:14px;line-height: 1.5;text-align:left;margin-bottom:5px;"><b>6.</b>问题反馈(QQ)：<a href="javascript:;" style="color:#2196f3" onclick="window.open('tencent://message/?uin=990320751&Menu=yes')
        ">990320751</a></p>
        `,
        'okBtn': '关闭',
        // 'contentColor': 'red',
        'onConfirm': function() {
            // console.log("回调触发后隐藏提示框");
            // alert("回调触发后隐藏提示框");
        }
    });
}

// 时间回溯
function subTime() {
    PostbirdAlertBox.prompt({
        'title': '<h4 style="margin-bottom:5px;">时光回溯</h4>若您在计时中做了其他的事情，可以使用此功能进行时间回溯。<br> <span style="color:grey;">如：中途玩了20分钟，输入20并提交计时将会减去20分钟。</span> <br>请输入您想回溯的时间（单位：分钟）',
        'okBtn': '确认',
        onConfirm: function(data) {
            if ((startTime + (Number(data) * 60000)) > new Date().getTime()) {
                alert('回溯时间超出计时时间')
                return
            }
            pause()
            startTime += (Number(data) * 60000)
            begin()
        }
    });
}

function rotate() {
    let box = document.querySelector('#timeBox')
    box.classList.toggle('w')
    box.classList.toggle('h')
}