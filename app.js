const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser');
const multer = require('multer');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const FFmpeg = require('fluent-ffmpeg');
FFmpeg.setFfmpegPath(ffmpeg.path);
// const processVideo = require('./app/src/video-compress');
// const routine = require('./app/src/routine');
const app=express()
app .use(express.json());
//app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 } ))
//app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.json({limit: '70mb'}));
app.use(bodyParser.urlencoded({limit: '70mb', extended: false, parameterLimit: 1000000}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS,PATCH,POST");
    res.header("Access-Control-Allow-Headers", "Multipart/form-data");
    next();
  });
const http=require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const path=require('path');
const staticPath=path.join(__dirname,'/public');
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
app.use(express.static(staticPath))
app.get('', function(req, res,next) {  
    res.sendFile(__dirname + "/public/index.html");
});
const contactlist=[]
let usersJoin={}
io.on('connection',(socket)=>{
    console.log("A user connected=",socket.id);
    //joing room by roomid through
    socket.on('LoginUserJoin',(mobile)=>{
	let m=String(mobile)
	socket.join(String(mobile))
        console.log('joining for mobile',mobile)
	console.log('type',typeof m)
        if(!usersJoin[socket.id]){
	     usersJoin[socket.id]=mobile
          }
    })
    socket.on('demo',(msg)=>{
       console.log(msg)
    
      })
    socket.on('joinRoom',(room)=>{
        console.log("joing for room is ",room)
        socket.join(room);
	//socket.to(room).broadcast.emit('online now','user online  now')
	 if(!usersJoin[socket.id]){
             usersJoin[socket.id]=room
          }
	//socket.broadcast.to(room).emit("online message",{online:true})
    io.to(room).emit("online message",{online:true})
     })
    //live user connection
	socket.on('online message',(room)=>{
	    //socket.broadcast.to(room).emit('online message1',{online:true})
        io.to(room).emit('online message1',{online:true})
         })
    socket.on('liveuser',(data)=>{
        const user={
            user_id:data,
            socketid:socket.id
        };
        contactlist.push(user);
        //this send the message who is live user
        //socket.broadcast.emit('liveuser',contactlist);
        io.emit('liveuser',contactlist)
    })
    

    //message come and transmit to client side
    socket.on('message',(data)=>{
       // console.log(data)
	//let other_id=Number(data.other_id)
	  //
// console.log(typeof data.other_id)
	  // if(usersJoin[socket.id]==data.room_id){
		  console.log('socket message1',data)
                  
          //socket.broadcast.to(data.room_id).emit('messageSend',data);
          io.to(data.room_id).emit('messageSend',data)
		  //socket.broadcast.to(data.other_id).emit('messageSend',data);
          
	  /*else if(usersJoin[socket.id]==other_id){
		 console.log('message2',data)
	         //socket.broadcast.to(other_id).emit('notificationMsg',data);
           }*/
       })
    //end for transmitting coding
 
    //come to gallery  file in socket server
    socket.on('user gallery',data=>{
        console.log("image",data)
        //socket.broadcast.to(data.room_id).emit('user gallery',data);
        io.to(data.room_id).emit('user gallery',data)
    }) 
    
    //come to document files in socket server
    socket.on('user document',data=>{
        console.log("image",data.result.room_id)
        //socket.broadcast.to(data.room_id).emit('user document',data);
        io.to(data.room_id).emit('user document',data)
    })
    
    
     //come to audio file in socket server
    socket.on('user audio',data=>{
        console.log("image",data.result.room_id)
        //socket.broadcast.to(data.room_id).emit('user audio',data);
        io.to(data.room_id).emit('user audio',data)
    })
    //End audio fies
   
    //come to camera  file in socket server
    socket.on('user camera',data=>{
        console.log("image",data.result.room_id)
        //socket.broadcast.to(data.room_id).emit('user camera',data);
        io.to(data.room_id).emit('user camera',data)
    })
    //end camera files   



    //disconnection socket
     socket.on('disconnect',()=>{
        /* let index;
         for(let i=0;i<contactlist.length;i++)
         {
             if(contactlist[i].socketid===socket.id)
             {
                 index=contactlist.indexOf(contactlist[i]);
             }
         }
         const c=contactlist.splice(index,1);
        if(contactlist.length>0){
            socket.broadcast.emit('leve',c)
        }
         console.log('a user left')
     })*/
      // let socketid=socket.id
       let id=usersJoin[socket.id]     
       console.log('user left',id)
       delete usersJoin[socket.id]
})
})
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Databse Connected Successfully!!");    
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});
const route =require('./app/routers/index')
app.use('/', route);

app.get('/', (req, res) => {
    res.json({"message": "This is for testing"});
});

server.listen(4002,()=>
{
    console.log("listening port 4002");
});

