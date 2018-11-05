# Vitriol - a distributed, serverless web publishing platform

## See the live app at [https://vitriol.co](https://vitriol.co)

Intro post (available on Vitriol at [this address](https://vitriol.co/QmccRaHCrUKZwZpjdJFiTTdgp8FG3ALFDZQexaYgit3NCF/QmYJvZjnw8c1DqFbW1BpWmvb3jVg8fQYRUs6UzzEyosagA)):

### What is Vitriol?
If you're reading this, you already understand half of what Vitriol is: a free, web-based tool to edit and publish articles like this one on the Internet. With it, you can write your articles, organised in what we call a feed, and share their URL on the Internet. Other people can click on that URL, like you did for this article, and read them. Easy.

### Why is it different?
Normally, when you publish an article using a regular web-based tool (say a micro-blogging service, or an online publishing platform), you post your articles to their servers and they will store and serve them for a fee (a material one, like a credit card monthly payment or an immaterial one, like your personal data).

With Vitriol, the model is radically different: you can write your articles on your phone or computer and publish them. Once you publish one of them and share its address, your phone or computer will directly share it to people who try to access it from their phones with the URL. While they're reading it, they will also share a copy of it it to new readers who try access it, and so on, which means that your article will be accessible even if you're offline, *as long as someone is reading (sharing) it*. No servers and infrastructures are needed, because the whole network will automatically replicate data to anyone who requests it. **This also means that it will be impossible for third parties to limit access to your articles**.

Finally, if other user decides to pin your feed, they will actively follow it, which means they will automatically sync your articles on their device and automatically share them with anyone as soon as you publish them. In exchange, they will receive automatic notifications about your new content and will be able to auto-download and instantly access it. For example, the URL for the feed of the current article is https://vitriol.co/QmccRaHCrUKZwZpjdJFiTTdgp8FG3ALFDZQexaYgit3NCF (you can also get there by clicking on the author name at the start of this page). If you go to the feed and click the pin button, which looks like a tag, this feed will be pinned and you will be able to access it again in Vitriol's "feeds" tab.

### What's next
Vitriol is a project in alpha stage. One of the major limitations is that a Vitriol feed is currently linked to a single device; that is, there's no way to publish to the same feed on your phone and your desktop computer. There are ways to implement that, but I'd like to [hear from you](mailto://vitriol@vitriol.co) on what direction this software should take.

### Want to participate?
Vitriol is an open source project. Its code can be found [here](https://gitlab.com/vitriolum/vitriol-web). Please feel free to look at the code, [open a ticket](https://gitlab.com/vitriolum/vitriol-web/issues) or even [propose a merge request](https://gitlab.com/vitriolum/vitriol-web/merge_requests).

Vitriol is based on the excellent [OrbitDB](https://github.com/orbitdb/orbit-db) project, which in turn is based on [the pure JavaScript implementation](https://github.com/ipfs/js-ipfs) of [IPFS](https://ipfs.io/). Supporting these two project supports Vitriol, so please take a look, if you are a developer.

## How to run this project locally

- Clone it
- `npm start`

The project is based on [Create React App](https://github.com/facebook/create-react-app).