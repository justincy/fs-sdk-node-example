var http = require('http'),
    url = require('url'),
    request = require('request'),
    q = require('q'),
    FamilySearch = require('familysearch-javascript-sdk');
    
http.createServer(function(req, res){

    var requestUrl = url.parse(req.url, true);
    if(requestUrl.query && requestUrl.query.access_token && requestUrl.query.app_key){
        var fs = new FamilySearch({
            app_key: requestUrl.query.app_key,
            environment: 'sandbox',
            access_token: requestUrl.query.access_token,
            http_function: request,
            deferred_function: q.defer
        });

        fs.getCurrentUser().then(function(userResponse){
            res.writeHead(200);
            res.write(userResponse.getUser().contactName);
            res.end();
        }, function(error){
            res.writeHead(500);
            res.write(JSON.stringify(error));
            res.end();
        });
    }
    
    // 400 Bad Request
    else {
        res.writeHead(400);
        res.write('Missing the app_key and/or the access_token query params');
        res.end();
    }
    
}).listen(process.env.PORT || 8080, process.env.IP);