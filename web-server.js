#!/usr/bin/env node

var util = require('util'), http = require('http'), fs = require('fs'), url = require('url'), events = require('events');

var DEFAULT_PORT = 8000;

var idSequence = 0;
var db = {product: [
    {id: ++idSequence, name: 'TV'},
    {id: ++idSequence, name: 'Fridge'}
]};

function main(argv)
{
    new HttpServer({
        'DELETE': createServlet(StaticServlet),
        'POST': createServlet(StaticServlet),
        'GET': createServlet(StaticServlet),
        'HEAD': createServlet(StaticServlet)
    }).start(Number(argv[2]) || DEFAULT_PORT);
}

function escapeHtml(value)
{
    return value.toString().replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;');
}

function createServlet(Class)
{
    var servlet = new Class();
    return servlet.handleRequest.bind(servlet);
}

/**
 * An Http server implementation that uses a map of methods to decide
 * action routing.
 *
 * @param {Object} Map of method => Handler function
 */
function HttpServer(handlers)
{
    this.handlers = handlers;
    this.server = http.createServer(this.handleRequest_.bind(this));
}

HttpServer.prototype.start = function (port)
{
    this.port = port;
    this.server.listen(port);
    util.puts('Http Server running at http://localhost:' + port + '/');
};

HttpServer.prototype.parseUrl_ = function (urlString)
{
    var parsed = url.parse(urlString);
    parsed.pathname = url.resolve('/', parsed.pathname);
    return url.parse(url.format(parsed), true);
};
function handleAPIRequest(req, res)
{
    function getEntities(type)
    {
        return db[type] || (db[type] = []);
    }

    var idMatch = req.url.match('/api/(\\w+)/(\\d+)');
    var entity, entities, entityType;
    if (idMatch) {
        var found = false;
        entityType = idMatch[1];
        entities = getEntities(entityType);
        for (var i = 0; i < entities.length; i++) {
            if (entities[i].id == idMatch[2]) {
                entity = entities[i];
                found = true;
                break;
            }
        }
        if (!found) {
            StaticServlet.prototype.sendMissing_(req, res, req.url);
            return;
        }
        var likeMatch = req.url.match('/api/(\\w+)/(\\d+)/like');
        if ('DELETE' === req.method) {
            entities.splice(i, 1);
            res.writeHead(200);
            res.end();
            return;
        } else if (likeMatch && 'POST' === req.method) {
            if (!entity.likes) {
                entity.likes = 0;
            }
            entity.likes++;
            res.writeHead(200);
            res.end();
        } else if ('POST' === req.method) {
            req.on('data', function (chunk)
            {
                try {
                    entity = JSON.parse(chunk);
                    entity.id = entities[i].id;
                    entities[i] = entity;
                } catch (e) {
                    util.puts(e);
                    res.writeHead(500);
                    res.end();
                }
            });
            req.on('end', function ()
            {
                res.write(JSON.stringify(entity));
                res.end();
            });
            return;
        }
    }
    var match = req.url.match('/api/(\\w+)\\??');
    if (match) {
        entityType = match[1];
        entities = getEntities(entityType);
        if ('GET' === req.method) {
            var searchQuery = url.parse(req.url, true).query.searchQuery;
            var results = [];
            if (searchQuery) {
                for (var j = 0; j < entities.length; j++) {
                    if (entities[j].name.match(searchQuery)) {
                        results.push(entities[j]);
                    }
                }
            } else {
                results = entities;
            }
            res.write(JSON.stringify(results));
            res.end();
            return;
        } else if ('POST' === req.method) {
            req.on('data', function (chunk)
            {
                try {
                    entity = JSON.parse(chunk);
                    entity.id = ++idSequence;
                    entities.push(entity);
                } catch (e) {
                    util.puts(e);
                    res.writeHead(500);
                    res.end();
                }
            });
            req.on('end', function ()
            {
                if (!entity) {
                    res.writeHead(400);
                    res.end();
                } else {
                    res.write(JSON.stringify(entity));
                    res.end();
                }
            });
            return;
        }
    }
    StaticServlet.prototype.sendMissing_(req, res, req.url);
}
HttpServer.prototype.handleRequest_ = function (req, res)
{
    var logEntry = req.method + ' ' + req.url;
    if (req.headers['user-agent']) {
        logEntry += ' ' + req.headers['user-agent'];
    }
    util.puts(logEntry);
    if (req.url.match('^/api/')) {
        handleAPIRequest(req, res);
        return;
    }
    req.url = this.parseUrl_(req.url);
    var handler = this.handlers[req.method];
    if (!handler) {
        res.writeHead(501);
        res.end();
    } else {
        handler.call(this, req, res);
    }
};

