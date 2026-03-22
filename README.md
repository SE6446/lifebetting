# lifebetting
## About
### How much are you worth as a human life?
That is a big question, I can't answer that, except if I disassemble your molecules, than you're worth about $100

Oh, you want to talk about how to play the game?
        
---

Step 1: Prepare

Step 2: Hit that start button on the top right hand corner!

Step 3: Wait for things to happen, you will be prompted with a relatable financial problem and 3 possible solutions. Chose wisely as the opps are watching and will buy or sell depending on how smart you are.

Step 4: Short Squeezes! This happens when people open a short position on your life! So go pull a GME.

Step 5: The game ends when your value hits 0. Or if you refresh the page.

---
## Install
### Download from source
Requires Node and npm to already be installed.

1. clone the repo
```
git clone https://github.com/SE6446/lifebetting.git
```

2. download dependancies
```
cd ./lifebetting
npm install
```
You should only need to install express.js.

3. run
```
npm run run
```

### Docker
#### GHCR *Currently broken
If all checks have passed in main we push to GCHR. Then to run it is as simple as:
```
docker pull ghcr.io/se6446/lifebetting:latest
docker run --name lifebetting ghcr.io/se6446/lifebetting:latest
```
#### Docker-compose
```
git clone https://github.com/SE6446/lifebetting.git
cd ./lifebetting
docker compose up .
```


