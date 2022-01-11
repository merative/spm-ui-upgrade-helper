
const http = require('http');
let req;

/**
 * Send http request
 * @param {object} connection connection object 
 */
 const doRequest =(connection, filename) => new Promise(function(resolve,reject){
   let newFlag=true;
      req = http.get( `http://spm-ui-upgrade-helper_nodefront:4005/full/${connection.property}/${connection.operation}/${connection.name}`, res => {
          //console.log("----------------------------");
          //console.log("File name", filename);
          //console.log("Property:  ", connection.property);
          //console.log("Class: ", connection.name);
          //console.log("Operation: ", connection.operation);
          //console.log("----------------------------");
          res.on('data', d => {
              responseAsJson = JSON.parse(d.toString());  
              whitelisted = responseAsJson.whitelisted;
              codeTable = responseAsJson.codetable;  
              console.log(responseAsJson); 
              if (whitelisted ==="false" && codeTable === "false"){
                console.log("Change the flag");
                newFlag=false;                       
              }
              resolve(newFlag);
            })
          }) 
        req.on('error', error => {
          console.error('Error',error);
          reject(newFlag);
        }) 
        req.end();
  })

module.exports = {
  doRequest
};