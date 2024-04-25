---
title: Go Down the Rabbit Hole
description: 'Go down the Rabbit hole as far as it takes you to solve the problem at hand'
published: true
slug: 2024-04-24-go-down-the-rabbit-hole
publishedDate: '2024-04-24'
---

Recently I asked to make a progress bar for work. In short, it was to display the stages of a document being processed in our system. Pretty straight forward. Time to get some Angular and ngrx on.

Our API team has been busy with other tasks, so I thought I would dig deeper. It turns out the API didn't have the data available from the database. Time to get my SQL on.

Welp, turns out the data in the tables was incomplete. It was missing some of the processing stages that I wanted to surface. Time to crack open the document processing orchestration code. Time to get my Go on.

It looked like messages were being being handled out of order from an SQS queue in our job runner, time to get my concurrent Go on.

It turns out that was a red herring, but that debugging led to me finding the real issue, a bug in ML Python code wasn't properly reporting its status back to our Go document processing service. Time to get my Python on.

I'm a full stack developer at heart, but I've spent the last several years pretty much exclusively on the frontend. I think there is a lot of benefits to specializing in a slice of a tech stack if you have the luxury to do so. But there is something unbelievably rewarding to being able to go down the rabbit hole as deep as you need to go to solve a problem; such as tracing SQS queue messages in concurrent Go to find a Python bug all so you can show a simple progress bar in the browser.

Man I love what I do.
