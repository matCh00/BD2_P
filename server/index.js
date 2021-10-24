const express = require('express');
const app = express();


app.use('/', (req, res) => {

    res.send("hello world")
});


app.use('/login/', (req, res) => {

    res.send("login section")
});


app.listen(3001, () => {
    console.log("running on port 3001")
});