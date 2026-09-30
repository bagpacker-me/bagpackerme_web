# Content engine: two articles a week, one newsletter on Saturday

Two articles publish themselves every Tuesday and Friday, and a written newsletter
goes out every Saturday. The writing happens in n8n; the quality gate that decides
whether an article is fit to publish lives in this repo.

Built 2026-09-30 alongside the existing 23 workflows (see `VIATOR.md` and the
automation notes for the rest of the estate).

## The shape of it

```
content_calendar (n8n Data Table)
        │  one brief, oldest plannedFor first
        ▼
Content Engine — Article          Tue + Fri 07:13 IST
        │  1. Tavily × 3 queries  → research briefing with source URLs
        │  2. Unsplash            → cover photo + photographer credit
        │  3. OpenRouter + schema → the article
        ▼
POST /api/automation/articles     ← the gate. 422 with reasons, or published.
        │                            one rewrite attempt, then the brief is failed
        ▼
Firestore `blogs`  →  /blog/<slug>  →  Content Publish Distribution (every 6h)
                                        IndexNow + ISR + social drafts
```

The newsletter is a separate chain on the same subscriber machinery that already
existed:

```
Weekly Newsletter — Saturday      Sat 10:07 IST
  Tavily news search (14 days) → OpenRouter → 120-180 word opening + subject line
  /api/automation/content?since=8d → the week's articles and trips
  viator_experiences → one experience pick, omitted when the table is empty
  subscriber_optin where confirmed = true → one email each
  [lib] Send Email → Resend, with a working List-Unsubscribe
```

## Why research is a search API, not a model with a search tool

Research is a **Tavily** call and writing is an **OpenRouter** call, and the writing
call has no tools attached at all. That split is worth keeping for three reasons: a
search API is cheaper than paying a model to search, it returns source URLs the
writer can be handed verbatim, and it cannot invent a citation. It also means the
writing call is free to use a strict `json_schema`, which is what makes the output
parseable rather than hopeful.

Three Tavily queries per brief, not one — the topic, then money, then timing and
mistakes. A single search returns a thin, homogeneous slice; asking separately is
what produces a briefing with real figures in it. Each page is truncated to 2,500
characters, holding the whole briefing near 60k characters.

## The model, and why this one

`google/gemini-3.5-flash-lite`, declared once in the `MODEL` line at the top of
**Build Write Request**. The rewrite branch reads it back from that node's output,
so upgrading the engine is a one-word edit in one place.

It was chosen by measurement, not by price list. `gemini-3.1-flash-lite` is nominally
cheaper but could not sustain length: across five real briefs it landed 798–1,375
words against floors of 1,200 and 1,500, so nearly every article needed the rewrite
pass and the effective cost came out the same. `3.5-flash-lite` cleared the gate on
the first pass in five of eight runs and the rewrite recovered the other three.

Two prompt techniques do the heavy lifting, and both are worth preserving if the
prompt is ever rewritten:

- **A section plan, not a word count.** Small models ignore "write 1,500 words" and
  follow "write 8 sections of 190–310 words each". The target is set at 1.5× the
  gate's floor because this tier consistently lands under whatever number it is
  given; overshooting keeps the single rewrite attempt free for a real content
  problem rather than spending it on length every time.
- **The prompt names the exact strings the validator bans.** Rule 2 lists
  `"visa fee is"`, `"e-visa costs"` and the rest verbatim, because a small model
  follows a literal blocklist far better than the principle behind it.

Running cost is roughly **$0.015 per article** and a fraction of a cent per
newsletter — call it **well under $1/month** at two articles a week, plus Tavily's
free tier. That is not a rounding error against the previous design, it is about
1% of it.

## The gate

`lib/article-validation.ts`, called by `POST /api/automation/articles`. Articles
publish live with no human reading them first, so this is the only thing between a
generated draft and an indexed page. Every rule is one that
`curious-club-articles.test.mjs` already enforces on the 21 reviewed articles:

- word count against the brief's own `minWords`
- `metaTitle` ≤ 60 chars, `metaDescription` 80–160
- cover image site-relative or on a host already in the CSP; alt text required
- ≥ 2 `relatedSlugs`, **every one of which must resolve** — an LLM cannot invent a
  working internal link, which is why `GET /api/automation/articles/slugs` exists
- ≥ 3 FAQ items whose questions appear verbatim in the body, not only in JSON-LD
- `tableOfContents` ids must match real headings
- an HTML tag allowlist matching what `lib/curious-club-articles/shared.ts` emits
- **any deposit or cancellation percentage must agree with `lib/faq.ts`** — that
  file's own header calls contradicting the Terms page "a trust failure, not a
  formatting nit", and this makes it mechanical

