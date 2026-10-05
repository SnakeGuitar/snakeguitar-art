"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { artworks, calculateEstimate, commissionTypes, socialLinks, type CommissionId } from "@/domain/commission";
import { dictionaries, localeLabels, locales, type Locale } from "@/lib/i18n";

type Filter = "all" | "sketch" | "poster" | "color";
type Theme = "light" | "dark";
type Track = { title: string; src: string };

const primaryTypes: CommissionId[] = ["headshot", "halfBody", "fullBody", "character"];
const addOnTypes: CommissionId[] = ["poster", "experimental"];
const categoryOrder: Exclude<Filter, "all">[] = ["sketch", "poster", "color"];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className={diagonal ? "arrow diagonal" : "arrow"}>→</span>;
}

function Mark() {
  return (
    <a className="mark" href="#top" aria-label="SnakeGuitar home">
      <span className="mark-cat" aria-hidden="true">/\_/\</span>
      <span>Snake<br />Guitar</span>
    </a>
  );
}

export function SiteShell() {
  const [locale, setLocale] = useState<Locale>("es-MX");
  const [theme, setTheme] = useState<Theme>("light");
  const [filter, setFilter] = useState<Filter>("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [base, setBase] = useState<CommissionId>("halfBody");
  const [extras, setExtras] = useState<CommissionId[]>([]);
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [idea, setIdea] = useState("");
  const [copiedSocial, setCopiedSocial] = useState<string | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [musicOpen, setMusicOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const t = dictionaries[locale];

  useEffect(() => {
    const savedLocale = localStorage.getItem("sg-locale") as Locale | null;
    const savedTheme = localStorage.getItem("sg-theme") as Theme | null;
    if (savedLocale && locales.includes(savedLocale)) setLocale(savedLocale);
    setTheme(savedTheme === "dark" || savedTheme === "light" ? savedTheme : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    fetch("/api/music").then((response) => response.json()).then(setTracks).catch(() => setTracks([]));
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("sg-locale", locale);
    localStorage.setItem("sg-theme", theme);
  }, [locale, theme]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setLightbox(null); setMenuOpen(false); setLanguageOpen(false); }
      if (lightbox !== null && event.key === "ArrowRight") setLightbox((lightbox + 1) % artworks.length);
      if (lightbox !== null && event.key === "ArrowLeft") setLightbox((lightbox - 1 + artworks.length) % artworks.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  useEffect(() => {
    if (!audioRef.current || tracks.length === 0) return;
    audioRef.current.volume = 0.65;
    audioRef.current.load();
    if (playing) audioRef.current.play().catch(() => setPlaying(false));
  }, [trackIndex, tracks]);

  const groupedArt = useMemo(() => categoryOrder
    .filter((category) => filter === "all" || filter === category)
    .map((category) => ({
      category,
      items: artworks.map((art, index) => ({ art, index })).filter(({ art }) => art.category === category),
    })), [filter]);
  const estimate = calculateEstimate(base, extras);

  const toggleExtra = (id: CommissionId) => setExtras((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const copyBrief = async () => {
    const selectedExtras = extras.map((id) => t.types[id]).join(", ") || "—";
    const text = `${t.contactTitle}\n${t.name}: ${name || "—"}\n${t.type}: ${t.types[base]}\n${t.extras}: ${selectedExtras}\n${t.estimated}: $${estimate} ${t.usd}\n${t.idea}: ${idea || "—"}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  const copySocial = async (id: string, handle: string) => {
    await navigator.clipboard.writeText(handle);
    setCopiedSocial(id);
    window.setTimeout(() => setCopiedSocial(null), 1800);
  };

  const toggleMusic = async () => {
    if (!audioRef.current || tracks.length === 0) return;
    if (playing) audioRef.current.pause();
    else await audioRef.current.play();
  };

  const nextTrack = () => {
    if (tracks.length === 0) return;
    setTrackIndex((current) => (current + 1) % tracks.length);
  };

  return (
    <div id="top" className="site-shell">
      <a className="skip-link" href="#content">{t.skip}</a>
      <header className="site-header">
        <Mark />
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#work">{t.navWork}</a><a href="#pricing">{t.navPricing}</a><a href="#process">{t.navProcess}</a><a href="#faq">{t.navFaq}</a>
        </nav>
        <div className="header-tools">
          <div className="language-wrap">
            <button className="language-button" onClick={() => { setLanguageOpen(!languageOpen); setMenuOpen(false); }} aria-expanded={languageOpen} aria-haspopup="menu"><span aria-hidden="true">◎</span>{localeLabels[locale]}<i aria-hidden="true">⌄</i></button>
            {languageOpen && <div className="language-menu" role="menu" aria-label={t.language}>
              {locales.map((item) => <button role="menuitem" className={locale === item ? "active" : ""} key={item} onClick={() => { setLocale(item); setLanguageOpen(false); }}><span>{localeLabels[item]}</span>{dictionaries[item].localeName}<i>{locale === item ? "✓" : ""}</i></button>)}
            </div>}
          </div>
          <button className="icon-button theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={theme === "light" ? "Dark mode" : "Light mode"}><span aria-hidden="true">{theme === "light" ? "◐" : "☼"}</span></button>
          <a className="header-cta" href="#contact">{t.navStart}<Arrow diagonal /></a>
          <button className="icon-button menu-button" onClick={() => { setMenuOpen(!menuOpen); setLanguageOpen(false); }} aria-expanded={menuOpen} aria-label={menuOpen ? t.close : t.openMenu}><span /><span /></button>
        </div>
        {menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation">
          {[{ href: "#work", label: t.navWork }, { href: "#pricing", label: t.navPricing }, { href: "#process", label: t.navProcess }, { href: "#faq", label: t.navFaq }, { href: "#contact", label: t.navStart }].map(({ href, label }) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<Arrow diagonal /></a>)}
        </nav>}
      </header>

      <main id="content">
        <section className="hero section-pad">
          <div className="hero-blob blob-one" aria-hidden="true" />
          <div className="hero-blob blob-two" aria-hidden="true" />
          <div className="hero-blob blob-three" aria-hidden="true" />
          <div className="hero-copy">
            <p className="eyebrow"><span />{t.eyebrow}</p>
            <h1>{t.heroTitleA}<br /><em>{t.heroTitleB}</em></h1>
            <p className="hero-body">{t.heroBody}</p>
            <div className="hero-actions">
              <a className="button primary" href="#work">{t.viewWork}<Arrow /></a>
              <a className="text-link" href="#contact">{t.start}<Arrow diagonal /></a>
            </div>
            <div className="availability"><span className="pulse" /><strong>{t.available}</strong><span className="slash">/</span><span>{t.slots}</span></div>
          </div>
          <div className="hero-art" aria-label={t.artAlt.poster}>
            <div className="scribble scribble-one" aria-hidden="true">✦</div>
            <div className="image-frame image-frame-back" />
            <div className="image-frame">
              <Image src="/art/full-poster-1.webp" alt={t.artAlt.poster} fill priority sizes="(max-width: 800px) 85vw, 42vw" />
            </div>
            <span className="art-note note-a" aria-hidden="true">original<br />character</span>
            <span className="art-note note-b" aria-hidden="true">#01</span>
          </div>
          <a className="scroll-cue" href="#work"><span>↓</span>{t.scroll}</a>
        </section>

        <section id="work" className="work-section section-pad">
          <div className="section-intro work-intro">
            <div><p className="eyebrow"><span />{t.workEyebrow}</p><h2>{t.workTitle}</h2></div>
            <p>{t.workBody}</p>
          </div>
          <div className="filters" role="group" aria-label={t.navWork}>
            {(["all", "sketch", "poster", "color"] as Filter[]).map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{t.filters[item]} <span>{item === "all" ? artworks.length : artworks.filter((art) => art.category === item).length}</span></button>)}
          </div>
          <div className="art-groups">
            {groupedArt.map(({ category, items }) => <section className="art-group" key={category} aria-labelledby={`group-${category}`}>
              <div className="art-group-title"><h3 id={`group-${category}`}>{t.filters[category]}</h3><span>{String(items.length).padStart(2, "0")}</span></div>
              <div className="gallery">
                {items.map(({ art, index }) => <button className="art-card" style={{ aspectRatio: `${art.width} / ${art.height}` }} key={art.src} onClick={() => setLightbox(index)} aria-label={`${t.artAlt[art.altKey]} — ${index + 1}`}>
                  <Image src={art.src} alt={t.artAlt[art.altKey]} fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" />
                  <span className="art-index">{String(index + 1).padStart(2, "0")}</span><span className="art-open"><Arrow diagonal /></span>
                </button>)}
              </div>
            </section>)}
          </div>
        </section>

        <section id="pricing" className="pricing-section section-pad">
          <div className="section-intro">
            <div><p className="eyebrow"><span />{t.pricingEyebrow}</p><h2>{t.pricingTitle}</h2></div>
            <p>{t.pricingBody}</p>
          </div>
          <div className="price-layout">
            <div className="price-list">
              {commissionTypes.map((item, index) => <article className={`price-row${item.id === "character" ? " featured" : ""}${item.id === "experimental" ? " experimental" : ""}`} key={item.id}>
                <span className="price-num">0{index + 1}</span>
                <div><h3>{t.types[item.id]}</h3>{item.modifier && <small>{t.addOn}</small>}{item.id === "halfBody" && <small className="popular">{t.popular}</small>}{item.id === "experimental" && <span className="price-note">{t.experimentalNote}</span>}</div>
                <p>{item.startingAt && <small>{t.from}</small>} ${item.price}</p>
              </article>)}
              <div className="included-box"><div><strong>{t.included}</strong><p>{t.characterBody}</p><span>{t.lore} <b>{t.lorePrice}</b></span><p>{t.additionalCharacters}</p></div><div><ul>{t.bullets.map((item) => <li key={item}>{item}</li>)}</ul><p>{t.characterComplexity}</p></div></div>
            </div>
            <aside className="estimator">
              <div className="estimator-head"><span aria-hidden="true">✦</span><div><h3>{t.estimator}</h3><p>{t.estimatorBody}</p></div></div>
              <label>{t.base}<select value={base} onChange={(e) => setBase(e.target.value as CommissionId)}>{primaryTypes.map((id) => <option value={id} key={id}>{t.types[id]}</option>)}</select></label>
              <fieldset><legend>{t.extras}</legend>{addOnTypes.map((id) => <label className="check-row" key={id}><input type="checkbox" checked={extras.includes(id)} onChange={() => toggleExtra(id)} /><span className="fake-check">✓</span><span>{t.types[id]}</span><b>+${commissionTypes.find((item) => item.id === id)?.price}</b></label>)}</fieldset>
              <div className="estimate-total"><span>{t.estimated}<small>{t.usd}</small></span><strong>${estimate}</strong></div>
              <a className="button primary full" href="#contact">{t.buildBrief}<Arrow /></a>
            </aside>
          </div>
        </section>

        <section id="process" className="process-section section-pad">
          <p className="eyebrow"><span />{t.processEyebrow}</p><h2>{t.processTitle}</h2>
          <div className="steps">{t.steps.map((step) => <article key={step.n}><span>{step.n}</span><div className="step-line" /><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
        </section>

        <section id="nsfw" className="nsfw-section section-pad">
          <div className="nsfw-mark" aria-hidden="true"><span>18+</span></div>
          <div className="nsfw-copy">
            <p className="eyebrow"><span />{t.nsfwEyebrow}</p>
            <h2>{t.nsfwTitle}</h2>
            <p>{t.nsfwBody}</p>
            <strong>{t.nsfwPrice}</strong>
          </div>
          <div className="nsfw-rules">
            <ul>{t.nsfwRules.map((rule, index) => <li key={rule}><span>0{index + 1}</span>{rule}</li>)}</ul>
            <a className="button primary full" href="#contact">{t.nsfwCta}<Arrow /></a>
          </div>
        </section>

        <section id="faq" className="faq-section section-pad">
          <div className="faq-title"><p className="eyebrow"><span />{t.faqEyebrow}</p><h2>{t.faqTitle}</h2><span className="faq-sketch" aria-hidden="true">?</span></div>
          <div className="accordions">{t.faqs.map((faq, index) => <details key={faq.q} open={index === 0}><summary><span>0{index + 1}</span>{faq.q}<i>+</i></summary><p>{faq.a}</p></details>)}</div>
        </section>

        <section id="social" className="social-section section-pad">
          <div className="section-intro">
            <div><p className="eyebrow"><span />{t.socialEyebrow}</p><h2>{t.socialTitle}</h2></div>
            <p>{t.socialBody}</p>
          </div>
          <div className="social-grid">
            {socialLinks.map((social) => social.href ? <a className="social-card" href={social.href} target="_blank" rel="noreferrer" key={social.id}>
              <span className="social-icon">{social.icon}</span><div><small>{social.label}</small><strong>{social.handle}</strong></div><span className="social-action">{t.socialVisit} <Arrow diagonal /></span>
            </a> : <button className="social-card" type="button" key={social.id} onClick={() => copySocial(social.id, social.handle)}>
              <span className="social-icon">{social.icon}</span><div><small>{social.label}</small><strong>{social.handle}</strong></div><span className="social-action">{copiedSocial === social.id ? t.socialCopied : t.socialCopy} <Arrow diagonal /></span>
            </button>)}
          </div>
        </section>

        <section id="contact" className="contact-section section-pad">
          <div className="contact-copy"><p className="eyebrow"><span />{t.contactEyebrow}</p><h2>{t.contactTitle}</h2><p>{t.contactBody}</p><div className="contact-doodle" aria-hidden="true">=＾● ⋏ ●＾=</div></div>
          <form className="brief-form" onSubmit={(event) => { event.preventDefault(); copyBrief(); }}>
            <label>{t.name}<input value={name} onChange={(e) => setName(e.target.value)} placeholder="@handle" /></label>
            <label>{t.type}<select value={base} onChange={(e) => setBase(e.target.value as CommissionId)}>{primaryTypes.map((id) => <option value={id} key={id}>{t.types[id]}</option>)}</select></label>
            <label className="full-field">{t.idea}<textarea value={idea} onChange={(e) => setIdea(e.target.value)} placeholder={t.ideaPlaceholder} rows={4} /></label>
            <button className="button invert full-field" type="submit">{copied ? t.copied : t.copy}<Arrow /></button>
          </form>
        </section>
      </main>

      <footer><Mark /><p>{t.footer}</p><p>{t.rights}</p><a href="#top" aria-label="Back to top">↑</a></footer>

      <aside className={`music-player ${musicOpen ? "open" : ""}`} aria-label={t.musicTitle}>
        <audio ref={audioRef} src={tracks[trackIndex]?.src} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={nextTrack} />
        <button className="music-tab" type="button" onClick={() => setMusicOpen(!musicOpen)} aria-expanded={musicOpen}><span aria-hidden="true">♫</span><span>{t.musicTitle}</span><i>{musicOpen ? "×" : "+"}</i></button>
        {musicOpen && <div className="music-body">
          <div className="track-info"><span className={playing ? "playing" : ""} aria-hidden="true">♪</span><p>{tracks[trackIndex]?.title || t.musicEmpty}<small>{tracks.length > 0 ? `${trackIndex + 1} / ${tracks.length}` : "—"}</small></p></div>
          <div className="music-controls">
            <button type="button" onClick={toggleMusic} disabled={tracks.length === 0} aria-label={playing ? t.musicPause : t.musicPlay}>{playing ? "Ⅱ" : "▶"}</button>
            <button type="button" onClick={nextTrack} disabled={tracks.length < 2} aria-label={t.musicNext}>→</button>
            <label aria-label={t.musicVolume}><span>◖</span><input type="range" min="0" max="1" step="0.05" defaultValue="0.65" onChange={(event) => { if (audioRef.current) audioRef.current.volume = Number(event.target.value); }} /></label>
          </div>
        </div>}
      </aside>

      {lightbox !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label={t.artAlt[artworks[lightbox].altKey]} onClick={() => setLightbox(null)}>
        <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label={t.close}>×</button>
        <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + artworks.length) % artworks.length); }} aria-label="Previous">←</button>
        <div className="lightbox-image" onClick={(e) => e.stopPropagation()}><Image src={artworks[lightbox].src} alt={t.artAlt[artworks[lightbox].altKey]} fill sizes="90vw" /></div>
        <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % artworks.length); }} aria-label="Next">→</button>
        <span className="lightbox-count">{String(lightbox + 1).padStart(2, "0")} / {String(artworks.length).padStart(2, "0")}</span>
      </div>}
    </div>
  );
}
