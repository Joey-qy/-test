$(function () {
    //1.点击“去注册账号”跳转到注册页面
    $('#link_reg').on('click', function () {
        //点击后让登陆的盒子隐藏，注册的盒子展示
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 2.点击“去登陆”跳转到登陆页面
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })
    // 3.从layui中获取form对象,form和layershi layui里面的两个方法，分别管理表单操作和提示框
    var form = layui.form
    var layer = layui.layer
    // 4.设置校验规则
    form.verify({
        //verfy是layui里面的方法，校验表单的专属方法，有两种方式。
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 第二种方法是写到函数里面，value：表单的值、item：表单的DOM对象
        repwd: function (value, item) {
            // 西安获取密码框里面的值然后进行比较
            var pwd = $('.reg-box [name = password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    //5.监听登陆表单的提交事件[应该先注册]
    // 对表单进行提交，而不是触发那个button按钮事件，所以直接获取表单的id
    $('#form_login').submit(function (e) {
        //阻止点击按钮提交的默认行为
        e.preventDefault()
        //用$.ajax对表单里面的数据进行提交
        $.ajax({
            //在base里面写了ajaxPrefilter，就不用写根目录
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                //将登录成功后获取的token字符串保存到localStorage中
                localStorage.setItem('token', res.token)
                //跳转到后台主页
                location.href = 'index.html'
            }

        })
    })
    //6.监听注册表单的提交事件
    $('#form_reg').submit(function (e) {
        e.preventDefault()
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data, function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录！')
            //直接跳转到登陆界面
            $('#link_login').click()
        })
    })
})

