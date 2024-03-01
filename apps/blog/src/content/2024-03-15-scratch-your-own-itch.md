---
title: Scratch Your Own Itch
description: 'Scratch your own itch and make things that work for you'
published: false
slug: 2024-02-21-scratch-your-own-itch
publishedDate: '2024-02-21'
---

I have had a weird inverse form of impostor syndrome for most of my career. I have been coding for over a decade, yet when it came to making something that I thought would be cool to have, whether that be a plugin in my editor or even a tool to do some personal task, I would freeze. I would tell myself

> Surely if this was the right way to do something, it would already exist

Odd right? It's sort of counter to the normal narrative you hear about the developer mindset. This all changed when I started to use Neovim (oh yeah, I use Neovim BTW)

I'm not here to sell you on the virtues of Neovim, and why I'm better than you. I just want to tell you that if you are like past-me you can find a ton of joy in making your workflow work for you. It doesn't have to work for everyone. Here is a list of things I made ranging from silly to super useful:

- Time tracker using sqlite3 based on my checked out branch. It keeps a timer running as I am in my editor, using the current branch name as the key. After a timeout, it logs the time to sqlite3 and resets the timer. Then when I call a command, it will sum up the time and hit our Jira API to log the time.
- Custom key mappings to jump me around my Angular project (component -> template -> styles -> spec files)
- Lualine notification when I have outstanding PRs to review
- Custom telescoope pickers that hit my work's Jira API and GitHub org
- An "explain this code" plugin that takes your highlighted code, hits the Open AI API, and returns a summary of what the code does in a popup
- Custom test runner with inline exmarks for test results - This one I use every single day as it makes my test life so much better. This was inspired by a [video tutorial from TJ DeVries](https://www.youtube.com/watch?v=HlfjpstqXwE)

So go get creative. Make something that works for how your brain operates. Scratch your own itch. I spent too many years assuming I had to conform to how everyone else worked, instead of having fun finding what works for me.
