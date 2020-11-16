import { Server } from './server';

let server = new Server().app;

let port = process.env.PORT || 5000;

server.listen(port, () => {

    console.log(`Server is running at ${port}`)
})