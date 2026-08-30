# Luxury Product Passport API

A blockchain-based REST API for digital product passports and ownership verification of luxury goods.

The project demonstrates how blockchain technology and Proof-of-Work can be used to create a verifiable ownership history for luxury products such as watches, handbags and other high-value goods.

## Purpose

Counterfeit luxury products are a major problem, and buyers may have difficulty verifying a product's history and ownership.

This API creates a digital product passport identified by a unique serial number. Ownership transfers are stored as transactions in a blockchain ledger.

The system allows users to:

- Register a luxury product and its first owner
- Transfer ownership between users
- Prevent unauthorized ownership transfers
- Mine transactions into blockchain blocks using Proof-of-Work
- Verify the complete ownership history of a product
- Detect manipulation of blockchain data

## Technologies

- Node.js
- Express
- Node.js `crypto`
- Vitest
- Supertest
- JavaScript ES Modules

## Architecture

The application separates responsibilities into different layers:

```text
src/
├── controllers/
│   └── blockchainController.js
├── engine/
│   ├── Block.js
│   └── Blockchain.js
├── middleware/
│   └── validateTransaction.js
├── routes/
│   └── blockchainRoutes.js
├── app.js
└── server.js

tests/
├── Block.test.js
├── Blockchain.test.js
└── api.test.js
```

### Engine

The blockchain engine contains the core blockchain and business logic.

`Block.js` handles:

- SHA-256 hashing
- Nonce
- Proof-of-Work mining

`Blockchain.js` handles:

- Genesis block
- Blockchain storage
- Pending transactions
- Ownership state validation
- Mining transactions
- Product history
- Current ownership
- Blockchain integrity validation

### Controllers

Controllers handle HTTP requests and responses and communicate with the blockchain engine.

### Routes

Routes map the REST API endpoints to the appropriate controller functions.

### Middleware

Middleware validates incoming transaction data before it reaches the blockchain logic.

## Transaction model

Example ownership transaction:

```json
{
  "serialNumber": "ROLEX-SUB-9981",
  "brand": "Rolex",
  "model": "Submariner",
  "fromAddress": "Rolex-Manufacturer",
  "toAddress": "Alice",
  "timestamp": 1788100000000
}
```

Each product is identified by its unique `serialNumber`.

## Ownership state validation

The backend validates ownership before accepting a transaction.

Example:

```text
Rolex-Manufacturer → Alice   VALID
Alice → Bob                  VALID
Charlie → David              REJECTED
```

If Bob is the current owner, another user cannot transfer the product.

The system checks both mined transactions and pending transactions when determining the current owner. This prevents conflicting ownership transfers from being submitted before mining.

## Proof-of-Work

Each new block is mined using a Proof-of-Work algorithm.

The block contains a `nonce` that is repeatedly incremented until the SHA-256 hash starts with the required number of zeroes.

Example with difficulty 2:

```text
004e4650f15406350362a7e58a899d6f5167a44c43f6ee131eccceeb6fb5a28b
```

The mining loop uses Node.js built-in `crypto` module.

Difficulty can be configured using:

```env
POW_DIFFICULTY=2
```

## Blockchain integrity

Each block stores the hash of the previous block.

The `isChainValid()` method verifies:

1. That each stored block hash still matches the block data
2. That each block correctly references the previous block

Changing an existing transaction therefore causes blockchain validation to fail.

## REST API

### Get blockchain

```http
GET /api/chain
```

Returns the blockchain and pending transactions.

### Add transaction

```http
POST /api/transactions
```

Example body:

```json
{
  "serialNumber": "ROLEX-SUB-9981",
  "brand": "Rolex",
  "model": "Submariner",
  "fromAddress": "Rolex-Manufacturer",
  "toAddress": "Alice",
  "timestamp": 1788100000000
}
```

### Mine pending transactions

```http
POST /api/mine
```

Creates and mines a new block containing the pending transactions.

### Verify product

```http
GET /api/verify/ROLEX-SUB-9981
```

Returns the complete transaction history and current owner of the product.

Example:

```json
{
  "serialNumber": "ROLEX-SUB-9981",
  "currentOwner": "Bob",
  "history": [
    {
      "serialNumber": "ROLEX-SUB-9981",
      "brand": "Rolex",
      "model": "Submariner",
      "fromAddress": "Rolex-Manufacturer",
      "toAddress": "Alice",
      "timestamp": 1788100000000
    },
    {
      "serialNumber": "ROLEX-SUB-9981",
      "brand": "Rolex",
      "model": "Submariner",
      "fromAddress": "Alice",
      "toAddress": "Bob",
      "timestamp": 1788100001000
    }
  ]
}
```

Unknown serial numbers return HTTP `404`.

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Start the API:

```bash
npm start
```

The server runs on:

```text
http://localhost:3000
```

## Environment variables

Example configuration:

```env
PORT=3000
POW_DIFFICULTY=2
```

See `.env.example`.

## Testing

Run the tests:

```bash
npm test
```

Run all tests once:

```bash
npm run test:run
```

Generate test coverage:

```bash
npm run coverage
```

The project contains unit and API tests using Vitest and Supertest.

Current test suite:

```text
Test Files: 3 passed
Tests:      19 passed
```

Current coverage:

```text
Statements: 96.38%
Branches:   90%
Functions:  100%
Lines:      96.34%
```

## TDD

The project was developed incrementally using Test-Driven Development.

Core functionality was implemented using a RED → GREEN workflow:

1. Write a failing test
2. Commit the failing test
3. Implement the functionality
4. Run the tests until they pass
5. Commit the working implementation

The Git history contains the individual test and implementation commits.

## Example ownership lifecycle

```text
Luxury product created
        ↓
Rolex-Manufacturer
        ↓
      Alice
        ↓
       Bob
```

Each ownership change becomes a transaction.

Transactions are validated before being accepted and are subsequently mined into the blockchain using Proof-of-Work.

This creates a verifiable digital ownership history for the luxury product.
