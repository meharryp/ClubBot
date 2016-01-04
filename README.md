# ClubBot
A bot for playing youtube, soundcloud and more on Discord voice chat channels.
# Installing
1. Install nodejs and npm.
2. Run `npm install` in the directory the bot is in
3. Open bot.js and fill in the username and password for the bot
4. Run it!
# Finding the channel ids
Finding the text channel ID is fairly easy, just use the last number in the URL.
`https://discordapp.com/channels/93925271886897152/93925271886897152` becomes `93925271886897152`
To find the audio channel, right click the channel you want to add the bot to, and click inspect.
![see above](http://meharryp.xyz/sharex/2016/01/04/2016-01-04_12-29-56.png)

Then, from the highlighted section, copy the text after the $ and before the dot.
```html
<span class="channel-name" data-reactid=".0.1.1.0.1.0.1.0.0.3.$127861585304616960.0.1">The Men's Room (AFK)</span>
```
becomes `127861585304616960`.
