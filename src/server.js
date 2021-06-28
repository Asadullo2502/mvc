const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const {
   host,
   PORT
} = require('./config')

app.use(express.json())
app.use(express.urlencoded({
   extended: true
}))
app.use(express.static(path.join(process.cwd(), 'src', 'public')))


app.get('/admin', (req, res) => {
   res.sendFile(path.join(process.cwd(), 'src', 'views', 'admin.html'))
})

app.get('/admin/api', (req, res) => {
   let dataBase = fs.readFileSync(path.join(process.cwd(), 'src', 'database', 'users.json'))
   let userData = fs.readFileSync(path.join(process.cwd(), 'src', 'database', 'jurnal.json'))

   
   dataBase = JSON.parse(dataBase)
   userData = JSON.parse(userData.toString())
   console.log(dataBase);
   let arr = []

   for (let i = 0; i < userData.length; i++) {
      let obj = {
         userName: userData[i].userName,
         userBall: 0
      }

      if (dataBase) {
         for (let k = 0; k < dataBase.length; k++) {
            if (dataBase[k].userName == userData[i].userName) {
               obj.userBall = +obj.userBall + +dataBase[k].userBall
            }
         }
      }

      arr.push(obj)


   }
   res.send(arr)
})

app.post('/admin/add', (req, res) => {
   let dataBase = fs.readFileSync(path.join(process.cwd(), 'src', 'database', 'users.json'))
   let userData = fs.readFileSync(path.join(process.cwd(), 'src', 'database', 'jurnal.json'))
   let found
   userData = JSON.parse(userData.toString())
   console.log(userData);
   userData.forEach(element => {
      if (element.userName == req.body.userName) {
         found = element
      }
   })



   let obj
   if (!dataBase.toString()) {
      dataBase = []
      obj = {
         id: 1,
         userId: found.userId,
         userName: req.body.userName,
         userBall: req.body.userBall,
         date: req.body.sana,
         izoh: req.body.izoh
      }

   } else {
      dataBase = JSON.parse(dataBase.toString())

      obj = {
         id: dataBase[dataBase.length - 1].userId + 1,
         userId: found.userId,
         userName: req.body.userName,
         userBall: req.body.userBall,
         date: req.body.sana,
         izoh: req.body.izoh
      }
   }

   dataBase.push(obj)
   fs.writeFileSync(path.join(process.cwd(), 'src', 'database', 'users.json'), JSON.stringify(dataBase, null, 4), (err) => {})
   res.redirect('/admin')
   res.status(201).json({
      message: 'Ball qoshildi'
   })

})

app.post('/admin/userplus', (req, res) => {
   let dataBase = fs.readFileSync(path.join(process.cwd(), 'src', 'database', 'jurnal.json'))
   if (!dataBase.toString()) {
      dataBase = []
      let obj = {
         userId: 1,
         userName: req.body.userName,
      }
      dataBase.push(obj)
      fs.writeFileSync(path.join(process.cwd(), 'src', 'database', 'jurnal.json'), JSON.stringify(dataBase, null, 4), (err) => {})
      res.redirect('/admin')
      res.status(201).json({
         message: 'Obuna boldi!'
      })
   }
   dataBase = JSON.parse(dataBase.toString())
   let found = dataBase.find(user => user.userName == req.body.userName)
   if (found) {
      res.send('Bunday foydalanuvchi bor')
   } else {
      let obj = {
         userId: dataBase[dataBase.length - 1].userId + 1,
         userName: req.body.userName,
      }
      dataBase.push(obj)
      fs.writeFileSync(path.join(process.cwd(), 'src', 'database', 'jurnal.json'), JSON.stringify(dataBase, null, 4), (err) => {})
      res.redirect('/admin')
   }
})

app.get('/', (req, res) => {
   res.sendFile(path.join(process.cwd(), 'src', 'views', 'index.html'))
})
app.get('/user', (req, res) => {
   res.sendFile(path.join(process.cwd(), 'src', 'views', 'user.html'))
})

app.post('/user/:userName', (req, res) => {
   let users = fs.readFileSync(path.join(process.cwd(), 'src', 'database', 'users.json'))
   users = JSON.parse(users.toString())
   let arr = []
   users.forEach(elem => {
      if (elem.userName == req.params.userName) {
         let obj = {
            userName: req.params.userName,
            izoh: elem.izoh,
            sana: elem.date,
            userBall: elem.userBall
         }
         arr.push(obj)
      }
   })
   fs.writeFileSync(path.join(process.cwd(), 'src', 'database', 'user.json'), JSON.stringify(arr, null, 4), (err) => {})
   res.send('je')
   res.redirect('/user')
   
})

app.get('/user/natija', (req, res) => {
   let user = require('./database/user.json')
   res.send(user)
})

app.listen(PORT, (req, res) => console.log('http://' + host + ":" + PORT))