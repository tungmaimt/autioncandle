# Candlestick Chart + Aution app


2 app in 1 project
- Candlestick Chart frontend with React
- Aution api backing with nodejs

## Candlestick Chart

Stack: React + Typescript + Vite

- Using binance websocket to get data from ticker price and klines data every 10s.
- BNB/USDT and ETH/USDT is the symbol to get data

### How to run

Add `.env` file and update its content with VITE_API_URL variable, which is your backend api url.

.env
```
VITE_API_URL=http://localhost:3000
```
run dev

```
npm run dev
```

Fontend at: [localhost:5173](http://localhost:5173)

## Aution app

Stack: Nodejs - Express + Mongodb

- Simple login/register api with email and password.
- Aution api with get and submit aution.

### How to run

Add `.env` file and update its content with MONGO_STRING and JWT_KEY variable (view .env.exemple).

.env
```
MONGO_STRING=mongodb://username:password@mongo.url:port/batabase
JWT_KEY=somekey
```

run app

```
node app.js
```

Backend at: [localhost:3000](http://localhost:3000)