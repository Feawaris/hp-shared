function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/vidstack-CRlTZX3Z-PBDNdscv.js","assets/vidstack-DQ6dSZwe-BTtv5vWE.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
var Ae=Object.getPrototypeOf;var Pe=Reflect.get;var pt=(e,t,s)=>Pe(Ae(e),s,t);import{c as h,p as bt,e as A,b as Ut,o as V,i as Me,f as J,u as x,C as Ie,g as Yt,h as k,j as Oe,k as y,l as Ht,m as ht,n as yt,q as gt,r as Zt,s as q,t as Jt,v as Ve,w as Xt,x as te,y as X,z as Le,A as Be,B as G,D as Ge,$ as Ne,E as _t,H as xt,F as Z,G as Re,I as Fe,J as Ee,K as je,L as We,N as qe,O as $,P as Ke,Q as ee,d as wt}from"./vidstack-DnapCeMD-DbZPO4jH.js";import{e as Qe,c as ze,t as Wt,A as Ue,l as kt,D as Ye,x as a,o as He,n as st,L as Ct,i as Ze,a as se}from"./vidstack-CbhL8rpf-C0Lj70YY.js";import{_ as ne}from"./app-c3VcIhAs.js";class Je extends ze{constructor(t){super(t),this.h=null,this.w=!1,this.ra=null,this.w=t.type===Wt.ATTRIBUTE||t.type===Wt.BOOLEAN_ATTRIBUTE}render(t){return t!==this.h&&(this.disconnected(),this.h=t,this.isConnected&&this.Si()),this.h?this.el(bt(this.h)):Ue}reconnected(){this.Si()}disconnected(){var t;(t=this.ra)==null||t.call(this),this.ra=null}Si(){this.h&&(this.ra=A(this.o.bind(this)))}el(t){return this.w?kt(t):t}hl(t){this.setValue(this.el(t))}o(){var t;this.hl((t=this.h)==null?void 0:t.call(this))}}function o(e){return Qe(Je)(h(e))}class ae{constructor(t,s){this.oo=t,this.Ca=s,this.elements=new Set,this.vf=Ut(this.ea.bind(this))}connect(){this.ea();const t=new MutationObserver(this.vf);for(const s of this.oo)t.observe(s,{childList:!0,subtree:!0});V(()=>t.disconnect()),V(this.disconnect.bind(this))}disconnect(){this.elements.clear()}assign(t,s){Me(t)?(s.textContent="",s.append(t)):Ye(t,s),s.style.display||(s.style.display="contents");const n=s.firstElementChild;if(!n)return;const i=s.getAttribute("data-class");i&&n.classList.add(...i.split(" "))}ea(t){if(t&&!t.some(i=>i.addedNodes.length))return;let s=!1,n=this.oo.flatMap(i=>[...i.querySelectorAll("slot")]);for(const i of n)!i.hasAttribute("name")||this.elements.has(i)||(this.elements.add(i),s=!0);s&&this.Ca(this.elements)}}let Xe=0,H="data-slot-id";class Tt{constructor(t){this.oo=t,this.vf=Ut(this.ea.bind(this)),this.slots=new ae(t,this.ea.bind(this))}connect(){this.slots.connect(),this.ea();const t=new MutationObserver(this.vf);for(const s of this.oo)t.observe(s,{childList:!0});V(()=>t.disconnect())}ea(){for(const t of this.oo)for(const s of t.children){if(s.nodeType!==1)continue;const n=s.getAttribute("slot");if(!n)continue;s.style.display="none";let i=s.getAttribute(H);i||s.setAttribute(H,i=++Xe+"");for(const l of this.slots.elements){if(l.getAttribute("name")!==n||l.getAttribute(H)===i)continue;const r=document.importNode(s,!0);n.includes("-icon")&&r.classList.add("vds-icon"),r.style.display="",r.removeAttribute("slot"),this.slots.assign(r,l),l.setAttribute(H,i)}}}}function ie({name:e,class:t,state:s,paths:n,viewBox:i="0 0 32 32"}){return a`<svg
    class="${"vds-icon"+(t?` ${t}`:"")}"
    viewBox="${i}"
    fill="none"
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
    data-icon=${kt(e??s)}
  >
    ${J(n)?He(n):o(n)}
  </svg>`}class ts{constructor(t){this.oo=t,this.Zj={},this.bk=!1,this.slots=new ae(t,this.ck.bind(this))}connect(){this.slots.connect(),V(this.disconnect.bind(this))}load(){this.xe().then(t=>{this.Zj=t,this.bk=!0,this.ck()})}disconnect(){for(const{slot:t}of this.dk())t.textContent=""}*dk(){for(const t of Object.keys(this.Zj)){const s=`${t}-icon`;for(const n of this.slots.elements)n.name===s&&(yield{icon:this.Zj[t],slot:n})}}ck(){if(this.bk)for(const{icon:t,slot:s}of this.dk())this.slots.assign(t,s)}}class oe extends ts{connect(){super.connect();const{player:t}=x();if(!t.el)return;let s,n=new IntersectionObserver(i=>{var l;(l=i[0])!=null&&l.isIntersecting&&(s==null||s(),s=void 0,this.load())});n.observe(t.el),s=V(()=>n.disconnect())}}const le=Ht();function u(){return ht(le)}const es={colorScheme:null,download:null,customIcons:!1,disableTimeSlider:!1,menuGroup:"bottom",noAudioGain:!1,noGestures:!1,noKeyboardAnimations:!1,noModal:!1,noScrubGesture:!1,playbackRates:{min:0,max:2,step:.25},audioGains:{min:0,max:300,step:25},seekStep:10,sliderChaptersMinWidth:325,hideQualityBitrate:!1,smallWhen:!1,thumbnails:null,translations:null,when:!1};var ss=Object.defineProperty,ns=Object.getOwnPropertyDescriptor,St=(e,t,s,n)=>{for(var i=n>1?void 0:n?ns(t,s):t,l=e.length-1,r;l>=0;l--)(r=e[l])&&(i=(n?r(t,s,i):r(i))||i);return n&&i&&ss(t,s,i),i};const Ft=class Ft extends Ie{constructor(){super(...arguments),this._m=h(()=>{const t=this.$props.when();return this.$m(t)}),this.Ym=h(()=>{const t=this.$props.smallWhen();return this.$m(t)}),this.menuContainer=null}get isMatch(){return this._m()}get isSmallLayout(){return this.Ym()}onSetup(){this.a=x(),this.setAttributes({"data-match":this._m,"data-sm":()=>this.Ym()?"":null,"data-lg":()=>this.Ym()?null:"","data-size":()=>this.Ym()?"sm":"lg","data-no-scrub-gesture":this.$props.noScrubGesture});const t=this;Yt(le,{...this.$props,when:this._m,smallWhen:this.Ym,userPrefersAnnouncements:k(!0),userPrefersKeyboardAnimations:k(!0),get menuContainer(){return t.menuContainer}})}onAttach(){A(this.qo.bind(this))}qo(){var s;const{colorScheme:t}=this.$props;(s=this.el)==null||s.classList.toggle("light",t()==="light")}$m(t){return t!=="never"&&(Oe(t)?t:h(()=>t(this.a.player.state))())}};Ft.props=es;let F=Ft;St([yt],F.prototype,"menuContainer",2);St([yt],F.prototype,"isMatch",1);St([yt],F.prototype,"isSmallLayout",1);function re(e,t){A(()=>{const{player:s}=x(),n=s.el;return n&&q(n,"data-layout",t()&&e),()=>n==null?void 0:n.removeAttribute("data-layout")})}function S(e,t){var s;return((s=e())==null?void 0:s[t])??t}function Dt(){return o(()=>{const{translations:e,userPrefersAnnouncements:t}=u();return t()?a`<media-announcer .translations=${o(e)}></media-announcer>`:null})}function P(e,t=""){return a`<slot
    name=${`${e}-icon`}
    data-class=${`vds-icon vds-${e}-icon${t?` ${t}`:""}`}
  ></slot>`}function Q(e){return e.map(t=>P(t))}function d(e,t){return o(()=>S(e,t))}function At({tooltip:e}){const{translations:t}=u(),{remotePlaybackState:s}=y(),n=o(()=>{const l=S(t,"AirPlay"),r=Jt(s());return`${l} ${r}`}),i=d(t,"AirPlay");return a`
    <media-tooltip class="vds-airplay-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-airplay-button class="vds-airplay-button vds-button" aria-label=${n}>
          ${P("airplay")}
        </media-airplay-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${e}>
        <span class="vds-airplay-tooltip-text">${i}</span>
      </media-tooltip-content>
    </media-tooltip>
  `}function ue({tooltip:e}){const{translations:t}=u(),{remotePlaybackState:s}=y(),n=o(()=>{const l=S(t,"Google Cast"),r=Jt(s());return`${l} ${r}`}),i=d(t,"Google Cast");return a`
    <media-tooltip class="vds-google-cast-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-google-cast-button class="vds-google-cast-button vds-button" aria-label=${n}>
          ${P("google-cast")}
        </media-google-cast-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${e}>
        <span class="vds-google-cast-tooltip-text">${i}</span>
      </media-tooltip-content>
    </media-tooltip>
  `}function nt({tooltip:e}){const{translations:t}=u(),s=d(t,"Play"),n=d(t,"Pause");return a`
    <media-tooltip class="vds-play-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-play-button
          class="vds-play-button vds-button"
          aria-label=${d(t,"Play")}
        >
          ${Q(["play","pause","replay"])}
        </media-play-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${e}>
        <span class="vds-play-tooltip-text">${s}</span>
        <span class="vds-pause-tooltip-text">${n}</span>
      </media-tooltip-content>
    </media-tooltip>
  `}function qt({tooltip:e,ref:t=Be}){const{translations:s}=u(),n=d(s,"Mute"),i=d(s,"Unmute");return a`
    <media-tooltip class="vds-mute-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-mute-button
          class="vds-mute-button vds-button"
          aria-label=${d(s,"Mute")}
          ${st(t)}
        >
          ${Q(["mute","volume-low","volume-high"])}
        </media-mute-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${e}>
        <span class="vds-mute-tooltip-text">${i}</span>
        <span class="vds-unmute-tooltip-text">${n}</span>
      </media-tooltip-content>
    </media-tooltip>
  `}function Pt({tooltip:e}){const{translations:t}=u(),s=d(t,"Closed-Captions On"),n=d(t,"Closed-Captions Off");return a`
    <media-tooltip class="vds-caption-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-caption-button
          class="vds-caption-button vds-button"
          aria-label=${d(t,"Captions")}
        >
          ${Q(["cc-on","cc-off"])}
        </media-caption-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${e}>
        <span class="vds-cc-on-tooltip-text">${n}</span>
        <span class="vds-cc-off-tooltip-text">${s}</span>
      </media-tooltip-content>
    </media-tooltip>
  `}function as(){const{translations:e}=u(),t=d(e,"Enter PiP"),s=d(e,"Exit PiP");return a`
    <media-tooltip class="vds-pip-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-pip-button
          class="vds-pip-button vds-button"
          aria-label=${d(e,"PiP")}
        >
          ${Q(["pip-enter","pip-exit"])}
        </media-pip-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content">
        <span class="vds-pip-enter-tooltip-text">${t}</span>
        <span class="vds-pip-exit-tooltip-text">${s}</span>
      </media-tooltip-content>
    </media-tooltip>
  `}function de({tooltip:e}){const{translations:t}=u(),s=d(t,"Enter Fullscreen"),n=d(t,"Exit Fullscreen");return a`
    <media-tooltip class="vds-fullscreen-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-fullscreen-button
          class="vds-fullscreen-button vds-button"
          aria-label=${d(t,"Fullscreen")}
        >
          ${Q(["fs-enter","fs-exit"])}
        </media-fullscreen-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${e}>
        <span class="vds-fs-enter-tooltip-text">${s}</span>
        <span class="vds-fs-exit-tooltip-text">${n}</span>
      </media-tooltip-content>
    </media-tooltip>
  `}function Kt({backward:e,tooltip:t}){const{translations:s,seekStep:n}=u(),i=e?"Seek Backward":"Seek Forward",l=d(s,i);return a`
    <media-tooltip class="vds-seek-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-seek-button
          class="vds-seek-button vds-button"
          seconds=${o(()=>(e?-1:1)*n())}
          aria-label=${l}
        >
          ${P(e?"seek-backward":"seek-forward")}
        </media-seek-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${t}>
        ${d(s,i)}
      </media-tooltip-content>
    </media-tooltip>
  `}function ce(){const{translations:e}=u(),{live:t}=y(),s=d(e,"Skip To Live"),n=d(e,"LIVE");return t()?a`
        <media-live-button class="vds-live-button" aria-label=${s}>
          <span class="vds-live-button-text">${n}</span>
        </media-live-button>
      `:null}function Mt(){return o(()=>{const{download:e,translations:t}=u(),s=e();if(Ve(s))return null;const{source:n,title:i}=y(),l=n(),r=Xt({title:i(),src:l,download:s});return r?a`
          <media-tooltip class="vds-download-tooltip vds-tooltip">
            <media-tooltip-trigger>
              <a
                role="button"
                class="vds-download-button vds-button"
                aria-label=${d(t,"Download")}
                href=${r.url+`?download=${r.name}`}
                download=${r.name}
                target="_blank"
              >
                <slot name="download-icon" data-class="vds-icon" />
              </a>
            </media-tooltip-trigger>
            <media-tooltip-content class="vds-tooltip-content" placement="top">
              ${d(t,"Download")}
            </media-tooltip-content>
          </media-tooltip>
        `:null})}function It(){const{translations:e}=u();return a`
    <media-captions
      class="vds-captions"
      .exampleText=${d(e,"Captions look like this")}
    ></media-captions>
  `}function O(){return a`<div class="vds-controls-spacer"></div>`}function pe(e,t){return a`
    <media-menu-portal .container=${e} disabled="fullscreen">
      ${t}
    </media-menu-portal>
  `}function me(e,t){let s=document.querySelector(`body > .${e}`);s||(s=document.createElement("div"),s.style.display="contents",s.classList.add(e),document.body.append(s));const{viewType:n}=y(),{colorScheme:i}=u();return A(()=>{if(!s)return;const l=t();q(s,"data-view-type",n()),q(s,"data-sm",l),q(s,"data-lg",!l),q(s,"data-size",l?"sm":"lg"),s.classList.toggle("light",i()==="light")}),s}function ve({placement:e,tooltip:t,portal:s}){const{textTracks:n}=x(),{viewType:i,clipStartTime:l,clipEndTime:r}=y(),{translations:p,thumbnails:c,menuContainer:v,noModal:f,menuGroup:m,smallWhen:g}=u();if(h(()=>{var Y;const N=l(),j=r()||1/0,U=k(null);te(n,"chapters",U.set);const W=(Y=U())==null?void 0:Y.cues.filter(jt=>jt.startTime<=j&&jt.endTime>=N);return!(W!=null&&W.length)})())return null;const w=h(()=>f()?X(e):g()?null:X(e)),I=h(()=>!g()&&m()==="bottom"&&i()==="video"?26:0),T=k(!1);function B(){T.set(!0)}function C(){T.set(!1)}const D=a`
    <media-menu-items
      class="vds-chapters-menu-items vds-menu-items"
      placement=${o(w)}
      offset=${o(I)}
    >
      ${o(()=>T()?a`
          <media-chapters-radio-group
            class="vds-chapters-radio-group vds-radio-group"
            .thumbnails=${o(c)}
          >
            <template>
              <media-radio class="vds-chapter-radio vds-radio">
                <media-thumbnail class="vds-thumbnail"></media-thumbnail>
                <div class="vds-chapter-radio-content">
                  <span class="vds-chapter-radio-label" data-part="label"></span>
                  <span class="vds-chapter-radio-start-time" data-part="start-time"></span>
                  <span class="vds-chapter-radio-duration" data-part="duration"></span>
                </div>
              </media-radio>
            </template>
          </media-chapters-radio-group>
        `:null)}
    </media-menu-items>
  `;return a`
    <media-menu class="vds-chapters-menu vds-menu" @open=${B} @close=${C}>
      <media-tooltip class="vds-tooltip">
        <media-tooltip-trigger>
          <media-menu-button
            class="vds-menu-button vds-button"
            aria-label=${d(p,"Chapters")}
          >
            ${P("menu-chapters")}
          </media-menu-button>
        </media-tooltip-trigger>
        <media-tooltip-content
          class="vds-tooltip-content"
          placement=${gt(t)?o(t):t}
        >
          ${d(p,"Chapters")}
        </media-tooltip-content>
      </media-tooltip>
      ${s?pe(v,D):D}
    </media-menu>
  `}function Ot(e){const{style:t}=new Option;return t.color=e,t.color.match(/\((.*?)\)/)[1].replace(/,/g," ")}let is=0;function M({label:e="",value:t="",children:s}){if(!e)return a`
      <div class="vds-menu-section">
        <div class="vds-menu-section-body">${s}</div>
      </div>
    `;const n=`vds-menu-section-${++is}`;return a`
    <section class="vds-menu-section" role="group" aria-labelledby=${n}>
      <div class="vds-menu-section-title">
        <header id=${n}>${e}</header>
        ${t?a`<div class="vds-menu-section-value">${t}</div>`:null}
      </div>
      <div class="vds-menu-section-body">${s}</div>
    </section>
  `}function z({label:e,children:t}){return a`
    <div class="vds-menu-item">
      <div class="vds-menu-item-label">${e}</div>
      ${t}
    </div>
  `}function E({label:e,icon:t,hint:s}){return a`
    <media-menu-button class="vds-menu-item">
      ${P("menu-arrow-left","vds-menu-close-icon")}
      ${t?P(t,"vds-menu-item-icon"):null}
      <span class="vds-menu-item-label">${o(e)}</span>
      <span class="vds-menu-item-hint" data-part="hint">${s?o(s):null} </span>
      ${P("menu-arrow-right","vds-menu-open-icon")}
    </media-menu-button>
  `}function os({value:e=null,options:t,hideLabel:s=!1,children:n=null,onChange:i=null}){function l(r){const{value:p,label:c}=r;return a`
      <media-radio class="vds-radio" value=${p}>
        ${P("menu-radio-check")}
        ${s?null:a`
              <span class="vds-radio-label" data-part="label">
                ${J(c)?c:o(c)}
              </span>
            `}
        ${gt(n)?n(r):n}
      </media-radio>
    `}return a`
    <media-radio-group
      class="vds-radio-group"
      value=${J(e)?e:e?o(e):""}
      @change=${i}
    >
      ${G(t)?t.map(l):o(()=>t().map(l))}
    </media-radio-group>
  `}function ls(e){return G(e)?e.map(t=>({label:t,value:t.toLowerCase()})):Object.keys(e).map(t=>({label:t,value:e[t]}))}function at(){return a`
    <div class="vds-slider-track"></div>
    <div class="vds-slider-track-fill vds-slider-track"></div>
    <div class="vds-slider-thumb"></div>
  `}function it(){return a`
    <media-slider-steps class="vds-slider-steps">
      <template>
        <div class="vds-slider-step"></div>
      </template>
    </media-slider-steps>
  `}function ot({label:e=null,value:t=null,upIcon:s="",downIcon:n="",children:i,isMin:l,isMax:r}){const p=e||t,c=[n?P(n,"down"):null,i,s?P(s,"up"):null];return a`
    <div
      class=${`vds-menu-item vds-menu-slider-item${p?" group":""}`}
      data-min=${o(()=>l()?"":null)}
      data-max=${o(()=>r()?"":null)}
    >
      ${p?a`
            <div class="vds-menu-slider-title">
              ${[e?a`<div>${e}</div>`:null,t?a`<div>${t}</div>`:null]}
            </div>
            <div class="vds-menu-slider-body">${c}</div>
          `:c}
    </div>
  `}const Vt={type:"color"},rs={type:"radio",values:{"Monospaced Serif":"mono-serif","Proportional Serif":"pro-serif","Monospaced Sans-Serif":"mono-sans","Proportional Sans-Serif":"pro-sans",Casual:"casual",Cursive:"cursive","Small Capitals":"capitals"}},us={type:"slider",min:0,max:400,step:25,upIcon:"menu-font-size-up",downIcon:"menu-font-size-down"},Lt={type:"slider",min:0,max:100,step:5,upIcon:"menu-opacity-up",downIcon:"menu-opacity-down"},ds={type:"radio",values:["None","Drop Shadow","Raised","Depressed","Outline"]},Bt=Ht();function cs(){return o(()=>{const{hasCaptions:e}=y(),{translations:t}=u();return e()?(Yt(Bt,{all:new Set}),a`
      <media-menu class="vds-font-menu vds-menu">
        ${E({label:()=>S(t,"Caption Styles")})}
        <media-menu-items class="vds-menu-items">
          ${[M({label:d(t,"Font"),children:[ps(),ms()]}),M({label:d(t,"Text"),children:[vs(),$s(),fs()]}),M({label:d(t,"Text Background"),children:[bs(),hs()]}),M({label:d(t,"Display Background"),children:[ys(),gs()]}),M({children:[_s()]})]}
        </media-menu-items>
      </media-menu>
    `):null})}function ps(){return L({group:"font",label:"Family",option:rs,defaultValue:"pro-sans",cssVarName:"font-family",getCssVarValue(e,t){var n;const s=e==="capitals"?"small-caps":"";return(n=t.el)==null||n.style.setProperty("--media-user-font-variant",s),xs(e)}})}function ms(){return L({group:"font",label:"Size",option:us,defaultValue:"100%",cssVarName:"font-size",getCssVarValue:lt})}function vs(){return L({group:"text",label:"Color",option:Vt,defaultValue:"#ffffff",cssVarName:"text-color",getCssVarValue(e){return`rgb(${Ot(e)} / var(--media-user-text-opacity, 1))`}})}function fs(){return L({group:"text",label:"Opacity",option:Lt,defaultValue:"100%",cssVarName:"text-opacity",getCssVarValue:lt})}function $s(){return L({group:"text",label:"Shadow",option:ds,defaultValue:"none",cssVarName:"text-shadow",getCssVarValue:ws})}function bs(){return L({group:"text-bg",label:"Color",option:Vt,defaultValue:"#000000",cssVarName:"text-bg",getCssVarValue(e){return`rgb(${Ot(e)} / var(--media-user-text-bg-opacity, 1))`}})}function hs(){return L({group:"text-bg",label:"Opacity",option:Lt,defaultValue:"100%",cssVarName:"text-bg-opacity",getCssVarValue:lt})}function ys(){return L({group:"display",label:"Color",option:Vt,defaultValue:"#000000",cssVarName:"display-bg",getCssVarValue(e){return`rgb(${Ot(e)} / var(--media-user-display-bg-opacity, 1))`}})}function gs(){return L({group:"display",label:"Opacity",option:Lt,defaultValue:"0%",cssVarName:"display-bg-opacity",getCssVarValue:lt})}function _s(){const{translations:e}=u(),t=()=>S(e,"Reset"),s=ht(Bt);function n(){s.all.forEach(i=>i())}return a`
    <button class="vds-menu-item" role="menuitem" @click=${n}>
      <span class="vds-menu-item-label">${o(t)}</span>
    </button>
  `}function L({group:e,label:t,option:s,defaultValue:n,cssVarName:i,getCssVarValue:l}){const{player:r}=x(),{translations:p}=u(),c=ht(Bt),v=`${e}-${t.toLowerCase()}`,f=k(n),m=()=>S(p,t),g=localStorage.getItem(`vds-player:${v}`);g&&_(g);function _(C){var D;f.set(C),localStorage.setItem(`vds-player:${v}`,C),(D=r.el)==null||D.style.setProperty(`--media-user-${i}`,(l==null?void 0:l(C,r))??C)}c.all.add(w),V(()=>void c.all.delete(w));function w(){_(n),I()}function I(){r.dispatchEvent(new Event("vds-font-change"))}if(s.type==="color"){let C=function(D){_(D.target.value),I()};return z({label:o(m),children:a`
        <input
          class="vds-color-picker"
          type="color"
          .value=${o(f)}
          @input=${C}
        />
      `})}if(s.type==="slider"){let C=function(Y){_(Y.detail+"%"),I()};const{min:D,max:N,step:j,upIcon:U,downIcon:W}=s;return ot({label:o(m),value:o(f),upIcon:U,downIcon:W,isMin:()=>f()===D+"%",isMax:()=>f()===N+"%",children:a`
        <media-slider
          class="vds-slider"
          min=${D}
          max=${N}
          step=${j}
          key-step=${j}
          .value=${o(()=>parseInt(f()))}
          aria-label=${o(m)}
          @value-change=${C}
          @drag-value-change=${C}
        >
          ${at()}${it()}
        </media-slider>
      `})}const T=ls(s.values),B=()=>{var N;const C=f(),D=((N=T.find(j=>j.value===C))==null?void 0:N.label)||"";return S(p,J(D)?D:D())};return a`
    <media-menu class=${`vds-${v}-menu vds-menu`}>
      ${E({label:m,hint:B})}
      <media-menu-items class="vds-menu-items">
        ${os({value:f,options:T,onChange({detail:C}){_(C),I()}})}
      </media-menu-items>
    </media-menu>
  `}function lt(e){return(parseInt(e)/100).toString()}function xs(e){switch(e){case"mono-serif":return'"Courier New", Courier, "Nimbus Mono L", "Cutive Mono", monospace';case"mono-sans":return'"Deja Vu Sans Mono", "Lucida Console", Monaco, Consolas, "PT Mono", monospace';case"pro-sans":return'Roboto, "Arial Unicode Ms", Arial, Helvetica, Verdana, "PT Sans Caption", sans-serif';case"casual":return'"Comic Sans MS", Impact, Handlee, fantasy';case"cursive":return'"Monotype Corsiva", "URW Chancery L", "Apple Chancery", "Dancing Script", cursive';case"capitals":return'"Arial Unicode Ms", Arial, Helvetica, Verdana, "Marcellus SC", sans-serif + font-variant=small-caps';default:return'"Times New Roman", Times, Georgia, Cambria, "PT Serif Caption", serif'}}function ws(e){switch(e){case"drop shadow":return"rgb(34, 34, 34) 1.86389px 1.86389px 2.79583px, rgb(34, 34, 34) 1.86389px 1.86389px 3.72778px, rgb(34, 34, 34) 1.86389px 1.86389px 4.65972px";case"raised":return"rgb(34, 34, 34) 1px 1px, rgb(34, 34, 34) 2px 2px";case"depressed":return"rgb(204, 204, 204) 1px 1px, rgb(34, 34, 34) -1px -1px";case"outline":return"rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px";default:return""}}function rt({label:e,checked:t,defaultChecked:s=!1,storageKey:n,onChange:i}){const{translations:l}=u(),r=n?localStorage.getItem(n):null,p=k(!!(r??s)),c=k(!1),v=o(Ne(p)),f=d(l,e);n&&i(bt(p)),t&&A(()=>void p.set(t()));function m(w){(w==null?void 0:w.button)!==1&&(p.set(I=>!I),n&&localStorage.setItem(n,p()?"1":""),i(p(),w),c.set(!1))}function g(w){_t(w)&&m()}function _(w){w.button===0&&c.set(!0)}return a`
    <div
      class="vds-menu-checkbox"
      role="menuitemcheckbox"
      tabindex="0"
      aria-label=${f}
      aria-checked=${v}
      data-active=${o(()=>c()?"":null)}
      @pointerup=${m}
      @pointerdown=${_}
      @keydown=${g}
    ></div>
  `}function ks(){return o(()=>{const{translations:e}=u();return a`
      <media-menu class="vds-accessibility-menu vds-menu">
        ${E({label:()=>S(e,"Accessibility"),icon:"menu-accessibility"})}
        <media-menu-items class="vds-menu-items">
          ${[M({children:[Cs(),Ts()]}),M({children:[cs()]})]}
        </media-menu-items>
      </media-menu>
    `})}function Cs(){const{userPrefersAnnouncements:e,translations:t}=u(),s="Announcements";return z({label:d(t,s),children:rt({label:s,storageKey:"vds-player::announcements",onChange(n){e.set(n)}})})}function Ts(){return o(()=>{const{translations:e,userPrefersKeyboardAnimations:t,noKeyboardAnimations:s}=u(),{viewType:n}=y();if(h(()=>n()!=="video"||s())())return null;const l="Keyboard Animations";return z({label:d(e,l),children:rt({label:l,defaultChecked:!0,storageKey:"vds-player::keyboard-animations",onChange(r){t.set(r)}})})})}function Ss(){return o(()=>{const{noAudioGain:e,translations:t}=u(),{audioTracks:s,canSetAudioGain:n}=y();return h(()=>!(n()&&!e())&&s().length<=1)()?null:a`
      <media-menu class="vds-audio-menu vds-menu">
        ${E({label:()=>S(t,"Audio"),icon:"menu-audio"})}
        <media-menu-items class="vds-menu-items">
          ${[Ds(),As()]}
        </media-menu-items>
      </media-menu>
    `})}function Ds(){return o(()=>{const{translations:e}=u(),{audioTracks:t}=y(),s=d(e,"Default");return h(()=>t().length<=1)()?null:M({children:a`
        <media-menu class="vds-audio-tracks-menu vds-menu">
          ${E({label:()=>S(e,"Track")})}
          <media-menu-items class="vds-menu-items">
            <media-audio-radio-group
              class="vds-audio-track-radio-group vds-radio-group"
              empty-label=${s}
            >
              <template>
                <media-radio class="vds-audio-track-radio vds-radio">
                  <slot name="menu-radio-check-icon" data-class="vds-icon"></slot>
                  <span class="vds-radio-label" data-part="label"></span>
                </media-radio>
              </template>
            </media-audio-radio-group>
          </media-menu-items>
        </media-menu>
      `})})}function As(){return o(()=>{const{noAudioGain:e,translations:t}=u(),{canSetAudioGain:s}=y();if(h(()=>!s()||e())())return null;const{audioGain:i}=y();return M({label:d(t,"Boost"),value:o(()=>Math.round(((i()??1)-1)*100)+"%"),children:[ot({upIcon:"menu-audio-boost-up",downIcon:"menu-audio-boost-down",children:Ps(),isMin:()=>((i()??1)-1)*100<=fe(),isMax:()=>((i()??1)-1)*100===$e()})]})})}function Ps(){const{translations:e}=u(),t=d(e,"Boost"),s=fe,n=$e,i=Ms;return a`
    <media-audio-gain-slider
      class="vds-audio-gain-slider vds-slider"
      aria-label=${t}
      min=${o(s)}
      max=${o(n)}
      step=${o(i)}
      key-step=${o(i)}
    >
      ${at()}${it()}
    </media-audio-gain-slider>
  `}function fe(){const{audioGains:e}=u(),t=e();return G(t)?t[0]??0:t.min}function $e(){const{audioGains:e}=u(),t=e();return G(t)?t[t.length-1]??300:t.max}function Ms(){const{audioGains:e}=u(),t=e();return G(t)?t[1]-t[0]||25:t.step}function Is(){return o(()=>{const{translations:e}=u(),{hasCaptions:t}=y(),s=d(e,"Off");return t()?a`
      <media-menu class="vds-captions-menu vds-menu">
        ${E({label:()=>S(e,"Captions"),icon:"menu-captions"})}
        <media-menu-items class="vds-menu-items">
          <media-captions-radio-group
            class="vds-captions-radio-group vds-radio-group"
            off-label=${s}
          >
            <template>
              <media-radio class="vds-caption-radio vds-radio">
                <slot name="menu-radio-check-icon" data-class="vds-icon"></slot>
                <span class="vds-radio-label" data-part="label"></span>
              </media-radio>
            </template>
          </media-captions-radio-group>
        </media-menu-items>
      </media-menu>
    `:null})}function Os(){return o(()=>{const{translations:e}=u();return a`
      <media-menu class="vds-playback-menu vds-menu">
        ${E({label:()=>S(e,"Playback"),icon:"menu-playback"})}
        <media-menu-items class="vds-menu-items">
          ${[M({children:Vs()}),Ls(),Rs()]}
        </media-menu-items>
      </media-menu>
    `})}function Vs(){const{remote:e}=x(),{translations:t}=u(),s="Loop";return z({label:d(t,s),children:rt({label:s,storageKey:"vds-player::user-loop",onChange(n,i){e.userPrefersLoopChange(n,i)}})})}function Ls(){return o(()=>{const{translations:e}=u(),{canSetPlaybackRate:t,playbackRate:s}=y();return t()?M({label:d(e,"Speed"),value:o(()=>s()===1?S(e,"Normal"):s()+"x"),children:[ot({upIcon:"menu-speed-up",downIcon:"menu-speed-down",children:Gs(),isMin:()=>s()===be(),isMax:()=>s()===he()})]}):null})}function be(){const{playbackRates:e}=u(),t=e();return G(t)?t[0]??0:t.min}function he(){const{playbackRates:e}=u(),t=e();return G(t)?t[t.length-1]??2:t.max}function Bs(){const{playbackRates:e}=u(),t=e();return G(t)?t[1]-t[0]||.25:t.step}function Gs(){const{translations:e}=u(),t=d(e,"Speed"),s=be,n=he,i=Bs;return a`
    <media-speed-slider
      class="vds-speed-slider vds-slider"
      aria-label=${t}
      min=${o(s)}
      max=${o(n)}
      step=${o(i)}
      key-step=${o(i)}
    >
      ${at()}${it()}
    </media-speed-slider>
  `}function Ns(){const{remote:e,qualities:t}=x(),{autoQuality:s,canSetQuality:n,qualities:i}=y(),{translations:l}=u(),r="Auto";return h(()=>!n()||i().length<=1)()?null:z({label:d(l,r),children:rt({label:r,checked:s,onChange(c,v){c?e.requestAutoQuality(v):e.changeQuality(t.selectedIndex,v)}})})}function Rs(){return o(()=>{const{hideQualityBitrate:e,translations:t}=u(),{canSetQuality:s,qualities:n,quality:i}=y(),l=h(()=>!s()||n().length<=1),r=h(()=>Ge(n()));return l()?null:M({label:d(t,"Quality"),value:o(()=>{var m,g;const p=(m=i())==null?void 0:m.height,c=e()?null:(g=i())==null?void 0:g.bitrate,v=c&&c>0?`${(c/1e6).toFixed(2)} Mbps`:null,f=S(t,"Auto");return p?`${p}p${v?` (${v})`:""}`:f}),children:[ot({upIcon:"menu-quality-up",downIcon:"menu-quality-down",children:Fs(),isMin:()=>r()[0]===i(),isMax:()=>r().at(-1)===i()}),Ns()]})})}function Fs(){const{translations:e}=u(),t=d(e,"Quality");return a`
    <media-quality-slider class="vds-quality-slider vds-slider" aria-label=${t}>
      ${at()}${it()}
    </media-quality-slider>
  `}function ye({placement:e,portal:t,tooltip:s}){return o(()=>{const{viewType:n}=y(),{translations:i,menuContainer:l,noModal:r,menuGroup:p,smallWhen:c}=u(),v=h(()=>r()?X(e):c()?null:X(e)),f=h(()=>!c()&&p()==="bottom"&&n()==="video"?26:0),m=k(!1);function g(){m.set(!0)}function _(){m.set(!1)}const w=a`
      <media-menu-items
        class="vds-settings-menu-items vds-menu-items"
        placement=${o(v)}
        offset=${o(f)}
      >
        ${o(()=>m()?[Os(),ks(),Ss(),Is()]:null)}
      </media-menu-items>
    `;return a`
      <media-menu class="vds-settings-menu vds-menu" @open=${g} @close=${_}>
        <media-tooltip class="vds-tooltip">
          <media-tooltip-trigger>
            <media-menu-button
              class="vds-menu-button vds-button"
              aria-label=${d(i,"Settings")}
            >
              ${P("menu-settings","vds-rotate-icon")}
            </media-menu-button>
          </media-tooltip-trigger>
          <media-tooltip-content
            class="vds-tooltip-content"
            placement=${gt(s)?o(s):s}
          >
            ${d(i,"Settings")}
          </media-tooltip-content>
        </media-tooltip>
        ${t?pe(l,w):w}
      </media-menu>
    `})}function Gt({orientation:e,tooltip:t}){return o(()=>{const{pointer:s,muted:n,canSetVolume:i}=y();if(s()==="coarse"&&!n())return null;if(!i())return qt({tooltip:t});const l=k(void 0),r=Le(l);return a`
      <div class="vds-volume" ?data-active=${o(r)} ${st(l.set)}>
        ${qt({tooltip:t})}
        <div class="vds-volume-popup">${Es({orientation:e})}</div>
      </div>
    `})}function Es({orientation:e}={}){const{translations:t}=u(),s=d(t,"Volume");return a`
    <media-volume-slider
      class="vds-volume-slider vds-slider"
      aria-label=${s}
      orientation=${kt(e)}
    >
      <div class="vds-slider-track"></div>
      <div class="vds-slider-track-fill vds-slider-track"></div>
      <media-slider-preview class="vds-slider-preview" no-clamp>
        <media-slider-value class="vds-slider-value"></media-slider-value>
      </media-slider-preview>
      <div class="vds-slider-thumb"></div>
    </media-volume-slider>
  `}function Nt(){const e=k(void 0),t=k(0),{thumbnails:s,translations:n,sliderChaptersMinWidth:i,disableTimeSlider:l,seekStep:r,noScrubGesture:p}=u(),c=d(n,"Seek"),v=o(l),f=o(()=>t()<i()),m=o(s);return Zt(e,()=>{const g=e();g&&t.set(g.clientWidth)}),a`
    <media-time-slider
      class="vds-time-slider vds-slider"
      aria-label=${c}
      key-step=${o(r)}
      ?disabled=${v}
      ?no-swipe-gesture=${o(p)}
      ${st(e.set)}
    >
      <media-slider-chapters class="vds-slider-chapters" ?disabled=${f}>
        <template>
          <div class="vds-slider-chapter">
            <div class="vds-slider-track"></div>
            <div class="vds-slider-track-fill vds-slider-track"></div>
            <div class="vds-slider-progress vds-slider-track"></div>
          </div>
        </template>
      </media-slider-chapters>
      <div class="vds-slider-thumb"></div>
      <media-slider-preview class="vds-slider-preview">
        <media-slider-thumbnail
          class="vds-slider-thumbnail vds-thumbnail"
          .src=${m}
        ></media-slider-thumbnail>
        <div class="vds-slider-chapter-title" data-part="chapter-title"></div>
        <media-slider-value class="vds-slider-value"></media-slider-value>
      </media-slider-preview>
    </media-time-slider>
  `}function js(){return a`
    <div class="vds-time-group">
      ${o(()=>{const{duration:e}=y();return e()?[a`<media-time class="vds-time" type="current"></media-time>`,a`<div class="vds-time-divider">/</div>`,a`<media-time class="vds-time" type="duration"></media-time>`]:null})}
    </div>
  `}function Ws(){return o(()=>{const{live:e,duration:t}=y();return e()?ce():t()?a`<media-time class="vds-time" type="current" toggle remainder></media-time>`:null})}function ge(){return o(()=>{const{live:e}=y();return e()?ce():js()})}function _e(){return o(()=>{const{textTracks:e}=x(),{title:t,started:s}=y(),n=k(null);return te(e,"chapters",n.set),n()&&(s()||!t())?xe():a`<media-title class="vds-chapter-title"></media-title>`})}function xe(){return a`<media-chapter-title class="vds-chapter-title"></media-chapter-title>`}class we extends oe{async xe(){const t=(await ne(()=>import("./vidstack-CRlTZX3Z-PBDNdscv.js"),__vite__mapDeps([0,1]))).icons,s={};for(const n of Object.keys(t))s[n]=ie({name:n,paths:t[n]});return s}}var R;let qs=(R=class extends F{},R.props={...pt(R,R,"props"),when:({viewType:t})=>t==="audio",smallWhen:({width:t})=>t<576},R);function Ks(){return[Dt(),It(),a`
      <media-controls class="vds-controls">
        <media-controls-group class="vds-controls-group">
          ${[Kt({backward:!0,tooltip:"top start"}),nt({tooltip:"top"}),Kt({tooltip:"top"}),Qs(),Nt(),Ws(),Gt({orientation:"vertical",tooltip:"top"}),Pt({tooltip:"top"}),Mt(),At({tooltip:"top"}),zs()]}
        </media-controls-group>
      </media-controls>
    `]}function Qs(){return o(()=>{let e=k(void 0),t=k(!1),s=x(),{title:n,started:i,currentTime:l,ended:r}=y(),{translations:p}=u(),c=Fe(e),v=()=>i()||l()>0;const f=()=>{const _=r()?"Replay":v()?"Continue":"Play";return`${S(p,_)}: ${n()}`};A(()=>{var _;c()&&document.activeElement===document.body&&((_=s.player.el)==null||_.focus())});function m(){const _=e(),w=!!_&&!c()&&_.clientWidth<_.children[0].clientWidth;_&&Ee(_,"vds-marquee",w),t.set(w)}function g(){return a`
        <span class="vds-title-text">
          ${o(f)}${o(()=>v()?xe():null)}
        </span>
      `}return Zt(e,m),n()?a`
          <span class="vds-title" title=${o(f)} ${st(e.set)}>
            ${[g(),o(()=>t()&&!c()?g():null)]}
          </span>
        `:O()})}function zs(){const e="top end";return[ve({tooltip:"top",placement:e,portal:!0}),ye({tooltip:"top end",placement:e,portal:!0})]}const tt=class tt extends xt(Ct,qs){constructor(){super(...arguments),this.jn=k(!1)}onSetup(){this.forwardKeepAlive=!1,this.a=x(),this.classList.add("vds-audio-layout"),this.menuContainer=me("vds-audio-layout",()=>this.isSmallLayout);const{pointer:t}=this.a.$state;A(()=>{t()==="coarse"&&A(this.kn.bind(this))}),V(()=>{var s;return(s=this.menuContainer)==null?void 0:s.remove()})}onConnect(){re("audio",()=>this.isMatch),A(()=>{const t=this.menuContainer?[this,this.menuContainer]:[this];this.$props.customIcons()?new Tt(t).connect():new we(t).connect()})}render(){return a`${o(this._j.bind(this))}`}_j(){return this.isMatch?Ks():null}kn(){if(!this.jn()){Z(this,"pointerdown",this.ln.bind(this),{capture:!0});return}Z(this,"pointerdown",t=>t.stopPropagation()),Z(window,"pointerdown",this.mn.bind(this))}ln(t){const{target:s}=t;Re(s)&&s.closest(".vds-time-slider")&&(t.stopImmediatePropagation(),this.setAttribute("data-scrubbing",""),this.jn.set(!0))}mn(){this.jn.set(!1),this.removeAttribute("data-scrubbing")}};tt.tagName="media-audio-layout",tt.attrs={smallWhen:{converter(t){return t!=="never"&&!!t}}};let mt=tt;const K=class K extends F{};K.props={...pt(K,K,"props"),when:({viewType:t})=>t==="video",smallWhen:({width:t,height:s})=>t<576||s<380};let vt=K;function ke(){return o(()=>{const e=x(),{noKeyboardAnimations:t,userPrefersKeyboardAnimations:s}=u();if(h(()=>t()||!s())())return null;const i=k(!1),{lastKeyboardAction:l}=e.$state;A(()=>{i.set(!!l());const m=setTimeout(()=>i.set(!1),500);return()=>{i.set(!1),window.clearTimeout(m)}});const r=h(()=>{var g;const m=(g=l())==null?void 0:g.action;return m&&i()?je(m):null}),p=h(()=>`vds-kb-action${i()?"":" hidden"}`),c=h(Us),v=h(()=>{const m=Ys();return m?We(m):null});function f(){const m=v();return m?a`
        <div class="vds-kb-bezel">
          <div class="vds-kb-icon">${m}</div>
        </div>
      `:null}return a`
      <div class=${o(p)} data-action=${o(r)}>
        <div class="vds-kb-text-wrapper">
          <div class="vds-kb-text">${o(c)}</div>
        </div>
        ${o(()=>Ze(l(),f()))}
      </div>
    `})}function Us(){var n;const{$state:e}=x(),t=(n=e.lastKeyboardAction())==null?void 0:n.action,s=e.audioGain()??1;switch(t){case"toggleMuted":return e.muted()?"0%":Qt(e.volume(),s);case"volumeUp":case"volumeDown":return Qt(e.volume(),s);default:return""}}function Qt(e,t){return`${Math.round(e*t*100)}%`}function Ys(){var s;const{$state:e}=x();switch((s=e.lastKeyboardAction())==null?void 0:s.action){case"togglePaused":return e.paused()?"kb-pause-icon":"kb-play-icon";case"toggleMuted":return e.muted()||e.volume()===0?"kb-mute-icon":e.volume()>=.5?"kb-volume-up-icon":"kb-volume-down-icon";case"toggleFullscreen":return`kb-fs-${e.fullscreen()?"enter":"exit"}-icon`;case"togglePictureInPicture":return`kb-pip-${e.pictureInPicture()?"enter":"exit"}-icon`;case"toggleCaptions":return e.hasCaptions()?`kb-cc-${e.textTrack()?"on":"off"}-icon`:null;case"volumeUp":return"kb-volume-up-icon";case"volumeDown":return"kb-volume-down-icon";case"seekForward":return"kb-seek-forward-icon";case"seekBackward":return"kb-seek-backward-icon";default:return null}}function Hs(){return[Dt(),Ce(),ut(),ke(),It(),a`<div class="vds-scrim"></div>`,a`
      <media-controls class="vds-controls">
        ${[Js(),O(),a`<media-controls-group class="vds-controls-group"></media-controls-group>`,O(),a`
            <media-controls-group class="vds-controls-group">
              ${Nt()}
            </media-controls-group>
          `,a`
            <media-controls-group class="vds-controls-group">
              ${[nt({tooltip:"top start"}),Gt({orientation:"horizontal",tooltip:"top"}),ge(),_e(),Pt({tooltip:"top"}),Zs(),At({tooltip:"top"}),ue({tooltip:"top"}),Mt(),as(),de({tooltip:"top end"})]}
            </media-controls-group>
          `]}
      </media-controls>
    `]}function Zs(){return o(()=>{const{menuGroup:e}=u();return e()==="bottom"?Rt():null})}function Js(){return a`
    <media-controls-group class="vds-controls-group">
      ${o(()=>{const{menuGroup:e}=u();return e()==="top"?[O(),Rt()]:null})}
    </media-controls-group>
  `}function Xs(){return[Dt(),Ce(),ut(),It(),ke(),a`<div class="vds-scrim"></div>`,a`
      <media-controls class="vds-controls">
        <media-controls-group class="vds-controls-group">
          ${[At({tooltip:"top start"}),ue({tooltip:"bottom start"}),O(),Pt({tooltip:"bottom"}),Mt(),Rt(),Gt({orientation:"vertical",tooltip:"bottom end"})]}
        </media-controls-group>

        ${O()}

        <media-controls-group class="vds-controls-group" style="pointer-events: none;">
          ${[O(),nt({tooltip:"top"}),O()]}
        </media-controls-group>

        ${O()}

        <media-controls-group class="vds-controls-group">
          ${[ge(),_e(),de({tooltip:"top end"})]}
        </media-controls-group>

        <media-controls-group class="vds-controls-group">
          ${Nt()}
        </media-controls-group>
      </media-controls>
    `,en()]}function tn(){return a`
    <div class="vds-load-container">
      ${[ut(),nt({tooltip:"top"})]}
    </div>
  `}function en(){return o(()=>{const{duration:e}=y();return e()===0?null:a`
      <div class="vds-start-duration">
        <media-time class="vds-time" type="duration"></media-time>
      </div>
    `})}function ut(){return a`
    <div class="vds-buffering-indicator">
      <media-spinner class="vds-buffering-spinner"></media-spinner>
    </div>
  `}function Rt(){const{menuGroup:e,smallWhen:t}=u(),s=()=>e()==="top"||t()?"bottom":"top",n=h(()=>`${s()} ${e()==="top"?"end":"center"}`),i=h(()=>`${s()} end`);return[ve({tooltip:n,placement:i,portal:!0}),ye({tooltip:n,placement:i,portal:!0})]}function Ce(){return o(()=>{const{noGestures:e}=u();return e()?null:a`
      <div class="vds-gestures">
        <media-gesture class="vds-gesture" event="pointerup" action="toggle:paused"></media-gesture>
        <media-gesture
          class="vds-gesture"
          event="pointerup"
          action="toggle:controls"
        ></media-gesture>
        <media-gesture
          class="vds-gesture"
          event="dblpointerup"
          action="toggle:fullscreen"
        ></media-gesture>
        <media-gesture class="vds-gesture" event="dblpointerup" action="seek:-10"></media-gesture>
        <media-gesture class="vds-gesture" event="dblpointerup" action="seek:10"></media-gesture>
      </div>
    `})}const et=class et extends xt(Ct,vt){onSetup(){this.forwardKeepAlive=!1,this.a=x(),this.classList.add("vds-video-layout"),this.menuContainer=me("vds-video-layout",()=>this.isSmallLayout),V(()=>{var t;return(t=this.menuContainer)==null?void 0:t.remove()})}onConnect(){re("video",()=>this.isMatch),A(()=>{const t=this.menuContainer?[this,this.menuContainer]:[this];this.$props.customIcons()?new Tt(t).connect():new we(t).connect()})}render(){return a`${o(this._j.bind(this))}`}_j(){const{load:t}=this.a.$props,{canLoad:s,streamType:n}=this.a.$state;return this.isMatch?t()==="play"&&!s()?tn():n()==="unknown"?ut():this.isSmallLayout?Xs():Hs():null}};et.tagName="media-video-layout",et.attrs={smallWhen:{converter(t){return t!=="never"&&!!t}}};let ft=et;class sn extends oe{async xe(){const t=(await ne(()=>import("./vidstack-DXxIKXmd-Dge3KT8k.js"),__vite__mapDeps([]))).icons,s={};for(const n of Object.keys(t))s[n]=ie({name:n,paths:t[n],viewBox:"0 0 18 18"});return s}}function dt(e,t){var s;return((s=e())==null?void 0:s[t])??t}function nn(){return rn()}function an(){const e=x(),{load:t}=e.$props,{canLoad:s}=e.$state;return h(()=>t()==="play"&&!s())()?[Te(),zt()]:[on(),ln(),zt(),un(),kn(),Cn()]}function Te(){const e=x(),{translations:t}=$(),{title:s}=e.$state,n=o(()=>`${dt(t,"Play")}, ${s()}`);return a`
    <media-play-button
      class="plyr__control plyr__control--overlaid"
      aria-label=${n}
      data-plyr="play"
    >
      <slot name="play-icon"></slot>
    </button>
  `}function on(){const{controls:e}=$();return o(()=>e().includes("play-large")?Te():null)}function ln(){const{thumbnails:e,previewTime:t}=$();return a`
    <media-thumbnail
      .src=${o(e)}
      class="plyr__preview-scrubbing"
      time=${o(()=>t())}
    ></media-thumbnail>
  `}function zt(){const e=x(),{poster:t}=e.$state,s=o(()=>`background-image: url("${t()}");`);return a`<div class="plyr__poster" style=${s}></div>`}function rn(){const e=new Set(["captions","pip","airplay","fullscreen"]),{controls:t}=$(),s=o(()=>t().filter(n=>!e.has(n)).map(Se));return a`<div class="plyr__controls">${s}</div>`}function un(){const{controls:e}=$(),t=o(()=>e().map(Se));return a`<div class="plyr__controls">${t}</div>`}function Se(e){switch(e){case"airplay":return dn();case"captions":return cn();case"current-time":return xn();case"download":return wn();case"duration":return De();case"fast-forward":return hn();case"fullscreen":return pn();case"mute":case"volume":case"mute+volume":return gn(e);case"pip":return vn();case"play":return fn();case"progress":return yn();case"restart":return $n();case"rewind":return bn();case"settings":return Tn();default:return null}}function dn(){const{translations:e}=$();return a`
    <media-airplay-button class="plyr__controls__item plyr__control" data-plyr="airplay">
      <slot name="airplay-icon"></slot>
      <span class="plyr__tooltip">${b(e,"AirPlay")}</span>
    </media-airplay-button>
  `}function cn(){const{translations:e}=$(),t=b(e,"Disable captions"),s=b(e,"Enable captions");return a`
    <media-caption-button
      class="plyr__controls__item plyr__control"
      data-no-label
      data-plyr="captions"
    >
      <slot name="captions-on-icon" data-class="icon--pressed"></slot>
      <slot name="captions-off-icon" data-class="icon--not-pressed"></slot>
      <span class="label--pressed plyr__tooltip">${t}</span>
      <span class="label--not-pressed plyr__tooltip">${s}</span>
    </media-caption-button>
  `}function pn(){const{translations:e}=$(),t=b(e,"Enter Fullscreen"),s=b(e,"Exit Fullscreen");return a`
    <media-fullscreen-button
      class="plyr__controls__item plyr__control"
      data-no-label
      data-plyr="fullscreen"
    >
      <slot name="enter-fullscreen-icon" data-class="icon--pressed"></slot>
      <slot name="exit-fullscreen-icon" data-class="icon--not-pressed"></slot>
      <span class="label--pressed plyr__tooltip">${s}</span>
      <span class="label--not-pressed plyr__tooltip">${t}</span>
    </media-fullscreen-button>
  `}function mn(){const{translations:e}=$(),t=b(e,"Mute"),s=b(e,"Unmute");return a`
    <media-mute-button class="plyr__control" data-no-label data-plyr="mute">
      <slot name="muted-icon" data-class="icon--pressed"></slot>
      <slot name="volume-icon" data-class="icon--not-pressed"></slot>
      <span class="label--pressed plyr__tooltip">${s}</span>
      <span class="label--not-pressed plyr__tooltip">${t}</span>
    </media-mute-button>
  `}function vn(){const{translations:e}=$(),t=b(e,"Enter PiP"),s=b(e,"Exit PiP");return a`
    <media-pip-button class="plyr__controls__item plyr__control" data-no-label data-plyr="pip">
      <slot name="pip-icon"></slot>
      <slot name="enter-pip-icon" data-class="icon--pressed"></slot>
      <slot name="exit-pip-icon" data-class="icon--not-pressed"></slot>
      <span class="label--pressed plyr__tooltip">${s}</span>
      <span class="label--not-pressed plyr__tooltip">${t}</span>
    </media-pip-button>
  `}function fn(){const{translations:e}=$(),t=b(e,"Play"),s=b(e,"Pause");return a`
    <media-play-button class="plyr__controls__item plyr__control" data-no-label data-plyr="play">
      <slot name="pause-icon" data-class="icon--pressed"></slot>
      <slot name="play-icon" data-class="icon--not-pressed"></slot>
      <span class="label--pressed plyr__tooltip">${s}</span>
      <span class="label--not-pressed plyr__tooltip">${t}</span>
    </media-play-button>
  `}function $n(){const{translations:e}=$(),{remote:t}=x(),s=b(e,"Restart");function n(i){ee(i)&&!_t(i)||t.seek(0,i)}return a`
    <button
      type="button"
      class="plyr__control"
      data-plyr="restart"
      @pointerup=${n}
      @keydown=${n}
    >
      <slot name="restart-icon"></slot>
      <span class="plyr__tooltip">${s}</span>
    </button>
  `}function bn(){const{translations:e,seekTime:t}=$(),s=o(()=>`${dt(e,"Rewind")} ${t()}s`),n=o(()=>-1*t());return a`
    <media-seek-button
      class="plyr__controls__item plyr__control"
      seconds=${n}
      data-no-label
      data-plyr="rewind"
    >
      <slot name="rewind-icon"></slot>
      <span class="plyr__tooltip">${s}</span>
    </media-seek-button>
  `}function hn(){const{translations:e,seekTime:t}=$(),s=o(()=>`${dt(e,"Forward")} ${t()}s`),n=o(t);return a`
    <media-seek-button
      class="plyr__controls__item plyr__control"
      seconds=${n}
      data-no-label
      data-plyr="fast-forward"
    >
      <slot name="fast-forward-icon"></slot>
      <span class="plyr__tooltip">${s}</span>
    </media-seek-button>
  `}function yn(){let e=x(),{duration:t,viewType:s}=e.$state,{translations:n,markers:i,thumbnails:l,seekTime:r,previewTime:p}=$(),c=b(n,"Seek"),v=k(null),f=o(()=>{const T=v();return T?a`<span class="plyr__progress__marker-label">${se(T.label)}<br /></span>`:null});function m(T){p.set(T.detail)}function g(){v.set(this)}function _(){v.set(null)}function w(){const T=l(),B=o(()=>s()==="audio");return T?a`
          <media-slider-preview class="plyr__slider__preview" ?no-clamp=${B}>
            <media-slider-thumbnail .src=${T} class="plyr__slider__preview__thumbnail">
              <span class="plyr__slider__preview__time-container">
                ${f}
                <media-slider-value class="plyr__slider__preview__time"></media-slider-value>
              </span>
            </media-slider-thumbnail>
          </media-slider-preview>
        `:a`
          <span class="plyr__tooltip">
            ${f}
            <media-slider-value></media-slider-value>
          </span>
        `}function I(){var B;const T=t();return Number.isFinite(T)?(B=i())==null?void 0:B.map(C=>a`
        <span
          class="plyr__progress__marker"
          @mouseenter=${g.bind(C)}
          @mouseleave=${_}
          style=${`left: ${C.time/T*100}%;`}
        ></span>
      `):null}return a`
    <div class="plyr__controls__item plyr__progress__container">
      <div class="plyr__progress">
        <media-time-slider
          class="plyr__slider"
          data-plyr="seek"
          pause-while-dragging
          key-step=${o(r)}
          aria-label=${c}
          @media-seeking-request=${m}
        >
          <div class="plyr__slider__track"></div>
          <div class="plyr__slider__thumb"></div>
          <div class="plyr__slider__buffer"></div>
          ${o(w)}${o(I)}
        </media-time-slider>
      </div>
    </div>
  `}function gn(e){return o(()=>{const t=e==="mute"||e==="mute+volume",s=e==="volume"||e==="mute+volume";return a`
      <div class="plyr__controls__item plyr__volume">
        ${[t?mn():null,s?_n():null]}
      </div>
    `})}function _n(){const{translations:e}=$(),t=b(e,"Volume");return a`
    <media-volume-slider class="plyr__slider" data-plyr="volume" aria-label=${t}>
      <div class="plyr__slider__track"></div>
      <div class="plyr__slider__thumb"></div>
    </media-volume-slider>
  `}function xn(){const e=x(),{translations:t,invertTime:s,toggleTime:n,displayDuration:i}=$(),l=k(bt(s));function r(c){!n()||i()||ee(c)&&!_t(c)||l.set(v=>!v)}function p(){return o(()=>i()?De():null)}return o(()=>{const{streamType:c}=e.$state,v=b(t,"LIVE"),f=b(t,"Current time"),m=o(()=>!i()&&l());return c()==="live"||c()==="ll-live"?a`
          <media-live-button
            class="plyr__controls__item plyr__control plyr__live-button"
            data-plyr="live"
          >
            <span class="plyr__live-button__text">${v}</span>
          </media-live-button>
        `:a`
          <media-time
            type="current"
            class="plyr__controls__item plyr__time plyr__time--current"
            tabindex="0"
            role="timer"
            aria-label=${f}
            ?remainder=${m}
            @pointerup=${r}
            @keydown=${r}
          ></media-time>
          ${p()}
        `})}function De(){const{translations:e}=$(),t=b(e,"Duration");return a`
    <media-time
      type="duration"
      class="plyr__controls__item plyr__time plyr__time--duration"
      role="timer"
      tabindex="0"
      aria-label=${t}
    ></media-time>
  `}function wn(){return o(()=>{const e=x(),{translations:t,download:s}=$(),{title:n,source:i}=e.$state,l=i(),r=s(),p=Xt({title:n(),src:l,download:r}),c=b(t,"Download");return p?a`
          <a
            class="plyr__controls__item plyr__control"
            href=${p.url+`?download=${p.name}`}
            download=${p.name}
            target="_blank"
          >
            <slot name="download-icon" />
            <span class="plyr__tooltip">${c}</span>
          </a>
        `:null})}function kn(){return o(()=>{const{clickToPlay:e,clickToFullscreen:t}=$();return[e()?a`
            <media-gesture
              class="plyr__gesture"
              event="pointerup"
              action="toggle:paused"
            ></media-gesture>
          `:null,t()?a`
            <media-gesture
              class="plyr__gesture"
              event="dblpointerup"
              action="toggle:fullscreen"
            ></media-gesture>
          `:null]})}function Cn(){const e=x(),t=k(void 0),s=o(()=>{var n;return se((n=t())==null?void 0:n.text)});return A(()=>{const n=e.$state.textTrack();if(!n)return;function i(){t.set(n==null?void 0:n.activeCues[0])}return i(),Z(n,"cue-change",i)}),a`
    <div class="plyr__captions" dir="auto">
      <span class="plyr__caption">${s}</span>
    </div>
  `}function Tn(){const{translations:e}=$(),t=b(e,"Settings");return a`
    <div class="plyr__controls__item plyr__menu">
      <media-menu>
        <media-menu-button class="plyr__control" data-plyr="settings">
          <slot name="settings-icon" />
          <span class="plyr__tooltip">${t}</span>
        </media-menu-button>
        <media-menu-items class="plyr__menu__container" placement="top end">
          <div><div>${[Dn(),In(),Vn(),Pn()]}</div></div>
        </media-menu-items>
      </media-menu>
    </div>
  `}function ct({label:e,children:t}){const s=k(!1);return a`
    <media-menu @open=${()=>s.set(!0)} @close=${()=>s.set(!1)}>
      ${Sn({label:e,open:s})}
      <media-menu-items>${t}</media-menu-items>
    </media-menu>
  `}function Sn({open:e,label:t}){const{translations:s}=$(),n=o(()=>`plyr__control plyr__control--${e()?"back":"forward"}`);function i(){const l=b(s,"Go back to previous menu");return o(()=>e()?a`<span class="plyr__sr-only">${l}</span>`:null)}return a`
    <media-menu-button class=${n} data-plyr="settings">
      <span class="plyr__menu__label" aria-hidden=${Bn(e)}>
        ${b(s,t)}
      </span>
      <span class="plyr__menu__value" data-part="hint"></span>
      ${i()}
    </media-menu-button>
  `}function Dn(){return ct({label:"Audio",children:An()})}function An(){const{translations:e}=$();return a`
    <media-audio-radio-group empty-label=${b(e,"Default")}>
      <template>
        <media-radio class="plyr__control" data-plyr="audio">
          <span data-part="label"></span>
        </media-radio>
      </template>
    </media-audio-radio-group>
  `}function Pn(){return ct({label:"Speed",children:Mn()})}function Mn(){const{translations:e,speed:t}=$();return a`
    <media-speed-radio-group .rates=${t} normal-label=${b(e,"Normal")}>
      <template>
        <media-radio class="plyr__control" data-plyr="speed">
          <span data-part="label"></span>
        </media-radio>
      </template>
    </media-speed-radio-group>
  `}function In(){return ct({label:"Captions",children:On()})}function On(){const{translations:e}=$();return a`
    <media-captions-radio-group off-label=${b(e,"Disabled")}>
      <template>
        <media-radio class="plyr__control" data-plyr="captions">
          <span data-part="label"></span>
        </media-radio>
      </template>
    </media-captions-radio-group>
  `}function Vn(){return ct({label:"Quality",children:Ln()})}function Ln(){const{translations:e}=$();return a`
    <media-quality-radio-group auto-label=${b(e,"Auto")}>
      <template>
        <media-radio class="plyr__control" data-plyr="quality">
          <span data-part="label"></span>
        </media-radio>
      </template>
    </media-quality-radio-group>
  `}function Bn(e){return o(()=>e()?"true":"false")}function b(e,t){return o(()=>dt(e,t))}const Et=class Et extends xt(Ct,Ke){onSetup(){this.forwardKeepAlive=!1,this.a=x()}onConnect(){var t;(t=this.a.player.el)==null||t.setAttribute("data-layout","plyr"),V(()=>{var s;return(s=this.a.player.el)==null?void 0:s.removeAttribute("data-layout")}),qe(this,this.a),A(()=>{this.$props.customIcons()?new Tt([this]).connect():new sn([this]).connect()})}render(){return a`${o(this._j.bind(this))}`}_j(){const{viewType:t}=this.a.$state;return t()==="audio"?nn():t()==="video"?an():null}};Et.tagName="media-plyr-layout";let $t=Et;wt(mt);wt(ft);wt($t);
