import express from 'express'
import pkg from 'pg'
import bodyParser from 'body-parser';
import dotenv from 'dotenv'

dotenv.config();
const { Pool } = pkg;

const app = express();
const port = 7000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, 
  });
  


app.use(bodyParser.urlencoded({extended : true}))
app.set('view engine','ejs')



app.get('/',(req,res)=>{
    res.render('index.ejs')
})

app.post('/ok', async (req, res, next) => {
    try {
      const { name } = req.body;
      if (!name) return res.send("Name is required");
  
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name TEXT
        )`);
  
      await pool.query('INSERT INTO users(name) VALUES($1)', [name]);
  
      res.send('<h1> ok your data is  stored </h1>')
    } catch (err) {
      next(err);
    }
  });



app.listen(port,()=>{
    console.log(port + 'port is started')
})