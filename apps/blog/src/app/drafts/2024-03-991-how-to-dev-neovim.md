---
title: A Simple Trick for Tinkering in Neovim
description: 'How to easily create things in Neovim and get fast feedback'
published: false
slug: 2024-03-991-scratch-your-own-itch
publishedDate: '2024-03-991'
---

Adding little bits of custom functionality to my Neovim life is one of my favorite things to do. It's just so dang satisfying. Slamming together a little Lua snippet is easy, but the feedback look of saving, closing Neovim, opening it, and testing it is pretty tedious. Here is a simple trick I use to to iterate faster.

First I created a file inside of my Neovim config `lua/jr/custom/playground.lua`

```lua
vim.api.nvim_create_user_command("RunThing", function(opts)
 print("Hello Neovim")
end
```

Then I created a simple custom keymap

```lua
vim.keymap.set("n", "<leader><leader>x", function()
  -- clear any messages
	vim.cmd("messages clear")
  -- re-source the file
	vim.cmd("luafile ~/.config/nvim/lua/jr/custom/playground.lua")
  -- execute the custom command to run the code
	vim.cmd("RunThing")
end)

```

So now I can throw some Lua code together, then test it out by running `<leader><leader>x`

It's not perfect, but it shortens the feedback loop significantly, which means I can throw together a [silly idea](https://www.justinrassier.com/blog/posts/2024-03-10-scratch-your-own-itch) the moment it pops into my head.