A 422 returns the full problem list, which the workflow feeds back for exactly one
rewrite. A second failure marks the brief `failed` and emails why. Nothing
half-finished reaches the site.

`npm run test:articles` covers the gate, and deliberately runs all 21 committed
articles through it — proof the automated floor is the house standard rather than a
stricter invention no real article could clear. Two rules are knowingly stricter
than the 2026 cluster and are explicit context flags rather than accidents:
`requireFaq` (only the pillars carry FAQs today) and `maxMetaDescription` (two
committed articles run to 164 and 170 characters).

## What the model is not allowed to decide

- **Dates.** `publishDate`, `createdAt` and `updatedAt` are stamped server-side.
  `types/index.ts` keeps `editorialDisplayDate` separate so a planned series never
  pretends it published early; letting a workflow choose would hand that guarantee
  to a prompt.
- **Byline.** Always `BagPackerMe Editorial Team`. `lib/authors.ts` treats an
  invented author entity as a trust failure, and attributing generated prose to
  Kevin would be exactly that.
- **Slug.** Taken from the calendar row. A renamed slug would orphan the row and
  publish under a URL nothing links to.
- **Regulatory facts.** The prompt forbids stating a visa fee, entry rule, permit
  cost or airfare as present-tense fact; it must link the official source instead.
  This narrows the exposure of unreviewed publishing. It does not remove it —
  `/admin/blog` can edit or unpublish any generated post.

## Workflows

| Workflow | ID | Schedule | State |
|---|---|---|---|
| Content Engine — Article | `wFnaRyWapj4KUKop` | Tue + Fri 07:13 | **active** |
| Content Calendar Seeder | `6pZZsflFU1L8agnV` | Monthly 1st 06:41 | **active** |
| Weekly Newsletter — Saturday | `y7zzANVwPjD3384M` | Sat 10:07 | **active**, ran end to end 2026-09-30 |
| Content Engine — Reclaim Stalled Briefs | `0BNVujRZJHQyQ6YJ` | Daily 05:23 | **active** |
| Newsletter Unsubscribe | `LRiIvXqCNTzfX1BT` | webhook | **active**, verified end to end |
| Monthly Newsletter Digest | `7TjAPhi3V05CCiyU` | — | **unpublished**, kept as the rollback |

All carry `errorWorkflow: jogtB8JVPhhTl827` and `Asia/Kolkata`.

> `create_workflow_from_code` silently drops `errorWorkflow` and `timezone` from the
> settings it is handed. Every workflow here needed a follow-up `update_workflow` to
> put them back. Check `settings` after any future create.

## Data tables

- **`content_calendar`** (`Pb15K8DyvI9siDUX`) — the queue. `status` moves
  `planned → writing → published | failed`. Seeded with 10 briefs through
  2026-11-03, weighted to Europe, Japan, Vietnam, Kenya and the India programme,
  which are the majority of the catalogue and had no editorial support at all.
- **`newsletter_issue`** (`iVhXKdK9QiW01flp`) — the written copy, separate from the
  send, so a Resend failure does not destroy the issue.
- **`subscriber_optin`** — gained an `unsubscribedAt` column. Unsubscribing sets
  `confirmed = false` and stamps it, so the existing `confirmed = true` filter keeps
  working with no schema change.

## Credentials

All three exist and are attached. They were created through the n8n **public API**
(`POST /api/v1/credentials`), not the UI — the MCP server has no credential-creation
tool, only `list_credentials`, which by design never returns secret data. The API key
that made this possible lives at `~/.config/bpm/n8n-api-key`.

| Credential | id | Header | Attached to |
|---|---|---|---|
| `OpenRouter API` | `6WU7B2EFNVkPwc0l` | `Authorization: Bearer sk-or-…` | `Write Article`, `Rewrite Article`, `Propose Briefs`, `Write Opening` |
| `Tavily API` | `ITK7KV3TbU5Zwv9z` | `Authorization: Bearer tvly-…` | `Research Topic`, `Research This Week` |
| `Unsplash API` | `bDmc2FBomIvOm82V` | `Authorization: Client-ID …` | `Find Cover Photo` |

The keys are deliberately **not** written into any node. Inline header values land in
workflow JSON, which is carried into version history, exports and the payload handed
to the error workflow on a failure — a credential keeps them out of all four.

