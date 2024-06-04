# speed

![speed in action](https://i.imgur.com/OJn4CBA.gif)

Speed read text in the terminal. Just pipe your stdin and be ready to GO!
`speed.js` accepts two arguments. The first is the speed (default: 250) in words
per minute and the second is the word number to begin at (default: 1). Use
`ctrl-c` to quit. When quitting, the command to resume where you left off is
printed to stdout.

```sh
cat poem.txt | speed 700
curl -s 'https://baconipsum.com/api/?type=meat-and-filler&format=text' | speed 500
```

## install

```sh
pnpm add --global @rasch/speed
```

<details><summary>npm</summary><p>

```sh
npm install --global @rasch/speed
```

</p></details>
<details><summary>yarn</summary><p>

```sh
yarn global add @rasch/speed
```

</p></details>
