# Singularity Web SDK Boilerplate User Guide

Welcome to the Singularity Web SDK Boilerplate User Guide! This document will provide step-by-step instructions on setting up, configuring, and using the boilerplate project to integrate with SingularityNET services.

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Generating JavaScript Files for Your Services](#generating-javascript-files-for-your-services)
5. [Configuration](#configuration)
6. [Running the Project](#running-the-project)
7. [Interacting with the Example Service](#interacting-with-the-example-service)
8. [Deploying to Internet Computer (ICP)](#deploying-to-internet-computer-icp)

## Introduction

The Singularity Web SDK Boilerplate is designed to demonstrate the integration of `snet-sdk-web` for wallet management and service utilization within the SingularityNET ecosystem. It supports two types of wallets: a browser extension wallet similar to MetaMask and a social authentication-based wallet.

### Features:
- Integration of desktop/mobile and social authentication-based wallets.
- Seamless interaction with SingularityNET services using `snet-sdk-web`.
- Facilities to purchase AGIX tokens through on-ramp service.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- Node.js (v18 or higher)

## Installation

Follow these steps to set up the project:

1. **Clone the repository and navigate to the directory:**
```bash
   git clone https://github.com/singnet/ICP-boilerplate
   cd ICP-boilerplate
```
2. **Copy the .env.example file to .env and update the values as necessary:**
```bash
   cp .env.example .env
```
3. **Install the required dependencies:**
```bash
   npm install
```

## Generating JavaScript Files for Your Services

To interact with your own SingularityNET services, you need to compile the `.proto` files from your service to JavaScript files

### Steps to Generate JS Files

Follow the steps mentioned in the official [documentation](https://github.com/improbable-eng/grpc-web/blob/master/client/grpc-web/docs/code-generation.md) to generate `js` stubs from `.proto` definitions. Additionally, provide the `namespace_prefix` flag to the generator.

#### Example Command for Linux
```bash
protoc ^
protoc \
--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
--js_out=import_style=commonjs,binary,namespace_prefix=[package name]_[org id]_[service]:. --ts_out=service=grpc-web:. \
[proto file name].proto
```
#### Example Command for Windows CMD
```bash
protoc ^
--plugin=protoc-gen-ts=%cd%/node_modules/.bin/protoc-gen-ts.cmd ^ --js_out=import_style=commonjs,binary,namespace_prefix=[package name]_[org id]_[service]:. --ts_out=service=grpc-web:. ^
[proto file name].proto
```
After that you need to place them in the `src/ExampleService/assets` folder to use it in your service component.

## Configuration

The project requires certain environment variables to be set in the `.env` file. Below is a list of the required variables and their descriptions:

| Variable Name                        | Description                                             | Where to Get It                      |
|--------------------------------------|---------------------------------------------------------|--------------------------------------|
| `REACT_APP_ENV`                      | Specifies the environment (`development` or `production`). | Set this manually.                   |
| `REACT_APP_ALCHEMY_API_KEY`          | API key for accessing Alchemy services.                 | [Alchemy API Keys](https://alchemy.com) |
| `REACT_APP_PARTICLE_AUTH_PROJECT_ID` | Project ID for Particle authentication.                 | [Particle Network](https://particle.network/) |
| `REACT_APP_PARTICLE_AUTH_CLIENT_KEY` | Client key for Particle authentication.                 | [Particle Network](https://particle.network/) |
| `REACT_APP_PARTICLE_AUTH_APP_ID`     | Application ID for Particle authentication.             | [Particle Network](https://particle.network/) |
| `REACT_APP_NETWORK`                  | Specifies the blockchain network to connect to (`mainnet` or `sepolia`). | Set this manually.                   |
| `REACT_APP_INFURA_PROJECT_ID`        | Project ID for accessing Infura services.               | [Infura](https://infura.io)          |
| `REACT_APP_WALLET_CONNECT_PROJECT_ID`| Project ID for Wallet Connect integration.              | [Wallet Connect](https://walletconnect.com/) |

## Running the Project

Once the environment variables are set, you can run the project using the following command:
```
npm start
```

## Interacting with the Example Service

The project comes pre-configured with two example services: one for the Ethereum Mainnet and one for the Sepolia Testnet. You can interact with these services through the `ExampleService` and `TestExampleService` components.

### Configuring the Service

To configure the project to work with your service, you need to specify the `orgId` and `serviceId` in the `src/config/service.ts` file. There are two configurations: one for mainnet and one for sepolia testnet.

1. Open the `src/config/service.ts` file.
2. Update the `orgId` and `serviceId` values to match your desired SingularityNET service.
   orgId: "your-organization-id",
   serviceId: "your-service-id"

### Using the ExampleService Component

The `ExampleService/TestExampleService` component provides a user interface for interacting with your service on the Ethereum/Sepolia network.

#### UI Components
- **Textarea**: Used to capture user input.
- **ActionButton**: Custom button to trigger the service call, displaying the cost of the service and a loading indicator.
- **DebugConsole**: Displays debugging information when in development mode, conditionally rendered based on the `REACT_APP_ENV` flag.

#### Functions

- **newChat**: Adds a new chat message to the conversation.
```typescript
  newChat("user", "This is a user's message.");
  newChat("bot", "This is a bot's response.");
```
- **runService**: Sends a request to the text service with the user-provided text and handles the response. Replace the service call and response handling in the `runService` function with the appropriate calls to your own service as defined in the protobuf files.
```typescript
  import { example } from "./assets/mainnet/summary_pb_service";

  async function runService(text) {
    const invokeOptions = {
      request: { text: text },
      host: "https://your-service-host",
    };

    try {
      const response = await clientSDK.unary(example.TextSummary.summary, invokeOptions);
      newChat("bot", response.getText());
    } catch (error) {
      console.error("Error running service:", error);
    }
  }
```
### How to Use

1. **Entering Text**: Enter the text in the provided text area.
2. **Sending Request**: Click the `ActionButton` to send the text to the service.
3. **Viewing Responses**: Responses from the service will be displayed in the chat area.

## Deploying to Internet Computer (ICP)

To deploy this project to the Internet Computer (ICP), follow these steps:

1. **Build the Project**: Before deploying, build the project using the following command:
   npm run build

2. **Install DFX (ICP SDK)**: Install the DFX SDK by following the instructions on the official ICP documentation: [Installing DFX via DFX-VM](https://internetcomputer.org/docs/current/developer-docs/getting-started/install/#installing-dfx-via-dfxvm).

3. **Get ICP Cycles and Deploy to Mainnet**: Obtain some ICP cycles and deploy the project to the mainnet by following the instructions on the ICP documentation: [Get ICP Cycles and Deploy to Mainnet](https://internetcomputer.org/docs/current/developer-docs/getting-started/deploy/mainnet).

---

By following this guide, you should be able to set up, configure, and use the Singularity Web SDK Boilerplate to integrate with SingularityNET services and deploy your project to the Internet Computer.
