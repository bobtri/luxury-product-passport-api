# Luxury Product Passport API

A blockchain-based REST API for digital product passports and ownership verification of luxury goods.

The project demonstrates how blockchain technology and Proof-of-Work can be used to create a verifiable ownership history for luxury products such as watches, handbags, and other high-value goods.

## Purpose

Counterfeit luxury products are a major problem, and buyers may have difficulty verifying a product's ownership history.

This API uses a unique serial number to represent a digital product passport. The first ownership transaction creates the product's initial ownership record, and subsequent ownership transfers are stored as transactions in a blockchain ledger.

The system allows users to:

- Create a digital product passport through its first ownership transaction
- Transfer ownership between users
- Prevent unauthorized ownership transfers
- Mine pending transactions into blocks using Proof-of-Work
- Verify the complete ownership history of a product
- Determine the current owner of a product
- Detect manipulation of previously mined blockchain data

## Technologies

- Node.js
- Express
- Node.js built-in `crypto` module
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
- Nonce handling
- Proof-of-Work mining

`Blockchain.js` handles:

- Genesis block creation
- Blockchain storage
- Pending transactions
- Ownership state validation
- Mining pending transactions
- Product ownership history
- Current ownership lookup
- Blockchain integrity validation

### Controllers

Controllers handle HTTP requests and responses and communicate with the blockchain engine.

### Routes

Routes map the REST API endpoints to the appropriate controller functions.

### Middleware

Middleware validates incoming transaction data before it reaches the blockchain logic.

## Transaction Model

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

The first transaction establishes the initial ownership record for the product.

## Ownership State Validation

The backend validates ownership before accepting a new ownership transaction.

Example:

```text
Rolex-Manufacturer → Alice   VALID
Alice → Bob                  VALID
Charlie → David              REJECTED
```

If Bob is the current owner, another user cannot transfer the product on Bob's behalf.

The system checks both mined transactions and pending transactions when determining the current owner. This prevents conflicting ownership transfers from being submitted before the previous transfer has been mined.

## Proof-of-Work

Each new block is mined using a Proof-of-Work algorithm.

A block contains a `nonce` that is repeatedly incremented until the SHA-256 hash starts with the required number of leading zeroes.

Example with difficulty 2:

```text
004e4650f15406350362a7e58a899d6f5167a44c43f6ee131eccceeb6fb5a28b
```

The mining loop uses the built-in Node.js `crypto` module to calculate SHA-256 hashes.

The default Proof-of-Work difficulty is `2`.

A different difficulty can be supplied through the environment when starting the application:

```bash
POW_DIFFICULTY=1 npm start
```

An example configuration is also provided in `.env.example`.

## Blockchain Integrity

Each block stores the hash of the previous block, linking the blocks together.

The `isChainValid()` method verifies:

1. That each stored block hash still matches the block's current data
2. That each block correctly references the hash of the previous block

The ledger is therefore tamper-evident. If previously mined transaction data is modified, the calculated hash no longer matches the stored hash and `isChainValid()` returns `false`.

## REST API

### Get Blockchain

```http
GET /api/chain
```

Returns the complete blockchain and any pending transactions.

### Add Transaction

```http
POST /api/transactions
```

Example request body:

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

The request is validated before the transaction is accepted.

If an existing product is transferred by someone who is not its current owner, the transaction is rejected.

### Mine Pending Transactions

```http
POST /api/mine
```

Creates a new block containing the pending transactions and executes the Proof-of-Work mining process.

After successful mining, the block is added to the blockchain and the pending transaction list is cleared.

### Verify Product

```http
GET /api/verify/ROLEX-SUB-9981
```

Returns the complete ownership history and current owner of the product.

Example response:

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

If the serial number does not exist, the API returns HTTP status `404`.

## Installation

Install the project dependencies:

```bash
npm install
```

Start the API:

```bash
npm start
```

By default, the server runs on:

```text
http://localhost:3000
```

A custom port can be supplied through the environment:

```bash
PORT=4000 npm start
```

## Testing

Run the tests in watch mode:

```bash
npm test
```

Run all tests once:

```bash
npm run test:run
```

Generate a test coverage report:

```bash
npm run coverage
```

The test suite uses Vitest for unit testing and Supertest for REST API testing.

At the time of submission, the project contains:

```text
Test Files: 3 passed
Tests:      19 passed
```

The test suite covers:

- SHA-256 block hashing
- Proof-of-Work mining
- Genesis block creation
- Pending transactions
- Valid ownership transfers
- Unauthorized ownership transfers
- Product history
- Blockchain integrity
- REST API endpoints
- Request validation
- Unknown product handling
- Clearing pending transactions after mining

## Test-Driven Development

The project was developed incrementally using Test-Driven Development (TDD).

Core functionality was implemented using a RED → GREEN workflow:

```text
1. Write a failing test
2. Run the test and verify that it fails
3. Commit the failing test
4. Implement the required functionality
5. Run the tests until they pass
6. Commit the working implementation
```

The Git history contains separate test and implementation commits that demonstrate this workflow.

## Example Ownership Lifecycle

```text
Luxury product
      │
      ▼
Rolex-Manufacturer
      │
      ▼
    Alice
      │
      ▼
     Bob
```

Each ownership change is represented by a transaction.

Transactions are validated against the current ownership state before being accepted. Pending transactions are then mined into the blockchain using Proof-of-Work.

This creates a verifiable and tamper-evident digital ownership history for the luxury product.

## Data Storage

This project stores the blockchain in memory for demonstration purposes.

Restarting the Node.js server resets the blockchain and all transaction data. A production implementation would require persistent storage and additional security mechanisms.
