# Signum Coin

Learn Blockchains by Building One

## Features
....

## Key concepts of Signum Coin

## How to run

### Components
Node - it is a  full blockchain node, wich exposes an API.
Wallet - UI which comunicates with blockchain Node
### Prerequisites

### How to run it
### 1. Run in development mode

1.1 Run a blockchain node
```
PORT=3000 npm run node
```
this command will run a blockchain node on PORT - 3000

2.1 Run an UI for this node
```
PORT=3001 REACT_APP_API_URI=//localhost:3000 npm start --prefix wallet
```
this command will run a UI node on PORT - 3000 and listen for a blockchain node which is running on port 3001

Run more than one node to test an application