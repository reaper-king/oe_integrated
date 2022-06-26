import fs from 'fs';


fs.readFile('./share/test.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data);
  });

  
fs.readdir('./share/', (err, files) => {
    console.log(files)
    files.forEach(file => {
      console.log(file);
    });
  });
  