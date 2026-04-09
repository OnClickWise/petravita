Terevita Landing

Projeto separado para a landing externa da Terevita, pronto para ser movido para outro diretório ou publicado em outro domínio.

O que já está montado:
- Hero principal com CTA para WhatsApp e para o formulário
- Menu fixo com navegação por âncoras e destaque da seção ativa
- Seções de benefícios, coberturas, como funciona, FAQ e contato
- Formulário integrado com a API pública do CRM OnClickWise
- Assets locais em `public/terevita`
- Layout e estilos globais próprios

Integração com a API do CRM:
- GET `/api/landing-pages/:slug/config`
- POST `/api/landing-pages/:slug/leads`

Variáveis de ambiente:
- `NEXT_PUBLIC_TEREVITA_API_BASE_URL`
- `NEXT_PUBLIC_TEREVITA_SLUG`
- `NEXT_PUBLIC_TEREVITA_WHATSAPP`

Arquivos principais:
- `src/app/pt/terevita/page.tsx`
- `src/components/terevita/TerevitaLanding.tsx`
- `src/lib/terevita-api.ts`
- `src/lib/terevita-types.ts`
- `public/terevita/logo-terevita.svg`
- `public/terevita/pattern.svg`

Como rodar:
1. Instale as dependências com `npm install`.
2. Copie `.env.example` para `.env.local`.
3. Ajuste a URL da API e o WhatsApp.
4. Rode `npm run dev`.

Observação:
- A landing usa a slug da organização para gravar o lead na conta correta do CRM.
- Se a slug não existir no backend, a busca de configuração vai falhar até a organização ser criada.
