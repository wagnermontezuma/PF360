# Política de Segurança

## Reportando Vulnerabilidades

Se você descobrir uma vulnerabilidade de segurança na Plataforma Fitness 360, por favor nos avise imediatamente enviando um email para security@fitness360.com.br. Nós nos comprometemos a:

1. Confirmar o recebimento do seu relatório em até 24 horas
2. Fornecer uma estimativa de quando o problema será corrigido
3. Notificar quando a vulnerabilidade for corrigida
4. Reconhecer sua contribuição (se desejado) após a correção

## Práticas de Segurança

### Desenvolvimento
- Todo código passa por revisão de segurança
- SAST/DAST integrados ao pipeline CI/CD
- Scanning de dependências via Dependabot
- Secret scanning em todos os commits
- Testes de penetração regulares

### Infraestrutura
- TLS 1.3 obrigatório
- Dados em repouso criptografados (AES-256)
- Autenticação OAuth 2.1 + MFA
- Logs centralizados e auditáveis
- Backup diário com retenção de 30 dias

### Compliance
- LGPD/GDPR ready
- ISO 27001 em processo
- PCI DSS para pagamentos
- Certificação SOC2 planejada

## Recompensas

Mantemos um programa de bug bounty privado. Pesquisadores de segurança interessados podem solicitar acesso via security@fitness360.com.br. 