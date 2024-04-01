import{aV as L,f as g,aI as S,p,aJ as v,F as y,e as w,aK as u,aM as k,aL as m,aN as c,aR as C,aS as E,aT as D,aU as I,q as W,K as _}from"./vidstack-BuChzGtl-BYPDrtzB.js";import{VideoProvider as $}from"./vidstack-video-DJxIVBye.js";import{R}from"./vidstack-mDXpEdA5-C4v1vEgk.js";import"./app-DzJi2Cyx.js";import"./vidstack-k8kYYRJb-B5cP64Pi.js";const A=h=>_(h);class x{constructor(t,i){this.m=t,this.b=i,this.g=null,this.nd=null,this.od={},this.pd=new Set,this.yk=-1}get instance(){return this.g}setup(t){const{streamType:i}=this.b.$state,s=p(i).includes("live"),r=p(i).includes("ll-");this.g=new t({lowLatencyMode:r,backBufferLength:r?4:s?8:void 0,renderTextTracksNatively:!1,...this.od});const n=this.Sg.bind(this);for(const o of Object.values(t.Events))this.g.on(o,n);this.g.on(t.Events.ERROR,this.U.bind(this));for(const o of this.pd)o(this.g);this.b.player.dispatch("hls-instance",{detail:this.g}),this.g.attachMedia(this.m),this.g.on(t.Events.FRAG_LOADING,this.Bk.bind(this)),this.g.on(t.Events.AUDIO_TRACK_SWITCHED,this.Tg.bind(this)),this.g.on(t.Events.LEVEL_SWITCHED,this.Ug.bind(this)),this.g.on(t.Events.LEVEL_LOADED,this.Vg.bind(this)),this.g.on(t.Events.NON_NATIVE_TEXT_TRACKS_FOUND,this.Wg.bind(this)),this.g.on(t.Events.CUES_PARSED,this.Xg.bind(this)),this.b.qualities[v.Za]=this.Yg.bind(this),y(this.b.qualities,"change",this.Yo.bind(this)),y(this.b.audioTracks,"change",this.Zo.bind(this)),this.nd=w(this._g.bind(this))}Wo(t,i){return new u(A(t),{detail:i})}_g(){if(!this.b.$state.live())return;const t=new R(this.$g.bind(this));return t.Bb(),t.ra.bind(t)}$g(){var t;this.b.$state.liveSyncPosition.set(((t=this.g)==null?void 0:t.liveSyncPosition)??1/0)}Sg(t,i){var s;(s=this.b.player)==null||s.dispatch(this.Wo(t,i))}Wg(t,i){const s=this.Wo(t,i);let r=-1;for(let n=0;n<i.tracks.length;n++){const o=i.tracks[n],e=o.subtitleTrack??o.closedCaptions,a=new k({id:`hls-${o.kind}-${n}`,src:e==null?void 0:e.url,label:o.label,language:e==null?void 0:e.lang,kind:o.kind,default:o.default});a[m.M]=2,a[m.Ua]=()=>{a.mode==="showing"?(this.g.subtitleTrack=n,r=n):r===n&&(this.g.subtitleTrack=-1,r=-1)},this.b.textTracks.add(a,s)}}Xg(t,i){var o;const s=(o=this.g)==null?void 0:o.subtitleTrack,r=this.b.textTracks.getById(`hls-${i.type}-${s}`);if(!r)return;const n=this.Wo(t,i);for(const e of i.cues)e.positionAlign="auto",r.addCue(e,n)}Tg(t,i){const s=this.b.audioTracks[i.id];if(s){const r=this.Wo(t,i);this.b.audioTracks[c.pa](s,!0,r)}}Ug(t,i){const s=this.b.qualities[i.level];if(s){const r=this.Wo(t,i);this.b.qualities[c.pa](s,!0,r)}}Vg(t,i){var b;if(this.b.$state.canPlay())return;const{type:s,live:r,totalduration:n,targetduration:o}=i.details,e=this.Wo(t,i);this.b.delegate.c("stream-type-change",r?s==="EVENT"&&Number.isFinite(n)&&o>=10?"live:dvr":"live":"on-demand",e),this.b.delegate.c("duration-change",n,e);const a=this.g.media;this.g.currentLevel===-1&&this.b.qualities[v.Ya](!0,e);for(const d of this.g.audioTracks){const l={id:d.id.toString(),label:d.name,language:d.lang||"",kind:"main"};this.b.audioTracks[c.oa](l,e)}for(const d of this.g.levels){const l={id:((b=d.id)==null?void 0:b.toString())??d.height+"p",width:d.width,height:d.height,codec:d.codecSet,bitrate:d.bitrate};this.b.qualities[c.oa](l,e)}a.dispatchEvent(new u("canplay",{trigger:e}))}U(t,i){var s;if(i.fatal)switch(i.type){case"networkError":this.Ck(i.error);break;case"mediaError":(s=this.g)==null||s.recoverMediaError();break;default:this.Ak(i.error);break}}Bk(){this.yk>=0&&this.zk()}Ck(t){var i;this.zk(),(i=this.g)==null||i.startLoad(),this.yk=window.setTimeout(()=>{this.yk=-1,this.Ak(t)},5e3)}zk(){clearTimeout(this.yk),this.yk=-1}Ak(t){this.b.delegate.c("error",{message:t.message,code:1,error:t})}Yg(){this.g&&(this.g.currentLevel=-1)}Yo(){const{qualities:t}=this.b;!this.g||t.auto||(this.g[t.switch+"Level"]=t.selectedIndex,C&&(this.m.currentTime=this.m.currentTime))}Zo(){const{audioTracks:t}=this.b;this.g&&this.g.audioTrack!==t.selectedIndex&&(this.g.audioTrack=t.selectedIndex)}Dk(t){var i;this.zk(),g(t.src)&&((i=this.g)==null||i.loadSource(t.src))}ah(){var t,i;this.zk(),(t=this.g)==null||t.destroy(),this.g=null,(i=this.nd)==null||i.call(this),this.nd=null}}class q{constructor(t,i,s){this.W=t,this.b=i,this.Ca=s,this.bh()}async bh(){const t={onLoadStart:this.Ea.bind(this),onLoaded:this.qd.bind(this),onLoadError:this.ch.bind(this)};let i=await O(this.W,t);if(E(i)&&!g(this.W)&&(i=await N(this.W,t)),!i)return null;if(!i.isSupported()){const s="[vidstack] `hls.js` is not supported in this environment";return this.b.player.dispatch(new u("hls-unsupported")),this.b.delegate.c("error",{message:s,code:4}),null}return i}Ea(){this.b.player.dispatch(new u("hls-lib-load-start"))}qd(t){this.b.player.dispatch(new u("hls-lib-loaded",{detail:t})),this.Ca(t)}ch(t){const i=D(t);this.b.player.dispatch(new u("hls-lib-load-error",{detail:i})),this.b.delegate.c("error",{message:i.message,code:4,error:i})}}async function N(h,t={}){var i,s,r,n,o;if(!E(h)){if((i=t.onLoadStart)==null||i.call(t),h.prototype&&h.prototype!==Function)return(s=t.onLoaded)==null||s.call(t,h),h;try{const e=(r=await h())==null?void 0:r.default;if(e&&e.isSupported)(n=t.onLoaded)==null||n.call(t,e);else throw Error("");return e}catch(e){(o=t.onLoadError)==null||o.call(t,e)}}}async function O(h,t={}){var i,s,r;if(g(h)){(i=t.onLoadStart)==null||i.call(t);try{if(await I(h),!W(window.Hls))throw Error("");const n=window.Hls;return(s=t.onLoaded)==null||s.call(t,n),n}catch(n){(r=t.onLoadError)==null||r.call(t,n)}}}const V="https://cdn.jsdelivr.net",f=class f extends ${constructor(){super(...arguments),this.$$PROVIDER_TYPE="HLS",this.Xe=null,this.d=new x(this.video,this.b),this.Gb=`${V}/npm/hls.js@^1.5.0/dist/hls.min.js`}get ctor(){return this.Xe}get instance(){return this.d.instance}get type(){return"hls"}get canLiveSync(){return!0}get config(){return this.d.od}set config(t){this.d.od=t}get library(){return this.Gb}set library(t){this.Gb=t}preconnect(){g(this.Gb)&&S(this.Gb)}setup(){super.setup(),new q(this.Gb,this.b,t=>{this.Xe=t,this.d.setup(t),this.b.delegate.c("provider-setup",this);const i=p(this.b.$state.source);i&&this.loadSource(i)})}async loadSource(t,i){if(!g(t.src)){this.Bn();return}this.a.preload=i||"",this.yn(t,"application/x-mpegurl"),this.d.Dk(t),this.V=t}onInstance(t){const i=this.d.instance;return i&&t(i),this.d.pd.add(t),()=>this.d.pd.delete(t)}destroy(){this.d.ah()}};f.supported=L();let T=f;export{T as HLSProvider};