Note the n8n **public API key** (`aud: public-api`) is a different object from the
**MCP token** in `~/.claude.json` (`aud: mcp-server-api`). The MCP token returns 401
against `/api/v1/` and `/rest/`; it speaks only to the MCP endpoint. Reaching for the
wrong one costs half an hour.

Unsplash's free tier is 5,000 requests/hour against about three a week.
`images.unsplash.com` was already cleared in the CSP and `next.config.mjs`, so no
config change was needed — but the licence wants attribution, which is what
`featuredImageCredit` and the credit line under the hero are for.

## Things worth not rediscovering

- **`status = writing` is a lease, and nothing reclaimed it.** The first live run hit a
  truncated OpenRouter response (`finish_reason: "error"`, zero usage, JSON cut
  mid-string). `Parse Article` correctly returned its `ok: false` shape — and then fed
  it straight into `Publish Article`, which stringified `undefined` and threw. The
  brief sat at `writing` with no alert and no retry, invisible. Fixed three ways:
  `Article Parsed?` / `Rewrite Parsed?` gates route the failure to the failure report;
  the failure report now separates infrastructure faults (back to `planned`, up to
  three attempts) from editorial rejection (`failed`); and **Reclaim Stalled Briefs**
  sweeps up anything a hard crash strands, because a gate cannot catch an n8n restart.
- **`finish_reason: "error"` is a real OpenRouter terminal state** and is not in the
  OpenAI set. It means the stream broke upstream; usage comes back as zero, so nothing
  was billed and retrying is the right response. Both parse nodes name it explicitly.
- **`$execution.mode` is `'test'` or `'production'` — there is no `'manual'`.**
  Comparing against `'manual'` fails silently, which is how the reclaim workflow's
  no-age-check bypass did nothing on its first run.
- **The gate had two false positives, both found by running real generated copy
  through it rather than by reading it.** A sentence naming the deposit *and* the
  cancellation ladder was narrowed to the deposit figures, so our own correct policy
  was rejected; and the unsourced-claim regex matched any occurrence of the phrase
  "visa costs", including the sentence "never treat visa costs as fixed", which
  states nothing. Both now have regression tests in `automation-articles.test.mjs`.
  The lesson generalises: a validator that has only ever seen hand-written copy has
  not been tested.
- **Plural forms were slipping past the commercial check entirely.** The sentence
  selector matched `cancellation` but not `cancellations`, so a sentence opening with
  the plural was never checked for contradicting figures at all. It now matches
  `cancel\w*` and `refund\w*`.
- **The newsletter currently has zero confirmed subscribers.** One person signed up
  on 2026-09-29 and never clicked the opt-in link, so `confirmed = true` matches
  nothing and the weekly would mail no one. The chain is correct; the list is empty.
- **`ignoreBots` makes curl get a 403** on the unsubscribe webhook —
  `Authorization data is wrong!`, which reads like a credential fault and is not
  one. isbot classifies curl's default user-agent as a bot. Send a browser
  user-agent to test. The flag is on deliberately: Gmail and Outlook scan links in
  messages, and a scanner following a GET unsubscribe URL would quietly unsubscribe
  people who never clicked anything.
- **One-click unsubscribe is POST, not GET.** Two webhook nodes on one path rather
  than `multipleMethods`, which was never verified on this instance.
- Data Table `date` columns reject `''`. Omit the column to leave it null.
- Structured-output schemas sent over raw HTTP reject `minLength`, `maxLength` and
  `minItems`. Lengths are the gate's job, not the schema's.
- `update_workflow` saves a **draft**. The live workflow keeps running the old
  version until `publish_workflow`. Check `activeVersionId` moved.
- A leftover test row (`unsub-selftest@bagpackerme.invalid`, id 2) sits in
  `subscriber_optin` from verifying the unsubscribe path. It is `confirmed = false`
  on a reserved TLD so it can never be mailed; delete it whenever convenient.

## Verifying a change

```bash
npm run typecheck
npm run lint
npm run test:articles          # the gate
npm run test:curious-club      # proves the 21 committed articles still pass
```

Against a deployed preview (Firestore cannot be reached locally — the gcloud ADC is
scoped to another project, so every Admin SDK call 403s):

- `POST /api/automation/articles` with a deliberately bad article — short, an
  unresolvable `relatedSlug`, a "10% deposit" line — should return **422** naming
  each problem; corrected, **200**; the same slug twice, **409**.
- Seed nothing and run the engine — it should email "content engine idle" rather
  than fail.
- Run the newsletter with your own address as the only `confirmed` row, then click
  the unsubscribe link and confirm the row flips.
