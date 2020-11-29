$(function() {

    let layer = layui.layer;
    let form = layui.form;

    getCate();

    function getCate() {
        $.ajax({
            url: "/my/article/cates",
            success: function(res) {
                let htmlStr = template('trTpl', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    // 添加类别按钮
    let index; // index变量保存弹出层的索引
    $("#btnAdd").click(function() {
        index = layer.open({
            type: 1,
            title: '添加文章分类',
            area: '500px',
            // 内容 ==> 来源于addForm这个script标签中的内容，注意这里使用的是html方法() ==> 可以获取到标签
            content: $('#addForm').html(),
        })
    })

    // 确认添加
    // 以下写法错误，原因在于form表单结构是动态创建（点击按钮弹出层弹出的form表单结构）==> 需要使用事件委托来注册
    /* $("form").on("submit", function (e) {
      e.preventDefault();
      alert(1);
    }); */

    $('body').on('submit', '#form', function(e) {
        e.preventDefault();
        let data = $(this).serialize();

        $.ajax({
            url: "/my/article/addcates",
            type: "POST",
            data,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！')
                }

                layer.msg('新增文章分类成功！')

                // 1. 弹出层关闭掉
                layer.close(index);

                // 2. 重新获取所有文章分类
                getCate();
            }
        })
    })

    // 编辑按钮的点击功能
    let editIndex; // editIndex存编辑的弹出层的索引
    $('tbody').on('click', '.editBtn', function() {
        // 获取当前编辑按钮的存储的data-id自定义属性的值
        let id = $(this).attr("data-id");
        // console.log(id);

        editIndex = layer.open({
            type: 1,
            title: '修改文章分类',
            area: '500px',
            // 内容 ==> 来源于editFormTpl这个script标签中的内容，注意这里使用的是html方法() ==> 可以获取到标签
            content: $('#editFormTpl').html(),
        })

        // 发送请求，获取到form里面的数据
        $.ajax({
            url: "/my/article/cates/" + id,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败!')
                }

                form.val('editForm', res.data);
            }
        })
    })

    // 编辑的form表单确认修改
    $('body').on("submit", '#editForm', function(e) {

        e.preventDefault();

        // 发送ajax，提交到服务器上
        // 数据的获取
        let data = $(this).serialize();

        $.ajax({
            url: '/my/article/updatecate',
            type: 'POST',
            data,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败！')
                }

                layer.msg('更新分类信息成功！');

                // 1. 弹出层关闭掉
                layer.close(editIndex);

                // 2. 重新获取所有文章分类
                getCate();
            }
        })
    })

    // 删除按钮
    $('tbody').on('click', '.delBtn', function() {
        // 1.获取储存的id
        let id = $(this).attr('data-id');

        // 2.弹框询问是否删除
        layer.confirm('是否删除？', { icon: 3, title: '提示' }, function(index) {
            // 3.发送请求
            $.ajax({
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    }

                    layer.msg('删除文章分类成功！')

                    getCate();
                }
            })

            layer.close(index);
        });
    })
})