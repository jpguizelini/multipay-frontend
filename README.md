# Multipay Web

Frontend em Next.js para criar pagamentos usando a Multipay API.

## 🏗️ Arquitetura

- **Framework**: Next.js 16
- **UI**: React 19, Tailwind CSS, shadcn/ui (Radix)
- **Formulários**: React Hook Form + Zod
- **Integração**: Consome a Multipay API (REST) em `http://localhost:3000` [web:318]

## 📋 Requisitos

- Node.js 20+
- Backend Multipay API rodando em `http://localhost:3000`
- Docker (para subir o backend — ver README do backend)

> 💡 Ordem recomendada: suba primeiro a API (backend) e só depois o frontend. [web:317]

## 🚀 Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Garantir que a Multipay API está rodando em http://localhost:3000

# 3. Iniciar o frontend em modo desenvolvimento
npm run dev
```

A aplicação fica em `http://localhost:3001`.

A tela de novo pagamento está em `http://localhost:3001/payments/new`.

## 📡 Integração com a API

O frontend envia `POST` para `http://localhost:3000/payments`.

**Body (JSON):**

```json
{
  "amount": 1000,
  "currency": "BRL",
  "paymentMethod": "pm_card_visa"
}
```

**Parâmetros:**

- `amount` (number, obrigatório): valor em centavos (ex.: 1000 = R$ 10,00). O formulário converte o valor digitado (em reais) para centavos.
- `currency` (string, obrigatório): moeda (ex.: `"BRL"`, `"USD"`, `"EUR"`).
- `paymentMethod` (string, obrigatório): ID do método de pagamento do Stripe (ex.: `pm_card_visa`) [web:197].

Sucesso e erro são exibidos via o componente `Alert` do shadcn/ui. (será atualizado para toast)

## 📝 Funcionalidades

Página `/payments/new`:

- Formulário com validação (React Hook Form + Zod).
- Campos: `amount`, `currency`, `paymentMethod`.
- Faz `POST` para `http://localhost:3000/payments`.
- Feedback de sucesso/erro via componente Alert do shadcn/ui.

## 🧪 Qualidade

Verificar código com ESLint:

```bash
npm run lint
```

## 📝 Scripts disponíveis

- `npm run dev` — inicia em modo desenvolvimento (porta 3001).
- `npm run build` — build de produção.
- `npm run start` — roda o build (ex.: em produção).
- `npm run lint` — ESLint.

## 🔐 Segurança

- O frontend assume que a API está em `http://localhost:3000` (configuração fixa no código).
- CORS da API deve permitir `http://localhost:3001` (conforme configurado no backend) [web:299].

## 📚 Documentação adicional

- [Next.js](https://nextjs.org/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev)
