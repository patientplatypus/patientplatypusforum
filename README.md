# What is this thing?

This is a image based web forum (like 4chan), that also includes chat, a feed, radio, and more! 

# Screen Shot of the Splash Page

![alt text](/static/SplashPageScreenShot.png "Screen Shot of the Splash Page")


# Motivation

I wanted to make a website that was as interactive and fun to use as possible. Lot's of parts of the application require interaction (chat, forum, etc) and it's my hope that this will drive user engagement. The playful, "comfy", design encourages enjoyment and good will in communication between users.

# It's not running why isn't it running?

The .env files are not included. A google server (`recaptchaSecretKey`) and a client (`recaptchaSiteKey`) are need for recaptcha (v2) which are not supplied. Also the server .env file needs an `adminPass` environmental variable for admin login challenge.

# Things to Do: 

- Three strikes then yuk face (throttled by timer) (DONE)
- add way to reference previous comments
- no image if image not found (DONE)
- backend test on post for no comment/filesize 
- all devops
- google recaptcha (for EVERYTHING) (DONE, feed has char count on front/back instead - do same for chat?)
- buy DNS and server
- set up a contact form page (to email me) (DONE)
- ask a platypus page?
- front page splash w/SVG (DONE)
- admin delete blog picture handler (DONE)
- newspaper (snooze news)
- radio (DONE)
- testing
- break routes file up into (blog etc) (DONE for now)
- make utility function folder and deagg multi-use functions in routes (DONE for now)
- get rid of console logs where unnecessary or may crash (heartbeat especially)
- when does if error mean we need to send res response?
- clean up css and deagg file if needbe
- fix up navbar on forum 
- agg functions in forums to logos
- agg render in forums to logos
- limit feed characters to input
- fix blog header overflow (DONE)
- On splash add cork board with visitor map (number + by ip with strings?) 
  - Plus have two charts (unique visitor vs repeat && not from texas vs texas)
  - Plus cool people and fred (99%)
- get rid of ipapi json call and put in native function
- rewrite backend/forums to simply serve all pictures as static rather than base64??? (DONE)