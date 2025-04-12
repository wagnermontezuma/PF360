# Fitness 360 - Portal do Profissional

Frontend para profissionais da plataforma Fitness 360, desenvolvido com Next.js 14 e TypeScript.

## 🚀 Recursos

- Dashboard com métricas e visão geral
- Gerenciamento de alunos
- Criação e acompanhamento de planos de treino
- Elaboração de planos nutricionais
- Análise de progresso dos alunos
- Comunicação direta com alunos

## 🛠️ Tecnologias

- **Next.js 14** com App Router
- **TypeScript** para tipagem segura
- **TailwindCSS** para estilização responsiva
- **Context API** para gerenciamento de estado
- **Recharts** para visualização de dados
- **JWT** para autenticação

## 📋 Pré-requisitos

- Node.js 18+
- npm ou pnpm

## 💻 Configuração do Ambiente

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/fitness-360-platform.git
cd fitness-360-platform/frontend/app-staff
```

2. Instale as dependências:
```bash
npm install
# ou
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
pnpm dev
```

O aplicativo estará disponível em `http://localhost:3007`.

## 🔒 Autenticação

O sistema utiliza JWT para autenticação. As credenciais para ambiente de desenvolvimento são:

- **Email**: prof@fitness360.com
- **Senha**: fitness360

## 🔄 Fluxo de Trabalho de Desenvolvimento

1. Crie uma branch a partir de `develop`
```bash
git checkout develop
git pull
git checkout -b feature/nome-da-feature
```

2. Faça suas alterações seguindo os padrões de código
3. Execute os testes e linting
```bash
npm run test
npm run lint
```

4. Envie um Pull Request para a branch `develop`

## 🐳 Docker

Para construir e executar o aplicativo em um container Docker:

```bash
# Construir a imagem
docker build -t fitness360/app-staff .

# Executar o container
docker run -p 3007:3007 fitness360/app-staff
```

## 📦 Estrutura do Projeto

```
src/
├── app/                  # Páginas e layouts (App Router)
│   ├── (protected)/      # Rotas protegidas (autenticadas)
│   └── ...
├── components/           # Componentes reutilizáveis
│   ├── layout/           # Componentes de layout (Header, Sidebar, etc.)
│   └── ...
├── context/              # Contexts do React (AuthContext, etc.)
├── hooks/                # Hooks personalizados
├── services/             # Serviços de API
├── styles/               # Estilos globais
├── types/                # Tipagens TypeScript
└── utils/                # Funções utilitárias
```

## 🧪 Testes

```bash
# Executar testes
npm run test

# Executar testes com coverage
npm run test:coverage
```

## 📋 CI/CD

Este projeto utiliza GitHub Actions para CI/CD. O pipeline inclui:

- Linting e verificação de tipos
- Testes unitários
- Build
- Construção e publicação de imagem Docker (branches main e develop)
- Deploy automático para ambiente de staging (branch develop)
- Deploy para produção (branch main, com aprovação manual)

## 📝 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes. 