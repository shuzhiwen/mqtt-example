const fs = require('fs');
const {
  exec
} = require('child_process');

const subTopic = "uploadToServer";
const pubTopic = "downloadFromServer";

//订阅来自终端设备的 MQTT 消息
setTimeout(() => {
  exec(`nohup mosquitto_sub -t ${subTopic} > data.txt 2>&1 &`, (error) => {
    if (error) {
      console.error(`Subscribe: ${error}`);
      return;
    } else {
      console.log(`Subscribe Topic: ${subTopic}`);
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

    //解析文本数据，获取最后（最新）的一行
    let dataArr = data.split('\n');
    let msg = dataArr[dataArr.length - 1];

    exec(`mosquitto_pub -t ${pubTopic} -m "${msg}"`, (error) => {
      if (error) {
        console.error(`Publish: ${error}`);
        return;
      } else {
        console.log(`Publish Topic: ${msg}`);
      }
    });
  });
}, 1000);