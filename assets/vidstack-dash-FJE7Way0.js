import{aH as A,f as l,aI as D,p as L,aJ as w,F as E,e as R,aK as p,aL as m,aM as _,aN as c,aO as x,aP as M,aQ as q,aR as $,aS as v,aT as C,aU as F,q as N,K as G}from"./vidstack-BuChzGtl-BYPDrtzB.js";import{VideoProvider as I}from"./vidstack-video-DJxIVBye.js";import{R as H}from"./vidstack-mDXpEdA5-C4v1vEgk.js";import"./app-DzJi2Cyx.js";import"./vidstack-k8kYYRJb-B5cP64Pi.js";const O=h=>`dash-${G(h)}`;class W{constructor(t,i){this.m=t,this.b=i,this.g=null,this.nd=null,this.od={},this.pd=new Set,this.Xo=null,this._o={},this.yk=-1}get instance(){return this.g}setup(t){this.g=t().create();const i=this.So.bind(this);for(const e of Object.values(t.events))this.g.on(e,i);this.g.on(t.events.ERROR,this.U.bind(this));for(const e of this.pd)e(this.g);this.b.player.dispatch("dash-instance",{detail:this.g}),this.g.initialize(this.m,void 0,!1),this.g.updateSettings({streaming:{text:{defaultEnabled:!1,dispatchForManualRendering:!0},buffer:{fastSwitchEnabled:!0}},...this.od}),this.g.on(t.events.FRAGMENT_LOADING_STARTED,this.bp.bind(this)),this.g.on(t.events.FRAGMENT_LOADING_COMPLETED,this.cp.bind(this)),this.g.on(t.events.MANIFEST_LOADED,this.Uo.bind(this)),this.g.on(t.events.QUALITY_CHANGE_RENDERED,this.fb.bind(this)),this.g.on(t.events.TEXT_TRACKS_ADDED,this.dp.bind(this)),this.g.on(t.events.TRACK_CHANGE_RENDERED,this._d.bind(this)),this.b.qualities[w.Za]=this.Yg.bind(this),E(this.b.qualities,"change",this.Yo.bind(this)),E(this.b.audioTracks,"change",this.Zo.bind(this)),this.nd=R(this._g.bind(this))}Wo(t){return new p(O(t.type),{detail:t})}_g(){if(!this.b.$state.live())return;const t=new H(this.$g.bind(this));return t.Bb(),t.ra.bind(t)}$g(){if(!this.g)return;const t=this.g.duration()-this.g.time();this.b.$state.liveSyncPosition.set(isNaN(t)?1/0:t)}So(t){var i;(i=this.b.player)==null||i.dispatch(this.Wo(t))}ep(t){var n;const i=(n=this.Xo)==null?void 0:n[m.T],e=(i==null?void 0:i.track).cues;if(!i||!e)return;const o=this.Xo.id,r=this._o[o]??0,a=this.Wo(t);for(let d=r;d<e.length;d++){const u=e[d];u.positionAlign||(u.positionAlign="auto"),this.Xo.addCue(u,a)}this._o[o]=e.length}dp(t){var r;if(!this.g)return;const i=t.tracks,e=[...this.m.textTracks].filter(a=>"manualMode"in a),o=this.Wo(t);for(let a=0;a<e.length;a++){const n=i[a],d=e[a],u=`dash-${n.kind}-${a}`,g=new _({id:u,label:(n==null?void 0:n.label)??((r=n.labels.find(s=>s.text))==null?void 0:r.text)??(n==null?void 0:n.lang)??void 0,language:n.lang??void 0,kind:n.kind,default:n.defaultTrack});g[m.T]={managed:!0,track:d},g[m.M]=2,g[m.Ua]=()=>{this.g&&(g.mode==="showing"?(this.g.setTextTrack(a),this.Xo=g):(this.g.setTextTrack(-1),this.Xo=null))},this.b.textTracks.add(g,o)}}_d(t){const{mediaType:i,newMediaInfo:e}=t;if(i==="audio"){const o=this.b.audioTracks.getById(`dash-audio-${e.index}`);if(o){const r=this.Wo(t);this.b.audioTracks[c.pa](o,!0,r)}}}fb(t){if(t.mediaType!=="video")return;const i=this.b.qualities[t.newQuality];if(i){const e=this.Wo(t);this.b.qualities[c.pa](i,!0,e)}}Uo(t){if(this.b.$state.canPlay()||!this.g)return;const{type:i,mediaPresentationDuration:e}=t.data,o=this.Wo(t);this.b.delegate.c("stream-type-change",i!=="static"?"live":"on-demand",o),this.b.delegate.c("duration-change",e,o),this.b.qualities[w.Ya](!0,o);const r=this.g.getVideoElement(),a=this.g.getTracksForTypeFromManifest("video",t.data),n=[...new Set(a.map(s=>s.mimeType))].find(s=>s&&x(r,s)),d=a.filter(s=>n===s.mimeType)[0];let u=this.g.getTracksForTypeFromManifest("audio",t.data);const g=[...new Set(u.map(s=>s.mimeType))].find(s=>s&&M(r,s));if(u=u.filter(s=>g===s.mimeType),d.bitrateList.forEach((s,f)=>{var T;const y={id:((T=s.id)==null?void 0:T.toString())??`dash-bitrate-${f}`,width:s.width??0,height:s.height??0,bitrate:s.bandwidth??0,codec:d.codec,index:f};this.b.qualities[c.oa](y,o)}),q(d.index)){const s=this.b.qualities[d.index];s&&this.b.qualities[c.pa](s,!0,o)}u.forEach((s,f)=>{const y={id:`dash-audio-${s==null?void 0:s.index}`,label:s.label??s.lang??"",language:s.lang??"",kind:"main",mimeType:s.mimeType,codec:s.codec,index:f};this.b.audioTracks[c.oa](y,o)}),r.dispatchEvent(new p("canplay",{trigger:o}))}U(t){const{type:i,error:e}=t;switch(e.code){case 27:this.Ck(e);break;default:this.Ak(e);break}}bp(){this.yk>=0&&this.zk()}cp(t){t.mediaType==="text"&&requestAnimationFrame(this.ep.bind(this,t))}Ck(t){var i;this.zk(),(i=this.g)==null||i.play(),this.yk=window.setTimeout(()=>{this.yk=-1,this.Ak(t)},5e3)}zk(){clearTimeout(this.yk),this.yk=-1}Ak(t){this.b.delegate.c("error",{message:t.message??"",code:1,error:t})}Yg(){var i;this.Ro("video",!0);const{qualities:t}=this.b;(i=this.g)==null||i.setQualityFor("video",t.selectedIndex,!0)}Ro(t,i){var e;(e=this.g)==null||e.updateSettings({streaming:{abr:{autoSwitchBitrate:{[t]:i}}}})}Yo(){const{qualities:t}=this.b;!this.g||t.auto||!t.selected||(this.Ro("video",!1),this.g.setQualityFor("video",t.selectedIndex,t.switch==="current"),$&&(this.m.currentTime=this.m.currentTime))}Zo(){if(!this.g)return;const{audioTracks:t}=this.b,i=this.g.getTracksFor("audio").find(e=>t.selected&&t.selected.id===`dash-audio-${e.index}`);i&&this.g.setCurrentTrack(i)}H(){this.zk(),this.Xo=null,this._o={}}loadSource(t){var i;this.H(),l(t.src)&&((i=this.g)==null||i.attachSource(t.src))}destroy(){var t,i;this.H(),(t=this.g)==null||t.destroy(),this.g=null,(i=this.nd)==null||i.call(this),this.nd=null}}class X{constructor(t,i,e){this.W=t,this.b=i,this.Ca=e,this.bh()}async bh(){const t={onLoadStart:this.Ea.bind(this),onLoaded:this.qd.bind(this),onLoadError:this.ch.bind(this)};let i=await P(this.W,t);if(v(i)&&!l(this.W)&&(i=await j(this.W,t)),!i)return null;if(!window.dashjs.supportsMediaSource()){const e="[vidstack] `dash.js` is not supported in this environment";return this.b.player.dispatch(new p("dash-unsupported")),this.b.delegate.c("error",{message:e,code:4}),null}return i}Ea(){this.b.player.dispatch(new p("dash-lib-load-start"))}qd(t){this.b.player.dispatch(new p("dash-lib-loaded",{detail:t})),this.Ca(t)}ch(t){const i=C(t);this.b.player.dispatch(new p("dash-lib-load-error",{detail:i})),this.b.delegate.c("error",{message:i.message,code:4,error:i})}}async function j(h,t={}){var i,e,o,r,a;if(!v(h)){if((i=t.onLoadStart)==null||i.call(t),h.prototype&&h.prototype!==Function)return(e=t.onLoaded)==null||e.call(t,h),h;try{const n=(o=await h())==null?void 0:o.default;if(n)(r=t.onLoaded)==null||r.call(t,n);else throw Error("");return n}catch(n){(a=t.onLoadError)==null||a.call(t,n)}}}async function P(h,t={}){var i,e,o;if(l(h)){(i=t.onLoadStart)==null||i.call(t);try{if(await F(h),!N(window.dashjs.MediaPlayer))throw Error("");const r=window.dashjs.MediaPlayer;return(e=t.onLoaded)==null||e.call(t,r),r}catch(r){(o=t.onLoadError)==null||o.call(t,r)}}}const Q="https://cdn.jsdelivr.net",b=class b extends I{constructor(){super(...arguments),this.$$PROVIDER_TYPE="DASH",this.Xe=null,this.d=new W(this.video,this.b),this.Gb=`${Q}/npm/dashjs@4.7.4/dist/dash.all.min.js`}get ctor(){return this.Xe}get instance(){return this.d.instance}get type(){return"dash"}get canLiveSync(){return!0}get config(){return this.d.od}set config(t){this.d.od=t}get library(){return this.Gb}set library(t){this.Gb=t}preconnect(){l(this.Gb)&&D(this.Gb)}setup(){super.setup(),new X(this.Gb,this.b,t=>{this.Xe=t,this.d.setup(t),this.b.delegate.c("provider-setup",this);const i=L(this.b.$state.source);i&&this.loadSource(i)})}async loadSource(t,i){if(!l(t.src)){this.Bn();return}this.a.preload=i||"",this.yn(t,"application/x-mpegurl"),this.d.loadSource(t),this.V=t}onInstance(t){const i=this.d.instance;return i&&t(i),this.d.pd.add(t),()=>this.d.pd.delete(t)}destroy(){this.d.destroy()}};b.supported=A();let S=b;export{S as DASHProvider};
