# dril-is-strange

<img src="https://pbs.twimg.com/media/DfNuToCXcAAS-Yo.jpg" />

Source for <a href="https://twitter.com/drilisstrange">@drilisstrange</a>. A bot that overimposes tweets from popular twitter user dril over life is strange screenshots

## how

It'll fetch a screenshot from a random youtube let's play and then it makes a webpage out of it, screenshots it and tweets it.

I recommend reading the code itself, (start at `app.js`!) it's pretty straightforward!

## more complex how

1. Clone this repo

2. Run `npm install` to get all the dependencies. This will take a while.

3. Run `node` and you should get a link to `http://localhost:3000`, showing a post over a youtube video. Until you set up a twitter app it'll use the local post cache instead of real posts.

4. To take screenies, run `node ./bin/screenshot.js`

5. To post to Twitter, you first need to make an app at <a href="apps.twitter.com">apps.twitter.com</a> (this is where the bot will post!! be careful) and get all four tokens (2 for the app 2 for the user). Then make a <a href="https://github.com/motdotla/dotenv">.env</a> file filling in the values you see in `./bin/tweet.js`. Then just run `node ./bin/tweet.js`

#### autoposting

The actual live bot is in sync with this exact codebase, it's hosted in heroku, which has a free forever tier, and there's a scheduled process that runs `node ./bin/tweet.js` hourly
