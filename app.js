const Koa = require('koa');
const Router = require('koa-router');
const joi = require('joi');
const validate = require('koa-joi-validate');
const search = require('./search');



const app = new Koa();
const router = new Router();

app.use(async(ctx, next)=>{
    const start = Date.now();
    await next();
    const ms = Date.now() -start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

app.on('error', err =>{
    console.error('Server Error', err);
});

app.use(async(ctx, next)=>{
    ctx.set('Access-Control-Allow-Origin', '*');
    return next();
});

router.get('/search', validate({
    query:{
        term: joi.string().max(60).required(),
        offset: joi.number().integer().min(0).default(0)
    }
}),
    async (ctx, next)=>{
   const{term, offset} = ctx.request.query;
   ctx.body = await search.queryTerm(term, offset);
});
const port = process.env.PORT || 3000;

router.get('/paragraphs',
    validate({
        query: {
            bookTitle: joi.string().max(256).required(),
            start: joi.number().integer().min(0).default(0),
            end: joi.number().integer().greater(joi.ref('start')).default(10)
        }
    }),
    async (ctx, next) => {
        const { bookTitle, start, end } = ctx.request.query
        ctx.body = await search.getParagraphs(bookTitle, start, end)
    }
)
app
.use(router.routes())
.use(router.allowedMethods())
.listen(port, err=>{
    if(err) throw err;
    console.log(`App listening on port ${port}`);
});