// About page — a Build-in-Amsterdam-style split view. Two panes sit side by
// side under the topbar and scroll independently: wheel/touch over the left
// pane moves only the left pane, same for the right. The page itself never
// scrolls on desktop (the shell is exactly one viewport tall); each pane is
// its own overflow container, and the shell carries data-lenis-prevent so
// Lenis (which owns the document scroller, see app/smooth-scroll.tsx) leaves
// the whole page's wheel events alone and native scrolling takes over. Both
// panes are focusable (tabIndex) so keyboard users can scroll them too —
// they're the page's only scrollers.
//
//   narrative — the story, in five sections (comments mark each one):
//               01 their problem → 02 why I started → 03 what we stand for
//               → 04 proof → 05 next step. Copy is a working draft — edit
//               the JSX in place, the structure doesn't care.
//   mosaic    — a visual feed: brand lockup, founder photo, case art,
//               metrics, approach, stack, and — when BEHOLD_FEED_URL is set
//               (see lib/instagram.ts) — the latest Instagram reels and
//               posts from @marked__digital, interleaved between the brand
//               tiles. Everything else reuses existing content from
//               lib/md.ts, so copy/art changes land here automatically.
//
// ≤900px there is no room for the split, so the mosaic pane hides and its
// tiles come back as themed, horizontally snap-scrolling RAILS woven between
// the narrative sections (founder+numbers after 01, case art after 02,
// Instagram after 03, stack after 04 — see the <Rail>s in Narrative). Each
// tile is defined once as a component and rendered in both homes; CSS
// display rules guarantee only one home is visible (and in the a11y tree)
// at a time. The footer renders twice for the same reason (see Foot).
//
// The narrative <main> comes first in the DOM so reading/tab order follows
// content priority; the desktop visual split (mosaic left, narrative right)
// is restored by explicit grid placement in marked.css. No hooks here, so
// like book-page.tsx this stays a server component; CountUp/ToolLogo are
// client children.

import Link from "next/link";
import { MD, C, navHref, WORK, STACK_TOOLS } from "@/lib/md";
import { getInstagramPosts, type IgPost } from "@/lib/instagram";
import { iconPath } from "@/lib/icons";
import { ArrowIcon, CountUp, MarkLogo, ToolLogo } from "@/components/shared";
import { MobileMenu, NavCta } from "@/components/site-nav";

// Our social profiles, single-sourced from the footer's Connect column so a
// URL change there lands here too. Icon slugs resolve via lib/icons.ts.
const SOCIALS = (["LinkedIn", "Instagram"] as const).flatMap((label) => {
  const items = MD.footer.cols.find((c) => c.h === "Connect")?.items ?? [];
  const item = items.find((i): i is { label: string; href: string } => typeof i !== "string" && i.label === label);
  return item ? [{ label, href: item.href, path: iconPath(label.toLowerCase()) }] : [];
});

// Same compact chrome as book-page.tsx / approach-page.tsx. The current-page
// highlight rides on aria-current (see .sg-navlink[aria-current] in
// marked.css).
function Nav() {
  return (
    <header className="mk-topbar">
      <div className="sg-wrap mk-topbar-inner">
        <Link href="/" className="mk-nav-logo" style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 700, letterSpacing: "-0.03em" }}>
          <MarkLogo size={22} color={C.text} accent={C.accent} />
          <span>
            {MD.brand}
            <span style={{ color: C.accent }}>.</span>
          </span>
        </Link>
        <nav className="sg-nav-links">
          {MD.nav.map((n) => (
            <Link key={n} className="sg-navlink" href={navHref(n)} {...(n === "About" ? { "aria-current": "page" as const } : {})}>
              {n}
            </Link>
          ))}
          <Link className="sg-navlink" href="/stack">
            Stack
          </Link>
        </nav>
        <div className="mk-nav-right">
          <NavCta />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

