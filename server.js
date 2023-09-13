import express from 'express';
import { Server } from 'socket.io';
const port = 3000;

const expressApp = express()
const httpServer = expressApp.listen(port, () => {
    console.table(
        {
            'Controller' : 'http://localhost:3000/controller',
            'Display' : 'http://localhost:3000/ddisplay',
        })
})

expressApp.use('/display', express.static('public-display'))
expressApp.use('/controller', express.static('public-conotroller'))
expressApp.use(express.json())