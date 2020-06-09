const fs = require('fs');
const {
    exec
} = require('child_process');

setTimeout(() => {
    exec(`mosquitto_sub -t outTopic > data.txt &`, (error, stdout, stderr) => {
        if (error) {
            console.error(`error: ${error}`);
            return;
        } else {
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        }
    });
}, 0);

setInterval(() => {
    fs.readFile('./data.txt', {
        encoding: 'utf-8'
    }, (error, data) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        data = data.split('\n');
        exec(`echo ${data[data.length - 1]}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`error: ${error}`);
                return;
            } else {
                console.log(`stdout: ${stdout}`);
                console.error(`stderr: ${stderr}`);
            }
        });
    });
}, 1000);