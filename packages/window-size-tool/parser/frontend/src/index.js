const http = require('http');
const serverlib = require('express');

const wserver = serverlib();

const connectionBase = {
    port: 7777,
    host: 'beanparser',
    method: 'GET'
}
wserver.get('/', function(req, res) {
    res.send('...Ready to delegate');
});
wserver.get('/full/:prop/:op/:bean', function(req, res) {
    delegateAndWait('fullinfo', req.params, result => res.send(result));
});
wserver.get('/base/:prop/:op/:bean', function(req, res) {
    delegateAndWait('getbase', req.params, result => res.send(result));
});
wserver.get('/ct/:prop/:op/:bean', function(req, res) {
    delegateAndWait('iscodetable', req.params, result => res.send(result));
});
wserver.get('/complex/:prop/:op/:bean', function(req, res) {
    delegateAndWait('isxmlwidget', req.params, result => res.send(result));
});
wserver.get('/whitelisted/:prop/:op/:bean', function(req, res) {
    delegateAndWait('iswhitelisted', req.params, result => res.send(result));
});

function delegateAndWait(pathBase, pathParams, callback) {
    let databack = '';
    let path = `/${pathBase}?d=${pathParams.prop}@${pathParams.op}_${pathParams.bean}`;
    let reqOptions = {...connectionBase, path };
    const backendReq =
        http.request(reqOptions, res => {;
            res.setEncoding('utf-8');
            res.on('data', chunk => databack += chunk);
            res.on('end', () => callback(databack));
        });
    backendReq.on('error',
        e => console.error(`Problem with the request delegation: ${e.message}`));
    backendReq.end();
}
wserver.listen(4005, _ => console.log('Sample bean tool query bridge is ready on localhost:4003...\n/full,/base,/ct,/complex,/whitelisted paths please. '));