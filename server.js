const express = require('express')
const fs = require('fs');
const path = require('path');
const {animals} = require('./data/animals.json')
const apiRoutes = require('./routes/apiRoutes')
const htmlRoutes = require('./routes/htmlRoutes')
const PORT = process.env.PORT || 3001;
const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use('/api',apiRoutes)
app.use('/',htmlRoutes)
app.use(express.static('public'))



app.listen(PORT,function(){
    console.log('API server now on port 3001!')
});