'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import briefing from '../../public/images/site-safety-briefing.webp';
import equipment from '../../public/images/protective-equipment.webp';
import classroom from '../../public/images/safety-classroom.webp';

const SLIDES = [
  { image: briefing, title: '함께 확인하는 현장의 안전', label: '건설현장 안전 브리핑', alt: '안전모와 반사조끼를 착용한 근로자들이 현장 도면을 함께 확인하는 AI 생성 이미지', position: '50% 45%' },
  { image: equipment, title: '안전은 올바른 보호구 착용부터', label: '보호구 착용 점검', alt: '안전모와 보안경을 착용한 교육생의 턱끈을 점검하는 AI 생성 이미지', position: '58% 40%' },
  { image: classroom, title: '배우고 실천하는 안전교육', label: '안전교육 강의', alt: '강사가 안전모를 들고 교육생에게 보호구를 설명하는 강의 장면의 AI 생성 이미지', position: '67% 45%' },
];

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPlaying(!preference.matches);
    const updateVisibility = () => setVisible(!document.hidden);
    updatePreference();
    updateVisibility();
    preference.addEventListener('change', updatePreference);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      preference.removeEventListener('change', updatePreference);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!playing || !visible) return;
    const timer = window.setTimeout(() => setActive(index => (index + 1) % SLIDES.length), 5000);
    return () => window.clearTimeout(timer);
  }, [active, playing, visible]);

  function move(direction) {
    setActive(index => (index + direction + SLIDES.length) % SLIDES.length);
  }

  return <div className="hero-slider" role="region" aria-roledescription="슬라이드 쇼" aria-label="안전교육 사진" onFocusCapture={event => { if (!event.target.closest('[data-playback]')) setPlaying(false); }}>
    <div className="hero-slides" aria-live={playing ? 'off' : 'polite'} aria-atomic="true">
      {SLIDES.map((slide, index) => <div key={slide.label} className={`hero-slide${index === active ? ' is-active' : ''}`} role="group" aria-roledescription="슬라이드" aria-label={`${index + 1} / ${SLIDES.length}`} aria-hidden={index !== active}>
        <Image src={slide.image} alt={slide.alt} fill priority={index === 0} loading={index === 0 ? undefined : 'eager'} sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1200px) 43vw, 490px" style={{ objectPosition: slide.position }} />
        <div className="slide-shade" />
        <div className="slide-caption"><span>SAFETY STARTS HERE</span><h2>{slide.title}</h2></div>
      </div>)}
    </div>
    <span className="slide-origin">안전교육 이미지 · AI 생성</span>
    <div className="slider-controls">
      <div className="slide-dots" aria-label="사진 선택">{SLIDES.map((slide, index) => <button key={slide.label} type="button" aria-label={`${index + 1}번 사진 보기: ${slide.label}`} aria-pressed={active === index} onClick={() => setActive(index)}><span /></button>)}</div>
      <span className="slide-counter" aria-hidden="true">0{active + 1}<span> / 03</span></span>
      <div className="slide-buttons"><button type="button" aria-label="이전 사진" onClick={() => move(-1)}>←</button><button type="button" data-playback aria-label={playing ? '자동 전환 일시정지' : '5초 간격 자동 전환 재생'} onClick={() => setPlaying(value => !value)}>{playing ? 'Ⅱ' : '▶'}</button><button type="button" aria-label="다음 사진" onClick={() => move(1)}>→</button></div>
    </div>
  </div>;
}
