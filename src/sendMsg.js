const fs = require('fs');
const {
  exec
} = require('child_process');

//接收来自终端设备的 MQTT 订阅
setTimeout(() => {
  exec(`nohup mosquitto_sub -t uploadToServer > data.txt 2>&1 &`, (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error}`);
      return;
    } else {
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    }
  });
}, 0);

//每隔一秒推送最新数据
setInterval(() => {
  fs.readFile('./data.txt', {
    encoding: 'utf-8'
  }, (error, data) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    data = data.split('\n');
    exec(`mosquitto_pub -t downloadFromServer -m "${data[data.length - 1]}"`,
      (error, stdout, stderr) => {
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