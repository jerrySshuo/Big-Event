$(function () {
    let form = layui.form;
    let layer = layui.layer;

    getInfo();
    function getInfo() {
        $.ajax({
            url: '/my/userinfo',
            success: function (res) {
                console.log(res);

                if (res.status !== 0) {
                    return layer.msg('获取用户基本信息失败！');
                }

                //   获取信息成功，把响应回来的数据填充到form中
                // 给表单赋值 语法：form.val('filter', object);
                // userForm 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                form.val('userForm', res.data);
                //   需要注意：给表单赋值，这个是按照name属性来一一对应的
            }
        })
    }

    // 重置功能
    $('#resetBtn').click(function (e) {
        e.preventDefault();
        // 再次发送ajax获取数据，填充到form中
        getInfo();
    })

    // 提交表单数据-修改用户信息
    $('#userForm').submit(function (e) {
        e.preventDefault();

        let data = $(this).serialize();
        console.log(data);

        $.ajax({
            url: '/my/userinfo',
            type: 'POST',
            data,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败！')
                }

                layer.msg('修改用户信息成功！');
                window.parent.getAvatarAndName();
            },
        })
    })

    form.verify({
        // 昵称长度限制
        nickname: function (value, item) {
            console.log(value);
            if (value.length > 6) {
                return '昵称长度在1-6个字符之间';
            }
        }
    })
})

