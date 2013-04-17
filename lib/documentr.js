module.exports = function (docTitle, markdownDir, targetDir, assetsDir, template){
    markdownDir = markdownDir+'/';

    /* Load Libraries
     * ======================================================== */
    var ncp = require('ncp').ncp, 
        fs =  require('fs'),
        path = require('path'),
        markdown = require('markdown'),
        childProc = require('child_process');


    /* Variables
     * ======================================================== */

    var fileArray = [], // an array contains markdown files name
        markdownBuffer  = '', // all markdown files content concatinated to this var
        templateBuffer = '', 
        outputBuffAr = '',
        outputHtml = '',
        html = '';

    if(!fs.existsSync(targetDir)){
        fs.mkdirSync(targetDir);
    }

    ncp(assetsDir, path.join(targetDir,'assets'), function (err) {
        if (err) {
            return console.error(err);
        }
    });

    fileArray = fs.readdirSync(markdownDir);
    fileArray.sort();

    for(var i=0; i<fileArray.length; i++){
        var stat = fs.statSync(markdownDir + fileArray[i]);
        if(stat.isFile()){
            markdownBuffer = markdownBuffer + fs.readFileSync( path.join(markdownDir, fileArray[i]), 'utf8') + "\n";
        }else{
            childProc.exec('cp -a '+path.join(markdownDir, fileArray[i])+' '+targetDir, function(){});
        }
    }

    templateBuffer  = fs.readFileSync(template,'utf8');
    outputHtml = templateBuffer.replace('{CONTENT}', markdown.markdown.toHTML(markdownBuffer));
    outputHtml = outputHtml.replace(/{TITLE}/g, docTitle);
    fs.writeFileSync(path.join(targetDir, 'index.html'), outputHtml, 'utf8');

};
