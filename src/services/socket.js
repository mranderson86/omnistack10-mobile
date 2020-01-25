import socketio from 'socket.io-client';

//const URL_API = 'https://arcane-depths-49398.herokuapp.com';
const URL_API = 'http://192.168.0.106:3333';

const socket = socketio(URL_API, {
    autoConnect: false,
});

function subscribeToNewDevs( subscribeFunction ){
    socket.on('new-dev',subscribeFunction );
}

function connect(latitude, longitude, techs) {
    socket.io.opts.query = {
        latitude,
        longitude,
        techs,
    };

    socket.connect();
    // socket.on('message', text =>{
    //     console.log(text);
    // });
}

function disconnect() {
    if(socket.connected) {
        socket.disconnect();
    }
}

export {
    connect,
    disconnect,
    subscribeToNewDevs
}