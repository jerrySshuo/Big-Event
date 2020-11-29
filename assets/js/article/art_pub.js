$(function() {
    let form = layui.form;
    let layer = layui.layer;

    // 发布文章状态
    let state = '';

    // 获取类别
    $.ajax({
        url: '/my/article/cates',
        success: function(res) {
            // console.log(res);

            let htmlStr = "";

            res.data.forEach(item => {
                htmlStr += `
                    <option value="${item.Id}">${item.name}</option>
                `
            })

            // 把option添加到下拉框中
            $('[name=cate_id]').append(htmlStr);

            // 手动渲染下拉框
            form.render();
        }
    })



    // 初始化富文本编辑器
    initEditor()


    // 1. 初始化图片裁剪器
    let $image = $('#image')

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择分页功能，模拟人点击
    $('#chooseBtn').click(function() {
        $('#file').click();
    })

    // 选择好之后更换封面
    $('#file').on('change', function() {
        //  获取用户选择的图片
        let file = this.files[0];
        let newImgURL = URL.createObjectURL(file);

        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    $('#pubBtn').click(function() {
        state = '已发布';
    })

    $('#pubBtn2').click(function() {
        state = '草稿';
    })

    $('#form').on('submit', function(e) {
        e.preventDefault();

        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(blob => {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

                let fd = new FormData(this); // 参数需要form这个DOM对象

                // fd实例可以通过append方法来追加数据
                fd.append('state', state)

                // 收集封面数据
                fd.append('cover_img', blob);

                // fd可以使用forEach来遍历，查看存储form的数据
                fd.forEach(item => { console.log(item) });

                // 后续写ajax发布文章
                pubArt(fd);
            })
    })

    // 发送ajax请求实现发布文章
    function pubArt(fd) {
        $.ajax({
            url: '/my/article/add',
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg("发布文章失败！");
                }

                layer.msg("发布文章成功！")

                // 跳转到文章列表页面
                location.href = '/article/art_list.html';
            }
        })
    }
})