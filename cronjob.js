const cron = require('node-cron');
const { exec } = require('child_process');

const runGetDataScript = () => {
  console.log('Running getdata.js...');
  exec('node getdata.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing getdata.js: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
  });
};

cron.schedule('*/10 * * * *', () => {
    //for now it just run after 10 min of the code execution
  runGetDataScript();
});
