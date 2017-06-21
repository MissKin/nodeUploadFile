var querystring = require('querystring');
var fs = require("fs");
var formidable = require("formidable");

function start(response) {
  console.log('start');
  var body = '<html>'+
	  '<head>' +
	'<meta http-equiv="Content-Type" content="text/html" charset="UTF-8">' +
	'</head>'+
	'<body>' +
	'<form action="/upload" method="post" enctype="multipart/form-data">' +
	'<input type="file" name="upload" multiple="multiple">' +
	'<input type="submit" value="Upload file">' +
	'</form>' +
	'</body>' +
	'</html>';
  response.writeHead(200, {"Content-Type":"text/html"});
    response.write(body);
    response.end();
}

function upload(response, request){
  console.log('upload');
  var form = new formidable.IncomingForm();
  //设置默认临时文件夹路径
  form.uploadDir = "tmp"
  console.log("about to parse");
  form.parse(request, function (error, fields, files) {
	console.log("F.U.P"+ files.upload.path);
	setTimeout(function () {
		try{
		  fs.renameSync(files.upload.path, "tmp/test.png");
		}catch (e){
		  console.log(e)
		}
	  response.writeHead(200,{"Content-Type":"text/html"});
	  response.write("You've sent:<br/> ");
	  response.write("<img src='/show'/>");
	  response.end();
	},1000);
  });
}

function show(response){
  console.log('show');
  fs.readFile("./tmp/test.png", "binary", function (error, file) {
	if(error){
	  response.writeHead(500, {"Content-Type":"text/plain"});
	  response.write(error + "\n");
	  response.end();
	} else{
	  response.writeHead(200,{"Content-Type":"image/png"});
	  response.write(file,"binary");
	  response.end();
	}
  });
}
exports.start = start;
exports.upload = upload;
exports.show = show;