const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const app = new Koa()
const router = new Router();
const static = require('koa-static')
const path = require('path')
const marked = require("marked");
const fs = require('fs')

router.get('/uu', ctx => {
    let md = fs.readFileSync('./md_file/README.md')
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
app.use(static(path.resolve(__dirname, 'static')));
app.use(bodyParser())
app.use(router.routes())

app.use(router.allowedMethods())

app.listen(5000, () => {
    console.log('监听5000端口')
})
