import{bS as c,aa as n,aw as o,a7 as h,a6 as u,bU as b,a5 as d}from"./app-CqP3DbKF.js";function p(r,t=3e3){const s=c();return setTimeout(()=>{const i=r();i&&s.reject(i)},t),s}class f{constructor(t){this.Lb=t,this.sc=n(""),this.referrerPolicy=null,t.setAttribute("frameBorder","0"),t.setAttribute("aria-hidden","true"),t.setAttribute("allow","autoplay; fullscreen; encrypted-media; picture-in-picture; accelerometer; gyroscope"),this.referrerPolicy!==null&&t.setAttribute("referrerpolicy",this.referrerPolicy)}get iframe(){return this.Lb}setup(){o(window,"message",this.Xi.bind(this)),o(this.Lb,"load",this.gd.bind(this)),h(this.Mb.bind(this))}Mb(){const t=this.sc();if(!t.length){this.Lb.setAttribute("src","");return}const s=u(()=>this.mg());this.Lb.setAttribute("src",b(t,s))}se(t,s){var i;(i=this.Lb.contentWindow)==null||i.postMessage(JSON.stringify(t),s??"*")}Xi(t){var a;const s=this.Nb();if((t.source===null||t.source===((a=this.Lb)==null?void 0:a.contentWindow))&&(!d(s)||s===t.origin)){try{const e=JSON.parse(t.data);e&&this.te(e,t);return}catch{}t.data&&this.te(t.data,t)}}}export{f as E,p as t};
