# Desafio de Desenvolvedor Blockchain: Emissor de Certificados

Este projeto implementa uma solução completa para a emissão de certificados digitais utilizando a blockchain. A aplicação permite que um usuário conecte sua carteira digital, preencha os dados de um certificado e o emita, registrando um hash do conteúdo de forma imutável na blockchain e armazenando os metadados no IPFS.

Este `README` serve como um guia completo para a configuração, execução e teste da funcionalidade de blockchain implementada como solução para o **Problema 3: Blockchain Developer Challenge**.

## ✨ Funcionalidades Implementadas

- **Conexão com Carteira:** Integração com Metamask utilizando Wagmi e RainbowKit.
- **Emissão de Certificado:** Formulário para inserir dados do aluno, curso e data, que são então enviados para o IPFS.
- **Armazenamento em IPFS:** Os metadados do certificado são enviados para o Pinata (serviço de IPFS) e o CID (Content Identifier) retornado é armazenado na blockchain.
- **Contrato Inteligente (`Certificate.sol`):** Contrato em Solidity para registrar e verificar o CID dos certificados emitidos.
- **Verificação On-chain:** Um script utilitário permite verificar o último CID registrado no contrato, provando a emissão.
- **Interface Reativa:** A aplicação utiliza React, Material-UI e Redux Toolkit para uma experiência de usuário fluida.

## 🛠️ Tecnologias Utilizadas

- **Frontend:**

  - **Framework:** React 18 + TypeScript
  - **Build Tool:** Vite
  - **UI:** Material-UI (MUI) v6
  - **Blockchain/Web3:** Wagmi, Viem, RainbowKit, Ethers.js
  - **State Management:** Redux Toolkit

- **Blockchain:**

  - **Ambiente:** Hardhat
  - **Linguagem:** Solidity (`^0.8.24`)
  - **Rede Local:** Hardhat Network

- **Armazenamento Descentralizado:**

  - **Serviço:** IPFS através do Pinata

- **Dependências do Projeto Original:**
  - **Backend:** Node.js, Express, PostgreSQL
  - **Banco de Dados:** PostgreSQL

## 📂 Arquivos Relevantes

- `blockchain/contracts/Certificate.sol`: O contrato inteligente que governa a lógica de emissão.
- `blockchain/scripts/deploy.js`: Script para fazer o deploy do contrato na rede.
- `blockchain/scripts/verify-last-tx.js`: Script para verificar o último certificado emitido.
- `blockchain/hardhat.config.js`: Configuração do ambiente Hardhat.
- `frontend/src/providers.tsx`: Arquivo central que configura todos os providers da aplicação (Wagmi, Redux, etc).
- `frontend/src/domains/certificate/`: Pasta contendo a lógica e a UI para a emissão de certificados.
- `frontend/src/lib/ipfs.ts`: Lógica para interagir com a API do Pinata e enviar arquivos para o IPFS.

## 🚀 Guia Completo de Execução

Siga este passo a passo para configurar e rodar o projeto completo em um ambiente local.

### 1. Pré-requisitos

