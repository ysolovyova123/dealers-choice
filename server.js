const db = require('./db');
const app = require('./app');
const port = process.env.PORT || 3000;
try {
  process.env = {...process.env, ...require('./secrets')}
}
catch(ex){
  console.log(ex);
}

const init = async()=> {
  await db.syncAndSeed();
  app.listen(port, ()=> console.log(`listening on port ${port}`));
}

init();
