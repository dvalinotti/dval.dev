---
title: "Creating a CLI tool using Node.js"
subtitle: "Spend time learning to save time working."
date: "2020-03-11"
category: "Tutorials"
featuredImage: cli-tool.jpg
featuredImageAlt: A picture of a computer terminal window
tags: ["tutorial", "nodejs"]
keywords: 'web development,nodejs,node,tutorial,cli,command line interface,oclif,typescript,javascript,cli-ux,npm,github,git,npm package'
---
In an attempt to learn something new about Node.js, and to improve my productivity, I began developing a CLI tool for generating React components. This would be very useful for the Next.js project that I talked about in my last post, as I could customize the file structure to the pattern I’ve already implemented (Model, View, ViewModel-ish).<!-- end -->  Through the use of the `oclif` CLI framework, it was actually pretty easy to not only develop this tool, but also to publish it on NPM so that my team members could utilize it as well. I decided to create this tutorial to share my experience and hopefully help you write tools that can make you more productive.

## Getting Started
**1. Initialize the Oclif project**

The easiest way to get a new project started is by using npx:
`npx oclif single [project name]`
You will then be prompted with several configuration options for your project. For example, in this tutorial I chose to use TypeScript. This will create a folder for your project with all of the required configuration.  Once you’re done, cd into the new directory and run
`npm install`  or `yarn install` to install the required dependencies.

To make sure that everything is situated correctly, run your CLI tool:
`./bin/run`

**2. Define the required arguments**

Our freshly-generated project gives us predefined variables to store our arguments and flags related to our cli:

`/src/index.ts`
```ts
// *** Add these imports to the beginning of the file! ***
import * as inquirer from "inquirer";
import * as fs from 'fs';
import cli from 'cli-ux';
import { createCipheriv, randomBytes, scryptSync } from 'crypto';

class Crypto extends Command {
    static description = 'describe the command here';

    static flags = {
        // add --version flag to show CLI version
        version: flags.version({char: 'v'}),
        help: flags.help({char: 'h'}),
        // flag with a value (-n, --name=VALUE)
        name: flags.string({char: 'n', description: 'name to print'}),
        // flag with no value (-f, --force)
        force: flags.boolean({char: 'f'}),
    };

    static args = [{name: 'file'}];
    ...
}
```
The difference between flags and arguments is that flags are provided when the command is executed, ie: `./bin/run --force`, whereas an argument is a value that the CLI prompts the user for during runtime.

For this example project, I am going to be making a CLI tool that takes a user input, and return a hashed string of that input. We will also be giving the user choices on what encryption algorithm they want to use.

From this example, we can see that there are two user inputs that are going to be recorded: the input string, and the encryption algorithm. Let's add those fields to our flags and arguments:

`/src/index.ts`
```ts
static flags = {
  // add --version flag to show CLI version
  version: flags.version({char: 'v'}),
  help: flags.help({char: 'h'}),
  // flag with a value (-n, --name=VALUE)
  name: flags.string({char: 'n', description: 'name to print'}),
  // flag with no value (-f, --force)
  force: flags.boolean({char: 'f'}),

  // Our new input flags
  input: flags.string({ default: '' }),
  algorithm: flags.string({
    options: ['aes-192-cbc', 'aes-256-cbc', 'des3', 'rc2']
  }),
  password: flags.string({}),
};

static args = [
  // Our new input arguments
  {name: 'input'},
  {name: 'algorithm'},
  {name: 'password'}
];
```

The reason I am defining these variables in both the flags and args options is so that a user can provide values when running the command, and the CLI will prompt the user for any undefined arguments. For example, someone could run `crypto --input=test`, because they know they want to encrypt "test" but aren't sure which algorithm they wish to use.

**3. Create input prompts**

Next, we need to define the logic that will both pull values from any provided flags, and prompt for any arguments not provided already. The "main" function of an Oclif project is `run()`, which is where we will be doing the majority of our work.

`/src/index.ts`
```ts
async run() {
  // Pulls args and flags variables from Crypto class
  const {args, flags} = this.parse(Crypto)
  // Destructure flags object to get input and algorithm
  let { input, algorithm, password } = flags;

  // If input variable is undefined...
  if (!input) {
    // cli-ux and 'cli' object provide utilities to interact
    //  with the Oclif API.
    input = await cli.prompt('String to be encrypted');
  }
  // If algorithm variable is undefined...
  if (!algorithm) {
    // inquirer is an add-on for Oclif that allows us to
    //  take different kinds of input - in this case a list
    const select = await inquirer.prompt([{
      name: 'algorithm',
      message: 'Select encryption algorithm',
      type: 'list',
      choices: [
        { name: 'aes-192-cbc' },
        { name: 'aes-256-cbc' },
        { name: 'des3' },
        { name: 'rc2' },
      ],
    }]);
    // Assign user input to algorithm variable
    algorithm = select.algorithm;
  }
  // If password is undefined...
  if (!password) {
    password = await cli.prompt('Password for encryption key');
  }
}
```
What I've done here is pretty simple - after getting the user input variables by destructuring `flags`, we simply check if each item is undefined, and if so we prompt the user with the appropriate method. In this case I am using `cli.prompt()` to get basic text inputs, and `inquirer.prompt()` to give the user a list of items to select from.

Now that we have collected the required variables, we can generate a hash from the input string and print the resulting hash to the terminal. We are going to use the imported function `createHash` to do this:

`/src/index.ts`
```ts
async run() {
  ...

  // Encryption key length is dependent on algorithm
  let keyLength: number;
  switch(algorithm) {
    case "aes-192-cbc":
      keyLength = 24;
      break;
    case "aes-256-cbc":
      keyLength = 32;
      break;
    case "des-ede3-cbc":
      keyLength = 7;
      break;
    default:
      keyLength = 24;
      break;
  }
  // Generate encryption key from password and keyLength
  const key = scryptSync(password ? password : 'password', 'salt', keyLength);
  // Define IV (Initialization vector)
  const iv = Buffer.alloc(16, 0);
  // Create Cipher object
  const cipher = createCipheriv(
    algorithm ? algorithm : 'aes-192-cbc',
    key,
    // des-ede3 algorithm does not use iv
    algorithm === 'des-ede3' ? '' : iv
  );

  this.log(`\n// Input string: ${input}`);
  this.log(`// Algorithm: ${algorithm}`);
  this.log(`// Cipher password: ${password}\n`);

  // Create the encrypted string by updating the cipher
  let encrypted: string = cipher.update(input, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  this.log(`OUTPUT: ${encrypted}`);
}
```

There's a little bit of extra work that had to go into this. Each encryption algorithm requires a different key length, so I used a switch/case statement to properly assign the `keyLength` variable. Next, we create the `key` and `iv` variables (more info about Initialization Vectors [here](https://en.wikipedia.org/wiki/Initialization_vector)). We then define the `cipher` variable by using the `createCipheriv` method from the Node.js crypto library. To actually get an encrypted value, we use the `cipher.update()` method to run the encryption, and `cipher.final()` to pull the resulting encrypted string.

**4. Running the program**

To test our program, we can run `./bin/run` in the terminal which will launch our CLI application. Congratulations! You have created your very own CLI tool to use as you please. CLI applications can be extremely powerful - and learning how to make them yourself is a great learning experience that can also improve your productivity. You can also publish your CLI tool to [npmjs.org](https://npmjs.org/) so anyone can install and use your work!

The full code for index.ts can be found [here](https://gist.github.com/dan-valinotti/6f7499d8e7a59d32f85740486ef4ba28).
