---
title: "console.trace(), Explained"
subtitle: "When console.log() just doesn't cut it."
date: "2021-05-30"
featuredImage: own-your-error.jpg
featuredImageAlt: "Scrabble pieces spelling \"OWN YOUR ERROR\""
tags: ["javascript", "tutorials"]
keywords: 'javascript,js,web development,webdev,console,console.trace,trace,console.log,debugging,debug'
---

## Introduction

Every JavaScript developer has done this, and if you tell me you haven't, you're lying.

```js {}[example.js]
function doTheThing() {
  console.log('here')
  // ...
}
```

There's nothing wrong with throwing a `console.log('here')` message - sure, it's not the best form of debugging, but it works. It's just about the quickest way to figure out what functions are being called, or maybe trying to figure out if you're passing one condition or another. In frustrating debugging sessions, I've often logged function names to the console to make sure that they are being called in the correct order:

```js {}[example.js]
function thingOne() {
  console.log('thingOne')
}

function thingTwo() {
  console.log('thingTwo')
}

function drSeuss() {
  thingOne() // log thingOne
  thingTwo() // log thingTwo
}
```

Simple enough. However, I've recently run into a complex issue that required more than CS101-levels of debugging, and found something very helpful that some developers might not have ever heard of or used themselves.

## Scenario

Lets say I'm working on a module for an Ecommerce application, and I'm writing a function that retrieves customer checkout data from a database:

```js {}[products.js]
import ProductModel from '~/models/Product'

class Products {
  async getProductById(id) {
    try {
      return await ProductModel.findById(id)
    } catch (err) {
      console.log(err)
    }
  }
  
  // other functions
}
```

My Ecommerce store might call this function in several places to get a product's data - for example, on a Product Detail Page and in a "Recommended Products" section in my Cart component. Unfortunately, I'm running into some error as a result of calling my function and I'm not really sure why or where this issue is happening. I will probably see something like this in the dev console:

![Console.log error in devtools](/img/console-log-error.png)

In the screenshot, you'll see those extra couple of lines under my error message that show the stack trace of where the error-throwing function was called. This is helpful, but in some circumstances you won't be provided this much information.

For example, I'm working on a server-side rendered frontend application, and I was calling a function that would work fine when called from the client-side, but on initial page load the server would call that function and encounter an error. Our app would redirect the user to an error page, and we could log the error to the console, but it didn't provide the information necessary to find what was causing this error and why. Our JavaScript code was being bundled and abstracted in ways that made the stack trace not particularly helpful or clear.

Until I read about `console.trace`.

## What is `console.trace`?

You've probably heard of the most popular JavaScript console logging functions - `log`, `warn`, `error`, maybe you've even seen `table` or `group` in another blog post. The `console.trace` function is kind of the Black Sheep of the group, often overshadowed by `console.error`, which you've probably seen a lot of in any error-handling module.

What `console.trace` does is pretty straightforward - it prints whatever message you provide in the parameters, along with the full stack trace of all the function calls that finally lead to that message being printed. You're probably thinking that this is exactly what `console.error` does - and you'd be right, honestly. Calling `trace` would be most appropriate, for example, when you have a function that is called in many places, and you want to find out all the instances of that function being called in a page or module. Calling `erorr` would make more sense, obviously, if you're logging the output of an Error and need to trace it back to the source.

## Example

Here's an example to demonstrate these use cases:

```js {}[store.js]
import UserModel from '../models/User';

async function getUserById(id) {
  return await UserModel.findById(id)
}

async function getCheckoutData(id) {
  const user = await getUserById(userId)
  return user.checkout
}

async function loadPageData() {
  const userId = sessionStorage.getItem('userId')

  const [user, checkout] = await Promise
    .all([
      getUserById(userId),
      getCheckoutData(userId),
    ])

  // Apply user and checkout data to the template
  // or something like that.
}

loadPageData()
```

Lets break down this example - I wrote functions that might handle the retrieval of a user's cart from a database, and these functions are called on page load. I've got a cart sidebar component that needs cart data, and a button on my nav bar that shows the currently-logged in user's profile picture. Somewhere along the way, I start encountering an error that is logged to the dev console, for example:

`Uncaught (in promise) ReferenceError: userId is not defined`

So clearly there is an issue somewhere in my code where `userId` is being used, but its not really clear which one is causing the issue. I'm also calling two async functions concurrently with `Promise.all`, so its unclear to me where the issue is coming from.

One thing I could do to re-*trace* (get it?) my steps is to put a `console.trace` statement in my `getUserId()` function, seen on line 3:

```js{}[store.js]
// ...
async function getUserById(id) {
  console.trace(`Getting user ${id}`);
  return await UserModel.findById(id)
}
// ...
```



<!-- ## Personal Scenario -->

<!-- I'm currently working on a Server-side Rendered web application (NuxtJS). If you're unfamiliar with Nuxt or other SSR frameworks (like NextJS or SvelteKit), the way it works is that when a client browser requests a page of your app, an HTTP server application handles the request, makes any required external requests to APIs, and renders the HTML/CSS/JS *before sending it to the client*. When the client gets a response, the page is completely loaded with all content. This is very different from Single-Page Applications, which send a bundled JavaScript package with all of your application code and executes that JS on the browser.

SSR comes with a lot of benefits, particularly performance and Time to Interactive improvements, but it also comes with its own set of challenges.

My team was dealing with a strange issue - our application, along with its frontend code, also included some custom server-side API routes to handle communication with other APIs that require private key auth. One of our pages would make a call to our custom API route when the page started rendering, but we kept getting generic request failed errors. What was weird was that **this was only happening on initial page load** - if you navigated from some other page to the one making this erroneous API request, no error would appear.

It took us some time debugging to come to the conclusion that the error source was some  -->
