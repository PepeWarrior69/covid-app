const express = require('express')
const path = require('path')
const app = express()

app.use('/', express.static(path.join(__dirname, 'client', 'build')))
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})

app.listen(5000, () => {
    console.log('server has been started on port 5000');
})