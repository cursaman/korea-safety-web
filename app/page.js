'use client';

import { useEffect, useRef, useState } from 'react';

const ADDRESS = '경남 양산시 북정서길 22, 201호';
const MAP = `https://map.naver.com/p/search/${encodeURIComponent(ADDRESS)}`;
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const FAQ = [
  ['교육은 얼마나 걸리나요?', '건설업 기초안전보건교육은 4시간 과정입니다. 평일은 13:00~17:00, 토요일은 예약제로 09:00~13:00 운영합니다.'],
  ['교육 당일 무엇을 가져가야 하나요?', '본인 확인을 위한 신분증을 지참하고, 원활한 접수를 위해 교육 시작 20분 전에 도착해 주세요. 교육비는 80,000원입니다.'],
  ['당일 접수와 주차가 가능한가요?', '현장 접수와 교육생 주차가 가능합니다. 방문 전 전화로 실제 교육 일정과 접수 가능 여부를 확인해 주세요.'],
  ['토요일에도 교육을 받을 수 있나요?', '토요일은 09:00~13:00 예약제로 운영합니다. 교육 진행 여부와 예약은 055-389-0302로 문의해 주세요.'],
];

function getDays(today, offset) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(`${today}T00:00:00+09:00`);
    date.setUTCDate(date.getUTCDate() + offset * 7 + index);
    const iso = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(date);
    const local = new Date(`${iso}T12:00:00+09:00`);
    const weekday = local.getUTCDay();
    return { iso, month: Number(iso.slice(5, 7)), day: Number(iso.slice(8)), weekday };
  });
}

function Arrow({ diagonal = false }) {
  return <span aria-hidden="true">{diagonal ? '↗' : '→'}</span>;
}

function Helmet({ large = false }) {
  return <svg className={large ? 'helmet helmet-large' : 'helmet'} viewBox="0 0 100 84" fill="none" aria-hidden="true">
    <path d="M19 57V45C19 29 30 15 44 12M81 57V45C81 29 70 15 56 12" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    <path d="M44 41V9H56V41M11 58H89V70H11V58Z" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
    <path d="M30 70V76H70V70" stroke="currentColor" strokeWidth="4" />
  </svg>;
}

