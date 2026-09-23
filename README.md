# CryptoPulse - Cryptocurrency Market Dashboard

CryptoPulse is a full-stack cryptocurrency market dashboard that displays live cryptocurrency market data using the CoinMarketCap API.

## Features

- Live cryptocurrency prices
- Cryptocurrency ranking
- Market capitalization
- 24-hour trading volume
- 24-hour price change
- 24-hour market performance chart
- Search cryptocurrencies by name or symbol
- Cryptocurrency logos
- Manual refresh button
- Automatic data refresh every 60 seconds
- Responsive dark-themed dashboard
- Node.js and Express backend
- React.js frontend

## Tech Stack

### Frontend
- React.js
- Vite
- Recharts
- CSS

### Backend
- Node.js
- Express.js
- REST API

### API
- CoinMarketCap API

## Project Architecture

CoinMarketCap API
        ↓
Node.js + Express Backend
        ↓
/api/crypto
        ↓
React Frontend
        ↓
CryptoPulse Dashboard

## Project Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd crypto-dashboard
