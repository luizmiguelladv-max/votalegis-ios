# VotaLegis — App iOS (wrapper Capacitor → App Store)

Wrapper iOS que carrega **https://votalegis.com.br** (o mesmo site do app Android/TWA).
Build + assinatura + envio pra TestFlight rodam **no Mac da nuvem do GitHub Actions** —
você **não precisa de Mac**. Você está no Windows; só mexe no navegador e no GitHub.

- **Bundle ID:** `br.com.votalegis`
- **Nome:** VotaLegis
- **URL carregada:** https://votalegis.com.br
- **Privacidade (a Apple exige):** https://votalegis.com.br/privacidade ✅ (já existe)
- **Permissões nativas:** microfone (captura/transcrição), câmera+galeria (foto de vereador)

---

## ⚠️ REGRA DE OURO: o repo `votalegis-ios` fica PÚBLICO durante os builds
GitHub cobra minutos de macOS em repo **privado** — dá bloqueio de billing ("spending limit").
Em repo **público** o CI de macOS é **grátis**. **Nenhum segredo fica no código** (tudo em
GitHub Secrets, criptografado), então é seguro deixar público. → Crie `votalegis-ios` como
**Public**. (O repo de certificados abaixo é PRIVADO.)

## Os 2 repositórios
1. **`votalegis-ios`** — **PÚBLICO** — este projeto (o wrapper + o workflow).
2. **`votalegis-ios-certs`** — **PRIVADO** — o `fastlane match` guarda aqui os certificados/
   provisioning (criptografados). Crie vazio.

---

## PASSO A — Apple Developer / App Store Connect (só você faz)
1. **developer.apple.com** → Certificates, IDs & Profiles → **Identifiers** → **+** → App IDs →
   App → Bundle ID **Explicit** = `br.com.votalegis`. Marque **Push Notifications** e
   **Associated Domains** (não custa nada e evita re-registrar depois).
2. **App Store Connect** → **Apps** → **+** → New App: plataforma iOS, nome **VotaLegis**,
   Bundle ID `br.com.votalegis`, SKU qualquer (ex.: `votalegis`).
3. Anote o **Team ID** (App Store Connect → Membership, ou developer.apple.com → Membership).
4. **App Store Connect → Users and Access → Integrations → App Store Connect API** →
   **Generate API Key** (função **App Manager**). Baixe o **`.p8`** (só dá pra baixar 1 vez!)
   e anote o **Key ID** e o **Issuer ID**.

## PASSO B — GitHub Secrets (repo `votalegis-ios` → Settings → Secrets and variables → Actions)
| Secret | O que é |
|--------|---------|
| `ASC_KEY_ID` | Key ID da API Key |
| `ASC_ISSUER_ID` | Issuer ID |
| `ASC_KEY_P8` | **conteúdo inteiro** do arquivo `.p8` (com `-----BEGIN PRIVATE KEY-----` … `-----END…`) |
| `APPLE_TEAM_ID` | seu Team ID (10 caracteres) |
| `MATCH_GIT_URL` | `https://github.com/<você>/votalegis-ios-certs.git` |
| `MATCH_PASSWORD` | uma senha forte que **você inventa** (criptografa os certs) — guarde-a |
| `MATCH_GIT_BASIC_AUTHORIZATION` | `base64("<usuário-github>:<PAT>")` — veja abaixo |

**PAT (GOTCHA #6):** crie um **Personal Access Token** (classic) com escopo **`repo` + `workflow`**
(precisa pra o `match` empurrar os certs pro repo privado — sem `workflow` dá "refusing to allow
a PAT to..."). Gere o valor do secret assim (no seu terminal, ou em qualquer lugar):
```
echo -n "SEU_USUARIO_GITHUB:ghp_SEU_PAT" | base64
```
Cole o resultado em `MATCH_GIT_BASIC_AUTHORIZATION`.

## PASSO C — rodar
- Faça **push na branch `main`** (ou Actions → *iOS → TestFlight* → **Run workflow**).
- ⚠️ Se disparar **push + run juntos**, **cancele 1** — 2 builds ao mesmo tempo brigam pelos
  certificados. (O `concurrency` do workflow já ajuda.)
- **1º build demora mais** (o `match` cria os certs e sobe pro repo de certs).
- Build leva ~10–15 min. Acompanhe em Actions → passo **"Build + assinar + enviar"**.

## PASSO D — TestFlight (validar ANTES de mandar pra revisão)
- Em ~5–15 min o build aparece em **App Store Connect → TestFlight**.
- Adicione seu e-mail como **testador interno** → instala pelo app **TestFlight** no iPhone,
  **sem revisão da Apple**. É aqui que a gente valida o **tempo real** num iPhone de verdade
  (ver "Tempo real" abaixo).
- Só depois: preencha a ficha da loja (capturas de iPhone, descrição) → **Enviar para revisão**.

---

## Tempo real (votação/updates ao vivo) — como funciona no wrapper
O site usa **WebSocket seguro (WSS)**: `wss://votalegis.com.br/ws/app/<slug>`. Dentro do
WKWebView (o motor do app iOS) o WSS funciona igual ao navegador. O app já tem, no próprio
site: **reconexão automática** no `onclose`, **wake/reconnect** ao voltar do background (crítico
no iOS, que suspende apps agressivamente) **e** um **polling de fallback** (`_tickVereador`) que
busca a votação mesmo se o WS cair. O `capacitor.config.json` está com
`limitsNavigationsToAppBoundDomains: false` de propósito — é o que libera o WS. Como isso já
roda no app Android (mesmo site), o iOS é equivalente. **A validação definitiva é o build no
TestFlight num iPhone real** — teste: abra uma votação no controle e confirme que chega ao vivo
no app; minimize e reabra o app e confirme que reconecta.

## Risco de revisão (Guideline 4.2 "minimum functionality")
É um wrapper de site — pode pegar observação. Mitigadores: é **sistema institucional de votação
legislativa** de câmaras municipais (Apple é tolerante com apps cívicos/governamentais) e tem
**função nativa real** (microfone → transcrição ao vivo). Nota de revisão sugerida:
> App institucional de votação eletrônica para câmaras municipais brasileiras. Vereadores votam
> em tempo real durante a sessão; a Mesa capta e transcreve o áudio da sessão (uso do microfone).
> Acesso restrito a usuários cadastrados de câmaras clientes (login obrigatório). Conta de teste
> para revisão: <criar um login de teste e informar aqui>.

---

## OS 7 GOTCHAS (já resolvidos nesta config — não altere sem entender)
1. **`contentInset: "never"`** no `capacitor.config.json` — senão a safe-area conta em dobro e o cabeçalho fica gigante.
2. **`runs-on: macos-15` (Xcode 26)** — SDK antigo → Apple rejeita o upload (erro 409).
3. **`setup_ci`** no Fastfile — destrava o keychain; sem ele o codesign TRAVA em "Embed Pods Frameworks" até o timeout.
4. **`update_code_signing_settings` (manual)** + `team_id` + profile `match AppStore br.com.votalegis` — Capacitor vem sem assinatura.
5. **Repo `votalegis-ios` PÚBLICO** durante os builds — privado = billing block no macOS.
6. **PAT com escopo `repo`+`workflow`** no `MATCH_GIT_BASIC_AUTHORIZATION` — pra o match empurrar os certs.
7. **Risco 4.2** — nota de revisão + conta de teste (acima).
