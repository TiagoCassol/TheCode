const knex = require("knex")({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'the_code'
    }
});
const restify = require("restify");
const errors = require("restify-errors");

const server = restify.createServer({
    name: 'the_code',
    version: '1.0.0'
});

const corsMiddleware =require("restify-cors-middleware2")

const cors = corsMiddleware({
    origins : ['*']
})

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.pre(cors.preflight);
server.use(cors.actual)

server.listen(3000, function() {
    console.log("%s executando em %s", server.name, server.url);
});

server.get('/', (req, res, next) => {
  res.send("TheCode API");
});

server.get('/titlelist',(req,res,next)=>{
  knex('titlelist').then((dados) => {
    res.send(dados);
  }, next);
});

server.get('/titlelist/:id_title', (req, res, next) => {
  const id_title = req.params.id_title;
  knex('titlelist')
      .where('id_title', id_title)
      .first()
      .then((dados) => {
          if (!dados || dados == "") {
              return res.send(
                  new errors.BadRequestError('Produto não encontrado')
              );
          }
          res.send(dados);
      }, next);
});