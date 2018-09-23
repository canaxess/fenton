
[![](https://img.shields.io/badge/fenton-BETA-%23fb9b27.svg)](#)

# fenton
fenton provides an accessible UI which has been tested against WCAG 2.0 AA. The script is for bots developed on the Microsoft Bot Framework, the code uses the Directline channel API to communicate with the bot.

**Built by following the principles in our [how to make chatbots accessible information card](https://canaxess.com.au/InfoCard/chatbots)**
## Features
1. Each message in the conversation history is accessible from the keyboard
2. A non-visual indication of which part of the conversation has been spoken by using the `aria-label` attribute
3. Conversation contained within an aria live region
4. Accessibility markup for several predefined rich media card types including Hero cards
5. Markdown support
## How to create and use fenton
### Obtain security credentials for your bot:
1. Make sure you've [registered your bot](https://dev.botframework.com/bots/new)
2. Add a DirectLine channel, and generate a Direct Line Secret. Make sure Direct Line 3.0 is enabled
3. Add the Directline secret into the `bot.secret` property
### Enter your details in the bot object
```js
var bot = new Object();
	bot.userId='<userid>';
	botname='<name>';
	bot.email='<bot email>';
	bot.organisation='<organisation>';
	bot.site='<site>';
	bot.id='<bot name>';
	bot.secret='*************************************************';
```
### Add the HTML
Enter the HTML exactly as it is displayed
```html
<div id="chatbot">
<div id="description" class="sr-hidden">This is the chatbot conversation window, 
all conversations are shown in here</div>

<div id="text-container">

<div id="conversation-text-body" aria-labelledby="description" aria-live="polite">
	<div tabindex="0" aria-label="The bot said" class="conversation-text bot">Hello, how are you?</div>
</div>
</div>
</div>

<div class="control-container">

<form id="chatbot-form" class="form-inline">
	<label for="user-msg">Ask me a question</label>
	<input type="text" autocomplete="off" id="user-msg" class="form-control">
	<button id="send" type="button" class="button large">Send</button>                     
</form>

</div>

<button id="connect" type="button" class="button large">Start</button>
```
### JQuery usage
JQuery is used to add click events to Hero cards. All buttons with a class `.actionable` may have a `data-type`, if this has openUrl it will open the page URL in a separate window, else it'll be a response which will carry on the conversation.
```js
$(function(){
	$(document).on("click", ".actionable", function(){
		var obj = $(this);
		switch(obj.attr('data-type'))
		{
			case "openUrl":
				window.open(obj.attr('data-value'), '_blank');
				break;
			default:
				$('#' + UI.userinputId).val(obj.attr('data-value'));
				$('#' + UI.submitbuttonId).click();
				break;
		}
	});
});	
```
## Browser and AT support
The support offered between browsers and assistive technology is increasing and has been tested and passed against the following combinations.
- JAWS 16 and Internet Explorer 11
- NVDA 2018.2.1 and Google Chrome
## External dependencies
- [RxJS 5.0](https://github.com/ReactiveX/rxjs)
- [Directline.js](https://github.com/Microsoft/BotFramework-DirectLineJS)
- [JQuery 3.3.1](https://jquery.com/download/)
- [Showdown 1.8.6](http://showdownjs.com/)
- [Foundation 6.4.3](https://foundation.zurb.com/sites/download.html/) is only used for basic styling of this example
> This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the [GNU General Public License](fenton/LICENSE) for more details.
