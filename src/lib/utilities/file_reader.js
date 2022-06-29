import fs from 'fs';

import path from 'path';

var dirPath = path.resolve('./share/'); // path to your directory goes here
var filesList;

function counts(string, word) {
  return string.split(word).length - 1;
}


fs.readdir(dirPath, function(err, files){
  filesList = files.filter(function(e){
    return path.extname(e).toLowerCase() === '.txt' || path.extname(e).toLowerCase() === '.csv'
  });
  // console.log({file_list:filesList});

  filesList.forEach( file => {
    

    try {
      
fs.readFile(`${dirPath}/${file}`, 'ascii', (err, data) => {
  let king = {data:""}  
    if (err) {
      console.error(err.message);
      return;
    }
     data = data.replace(/[\u0000]+/g,'')
        
    let recCount = (data.match(/RESULT TABLE/g) || []).length 
    if(recCount > 0 ){
        try {
          let datas = data.split("RESULT TABLE")
          let filtered = datas.filter(d => d.includes('Test Disclaimer'))
    
    
          let filtered2 = [ filtered.map(d=>{
          return ( '{'+ d.substring(
              1, 
              d.lastIndexOf("Test Disclaimer"))
                        .replace(/"/g,'')
                        .replace(/Notes\r\n/g,`Notesxx\r\n`)
                        .replace(/\nSample Type\r/g,'\nSample Typexx\r')
                        // .replace(/\nSample Type/g,'')
                        .replace(/,/g,'" : "')
                        .replace(/\r/g,'"')
                        .replace(/""/g,'')
                        .replace(/\n/g,'\n"')
                        .replace(/"Assay"/g,'"Test Name"')
                        .replace(/"Notesxx"/g,'"Notes" : ""')
                        .replace(/"Sample Typexx"/g,'"Sample Type" : ""')
                        .substring(1)
                        .slice(0,-2)
                        .split('\n')
                       +'}' )
            })]
            // fs.writeFile(`${dirPath}/archive/${file}`,  String(filtered2 ) , (err) => {
            //   if (err)
            //     console.log(err);
            //   else {
            //     // console.log(fs.readFileSync("books.txt", "utf8"));
            //   }
            // });
            
       let Jsoned =   JSON.parse('['+(filtered2)+']')

        
                            
      fs.rename(`./share/${file}`, `./share/archive/${file}`, function (err) {
        if (err) throw err
        console.log('Successful import. Archived file : '+file)
      })

             } catch (error) {
                            
            fs.rename(`./share/${file}`, `./share/errored/${file}`, function (err) {
              if (err) throw err
              console.log(error.message + '\nFile stored under errored folder : '+file)
            })

 
        }

  }

  });
    } catch (error) {
      
            fs.rename(`./share/${file}`, `./share/errored/${file}`, function (err) {
              if (err) throw err
              console.log(error.message + '\nFile stored under errored folder : '+file)
            })

      
    }
    
  });
});



  
// fs.rename('./share/Standardbankpaymentfile.csv', './share/archive/Standardbankpaymentfile.csv', function (err) {
//   if (err) throw err
//   console.log('Successfully moved!')
// })


function convertExpo(val) {

   return val.split(' ').map(d=> {let e = Number(d) > 0 ? Number(d) : d ; return e  } ).join(' ')

}