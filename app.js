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

    }
}))


router.post('/filelist', ctx => {
    const jsonbuffer = fs.readFileSync('./file_json/index.json')
    const jsonArr= JSON.parse(jsonbuffer)

    ctx.body = JSON.stringify(jsonArr)
})


router.get('/html', ctx => {
    let md = fs.readFileSync('./file_store/README.md')
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
    const { name, type, path: _path } = ctx.request.files.file
    const readStream = fs.createReadStream(_path);
    const pathName = path.resolve(__dirname, "file_store", name);
    const writeStream = fs.createWriteStream(pathName);
    readStream.pipe(writeStream);
    const jsonbufffer = fs.readFileSync(path.resolve(__dirname, 'file_json/index.json'))
    const jsonArr = JSON.parse(jsonbufffer)
    const o = {
        name: name,
        path: pathName,
        id: (Date.now() + Math.random() * 100) + ''
    }
    jsonArr.push(o)
    const stringJson = JSON.stringify(jsonArr)
    const jsonfile = fs.writeFileSync(path.resolve(__dirname, 'file_json/index.json'), stringJson)
    // console.log(jsonbufffer)
    // console.log(JSON.parse(jsonbufffer))
    ctx.body = stringJson
})

app.use(router.routes())

app.use(router.allowedMethods())

app.listen(4000, () => {
    console.log('5000端口')
})
