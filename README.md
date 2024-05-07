# Singularity Web SDK Boilerplate

Welcome to the Singularity Web SDK Boilerplate! This project demonstrates the integration of `snet-sdk-web`, focusing on wallet management and service utilization within the SingularityNET ecosystem. It supports two types of wallets: a browser extension wallet similar to MetaMask and a social authentication-based wallet.


### Features:
- Integration of desktop/mobile and social authentication-based wallets.
- Seamless interaction with SingularityNET services using `snet-sdk-web`.
- Facilities to purchase AGIX tokens through on-ramp service.


### Service details:
**Organization ID:** snet \
**Service:** Text Summaries(news-summary) \
**Service URL:** https://beta.singularitynet.io/servicedetails/org/snet/service/news-summary \
**Network:** Ethereum Mainnet \
**Description:** This service offers a concise summary of news articles. Based on input text the service returns a summarized version of the content.


## Getting Started

### Prerequisites
- Node.js (v18 or higher)

### Installation
1. Clone the repository and navigate to the directory:
```bash
git clone https://github.com/singnet/ICP-boilerplate
cd ICP-boilerplate
```

2. Copy the .env.example file to .env and update the values as necessary:
```bash
cp .env.example .env
```

3. Install the required dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm start
```
