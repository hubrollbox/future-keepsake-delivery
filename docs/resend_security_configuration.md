# Configuração de Segurança do Resend

## Cabeçalhos Anti-Spoofing (SPF, DKIM, DMARC)

Para garantir a segurança e autenticidade dos e-mails enviados através do serviço Resend, é essencial configurar os cabeçalhos anti-spoofing. Estas configurações devem ser feitas no painel de controle do Resend e nos registros DNS do seu domínio.

### 1. SPF (Sender Policy Framework)

O SPF especifica quais servidores estão autorizados a enviar e-mails em nome do seu domínio.

**Configuração no DNS:**
```
Tipo: TXT
Nome: @
Valor: v=spf1 include:_spf.resend.com ~all
```

### 2. DKIM (DomainKeys Identified Mail)

O DKIM adiciona uma assinatura digital aos e-mails para verificar sua autenticidade.

**Passos para configuração:**
1. Acesse o painel do Resend
2. Vá para "Domains" > "DKIM"
3. Gere as chaves DKIM
4. Adicione os registros DKIM fornecidos ao seu DNS

**Exemplo de registro DKIM:**
```
Tipo: TXT
Nome: resend._domainkey
Valor: [chave fornecida pelo Resend]
```

### 3. DMARC (Domain-based Message Authentication, Reporting & Conformance)

O DMARC define como os e-mails que falham na verificação SPF/DKIM devem ser tratados.

**Configuração no DNS:**
```
Tipo: TXT
Nome: _dmarc
Valor: v=DMARC1; p=quarantine; rua=mailto:dmarc@seudominio.com; ruf=mailto:dmarc@seudominio.com; fo=1
```

**Explicação dos parâmetros:**
- `p=quarantine`: E-mails suspeitos vão para quarentena
- `rua`: E-mail para relatórios agregados
- `ruf`: E-mail para relatórios de falhas
- `fo=1`: Gera relatórios para qualquer falha

### 4. Verificação da Configuração

Após configurar os registros DNS, você pode verificar se estão funcionando corretamente:

1. **SPF**: Use ferramentas como `dig TXT seudominio.com` ou sites como mxtoolbox.com
2. **DKIM**: Verifique no painel do Resend se o status está "Verified"
3. **DMARC**: Use ferramentas online de verificação DMARC

### 5. Monitoramento

- Configure alertas para relatórios DMARC
- Monitore regularmente os logs do Resend
- Verifique a reputação do domínio periodicamente

### 6. Configurações Adicionais de Segurança

**No código da aplicação:**
- Rate limiting já implementado
- Validação de e-mail já implementada
- Sanitização de conteúdo já implementada

**Configurações recomendadas no Resend:**
- Ative notificações de bounce/complaint
- Configure webhooks para monitoramento
- Use domínio dedicado para melhor reputação

### 7. Troubleshooting

**Problemas comuns:**
- Registros DNS não propagados (aguarde até 48h)
- Sintaxe incorreta nos registros
- Conflitos com registros existentes

**Soluções:**
- Verifique a sintaxe dos registros
- Use ferramentas de verificação DNS
- Contate o suporte do Resend se necessário

---

**Nota:** Estas configurações são críticas para a deliverabilidade e segurança dos e-mails. Teste sempre em ambiente de desenvolvimento antes de aplicar em produção.