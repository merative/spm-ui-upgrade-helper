
const http = require('http');
let req;

/**
 * Send http request
 * @param {object} connection connection object 
 */
 const doRequest =(connection, filename) => new Promise(function(resolve,reject){
   let newFlag=true;
      req = http.get( `http://spm-ui-upgrade-helper_nodefront:4005/full/${connection.property}/${connection.operation}/${connection.name}`, res => {
          res.on('data', d => {
              responseAsJson = JSON.parse(d.toString());  
              whitelisted = responseAsJson.whitelisted;
              codeTable = responseAsJson.codetable;  
              if (whitelisted ==="false" && codeTable === "false"){
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