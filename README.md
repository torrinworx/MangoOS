# MangoOS
A classic iPodOS like operating system. I want to build my own classic iPod, using the shell of either a 3rd gen classic or 5th gen classic ipod with completely new internals.

The basic outline of this project:
- PiCore os on a raspberry pi zero 2w
- A destam js web frontend built with vite
- Embedded display using Servo/Servo (rust, runs on 32bit architecture that the pi uses)
- Rust backend to handle i/o, file management, music playing, bluetooth, battery management, etc
- A build script that can entirely setup the picore operating system fully functional, MangoOS backend/frontend servo, and whatever is needed to boot and display it at runtime so that it acts like a dedicated device. All this from a pc/laptop get's flashed onto the sd card, so that when the device powers on everything is setup and it just works.

iPod 5th gen classic mods list:
- New shiny back plate original silver
- New shiny front plate original white
- New click wheel original white
- Bluetooth definitely, wifi maybe?
- Taptic engine
- New (maybe OLED?) screen
- New battery
- 500gb of ssd storage (because why the hell not)
- usbc charger and usbc shaped case?
- Raspberry pi 0w instead of ipod main board? 
- Magsafe Charging or wireless charging.

Video links:
[ Why Are People Buying iPods Again? ](https://www.youtube.com/watch?v=00lLrwHQPns)

[ Perfect iPod bluetooth + taptic + magsafe ](https://www.youtube.com/watch?v=FEPREoY_Gmk)

[ Spotify Streaming on a modded 17-year-old iPod Classic (via Raspberry Pi 0w) ](https://www.youtube.com/watch?v=ZxdhG1OhVng)

[ Spotify iPod pt. 2: FAQ's and Upgrades! ](https://www.youtube.com/watch?v=q0pUPab7Rms)

[ Bluetooth and USB C kit for iPod classic (Classic Connect by Moonlit Market review) ](https://www.youtube.com/watch?v=Y0YXLERInw8) <<---- This kit looks really good, bluetooth small, usbc small. kit is for 6th gen though not 5 or 5.5.

[ Bluetooth Upgrade Kit for the Apple iPod classic 5th gen ](https://www.youtube.com/watch?v=GJmMuAekcwE)

[ sPot: Spotify in a 4th-gen iPod (2004) ](https://hackaday.io/project/177034-spot-spotify-in-a-4th-gen-ipod-2004)

[retro-ipod-spotify-client github](https://github.com/dupontgu/retro-ipod-spotify-client)

youtube history: https://www.youtube.com/feed/history?query=ipod

Maybe I don't even need to buy an ipod and could just build one from scratch?

5th gen comes in two different sizes: slim (30gb ipods) and thick (60gb & 80gb ipods)

# Fully custom ipod 3rd gen project
Basically this is building my own ipod from scratch, keeping only the external case, buttons, and scroll wheel.

hardware:
- remove existing hard drive
- Preferably a replacement back, replacement front, buttons and wheel, mint condition with no scratches or wear, but idk where to find that if that exists.
- raspberry pi zero 2w, usb display port, sd card, bluetooth, etc all included in this pi.
- usbc charging port
- massive ass battery to have week+ long battery life.
- 1tb sd storage
- iphone taptic engine kit
- wirless charging
- new modern, preferably oled display so that we can imitate the original contrast of the old display.
- headphone jack/aux
- existing buttons of the 3rd gen to the pie serial ports, along with scroll wheel output and center button

software:
- flash with piCore (http://www.tinycorelinux.net/ports.html)
- use rust Servo browser renderer, supports arm32 architecture (https://github.com/servo/servo)
- build a dual use repo: frontend js vite build destam stack, backend rust
- frontend is built in destam js, simple web page, allows you to manage device settings, bluetooth pairing, song playback, button inputs, etc (need to figure out how to send this thing on device button inputs live, maybe servo has support or an api?). also not sure if servo should handle pipeing the output directly to the display? Maybe that'a s servo thing that it supports since it lists embeded system on the site but idk. Maybe this is a rust backend thing
- backend, possibly handles routing device raspberry button and scroll wheel inputs as well as other device stuff like bluetooth controls, media file management, audio playback to aux and bluetooth, rumble control.
- Ideally I would like to have this setup like any old mp3 where you can plug it in via usbc and it appears as an mp3 that can get music loaded onto it through the file system ui for mp3s. idk how this would work, no clue.
- I really like the spotify ui that guy put together, and the original retro style ui, should keep that look and feel. Obviously custom themeing is a must to get the retro feel but also allow for custom theme colors.
- The ui is entirely navigable via the scroll wheel

- Servo, client uses websockets to communicate with rust backend with some kind of modules system built in rust to run the needed backend code over websockets. NO auth, very simple, request websocket get's piped to a rust file and ran. Dead simple.

Cool thing about this is that I can kinda built the web page without having to have the hardware immediately so I could start on this whenever. Plus figuring out how servo works and how to get picore setup, learning how to solder, hook up electronics and batteries and stuff would be cool. Might look into a microscope soldering station. Really want this thing to be freaking awesome.

# Rules
I want to lay down some rules to make this projects scope understood:
1. No wifi. Bluetooth yes because wireless headphones are freaking awesome, but no wifi, this isn't an iphone. The original retro feel of these devices, a core part of that is the fact you have to curate your own music, plug in, transfer, and unplug your ipod. Then that's all you get, that experience should be preserved. Adding wifi would be faster but this project is focused on adding convenience while mainting a retro feeling balance. Also it's nice not having another tracking device that's simply just a music player. Not sure if the logic in this argument tracks but oh well
2. No apple music or spotify or streaming, similar argument to 1. this is an mp3 player, they never had wifi, that's not retro. An acception for bluetooth headphones because they are freaking awesome and everywhere.


# future plans:
offline scrobble? potentially some kind of scrobble system, when you plug in, your scrobble data get's loaded onto your desktop, then it can somehow suggest new music to you based on that scrobble, you get to load your "New music playlist" generated, somehow automatically download it from deezer or something and load it onto the device, would require a desktop companion client. Maybe the client could be used to flash the os and build onto a pre-built device or something. idk.



instead of using websockets to communicate button and scroll wheel inputs in servo/rust, does servo instead just provide on key down events that we could trigger in rust directly when we detect the signals from the buttons/scroll wheel? Just have those trigger keyboard buttons on the device then have that traditional signal get picked up by Servo if Servo supports on key down events? Would that be faster than websockets? It wouldn't require a network connection between the front and backend server?

potential fonts: https://designwithshay.com/free-retro-google-fonts-for-your-next-design-project/


with a custom resin 3d printed back panel, we can get a nice seal between usbc ports, aux, hold/power button, etc, maybe even a volume rocker.

we can chrome plate polished smooth resin prints:
https://www.youtube.com/watch?v=ifboockPrFY

electroplating, more complicated but a finer mirror finish, maybe we do this and coat it in some car gloss paint to protect it form scratches?

https://www.youtube.com/watch?v=7PFHT02n5V8


crazy ionized plating: https://www.youtube.com/shorts/zNw-4uLwiNM