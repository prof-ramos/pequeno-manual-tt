# Conselho do Dia - Automação

Sistema completo para gerar e postar automaticamente conselhos diários do "Pequeno Manual de Instruções para a Vida" no X (Twitter).

## Arquivos Criados/Modificados

### 1. `serif-sh/src/lib/conselhos.json`
Arquivo JSON com todas as 1001 frases do livro, numeradas de 1 a 1001.

### 2. `serif-sh/src/lib/conselhos.py`
Versão Python do mesmo arquivo para uso no script de automação.

### 3. `serif-sh/src/routes/+page.svelte` (modificado)
- Adicionado suporte a query parameters na URL:
  - `?quote=texto do conselho`
  - `?theme=noir` (ou qualquer outro tema válido)
  - `?align=center` (left, center, right)
  - `?padding=64`
  - `?marks=true/false`
  - `?bg=true/false`
  - `?font=playfair` (opcional)

### 4. `serif-sh/src/routes/api/generate/+server.ts` (novo)
Endpoint que usa Playwright para renderizar a página e gerar PNG.
- **Método:** GET
- **Parâmetros:** `quote`, `theme`, `author`, `align`, `padding`, `marks`, `bg`, `font`
- **Retorna:** Imagem PNG

### 5. `scripts/daily-post.py` (novo)
Script Python para automação diária.

### 6. `scripts/requirements.txt` (novo)
Dependências Python.

## Instalação

### 1. Instalar dependências do projeto

```bash
cd serif-sh
npm install
npx playwright install chromium
```

### 2. Instalar dependências do script Python

```bash
cd scripts
pip install -r requirements.txt
```

## Testando o Endpoint

### 1. Iniciar o servidor de desenvolvimento

```bash
cd serif-sh
npm run dev
```

### 2. Testar o endpoint de geração

```bash
# Teste básico
curl "http://localhost:5173/api/generate?quote=Elogie%20tr%C3%AAs%20pessoas%20todos%20os%20dias&theme=noir" -o teste.png

# Teste com diferentes temas
curl "http://localhost:5173/api/generate?quote=Elogie%20tr%C3%AAs%20pessoas%20todos%20os%20dias&theme=editorial" -o editorial.png
curl "http://localhost:5173/api/generate?quote=Elogie%20tr%C3%AAs%20pessoas%20todos%20os%20dias&theme=x-dark" -o x-dark.png
```

### 3. Testar visualmente no navegador

```
http://localhost:5173/?quote=Elogie três pessoas todos os dias&theme=noir
```

## Script de Automação Diária

### Configuração do Twitter/X API

O script precisa das seguintes variáveis de ambiente:

```bash
# Opção 1: Bearer Token (simplificado, apenas posting)
export TWITTER_BEARER_TOKEN="seu_bearer_token_aqui"

# Opção 2: OAuth 2.0 Client Credentials (para upload de mídia)
export TWITTER_CLIENT_ID="seu_client_id"
export TWITTER_CLIENT_SECRET="seu_client_secret"

# URL do servidor (padrão: localhost para desenvolvimento)
export SERIF_SH_URL="https://seu-dominio.com"
```

Para obter credenciais do Twitter:
1. Acesse https://developer.twitter.com/
2. Crie um projeto e app
3. Configure OAuth 2.0 com "Read and Write" permissions
4. Obtenha o Bearer Token ou Client ID/Secret

### Uso do Script

```bash
cd scripts

# Postar o conselho do dia (baseado na data)
python daily-post.py

# Testar sem postar (apenas gerar imagem)
python daily-post.py --test

# Postar uma conselho específico
python daily-post.py --quote 1

# Postar um conselho aleatório
python daily-post.py --random

# Usar tema diferente
python daily-post.py --theme editorial

# Apenas salvar imagem (sem postar)
python daily-post.py --save-only

# Apontar para outro servidor
python daily-post.py --url https://serif.sh.example.com
```

### Agendar Execução Diária

#### macOS (launchd)

Crie `~/Library/LaunchAgents/com.conselho.daily.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.conselho.daily</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/python3</string>
        <string>/caminho/para/scripts/daily-post.py</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>9</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
    <key>EnvironmentVariables</key>
    <dict>
        <key>TWITTER_BEARER_TOKEN</key>
        <string>seu_token_aqui</string>
    </dict>
</dict>
</plist>
```

```bash
launchctl load ~/Library/LaunchAgents/com.conselho.daily.plist
```

#### Linux (cron)

```bash
crontab -e
```

Adicione:
```
0 9 * * * /usr/bin/python3 /caminho/para/scripts/daily-post.py >> /caminho/para/logs/daily-post.log 2>&1
```

#### GitHub Actions (alternativa gratuita)

Crie `.github/workflows/daily-post.yml`:

```yaml
name: Daily Quote Post

on:
  schedule:
    - cron: '0 12 * * *'  # 12:00 UTC daily
  workflow_dispatch:

jobs:
  post:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: pip install -r scripts/requirements.txt

      - name: Post daily quote
        env:
          TWITTER_BEARER_TOKEN: ${{ secrets.TWITTER_BEARER_TOKEN }}
          SERIF_SH_URL: ${{ secrets.SERIF_SH_URL }}
        run: python scripts/daily-post.py
```

## Temas Disponíveis

Os temas são definidos em `serif-sh/src/lib/themes.ts`:

| Tema | Descrição |
|------|-----------|
| `vercel-dark` | Vercel Dark |
| `vercel-light` | Vercel Light |
| `peerlist-dark` | Peerlist Dark |
| `peerlist-light` | Peerlist Light |
| `x-dark` | X Dark |
| `x-light` | X Light |
| `editorial` | Editorial (padrão) |
| `breeze` | Breeze |
| `aura` | Aura |
| `paper` | Paper |
| `noir` | **Recomendado para X** - Noir |
| `glass` | Glass |
| `claude-code` | Claude Code |

## Fluxo de Funcionamento

1. **Escolha do conselho**: O script escolhe um conselho baseado na data (cíclico, garantia de usar todos os 1001 ao longo do ano)

2. **Geração da imagem**: O endpoint `/api/generate` usa Playwright para:
   - Abrir a página com os parâmetros
   - Renderizar o quote-frame
   - Capturar como PNG

3. **Postagem**: O script posta no X (Twitter) com:
   - Texto formatado
   - Hashtag com número do conselho
   - Imagem em anexo

## Troubleshooting

### Erro: "Quote frame not found"
- Verifique se o servidor está rodando
- Verifique se a página carregou completamente (timeout de 10s)

### Erro: "Failed to generate image"
- Verifique se o Playwright está instalado corretamente
- Teste manualmente: `npx playwright install chromium`

### Erro: Twitter API 401
- Verifique se o Bearer Token está correto
- Verifique se o app tem permissões de escrita

### Erro: Twitter API 413
- A imagem pode ser muito grande
- Tente减小 padding ou usar viewport menor