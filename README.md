# balancer-tools-v2
Balancer Tools v2 front-end

## Balancer v2 protocol tooling interface

An open-source interface to interact with balancer tech.


Release URL: https://defilytica.tools

## Development

### Configure .env environment
- replace sample .env_example file with your data
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
defilytica.tools is a community tooling site to better understand ecosystems like the Balancer protocol. 
It provides advanced tools like a veBAL boosting calculator, impermanent loss calculator and much more.

## Planned features

* veBAL boost calculator
* veBAL gauge multi-voter
* Governance tooling such as a gauge PR creator

## Future features in review

* Metamask integration
* Impermanent loss calculation per address
* Incentives overview with APR ranges for new gauge system
* Fallback UI to withdraw funds from Balancer pools / contracts
* Helpers such as gauge vote allocation
* Governance / authorization views