export default function Home() {
  const [today, setToday] = useState('');
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const dialog = useRef(null);
  const form = useRef(null);

  useEffect(() => {
    const value = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());
    setToday(value);
    setSelected(getDays(value, 0)[0]);
  }, []);

  const days = today ? getDays(today, offset) : [];
  const isClosed = selected?.weekday === 0;
  const selectedLabel = selected ? `${selected.month}월 ${selected.day}일 (${WEEKDAYS[selected.weekday]})` : '';
  const time = selected?.weekday === 6 ? '09:00–13:00' : '13:00–17:00';

  function changeWeek(next) {
    setOffset(next);
    setSelected(getDays(today, next)[0]);
  }

  function openForm() {
    setFinished(false);
    form.current?.reset();
    dialog.current.showModal();
  }

  function handleSubmit(event) {
    event.preventDefault();
    setFinished(true);
    form.current.reset();
  }

  return <>
    <div className="preview-bar">프런트엔드 미리보기 <span>·</span> 일정과 신청은 데모입니다</div>
    <header className="header">
      <div className="container header-inner">
        <a href="#top" className="brand" aria-label="한국안전교육 홈"><span className="brand-icon"><Helmet /></span><span>한국안전교육<small>KOREA SAFETY EDUCATION</small></span></a>
        <nav className="nav" aria-label="주요 메뉴"><a href="#education">교육 안내</a><a href="#schedule">교육 일정</a><a href="#location">오시는 길</a></nav>
        <a href="tel:0553890302" className="header-contact">전화 상담 <Arrow diagonal /></a>
      </div>
    </header>

    <main id="top">
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> 양산 · 부산 · 경남 건설업 안전교육</p>
          <h1>현장의 첫걸음,<br /><span>안전교육부터.</span></h1>
          <p className="hero-description">건설업 기초안전보건교육,<br />꼭 필요한 안내부터 교육 일정까지 한눈에 확인하세요.</p>
          <div className="hero-actions"><a href="#schedule" className="button button-primary">교육 일정 확인 <Arrow /></a><a href="tel:0553890302" className="button button-outline">전화로 문의하기 <Arrow diagonal /></a></div>
          <div className="hero-footnote"><span className="check">✓</span> 4시간 교육 <i /> 신분증 지참 <i /> 주차 가능</div>
        </div>
        <div className="hero-visual">
          <div className="visual-top"><span>SAFETY STARTS HERE</span><span className="visual-code">KSE / 01</span></div>
          <div className="helmet-art"><span className="orbit orbit-one" /><span className="orbit orbit-two" /><Helmet large /><span className="art-cross cross-one">+</span><span className="art-cross cross-two">+</span></div>
          <div className="visual-bottom"><span>오늘의 교육이<br /><strong>내일의 안전이 됩니다.</strong></span><span className="visual-arrow" aria-hidden="true">↗</span></div>
          <div className="time-tag"><span className="tag-icon" aria-hidden="true">◷</span><span>건설업 기초안전보건교육<strong>4시간 교육과정</strong></span></div>
        </div>
      </section>

      <section className="facts container" aria-label="교육 핵심 정보">
        <div><span className="fact-label">평일 교육</span><strong>13:00–17:00</strong><span>월요일부터 금요일까지</span></div>
        <div><span className="fact-label">토요일 교육</span><strong>09:00–13:00</strong><span>사전 예약제로 운영</span></div>
        <div><span className="fact-label">교육비</span><strong>80,000<span>원</span></strong><span>방문 전 접수 가능 여부 확인</span></div>
        <div><span className="fact-label">교육 준비</span><strong>신분증 지참</strong><span>교육 시작 20분 전 도착</span></div>
      </section>

      <section id="education" className="education section container">
        <div className="section-heading"><div><p className="eyebrow">BEFORE YOU VISIT</p><h2>처음 오셔도, 어렵지 않게.</h2></div><p>교육 전 아래 세 가지만 확인해 주세요.</p></div>
        <div className="steps"><article><span className="step-number">01</span><h3>교육 일정 확인</h3><p>희망하는 날짜와 시간을 확인해 주세요.<br />토요일은 사전 예약이 필요합니다.</p><a href="#schedule">일정 살펴보기 <Arrow /></a></article><article><span className="step-number">02</span><h3>신분증 챙기기</h3><p>본인 확인을 위해 신분증이 필요합니다.<br />교육비도 함께 확인해 주세요.</p><span className="step-note">교육비 80,000원</span></article><article><span className="step-number">03</span><h3>20분 먼저 도착</h3><p>여유 있게 도착해 접수를 진행하세요.<br />교육생 주차 공간이 있습니다.</p><a href="#location">오시는 길 확인 <Arrow /></a></article></div>
      </section>

      <section id="schedule" className="schedule-section section">
        <div className="container">
          <div className="section-heading"><div><p className="eyebrow">CLASS SCHEDULE</p><h2>나에게 맞는 교육일정</h2></div><span className="demo-label">예시 일정</span></div>
          <p className="schedule-description">날짜를 선택하고 교육시간을 확인하세요. 실제 운영 일정은 전화로 문의해 주세요.</p>
          <div className="schedule-panel">
            <div className="week-heading"><h3>{days.length ? `${days[0].month}월 ${days[0].day}일 – ${days[6].month}월 ${days[6].day}일` : '일정 불러오는 중'}</h3><div className="week-controls"><button type="button" disabled={!today || offset === 0} onClick={() => changeWeek(offset - 1)} aria-label="이전 주">←</button><button type="button" disabled={!today || offset >= 8} onClick={() => changeWeek(offset + 1)} aria-label="다음 주">→</button></div></div>
            <div className="day-grid" aria-label="교육 날짜 선택">{days.map(day => <button type="button" key={day.iso} className={`day ${day.weekday === 0 ? 'sunday' : ''}`} aria-pressed={selected?.iso === day.iso} onClick={() => setSelected(day)}><span className="day-name">{WEEKDAYS[day.weekday]}요일</span><strong>{day.day}</strong><span className="day-state">{day.weekday === 0 ? '휴무' : day.weekday === 6 ? '예약제' : '평일 교육'}</span></button>)}</div>
            <div className="selected-session" aria-live="polite"><div><p className="session-label">선택한 교육일</p><h3>{selectedLabel || '날짜를 불러오고 있습니다'}</h3><p>{isClosed ? '일요일은 교육 일정이 없습니다.' : `건설업 기초안전보건교육 · ${time}`}</p></div><button type="button" className="button button-primary" onClick={openForm} disabled={!selected || isClosed}>신청 화면 보기 <Arrow /></button></div>
          </div>
          <p className="schedule-note">* 공휴일·임시 휴무는 반영되지 않은 예시입니다. 실제 예약 접수나 좌석 조회는 이루어지지 않습니다.</p>
        </div>
      </section>

      <section className="section faq-section container" id="faq"><div><p className="eyebrow">FREQUENTLY ASKED</p><h2>궁금한 점을<br />미리 확인하세요.</h2><a className="text-link" href="tel:0553890302">더 궁금하다면 전화 문의 <Arrow diagonal /></a></div><div className="faq-list">{FAQ.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>

      <section id="location" className="location-section container"><div className="location-mark" aria-hidden="true"><div className="map-road road-a" /><div className="map-road road-b" /><div className="map-road road-c" /><div className="map-block block-a" /><div className="map-block block-b" /><div className="map-pin"><Helmet /><span>한국안전교육</span></div><span className="map-caption">정확한 위치는 지도에서 확인하세요</span></div><div className="location-copy"><p className="eyebrow">FIND US</p><h2>가까운 곳에서,<br />안전한 시작.</h2><address>{ADDRESS}<span>한국안전교육 · 교육생 주차 가능</span></address><a href={MAP} target="_blank" rel="noreferrer" className="button button-outline">네이버지도에서 보기 <Arrow diagonal /></a></div></section>

      <section className="contact-banner container"><div><p>교육 일정부터 준비물까지</p><h2>편하게 물어보세요.</h2></div><a href="tel:0553890302">055-389-0302 <Arrow diagonal /></a></section>
    </main>

    <footer className="footer container"><div><a href="#top" className="footer-brand">한국안전교육</a><p>{ADDRESS}<br />대표자 최현주·안정현 · 사업자등록번호 217-86-02371<br />전화 055-389-0302 · 팩스 0504-006-2558</p></div><div className="footer-right"><span>안전은 교육에서 시작됩니다.</span><small>© {today ? today.slice(0, 4) : '2026'} KOREA SAFETY EDUCATION</small></div></footer>

    <nav className="mobile-dock" aria-label="빠른 메뉴"><a href="tel:0553890302">전화 문의 ↗</a><a href="#schedule">교육 일정 →</a></nav>

    <dialog ref={dialog} className="application-dialog" onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}>
      <button type="button" className="close-dialog" onClick={() => dialog.current.close()} aria-label="신청 화면 닫기">×</button>
      {finished ? <div className="demo-success" role="status"><span className="success-icon" aria-hidden="true">✓</span><p className="eyebrow">PREVIEW COMPLETE</p><h2>신청 화면을 확인했습니다.</h2><p>데모이므로 실제 예약은 접수되지 않았습니다.<br />입력한 정보는 전송·저장하지 않습니다.</p><a href="tel:0553890302" className="button button-primary">실제 예약은 전화 문의 <Arrow diagonal /></a><button type="button" className="text-button" onClick={() => dialog.current.close()}>닫기</button></div> : <><p className="eyebrow">APPLICATION PREVIEW</p><h2>교육 신청 미리보기</h2><p className="dialog-description">실제 접수 없이 입력 화면만 확인합니다.<br />개인정보 대신 예시 이름과 번호를 입력해 주세요.</p><div className="application-summary"><strong>{selectedLabel}</strong><span>{time} · 교육비 80,000원</span></div><form ref={form} onSubmit={handleSubmit}><label htmlFor="student-name">이름 <span>필수</span></label><input id="student-name" name="demo-name" required maxLength={30} autoComplete="off" placeholder="예시 교육생" /><label htmlFor="student-phone">휴대전화번호 <span>필수</span></label><input id="student-phone" name="demo-phone" type="tel" required autoComplete="off" inputMode="tel" pattern="01[0-9]-?[0-9]{3,4}-?[0-9]{4}" title="010-0000-0000 형식으로 입력해 주세요" placeholder="010-0000-0000" /><p className="form-note">이 화면은 프런트엔드 데모이며 실제 예약 기능은 연결 전입니다.</p><button className="button button-primary form-submit" type="submit">데모 신청 확인 <Arrow /></button></form></>}
    </dialog>
  </>;
}
