require('dotenv').config();
const express=require('express'),cors=require('cors'),{init}=require('./db'),{router:auth,requireSession}=require('./routes/auth'),posts=require('./routes/posts');
const app=express(),PORT=process.env.PORT||4000;
app.use(cors({origin:true}));app.use(express.json({limit:'1mb'}));app.get('/api/health',(q,s)=>s.json({ok:true}));
app.use('/api/auth',auth);app.use('/api/posts',requireSession,posts);
app.use((e,q,s,n)=>{console.error(e);s.status(400).json({error:e.message||'Request failed.'})});
init().then(()=>app.listen(PORT,()=>console.log('Nobody API listening on '+PORT))).catch(e=>{console.error(e);process.exit(1)});