/**
 * Handles static content.
 */
function StaticServlet()
{
}

StaticServlet.MimeMap = {
    'txt': 'text/plain',
    'html': 'text/html',
    'css': 'text/css',
    'xml': 'application/xml',
    'json': 'application/json',
    'js': 'application/javascript',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'png': 'image/png',
    'svg': 'image/svg+xml'
};

StaticServlet.prototype.handleRequest = function (req, res)
{
    var self = this;
    var path = ('./' + req.url.pathname).replace('//', '/').replace(/%(..)/g, function (match, hex)
    {
        return String.fromCharCode(parseInt(hex, 16));
    });
    var parts = path.split('/');
    if (parts[parts.length - 1].charAt(0) === '.') {
        return self.sendForbidden_(req, res, path);
    }
    function serveIndex(req)
    {
        'use strict';
        return self.sendFile_(req, res, 'index.html');
    }

    fs.stat(path, function (err, stat)
    {
        if (err) {
            return self.sendMissing_(req, res, path);
        }
        if (null != stat && stat.isDirectory()) {
            return serveIndex(req);
        }
        return self.sendFile_(req, res, path);
    });
};

StaticServlet.prototype.sendError_ = function (req, res, error)
{
    res.writeHead(500, {
        'Content-Type': 'text/html'
    });
    res.write('<!doctype html>\n');
    res.write('<title>Internal Server Error</title>\n');
    res.write('<h1>Internal Server Error</h1>');
    res.write('<pre>' + escapeHtml(util.inspect(error)) + '</pre>');
    util.puts('500 Internal Server Error');
    util.puts(util.inspect(error));
};

StaticServlet.prototype.sendMissing_ = function (req, res, path)
{
    path = path.substring(1);
    res.writeHead(404, {
        'Content-Type': 'text/html'
    });
    res.write('<!doctype html>\n');
    res.write('<title>404 Not Found</title>\n');
    res.write('<h1>Not Found</h1>');
    res.write('<p>The requested URL ' + escapeHtml(path) + ' was not found on this server.</p>');
    res.end();
    util.puts('404 Not Found: ' + path);
};

StaticServlet.prototype.sendForbidden_ = function (req, res, path)
{
    path = path.substring(1);
    res.writeHead(403, {
        'Content-Type': 'text/html'
    });
    res.write('<!doctype html>\n');
    res.write('<title>403 Forbidden</title>\n');
    res.write('<h1>Forbidden</h1>');
    res.write('<p>You do not have permission to access ' + escapeHtml(path) + ' on this server.</p>');
    res.end();
    util.puts('403 Forbidden: ' + path);
};

StaticServlet.prototype.sendFile_ = function (req, res, path)
{
    var self = this;
    var file = fs.createReadStream(path);
    res.writeHead(200, {
        'Content-Type': StaticServlet.MimeMap[path.split('.').pop()] || 'text/plain'
    });
    if (req.method === 'HEAD') {
        res.end();
    } else {
        file.on('data', res.write.bind(res));
        file.on('close', function ()
        {
            res.end();
        });
        file.on('error', function (error)
        {
            self.sendError_(req, res, error);
        });
    }
};

// Must be last,
main(process.argv);
