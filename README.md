# balancer-tools-v2
Balancer Tools v2 front-end

## Balancer v2 protocol tooling interface

An open-source interface to interact with balancer tech.


Release URL: https://balancer.tools

## Development

### Configure .env environment
- replace sample .env_example file with your file
- rename to .env
- do not store sensitive API keys in this file

### Install Dependencies

```bash
yarn install
```

### Run

```bash
yarn start
```

## What this project wants to achieve
Balancer.tools is a community tooling site to better understand the Balancer ecosystem. It provides advanced tools like a veBAL boosting calculator, impermanent loss calculator and much more.

## Current features

* veBAL boost calculator
* Impermanent loss calculator
* Price impact calculator for swaps and investments
* Endpoint status checker

## Future features in review

* Metamask integration
* Impermanent loss calculation per address
* Incentives overview with APR ranges for new gauge system
* Fallback UI to withdraw funds from Balancer pools / contracts
* Helpers such as gauge vote allocation
* Governance / authorization views