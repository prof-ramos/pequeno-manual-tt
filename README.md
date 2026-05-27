# Pequeno Manual TT — Conselho do Dia

> Sistema completo para gerar imagens elegantes de conselhos do livro "Pequeno Manual de Instruções para a Vida" e postá-las automaticamente no X (Twitter).

[![SvelteKit](https://img.shields.io/badge/SvelteKit-5.0-orange?logo=svelte)](https://kit.svelte.dev)
[![Python](https://img.shields.io/badge/Python-3.12%2B-blue?logo=python)](https://python.org)
[![Playwright](https://img.shields.io/badge/Playwright-Chromium-green?logo=playwright)](https://playwright.dev)
[![License](https://img.shields.io/badge/License-MIT-lightgrey)](LICENSE)

---

## ✨ Visão Geral

Este projeto combina um **gerador de imagens estilizadas** (SvelteKit + Playwright) com um **script de automação** (Python) para criar e publicar diariamente conselhos do livro *Pequeno Manual de Instruções para a Vida*, de H. Jackson Brown, Jr.

Cada imagem é renderizada com tema `noir`, fonte `Playfair Display`, numeração `001 / 1001` e citação do livro — pronta para engajamento no X.

![Preview](https://via.placeholder.com/1200x630/000000/FFFFFF?text=Conselho+do+Dia)

---

## 🚀 Quick Start

### 1. Clone e instale dependências

```bash
git clone https://github.com/prof-ramos/pequeno-manual-tt.git
cd pequeno-manual-tt
```

### 2. Web app (serif-sh)

```bash
cd serif-sh
npm install
npx playwright install chromium
npm run dev
```

O servidor iniciará em `http://localhost:5173`.

### 3. Script Python (scripts)

```bash
cd scripts
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 4. Teste a geração de imagem

```bash
python3 daily-post.py --test --quote 1
# Saída: scripts/output/conselho-YYYY-MM-DD-1.png
```

---

## 🏗️ Arquitetura

O projeto é dividido em duas partes:

| Parte | Tecnologia | Função |
|-------|-----------|--------|
| `serif-sh/` | SvelteKit 5 + Tailwind v4 + Playwright | Web app para gerar imagens de quotes |
| `scripts/` | Python 3 + requests | Automação diária de postagem no X |

### Fluxo de dados

```
scripts/daily-post.py
    ↓ HTTP GET
serif-sh/src/routes/api/generate/+server.ts
    ↓ Playwright Chromium
serif-sh/src/routes/+page.svelte (renderizado com query params)
    ↓ Screenshot .quote-frame
    ↓ PNG retornado
scripts/daily-post.py
    ↓ POST api.x.com/2/tweets
X (Twitter)
```

---

## 📁 Estrutura do Projeto

```
pequeno-manual-tt/
├── scripts/                          # Automação Python
│   ├── daily-post.py                 # Script principal de postagem
│   ├── generate-previews.py          # Geração em lote de previews
│   ├── extract-conselhos.py          # Parser do markdown para JSON
│   ├── requirements.txt              # Dependências: requests
│   └── output/                       # Imagens geradas (gitignored)
│
├── serif-sh/                         # Web app SvelteKit
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/           # Componentes Svelte
│   │   │   │   ├── quote-frame.svelte    # Renderização das quotes
│   │   │   │   ├── theme-selector.svelte
│   │   │   │   └── icons/            # SVGs: marcas de citação, logos
│   │   │   ├── stores/               # Stores Svelte com sync URL hash
│   │   │   ├── utils/                # Client-side export (html-to-image)
│   │   │   ├── themes.ts             # Definições de 10+ temas
│   │   │   └── conselhos.json        # 1001 quotes do livro
│   │   ├── routes/
│   │   │   ├── +page.svelte        # Página principal (editor)
│   │   │   └── api/
│   │   │       └── generate/         # Endpoint Playwright (server-side PNG)
│   │   └── app.css                   # Tailwind v4 @theme config
│   └── static/                       # Fontes self-hosted (Instrument Serif, Open Runde)
│
├── Pequeno Manual de Instruções para a Vida.md   # Fonte original dos quotes
├── CLAUDE.md                         # Instruções para Claude Code
└── AGENTS.md                         # Documentação hierárquica para agentes AI
```

---

## 🎨 Temas Disponíveis

| Tema | Estilo | Uso recomendado |
|------|--------|-----------------|
| `noir` | Fundo preto, texto branco, aspas douradas | **Padrão para X** |
| `editorial` | Jornalístico, serif, itálico | Clássico |
| `breeze` | Card arredondado, leve | Moderno |
| `aura` | Gradientes vibrantes | Chamativo |
| `paper` | Textura de papel | Artesanal |
| `glass` | Glassmorphism | Tecnológico |
| `claude-code` | Terminal-style | Developer |
| `vercel-dark/light` | Brand Vercel | Marca |
| `peerlist-dark/light` | Brand Peerlist | Marca |
| `x-dark/light` | Brand X (Twitter) | Marca |

Temas são definidos em `serif-sh/src/lib/themes.ts`. Cada tema tem `quoteStyle` que determina o layout DOM completo em `quote-frame.svelte`.

---

## 🔌 API de Geração

### `GET /api/generate`

Gera imagem PNG server-side via Playwright.

**Parâmetros (query string):**

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `quote` | string | — | Texto da citação |
| `theme` | string | `noir` | ID do tema |
| `author` | string | `H. Jackson Brown, Jr.` | Nome do autor |
| `source` | string | `Pequeno Manual...` | Nome do livro |
| `number` | int | — | Número da citação (exibe `001 / 1001`) |
| `font` | string | — | Família de fonte (ex: `Playfair Display`) |
| `align` | string | `center` | Alinhamento: `left`, `center`, `right` |
| `padding` | int | `64` | Espaçamento interno em px |
| `marks` | bool | `true` | Mostrar aspas decorativas |
| `bg` | bool | `true` | Mostrar background |

**Exemplo:**

```bash
curl "http://localhost:5173/api/generate?quote=Elogie%20três%20pessoas&theme=noir&number=1" \
  -o conselho.png
```

**Retorno:** `image/png` (1200×630 viewport, screenshot de `.quote-frame`)

---

## 🔑 Variáveis de Ambiente

| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| `TWITTER_BEARER_TOKEN` | Sim | **OAuth 2.0 User Access Token** com escopo `tweet.write` |
| `SERIF_SH_URL` | Não | URL do servidor (padrão: `http://localhost:5173`) |

### Como obter o token

1. Acesse [developer.x.com](https://developer.x.com/en/portal/projects-and-apps)
2. Crie um app **dentro de um Project** (standalone não funciona)
3. Ative **User Authentication** → OAuth 2.0 → Type: *Automated App*
4. Callback URI: `http://localhost:3000/callback`
5. Gere **OAuth 2.0 User Token** com scope `tweet.write`

⚠️ **Limitação Free tier:** O plano Free tem praticamente zero créditos de escrita. Você provavelmente receberá erro `402 CreditsDepleted`. Opções:
- Aguardar reset mensal (~dia 8)
- Fazer upgrade para Basic ($100/mês)
- Usar `--save-only` para apenas gerar imagens

---

## 🖥️ Uso do Script

```bash
cd scripts

# Postar o conselho do dia (baseado no dia do ano, cíclico 1–1001)
python3 daily-post.py

# Testar sem postar — apenas gerar e salvar imagem
python3 daily-post.py --test

# Postar conselho específico (1–1001)
python3 daily-post.py --quote 42

# Postar conselho aleatório
python3 daily-post.py --random

# Usar tema diferente
python3 daily-post.py --theme editorial

# Apenas salvar imagem, não postar
python3 daily-post.py --save-only

# Apontar para outro servidor
python3 daily-post.py --url https://seu-dominio.com
```

---

## ⏰ Automação Diária

### macOS (launchd)

```bash
# Criar plist
mkdir -p ~/Library/LaunchAgents
cat > ~/Library/LaunchAgents/com.conselho.daily.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.conselho.daily</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/python3</string>
        <string>/caminho/completo/scripts/daily-post.py</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key><integer>9</integer>
        <key>Minute</key><integer>0</integer>
    </dict>
    <key>EnvironmentVariables</key>
    <dict>
        <key>TWITTER_BEARER_TOKEN</key><string>SEU_TOKEN_AQUI</string>
        <key>SERIF_SH_URL</key><string>https://seu-dominio.com</string>
    </dict>
</dict>
</plist>
EOF

# Ativar
launchctl load ~/Library/LaunchAgents/com.conselho.daily.plist
```

### Linux (cron)

```bash
crontab -e
# Adicione:
0 9 * * * cd /caminho/para/pequeno-manual-tt/scripts && /usr/bin/python3 daily-post.py >> /var/log/conselho.log 2>&1
```

### GitHub Actions (gratuito)

Crie `.github/workflows/daily-post.yml`:

```yaml
name: Daily Quote Post

on:
  schedule:
    - cron: '0 12 * * *'  # 12:00 UTC
  workflow_dispatch:

jobs:
  post:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install -r scripts/requirements.txt
      - run: python scripts/daily-post.py
        env:
          TWITTER_BEARER_TOKEN: ${{ secrets.TWITTER_BEARER_TOKEN }}
          SERIF_SH_URL: ${{ secrets.SERIF_SH_URL }}
```

---

## 🐛 Troubleshooting

| Erro | Causa | Solução |
|------|-------|---------|
| `Quote frame not found` | Servidor não respondeu em 10s | Confirme que `npm run dev` está rodando |
| `Failed to generate image` | Playwright não instalado | Execute `npx playwright install chromium` |
| `401 Unauthorized` | Token inválido ou expirado | Regenere o OAuth 2.0 User Token no portal |
| `403 client-not-enrolled` | App fora de um Project | Mova o app para dentro de um Project no portal |
| `402 CreditsDepleted` | Free tier sem créditos de escrita | Upgrade para Basic ou aguarde reset mensal |
| `Port already in use` | Outro processo na porta | Mude a porta: `npm run dev -- --port 5174` |

---

## 🛠️ Para Desenvolvedores

### Arquitetura chave

- **Dual URL state:** Hash base64 (UI compartilhável) vs query params (API)
- **`setSilent()`:** Atualiza stores sem poluir a URL
- **`editableStore`:** Action Svelte para `contenteditable` sem destruir cursor
- **Server-side PNG:** Playwright headless screenshota `.quote-frame` com `viewport: {1200, 630}`

Leia `CLAUDE.md` para instruções completas de desenvolvimento.

---

## 🤝 Contribuição

Pull requests são bem-vindos! Para mudanças significativas, abra uma issue primeiro para discutir o que você gostaria de alterar.

---

## 📄 Licença

[MIT](LICENSE) — Prof. Ramos

---

<div align="center">
  Feito com ❤️ e mil conselhos
</div>
