const Koa = require('koa')
const Router = require('koa-router')
const koaBody = require('koa-body') //解析上传文件的插件
const app = new Koa()
const router = new Router();
const static = require('koa-static')
const path = require('path')
const marked = require("marked");
const fs = require('fs')
app.use(static(path.resolve(__dirname, 'static')));

app.use(koaBody({
    multipart: true,
    formidable: {

        keepExtensions: true,
        maxFieldsSize: 20 * 1024 * 1024,
        multipart: true
    }
}))

router.get('/html', ctx => {
    let md = fs.readFileSync('./md_file/README.md')
    // let md = fs.readFileSync('./static/upload/README.md')
    marked.setOptions({
        highlight: function (code, language) {
            const hljs = require('highlightjs');
            const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
            return hljs.highlight(validLanguage, code).value;
        }
    });
    let html = marked(md.toString())
    ctx.body = html
})

router.post('/FileUpload', async ctx => {
    const file = ctx.request.files.file

    const fileReader = fs.createReadStream(file.path);
    const filePath = path.join(__dirname, '/static/upload/');
    const fileResource = filePath + `/${file.name}`;
    const writeStream = fs.createWriteStream(fileResource);
    if (!fs.existsSync(filePath)) {
        fs.mkdir(filePath, (err) => {
            if (err) {
                throw new Error(err);
            } else {
                fileReader.pipe(writeStream);
                ctx.body = {
                    url:   `/${file.name}`,
                    code: 0,
                    message: '上传成功'
                };
            }
        });
    } else {
        fileReader.pipe(writeStream);
        ctx.body = {
            url:   `/${file.name}`,
            code: 0,
            message: '上传成功'
        };
    }

})

app.use(router.routes())

app.use(router.allowedMethods())

app.listen(5000, () => {
    console.log('5000端口')
})
