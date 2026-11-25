import { useState } from 'react'
import { CompositionPreview } from '../editor/CompositionPreview'
import { defaultEdits } from '../editor/useEditSettings'
import { findTemplate } from './catalog'

interface Props {
  onTemplates: () => void
  onBlank: () => void
}

const sampleScenes = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 640"><defs><linearGradient id="s" x2="0" y2="1"><stop stop-color="#f7c7a5"/><stop offset=".55" stop-color="#ed9d86"/><stop offset="1" stop-color="#856f7c"/></linearGradient><linearGradient id="w" x2="0" y2="1"><stop stop-color="#f8ddba"/><stop offset="1" stop-color="#d98e76"/></linearGradient></defs><rect width="480" height="640" fill="url(#s)"/><circle cx="335" cy="180" r="62" fill="#fff0c9"/><path d="M0 365q100-52 190 0t290-2v277H0" fill="#7c9290"/><path d="M0 405q130-44 250 5t230-4v234H0" fill="url(#w)"/><path d="M0 496q125-30 250 2t230 0" fill="none" stroke="#f8e3c4" stroke-width="9" opacity=".75"/><path d="M94 552q18-128 102-126 72 3 94 126" fill="#4b5254"/><circle cx="194" cy="387" r="42" fill="#b96f65"/><path d="M248 552q13-96 72-96 55 0 69 96" fill="#74645e"/><circle cx="321" cy="427" r="32" fill="#e7ad8a"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 640"><defs><linearGradient id="b" x2="0" y2="1"><stop stop-color="#f4d6c0"/><stop offset="1" stop-color="#c6aa9d"/></linearGradient></defs><rect width="480" height="640" fill="url(#b)"/><circle cx="235" cy="295" r="145" fill="#e9bd83"/><path d="M85 640q18-210 153-222 143 7 161 222" fill="#71837b"/><path d="M149 278q2-139 101-141 102 4 101 145-37-52-99-49-65 0-103 45" fill="#594845"/><ellipse cx="236" cy="302" rx="89" ry="115" fill="#e3aa88"/><path d="M147 286q24-82 93-85 62 0 108 67-17-118-104-128-94 8-97 146" fill="#594845"/><path d="M205 314h12m45 0h12" stroke="#493c39" stroke-width="8" stroke-linecap="round"/><path d="M218 365q19 16 38 0" fill="none" stroke="#a45751" stroke-width="7" stroke-linecap="round"/><circle cx="91" cy="141" r="25" fill="#fff4de" opacity=".8"/><circle cx="377" cy="205" r="16" fill="#fff4de" opacity=".8"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 640"><defs><linearGradient id="g" x2="0" y2="1"><stop stop-color="#c4d2be"/><stop offset="1" stop-color="#e8c59f"/></linearGradient></defs><rect width="480" height="640" fill="url(#g)"/><circle cx="373" cy="115" r="48" fill="#f8eccd"/><path d="M0 359q113-83 214 0t266-5v286H0" fill="#879883"/><path d="M0 448q130-74 240 0t240-2v194H0" fill="#d39472"/><path d="M91 640q8-145 104-158 104 9 116 158" fill="#b57662"/><circle cx="195" cy="434" r="42" fill="#efc09a"/><path d="M185 424q15-14 28 0" stroke="#6c5247" stroke-width="6" stroke-linecap="round"/><path d="M183 452q16 12 31 0" fill="none" stroke="#a15d57" stroke-width="5" stroke-linecap="round"/><path d="M320 352q-28-92 8-150m-3 81q42-54 73-45m-88 68q-55-39-81-22" fill="none" stroke="#526d57" stroke-width="12" stroke-linecap="round"/><circle cx="407" cy="237" r="28" fill="#cf8d87"/><circle cx="228" cy="286" r="24" fill="#e6b07d"/></svg>`,
].map((svg) => `data:image/svg+xml,${encodeURIComponent(svg)}`)

const slides = [
  { id: '3-cut', title: 'Little golden hour', note: 'Three frames, one afternoon' },
  { id: 'instant-film', title: 'A portrait to keep', note: 'A little film, a lot of feeling' },
  { id: 'retro-grid', title: 'Weekend in bloom', note: 'Four moments, collected' },
]

const howItWorks = [
  { number: '01', title: 'Choose your frame', text: 'Start with a photostrip, a classic frame, or a blank canvas.' },
  { number: '02', title: 'Make it yours', text: 'Capture a new moment or add photos already on your device.' },
  { number: '03', title: 'Keep the feeling', text: 'Add your finishing touches, then download your keepsake.' },
]

