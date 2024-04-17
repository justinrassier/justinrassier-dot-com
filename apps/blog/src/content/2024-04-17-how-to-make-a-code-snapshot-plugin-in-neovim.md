---
title: How to Make a Code Snapshot Plugin in Neovim
description: 'Make your own code snapshot plugin in Neovim'
published: true
slug: 2024-04-17-how-to-make-a-code-snapshot-plugin-in-neovim
publishedDate: '2024-04-17'
---

Back in the dark days when I used VS Code ;) I loved the [CodeSnap](https://marketplace.visualstudio.com/items?itemName=adpyke.codesnap) extension. It was a super simple plugin that could take your highlighted code and quickly turn it into a nice looking image. Moving to Neovim, I missed this feature. Then I saw the [Charm.sh](https://charm.sh/) folks created a super cool new CLI tool called [Freeze](https://github.com/charmbracelet/freeze)

So instead of continuing to feeling sad about missing CodeSnap, I thought I could throw together a few lines of Lua and make my own. Hopefully seeing how simple it is to do something like this can give you your own inspiration to make your own little extensions to Neovim.

```lua
-- I always like to prefix my commands with JR so I can easily find them
vim.api.nvim_create_user_command("JRFreeze", function()
	-- snag the file type from the buffer
	local file_type = vim.bo.filetype

	-- get the text from the visual selection as a table
	local text = vim.fn.getline(vim.fn.getpos("'<")[2], vim.fn.getpos("'>")[2])

	-- join it together into one string
	local full_text = table.concat(text, "\n")

	-- write the file to /tmp/freeze...probably could find a better place to put this so it's
	-- cross platform, but it works for me ¯\_(ツ)_/¯
	local file = io.open("/tmp/freeze", "w")
	if file == nil then
		print("could not open file")
		return
	end
	file:write(full_text)
	file:close()

	-- call the freeze command with the file type we grabbed earlier
	vim.fn.system("freeze /tmp/freeze -l" .. file_type .. " -o /tmp/freeze.png")

	--  This is the tricky bit. Use apple script to copy the image to the clipboard
	vim.fn.system("osascript -e 'set the clipboard to (read (POSIX file \"/tmp/freeze.png\") as TIFF picture)'")

	-- notify the user that the image has been copied to the clipboard
	vim.notify("Image copied to clipboard", vim.log.levels.INFO)
end, {
	-- make sure the command is only available in visual mode
	range = true,
})

```
