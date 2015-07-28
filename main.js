var net = require("net");
var fs = require("fs");
var chalk = require("chalk");
var green = chalk.green;
var white = chalk.white;


var server = net.createServer(function(connection){
	connection.write("To leave a message, use following command:\n add yourName Message\n");
	var data = fs.readFileSync("messages.json", "utf8");
	var parsed = JSON.parse(data);
	connection.setEncoding("utf8");
	var counter = 0;
	connection.on("data", function(input){
		input = input.trim();
		var array = input.split(" ");
		//console.log(array);
		var slice = array.slice(2);
		//console.log(slice);

		var myString = slice.join(" ");
		//console.log(myString);
		//console.log(typeof myString);
		counter ++;

		if (array[0] === "add"){
			var messageObject = {
				id: counter,
				from: array[1],
				message: myString,
			}
			//console.log(messageObject);
			parsed.push(messageObject);
			var myJSON = JSON.stringify(parsed);
			//console.log(myJSON);
			fs.writeFileSync("messages.json", myJSON);

		} else if (array[0] === "read"){
			parsed.forEach(function(message){
				connection.write(white("ID: ") + green(message.id) + "\r\n" + white("From: ") + green(message.from) + "\r\n" + white("Message: ") + green(message.message) + "\r\n" + "\r\n");
			});

		} else if (array[0] === "deleteAll"){
			parsed = [];
			//console.log(parsed);

			var myJSON = JSON.stringify(parsed);
			fs.writeFileSync("messages.json", myJSON);

		} else if (array[0] === "deleteOne"){
			parsed.forEach(function(element, index){
				var messageId = parseInt(array[1]);
				// console.log(typeof messageId);
				// console.log(typeof element.id);
				if (messageId === element.id){
					console.log("We match!");
					parsed.splice(index, 1);
				}
				
			});
			//console.log(parsed);
			var myJSON = JSON.stringify(parsed);
			fs.writeFileSync("messages.json", myJSON);
		}


	});	
});

server.listen(2000, function(){
	console.log("working");
});