// Rendered twice: once at the end of the narrative pane (desktop — scrolls
// out at the bottom of the right column) and once as the shell's last child
// (≤900px — so the collapsed page still ends on the footer). The marked.css
// display toggles keep exactly one visible — and in the accessibility
// tree — at a time.
function Foot({ variant }: { variant: "split" | "stack" }) {
  return (
    <footer className={`abt-foot abt-foot--${variant}`}>
      <span>
        © 2026 {MD.brandFull}. {MD.footer.address}.
      </span>
      <span>Privacy · Terms</span>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Tiles — each defined once, rendered in the desktop mosaic and the   */
/* mobile rails                                                        */
/* ------------------------------------------------------------------ */

// Case-study art tile. Only the first two WORK entries have real routes, so
// the rest render as plain (non-link) tiles until their case studies exist.
function CaseTile({ item, wide, link }: { item: (typeof WORK)[number]; wide?: boolean; link?: boolean }) {
  const cls = `abt-tile abt-tile--case${wide ? " abt-tile--wide" : ""}`;
  const inner = (
    <>
      <div className="abt-case-industry">{item.industry}</div>
      <div className="abt-case-title">{item.title}</div>
      <div className="abt-case-metric">{item.metric}</div>
    </>
  );
  return link ? (
    <Link href={item.href} className={cls} style={{ background: item.bg }}>
      {inner}
    </Link>
  ) : (
    <div className={cls} style={{ background: item.bg }}>
      {inner}
    </div>
  );
}

function MetricTile({ m }: { m: (typeof MD.metrics)[number] }) {
  return (
    <div className="abt-tile abt-tile--metric">
      <div className="abt-metric-n">
        <CountUp {...m} />
      </div>
      <div className="abt-metric-l">{m.label}</div>
    </div>
  );
}

// A live Instagram reel/post from the Behold feed. Links out to the post;
// the aria-label carries the description, so the image itself stays silent.
function IgTile({ post, wide }: { post: IgPost; wide?: boolean }) {
  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className={`abt-tile abt-tile--ig${wide ? " abt-tile--wide" : ""}`}
      aria-label={`Instagram ${post.isVideo ? "reel" : "post"}: ${post.caption.slice(0, 80) || "view on Instagram"}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={post.imageUrl} alt="" loading="lazy" />
      <span className="abt-ig-badge">{post.isVideo ? "Reel" : "Post"}</span>
    </a>
  );
}

// The founder — the face behind Section 2's story. Photo lives at
// public/about/founder.jpg; swap the file to update it.
function FounderTile() {
  return (
    <div className="abt-tile abt-tile--wide abt-tile--founder">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/about/founder.jpg" alt="Mark Youash, founder of Marked Digital, at his desk" loading="lazy" />
      <div className="abt-founder-cap">
        <div className="abt-tile-cap" style={{ color: C.accent }}>
          The founder
        </div>
        <div className="abt-founder-name">Mark Youash</div>
      </div>
    </div>
  );
}

// How we work, in three beats
function ApproachTile() {
  return (
    <div className="abt-tile abt-tile--list">
      {MD.approach.map((a) => (
        <div key={a.n} className="abt-list-row">
          <span className="abt-list-n">{a.n}</span>
          <span>{a.title}</span>
        </div>
      ))}
    </div>
  );
}

// A recognizable cross-section of the stack for the logo tile — full roster
// lives on /stack.
const MOSAIC_TOOL_NAMES = new Set(["Shopify", "Amazon Marketplace", "Google Ads", "Meta Ads", "Klaviyo", "OpenAI", "Stripe", "AWS"]);

// Stack sampler. ToolLogo has no accessible name of its own (its img branch
// is alt="" and its SVG branch aria-hidden), so each chip gets a named img
// role here — the monogram fallback then stays quiet too.
function StackTile() {
  const tools = STACK_TOOLS.filter((t) => MOSAIC_TOOL_NAMES.has(t.name));
  return (
    <div className="abt-tile abt-tile--wide abt-tile--stack">
      <div className="abt-tile-cap">The stack we run</div>
      <div className="abt-stack-row">
        {tools.map((t) => (
          <span key={t.name} role="img" aria-label={t.name}>
            <ToolLogo tool={t} size={40} />
          </span>
        ))}
      </div>
    </div>
  );
}

function CtaTile() {
  return (
    <div className="abt-tile abt-tile--wide abt-tile--cta">
      <div className="abt-tile-cap" style={{ color: C.accent }}>
        {MD.ctaBand.kicker}
      </div>
      <div className="abt-cta-line">
        {MD.ctaBand.title[0]} {MD.ctaBand.title[1]}
      </div>
      <Link className="sg-btn sg-btn--p" href={MD.ctaHref} style={{ alignSelf: "flex-start" }}>
        {MD.cta}
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mosaic pane (desktop)                                               */
/* ------------------------------------------------------------------ */

function Mosaic({ igPosts }: { igPosts: IgPost[] }) {
  // Instagram tiles slot between the brand tiles at fixed positions; a short
  // (or empty) feed just leaves those slots out. Singles are placed in pairs
  // so the 2-column grid stays even.
  const ig = (i: number, wide?: boolean) => (igPosts[i] ? <IgTile post={igPosts[i]} wide={wide} /> : null);
  return (
    <div className="abt-mosaic">
      {/* Brand lockup */}
      <div className="abt-tile abt-tile--wide abt-tile--brand">
        <MarkLogo size={54} color={C.text} accent={C.accent} />
        <div className="abt-brand-word">
          {MD.brand}
          <span style={{ color: C.accent }}>.</span>
        </div>
        <div className="abt-brand-tag">
          {MD.hero.h1[0]} <span style={{ color: C.accent }}>{MD.hero.h1[1]}</span>
        </div>
      </div>

      <FounderTile />

      <MetricTile m={MD.metrics[0]} />
      <MetricTile m={MD.metrics[1]} />

      {ig(0)}
      {ig(1)}

      <CaseTile item={WORK[0]} wide link />

      <ApproachTile />
      <MetricTile m={MD.metrics[3]} />

      {ig(2, true)}

      <CaseTile item={WORK[1]} wide link />

      <StackTile />

      {ig(3)}
      {ig(4)}

      <CaseTile item={WORK[2]} />
      <CaseTile item={WORK[3]} />
      <MetricTile m={MD.metrics[2]} />
      <CaseTile item={WORK[4]} />

      {ig(5, true)}

      {/* Feed close — hand the scroller to the CTA */}
      <CtaTile />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile rails                                                        */
/* ------------------------------------------------------------------ */

// A themed, horizontally snap-scrolling strip of tiles, shown only ≤900px
// (see .abt-rail in marked.css). Desktop delivers the same tiles via the
// mosaic pane instead.
function Rail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="abt-rail" aria-label={label}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Narrative pane                                                      */
/* ------------------------------------------------------------------ */

// Section 3's belief list. Edit freely — rows render in order.
const BELIEFS = [
  ["One system, not five vendors", "Media, site, AI and content are engineered together, because together is the only way they compound."],
  ["Revenue is the only vanity-proof metric", "If a number can't be traced to money in your account, we don't optimize for it — and we won't report on it."],
  ["Every market is winnable", "With the right sequence of entry, localization and proof, borders are logistics, not limits."],
  ["No decks, no fluff", "Straight answers, visible work, and reporting you can read in one screen."],
];

function Narrative({ igPosts }: { igPosts: IgPost[] }) {
  return (
    <>
      {/* --- Section 1: Their problem — meet them where they are ---------- */}
      <section className="abt-sec">
        <div className="abt-kicker">01 · Sound familiar?</div>
        <h1 className="abt-h">You didn&apos;t plateau. Your setup did.</h1>
        <p className="abt-body">
          You built a brand that works. The product converts, customers come back, and your home market knows your name. But growth has flattened, and every
          quarter squeezes a little harder — ad costs creep up, the same audiences get more expensive, and &ldquo;more budget&rdquo; has quietly stopped
          meaning &ldquo;more revenue.&rdquo;
        </p>
        <p className="abt-body">
          You&apos;ve probably tried the usual route: an agency for ads, a freelancer for the site, a consultant deck for &ldquo;international.&rdquo; Five
          vendors, five dashboards, nobody accountable for the number that matters. Expanding abroad looks like the obvious next move — and also the riskiest
          one to get wrong alone.
        </p>
        <Rail label="The founder and the numbers">
          <FounderTile />
          <MetricTile m={MD.metrics[0]} />
          <MetricTile m={MD.metrics[1]} />
          <ApproachTile />
        </Rail>
      </section>

      {/* --- Section 2: Why I started — the reason behind the business ---- */}
      <section className="abt-sec">
        <div className="abt-kicker">02 · Why I started Marked</div>
        <h2 className="abt-h">Growth kept getting sold in pieces. I started Marked to sell it whole.</h2>
        <p className="abt-body">
          I&apos;ve spent {MD.metrics[3].value} years inside e-commerce — launching brands into new markets and running the media, storefronts and systems
          behind them. The pattern never changed: strategy lived in one shop, ads in another, the site in a third. Every hand-off leaked money, and every
          vendor optimized their slice instead of the whole.
        </p>
        <p className="abt-body">
          Marked exists to end the hand-offs. One team that runs expansion, advertising, AI and the storefront as a single compounding system — accountable to
          revenue, not to a channel report.
        </p>
        <Rail label="Selected work">
          {WORK.map((w, i) => (
            <CaseTile key={w.href} item={w} link={i < 2} />
          ))}
        </Rail>
      </section>

      {/* --- Section 3: What we stand for — something to root for --------- */}
      <section className="abt-sec">
        <div className="abt-kicker">03 · What we stand for</div>
        <h2 className="abt-h">Systems over silos. Outcomes over optics.</h2>
        <div className="abt-beliefs">
          {BELIEFS.map(([title, body], i) => (
            <div key={title} className="abt-belief">
              <span className="abt-list-n">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <div className="abt-belief-t">{title}</div>
                <p className="abt-body" style={{ margin: "6px 0 0" }}>
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="abt-body abt-mission">
          The mission: make growth in any market feel as native as your home market.
        </p>
        {igPosts.length > 0 && (
          <Rail label="Latest from Instagram">
            {igPosts.map((p) => (
              <IgTile key={p.id} post={p} />
            ))}
          </Rail>
        )}
      </section>

      {/* --- Section 4: Proof — back the story up ------------------------- */}
      <section className="abt-sec">
        <div className="abt-kicker">04 · Proof</div>
        <h2 className="abt-h">The record so far.</h2>
        <div className="abt-proof-grid">
          {MD.metrics.map((m) => (
            <div key={m.label} className="abt-proof-cell">
              <div className="abt-metric-n">
                <CountUp {...m} />
              </div>
              <div className="abt-metric-l">{m.label}</div>
            </div>
          ))}
        </div>
        {/* Real engagements only — placeholders stay off the proof list. */}
        {WORK.slice(0, 2).map((w) => (
          <Link key={w.href} href={w.href} className="abt-proof-case">
            <span className="abt-proof-name">{w.title}</span>
            <span className="abt-proof-metric">{w.metric}</span>
            <ArrowIcon />
          </Link>
        ))}
        <p className="abt-body" style={{ marginTop: 18, fontSize: 14.5 }}>
          Full breakdowns — strategy, build, numbers — live in the case studies.
        </p>
        <Rail label="The stack we run">
          <StackTile />
          <MetricTile m={MD.metrics[2]} />
          <MetricTile m={MD.metrics[3]} />
        </Rail>
      </section>

      {/* --- Section 5: Next step — don't leave them hanging --------------- */}
      <section className="abt-sec abt-sec--last">
        <div className="abt-kicker">05 · Your move</div>
        <h2 className="abt-h">Book the call. Leave with a map.</h2>
        <p className="abt-body">{MD.ctaBand.sub}</p>
        <div className="abt-next">
          <Link className="sg-btn sg-btn--p" href={MD.ctaHref}>
            {MD.cta}
          </Link>
          <Link className="sg-btn" href="/#work">
            See the work
          </Link>
        </div>
        {/* Softer next step for the not-ready-yet: follow the work in public. */}
        <div className="abt-social">
          <span className="abt-social-lead">Not ready to talk? Follow the work in public —</span>
          {SOCIALS.map((s) => (
            <a key={s.label} className="abt-social-link" href={s.href} target="_blank" rel="noopener noreferrer">
              {s.path && (
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              )}
              {s.label}
            </a>
          ))}
        </div>
      </section>

      <Foot variant="split" />
    </>
  );
}

export default async function AboutPage() {
  const igPosts = await getInstagramPosts(6);
  return (
    <div className="sg abt-shell" data-lenis-prevent>
      <Nav />
      <div className="abt-cols">
        <main className="abt-col abt-right" tabIndex={0} aria-label="About Marked">
          <Narrative igPosts={igPosts} />
        </main>
        <aside className="abt-col abt-left" tabIndex={0} aria-label="Marked in pictures and numbers">
          <Mosaic igPosts={igPosts} />
        </aside>
      </div>
      <Foot variant="stack" />
    </div>
  );
}