- **Node.js:** Versão 18 ou superior.
- **Navegador com Carteira:** Google Chrome com a extensão [MetaMask](https://metamask.io/) instalada.
- **PostgreSQL:** Necessário para rodar o backend original da aplicação.

### 2. Configuração Inicial

**Clone o repositório:**

```bash
git clone https://github.com/RafaelMachado1/assessment.git
cd assessment
```

### 3. Configuração do Banco de Dados (Backend Original)

Mesmo que nossa funcionalidade principal seja em blockchain, o backend original precisa do banco de dados para rodar sem erros.

```bash
# Crie o banco de dados no PostgreSQL
createdb school_mgmt

# Execute os scripts para criar as tabelas e popular o banco
psql -d school_mgmt -f seed_db/tables.sql
psql -d school_mgmt -f seed_db/seed-db.sql
```

### 4. Configuração do Backend (Node.js)

```bash
# Navegue até a pasta do backend
cd backend

# Instale as dependências
npm install

# Crie o arquivo de ambiente (pode deixar com os valores padrão)
cp .env.example .env

# Inicie o servidor backend (em um terminal separado)
npm start
```

> O backend estará rodando em `http://localhost:5007`.

### 5. Configuração da Blockchain (Hardhat)

Esta é a parte central do nosso desafio.

```bash
# Em um novo terminal, navegue até a pasta da blockchain
cd blockchain

# Instale as dependências
npm install

# Crie o arquivo .env para a chave privada da sua carteira
echo "HARDHAT_PRIVATE_KEY=SUA_CHAVE_PRIVADA_AQUI" > .env
```

> **Importante:** Substitua `SUA_CHAVE_PRIVADA_AQUI` por uma chave privada de uma carteira de desenvolvimento (NUNCA use uma chave de produção). Você pode obter uma do MetaMask.

**Inicie o nó local da blockchain:**

```bash
# Este comando inicia uma blockchain local para desenvolvimento
npx hardhat node
```

> Guarde uma das chaves privadas fornecidas pelo Hardhat para usar no passo de deploy.

**Compile e faça o deploy do contrato:**

```bash
# Em outro terminal, dentro da pasta /blockchain

# Compile o contrato
npx hardhat compile

# Faça o deploy na rede local
npx hardhat run scripts/deploy.js --network localhost
```

> Anote o endereço do contrato (`Certificate contract deployed to: 0x...`) que aparecerá no terminal.

### 6. Configuração do Frontend (React)

```bash
# Em um novo terminal, navegue até a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Crie o arquivo .env com as chaves necessárias
touch .env
```

Abra o arquivo `frontend/.env` e adicione as seguintes variáveis:

```
VITE_WALLETCONNECT_PROJECT_ID="SEU_PROJECT_ID_DO_WALLETCONNECT"
VITE_PINATA_JWT="SEU_JWT_DO_PINATA"
VITE_CONTRACT_ADDRESS="ENDERECO_DO_CONTRATO_DO_PASSO_5"
```

> - `VITE_WALLETCONNECT_PROJECT_ID`: Obtenha em [cloud.walletconnect.com](https://cloud.walletconnect.com/).
> - `VITE_PINATA_JWT`: Obtenha em [app.pinata.cloud](https://app.pinata.cloud/) criando uma API Key.
> - `VITE_CONTRACT_ADDRESS`: O endereço do contrato que você anotou no passo anterior.

**Inicie a aplicação frontend:**

```bash
npm run dev
```

> A aplicação estará acessível em `http://localhost:5173`.

### 7. Interagindo com a Aplicação

1.  **Configure a MetaMask:**

    - Adicione uma nova rede na MetaMask com os seguintes dados:
      - **Nome da Rede:** Hardhat Local
      - **URL da RPC:** `http://127.0.0.1:8545`
      - **ID da Cadeia (Chain ID):** `31337`
      - **Símbolo da Moeda:** `ETH`
    - Importe uma das contas fornecidas pelo `npx hardhat node` usando a chave privada para ter fundos na rede local.

2.  **Emita um Certificado:**
    - Abra a aplicação em `http://localhost:5173`.
    - Clique em "Connect Wallet" e conecte sua conta da MetaMask.
    - Navegue até a página "Certificate" no menu lateral.
    - Preencha o formulário e clique em "Issue Certificate".
    - Aprove a transação na MetaMask.

### 8. Verificando a Emissão no Terminal

Para provar que o CID do certificado foi salvo na blockchain, use o script de verificação.

```bash
# No terminal da pasta /blockchain

# Execute o script de verificação
npx hardhat run scripts/verify-last-tx.js --network localhost
```

O terminal exibirá o último CID armazenado no contrato. Você pode verificar o conteúdo do certificado acessando uma URL de gateway IPFS:

`https://gateway.pinata.cloud/ipfs/<CID_DO_TERMINAL>`
