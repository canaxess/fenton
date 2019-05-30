var now = new Date();

var ConnectionStatus = {
  Uninitialized: 1,
  Connecting: 2,
  Online: 3,
  ExpiredToken: 4,
  FailedToConnect: 5,
  Ended: 6,
};

var startconnection = document.querySelector('#' + UI.connect);
Rx.Observable.fromEvent(startconnection, 'click')
	.first()
	.subscribe(botConnect, err => console.log(err));

var sendmessage = document.querySelector('#' + UI.submitbuttonId);
const click$ = Rx.Observable.fromEvent(sendmessage, 'click')

click$
	.bufferWhen(() => click$.delay(1000))
	.subscribe(sendMessage, err => console.log(err));	
	
function buildUserMsg(msg)
{
	var HTML = '<section class="conversation-text user" aria-label="You said ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '">' + msg + '</section>';
	
	renderResponse(HTML);
	renderTyping(1);
}	

function buildBotMessage(msg)
{
	var converter = new showdown.Converter(), text = msg, html = converter.makeHtml(text);
	var output = '<section class="conversation-text bot" aria-label="The bot said ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '">' + html + '</section>';
	
	renderTyping(0);
	renderResponse(output);
}	

function buildHerocard(response)
{
	var text="";
	var images="";
	var buttons="";
		
	Object.keys(response.attachments[0].content).forEach(function(key)
	{
		if(response.attachments[0].content[key]!="")
		{
			switch(key)
			{
				case "images":
					for (var i = 0; i < response.attachments[0].content[key].length; i++)
					{
						images = images + '<img src="' + response.attachments[0].content[key][i].url + '" alt="">';
					}
					break;
				case "buttons":
					for (var i = 0; i < response.attachments[0].content[key].length; i++)
					{
						buttons = buttons + '<input type="button" class="button actionable" data-type="' + response.attachments[0].content[key][i].type + '" data-value="' + response.attachments[0].content[key][i].value + '" value="' + response.attachments[0].content[key][i].title + '">';
					}
					break;
				default:
					switch(key)
					{
						case "title":
							text = text + "<div class='heading'>" + response.attachments[0].content[key] + "</div>";
							break;
						case "subtitle":
							text = text + "<div class='subtitle'>" + response.attachments[0].content[key] + "</div>";
							break;
						default:
							text = text + "<div class='text'>" + response.attachments[0].content[key] + "</div>";
							break;
					}
					break;
			}
		}
	})
	
	console.log(images);
	console.log(buttons);
	console.log(text);
	
	var buildString = "<div class='herocard'>";
	if(images != "")
	{
		buildString = buildString + images + "<br>" + text + "<br>" + buttons;
	}
	else
	{
		buildString = buildString + text + "<br>" + buttons;
	}
	buildString = buildString + "</div>";
	
	renderTyping(0);
	var output = '<section class="conversation-text bot" aria-label="The bot said <time>">' + buildString + '</section>';
	renderResponse(output);
}

function renderTyping(val)
{
	switch(val)
	{
		case 0:
			$(".typing-notification").remove();
			break;
		case 1:
			$("#" + UI.conversationId).append('<div class="typing-notification conversation-text bot"><span class="sr-hidden">The bot is replying </span><img src="./images/loading.gif" class="bot-typing"></div>');
			document.getElementById(UI.conversationContainerId).scrollTop = 4500;
			break;
	}
}
	
function renderResponse(msg)
{
	$('#' + UI.conversationId).append(msg);
	document.getElementById(UI.conversationContainerId).scrollTop = 4500;
}
	
function sendMessage()
{
	if(directLine!=undefined)
	{
		directLine.postActivity({
			from: { id: bot.userId, name: bot.name },
			type: 'message',
			text: $('#' + UI.userinputId).val()
			}).subscribe(
			buildUserMsg($('#' + UI.userinputId).val()),
			error => console.log("Error posting activity", error)
		);
	}
}
	
function botConnect()
{
	directLine = new DirectLine.DirectLine({
		secret: bot.secret,
		domain: 'https://directline.botframework.com/v3/directline/',
		webSocket: true,
		pollingInterval: 1000,
	});
	
	//renderTyping(1);
	
	directLine.activity$
	.filter(activity => activity.from.id === bot.id)
	.subscribe(activity =>
	{
		if(activity.attachments.length>0)
		{
			var contentType = activity.attachments[0].contentType;
			switch(contentType)
			{
				case "application/vnd.microsoft.card.thumbnail":
				case "application/vnd.microsoft.card.hero":
					buildHerocard(activity);
					break;
			}
		}
		else
		{
			buildBotMessage(activity.text);
		}
	})
		
	directLine.connectionStatus$
	.subscribe(connectionStatus =>{
		switch(connectionStatus) {
			case ConnectionStatus.Uninitialized:
				console.log('ConnectionStatus.Uninitialized')
				break;
			case ConnectionStatus.Connecting:
				console.log('ConnectionStatus.Connecting')
				break;
			case ConnectionStatus.Online:
				console.log('ConnectionStatus.Online')
				break;
			case ConnectionStatus.ExpiredToken:
				console.log('ConnectionStatus.ExpiredToken')
				break;
			case ConnectionStatus.FailedToConnect:
				console.log('ConnectionStatus.FailedToConnect')
				break;
			case ConnectionStatus.Ended:
				console.log('ConnectionStatus.Ended')
				break;
			default:
				console.log("other code")
				break;
		}
	});
}
