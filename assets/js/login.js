$(function () {

    // 登录与注册页面切换
    $('#gotoRegi').click(function () {
        $('.regiBox').show();
        $('.loginBox').hide();
    });

    $('#gotoLogin').click(function () {
        $('.regiBox').hide();
        $('.loginBox').show();
    })

    // 从layui中获取到form表单的功能
    let form = layui.form;
    let layer = layui.layer;

    // 表单校验
    form.verify({

        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        // 再次确认密码的校验 需要和密码框的内容保持一致 ==> 函数写法
        repass: function (value) {
            // value：表单的值、item：表单的DOM对象
            // console.log(value);

            let pwd = $('.regiBox input[name=password]').val();

            if (value !== pwd) {
                return '两次输入密码不一致';
            }
        }
    });

    // 注册的ajax代码
    $('#regiForm').on('submit', function (e) {
        e.preventDefault();

        let data = $(this).serialize();

        // 直接发送ajax请求
        $.ajax({
            type: "POST",
            url: "/api/reguser",
            data,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('注册失败' + res.message);
                }

                layer.msg('注册成功！');
                $('#gotoLogin').click();
            }
        })
    })
})