export function StartPage({ onTemplates, onBlank }: Props) {
  const [activeSlide, setActiveSlide] = useState(0)
  const slide = slides[activeSlide]
  const template = findTemplate(slide.id)!
  const slots = Array.from({ length: template.photoCount }, (_, index) => sampleScenes[(index + activeSlide) % sampleScenes.length])

  function changeSlide(offset: number) {
    setActiveSlide((current) => (current + offset + slides.length) % slides.length)
  }

  return (
    <div className="landing-page">
      <section aria-labelledby="start-heading" className="landing-hero">
        <div className="landing-hero-copy">
          <p className="landing-eyebrow"><span aria-hidden="true">✳</span> Little moments, made lasting</p>
          <h1 id="start-heading">A little frame<br /><em>for a lot of feeling.</em></h1>
          <p className="landing-lede">Turn the moments you love into something you can hold onto. Make a photo strip, a tiny album page, or whatever feels like you.</p>
          <div className="landing-actions">
            <button type="button" onClick={onTemplates} className="landing-button landing-button-primary">Choose a template <span aria-hidden="true">↗</span></button>
            <button type="button" onClick={onBlank} className="landing-button landing-button-quiet">Start with a blank page <span aria-hidden="true">→</span></button>
          </div>
          <p className="landing-reassurance"><span aria-hidden="true">✦</span> No account needed · Your photos stay in this browser</p>
        </div>

        <div className="landing-showcase" aria-label="Sample Ephemora photo compositions">
          <span className="landing-spark landing-spark-one" aria-hidden="true">✳</span>
          <span className="landing-spark landing-spark-two" aria-hidden="true">✦</span>
          <div className="landing-orbit landing-orbit-one" aria-hidden="true" />
          <div className="landing-orbit landing-orbit-two" aria-hidden="true" />
          <div className="landing-photo-card landing-photo-card-back" aria-hidden="true"><img src={sampleScenes[2]} alt="" /></div>
          <div className="landing-photo-card landing-photo-card-front">
            <CompositionPreview template={template} slots={slots} edits={defaultEdits} height="clamp(17rem, 42vw, 24rem)" />
            <div className="landing-caption"><span className="landing-caption-dot" /><span>{slide.title}</span><span className="landing-caption-note">{slide.note}</span></div>
          </div>
          <div className="landing-preview-controls" aria-label="Choose a sample composition">
            <button type="button" onClick={() => changeSlide(-1)} aria-label="Previous sample composition">←</button>
            <div className="landing-slide-dots">
              {slides.map((item, index) => <button key={item.id} type="button" onClick={() => setActiveSlide(index)} aria-label={`Show sample ${index + 1}: ${item.title}`} aria-current={index === activeSlide ? 'true' : undefined} />)}
            </div>
            <span className="landing-slide-count">0{activeSlide + 1} / 0{slides.length}</span>
            <button type="button" onClick={() => changeSlide(1)} aria-label="Next sample composition">→</button>
          </div>
        </div>
      </section>

      <section id="how-it-works" aria-labelledby="how-heading" className="landing-how">
        <div className="landing-section-heading">
          <p className="landing-eyebrow">A soft place to start</p>
          <h2 id="how-heading">From “remember this?”<br /><em>to “look at this.”</em></h2>
          <p>Three easy steps, and the moment is yours to keep.</p>
        </div>
        <div className="landing-steps">
          {howItWorks.map((item) => <article className="landing-step" key={item.number}>
            <span className="landing-step-number">{item.number}</span>
            <span className="landing-step-flower" aria-hidden="true">✿</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>)}
        </div>
      </section>

      <section id="templates" aria-labelledby="templates-heading" className="landing-templates">
        <div className="landing-templates-copy">
          <p className="landing-eyebrow">A frame for every kind of day</p>
          <h2 id="templates-heading">Your moments.<br /><em>Your kind of lovely.</em></h2>
          <p>Pick a shape that feels right. Go soft and simple, a little retro, or make a blank page completely your own.</p>
          <button type="button" onClick={onTemplates} className="landing-button landing-button-primary">Explore the templates <span aria-hidden="true">↗</span></button>
        </div>
        <div className="landing-template-chips" aria-label="Template styles">
          <span className="landing-chip landing-chip-peach">A little nostalgia</span>
          <span className="landing-chip landing-chip-sage">Fresh and simple</span>
          <span className="landing-chip landing-chip-lilac">Made by you</span>
          <span className="landing-template-stamp" aria-hidden="true">made<br />with love <span>♡</span></span>
        </div>
      </section>

      <section className="landing-last-call" aria-labelledby="last-call-heading">
        <span className="landing-last-flower" aria-hidden="true">✿</span>
        <p className="landing-eyebrow">Whenever you’re ready</p>
        <h2 id="last-call-heading">Let’s make a little<br /><em>something to remember.</em></h2>
        <button type="button" onClick={onTemplates} className="landing-button landing-button-primary">Choose a template <span aria-hidden="true">↗</span></button>
        <p>Your photos stay in this browser until you choose to download.</p>
      </section>
    </div>
  )
}
