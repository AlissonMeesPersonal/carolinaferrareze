'use client';
import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Download, Menu, Search, Sparkles, Users, ChevronLeft } from 'lucide-react';
import { communityLessons, communityPreviewSlides } from '@/lib/community-lessons.mjs';

const THUMB = '/images/originais/hero.jpeg';

function LessonThumbnail({ lesson }) {
  return (
    <span className="bmc-device-thumb">
      <img src={THUMB} alt="" loading="lazy" decoding="async" width="88" height="70" />
      <span className="bmc-device-thumb-badge">#{lesson.number}</span>
      <span className="bmc-device-duration">{lesson.duration}</span>
    </span>
  );
}

function PhoneStatus() {
  return (
    <div className="bmc-device-status" aria-hidden="true">
      <span>13:52</span>
      <span className="bmc-device-status-symbols">● ▂▃▅ ▰</span>
    </div>
  );
}

function IntroScreen() {
  return (
    <div className="bmc-device-screen bmc-device-screen--intro">
      <PhoneStatus/>
      <header className="bmc-device-site-header">
        <div className="bmc-device-wordmark">Carolina<br/>Ferrareze<small>Mentora e Terapeuta Sistêmica</small></div>
        <Menu size={19} aria-hidden="true"/>
      </header>
      <div className="bmc-device-intro-body">
        <div className="bmc-device-intro-mark"><Users size={24} aria-hidden="true"/><h3>Comunidade<br/>Bota a Mão na Consciência</h3></div>
        <p>Um espaço de encontros, aulas e reflexões para quem quer se conhecer mais, questionar padrões e construir uma vida com mais consciência, paz e alegria.</p>
        <div className="bmc-device-tags">
          {['Aulas exclusivas','Reflexões','Exercícios','Meditações','Encontros'].map(item=><span key={item}><Sparkles size={11} aria-hidden="true"/>{item}</span>)}
        </div>
        <div className="bmc-device-intro-footer">Acolher · Compreender · Ressignificar</div>
      </div>
    </div>
  );
}

function LibraryScreen({ light=false }) {
  const lessons=light?communityLessons.slice(0,6):communityLessons;
  return (
    <div className={'bmc-device-screen '+(light?'bmc-device-screen--light':'bmc-device-screen--dark')}>
      <PhoneStatus/>
      <header className="bmc-device-library-header">
        <ChevronLeft size={17} aria-hidden="true"/>
        <span>Comunidade Bota a Mão na Consciência</span>
        <Search size={16} aria-hidden="true"/>
      </header>
      <div className="bmc-device-lesson-list">
        {lessons.map(lesson=>
          <div className="bmc-device-lesson" key={lesson.number}>
            <LessonThumbnail lesson={lesson}/>
            <p>#{lesson.number} - {lesson.title}</p>
            {!light&&<Download className="bmc-device-download" size={15} strokeWidth={1.5} aria-hidden="true"/>}
          </div>
        )}
      </div>
      {light&&<div className="bmc-device-light-footer">Novas reflexões para transformar seu olhar.</div>}
    </div>
  );
}

function PreviewPhone({ type }) {
  return (
    <div className="bmc-device-shell" aria-hidden="true">
      <div className="bmc-device-bezel">
        <div className="bmc-device-notch"/>
        {type==='intro'?<IntroScreen/>:<LibraryScreen light={type==='themes'}/>}
      </div>
    </div>
  );
}

export default function CommunityPhonesCarousel() {
  const [active,setActive]=useState(1);
  const touchStartX=useRef(null);
  const count=communityPreviewSlides.length;
  const go=(delta)=>setActive(index=>(index+delta+count)%count);
  const slotFor=(index)=>index===active?'center':index===(active+count-1)%count?'left':'right';

  function handleTouchEnd(event){
    if(touchStartX.current===null)return;
    const distance=event.changedTouches[0].clientX-touchStartX.current;
    touchStartX.current=null;
    if(Math.abs(distance)>50)go(distance<0?1:-1);
  }

  return (
    <section id="aulas-comunidade" className="bmc-phones-section" aria-label="Prévia das aulas e da plataforma da Comunidade BMC">
      <div className="bmc-phones-carousel" role="region" aria-roledescription="carrossel" aria-label="Três visualizações da comunidade"
        onTouchStart={event=>{touchStartX.current=event.touches[0].clientX;}}
        onTouchEnd={handleTouchEnd}
        onKeyDown={event=>{
          if(event.key==='ArrowRight'){event.preventDefault();go(1);}
          else if(event.key==='ArrowLeft'){event.preventDefault();go(-1);}
        }}>
        <div className="bmc-phones-stage">
          {communityPreviewSlides.map((slide,index)=>{
            const slot=slotFor(index);
            return (
              <button type="button" className={'bmc-phone-slot bmc-phone-slot--'+slot}
                key={slide.id} onClick={()=>setActive(index)}
                aria-label={slide.label+(slot==='center'?' — selecionada':' — exibir')}
                aria-current={slot==='center'?'true':undefined} tabIndex={slot==='center'?0:-1}>
                <PreviewPhone type={slide.id}/>
              </button>
            );
          })}
        </div>
        <div className="bmc-carousel-controls">
          <button className="bmc-carousel-arrow" type="button" onClick={()=>go(-1)} aria-label="Visualização anterior">
            <ArrowLeft size={19} aria-hidden="true"/>
          </button>
          <div className="bmc-carousel-dots" role="group" aria-label="Selecionar visualização">
            {communityPreviewSlides.map((slide,index)=>
              <button key={slide.id} type="button"
                className={'bmc-carousel-dot'+(index===active?' is-active':'')}
                aria-label={'Exibir: '+slide.label}
                aria-pressed={index===active}
                onClick={()=>setActive(index)}/>
            )}
          </div>
          <button className="bmc-carousel-arrow" type="button" onClick={()=>go(1)} aria-label="Próxima visualização">
            <ArrowRight size={19} aria-hidden="true"/>
          </button>
        </div>
        <span className="bmc-carousel-sr" role="status" aria-live="polite">
          {communityPreviewSlides[active].label}, visualização {active+1} de {count}
        </span>
      </div>
    </section>
  );
}
