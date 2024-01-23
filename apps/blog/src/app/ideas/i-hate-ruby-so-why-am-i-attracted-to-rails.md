I've been on a really weird kick recently. I've somehow gotten really into Ruby on Rails. Not actually programming it, god no, I can't stand Ruby. Don't get me wrong, I don't think it's bad if you like Ruby; the language just doesn't value the things I've come to value in a programming language.

So why would I be digging into RoR?

There are two main things that just really intrigue me about the framework as a whole.

## Hotwire

I've been doing Angular development for almost a decade now. I love the framework. The SPA-mindset matches my world view and has been a pleasure to work with for so long. But the frontend ecosystem is changing. And it's changing in a way that just no longer makes sense to me. The rise of metaframeworks (Next, Nuxt, Sveltkit, etc) has blurred the lines between the client and the server, in a way that is confusing, not empowering.

It all feels like one big Rube Goldberg machine to me. Take a frontend framework, spin it up on the server, to execute said frontend framework to spit out HTML, to then be sent over the wire and loaded up by the frontend framework to then hydrate and continue on. With things like RSCs you are now down to component level decisions of where the component operates. It all feels so very complicated.

This is where RoR seems to be a breath of fresh air. RoR has from the beginning been a server-side rendered framework with the old-school MVC approach to render HTML using a templating language. This is dead simple to understand. The problem is that this old-school approach felt very ... well old school. Full page refreshes were a major reason that the first SPA frameworks were created.

[Hotwire](https://hotwired.dev/) is a collection of technologies for Rails that is intended to embrace "HTML Over The Wire). I'm not qualified to actually talk intelligently about how these work in practice. What I can tell you is, they make complete sense. So much so, that someone with a decade of JS/frontend experience, who has never written a line of production Ruby can follow the mental model better than what is going on in the frontend ecosystem today.

## The One Person framework

Rails has a catchy tag line of the [one person framework](https://world.hey.com/dhh/the-one-person-framework-711e6318). And man does that feel inspiring. Even me just tinkering around with it was able to get a full-stack app, with solid frontend reactivity (setup with Hotwire), a database, and web sockets up minutes. The amount that the framework gets out of your way so you can take your idea and start sprinting with that is truly impressive.

I have been in the industry long enough to know where these super opinionated can be limiting. But I also know that a lot of the times that people raise their fists in anger, is because they end up trying to fight the framework due to some ideological mismatch instead of learning to embrace the framework and how the framework expects you to view the world.

<br/>
<br/>
How long will I be on this RoR kick? Probably not long. As I said, I can't get
into the language. But while I'm here, I want to revisit my prior beliefs and 
understand a new way to look at the world. It's refreshing, it's inspiring, and
I'm having a blast.
