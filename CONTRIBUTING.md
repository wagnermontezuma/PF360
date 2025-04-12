# Guia de Contribuição

## 🚀 Como Contribuir

1. Faça um Fork do projeto
2. Crie uma branch para sua feature:
   ```bash
   git checkout -b feature/MinhaFeature
   ```
3. Commit suas mudanças:
   ```bash
   git commit -m 'feat: Adiciona nova feature'
   ```
4. Push para a branch:
   ```bash
   git push origin feature/MinhaFeature
   ```
5. Abra um Pull Request

## 📝 Convenções de Código

### Commits

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-BR/v1.0.0/):

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção

### TypeScript

- Use tipos explícitos
- Evite `any`
- Documente interfaces públicas
- Use enums para valores fixos

### React/Next.js

- Use componentes funcionais
- Prefira hooks personalizados
- Mantenha componentes pequenos
- Documente props com JSDoc

### Testes

- Escreva testes unitários
- Mantenha cobertura > 80%
- Use mocks apropriadamente
- Teste casos de erro

## 🏗 Estrutura do Projeto

```
.
├── apps/
│   ├── web/           # Frontend Next.js
│   ├── mobile/        # App React Native
│   └── student/       # App Flutter
├── packages/
│   ├── ui/            # Componentes compartilhados
│   └── utils/         # Utilitários compartilhados
└── services/
    ├── auth/          # Serviço de autenticação
    ├── training/      # Serviço de treinos
    └── payment/       # Serviço de pagamentos
```

## 🔍 Code Review

### O que verificamos

- Funcionalidade
- Segurança
- Performance
- Testes
- Documentação
- Clean Code

### Processo

1. Revise o código localmente
2. Execute os testes
3. Verifique o lint
4. Teste manualmente
5. Aprove ou sugira mudanças

## 🐛 Reportando Bugs

1. Verifique se já existe uma issue
2. Use o template de bug
3. Inclua:
   - Passos para reproduzir
   - Comportamento esperado
   - Comportamento atual
   - Screenshots/logs
   - Ambiente (OS, browser, etc)

## 💡 Sugerindo Melhorias

1. Verifique se já existe uma issue
2. Use o template de feature
3. Explique o problema/necessidade
4. Sugira uma solução
5. Considere alternativas

## 📚 Recursos

- [Documentação da API](./API_REFERENCE.md)
- [Changelog](./CHANGELOG.md)
- [Código de Conduta](./CODE_OF_CONDUCT.md)

## ❓ Dúvidas

Para suporte:
- Abra uma issue
- Entre em contato via [email]
- Use o canal no Discord 