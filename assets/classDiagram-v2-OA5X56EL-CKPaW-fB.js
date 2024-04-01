import{c as $,a as D,s as B}from"./chunk-HVP3VGVY-CrlXneOc.js";import{r as G}from"./chunk-ANTO7JYN-BHNQtXSh.js";import{_ as m,l as d,d as i,A as z,t as q,o as C,q as A,n as E,e as M}from"./mermaid.core-DSy5ChKP.js";import{d as k}from"./transform-Dgtl54Jv.js";import{G as P}from"./graph-uLlu0vzu.js";import"./clone-bf7ZZHym.js";import"./chunk-QOU2KDNW-0wiBUnW3.js";import"./line-BNcxYhJ7.js";import"./array-DEnAxiAM.js";import"./path-CbwjOpE9.js";import"./point-DWREGWZc.js";import"./layout-W1r2lxif.js";import"./app-c3VcIhAs.js";import"./commonjsHelpers-Cpj98o6Y.js";var _=m(s=>M.sanitizeText(s,i()),"sanitizeText"),T={dividerMargin:10,padding:5,textHeight:10,curve:void 0},F=m(function(s,t,p,n){const e=Object.keys(s);d.info("keys:",e),d.info(s),e.forEach(function(a){var y,c;const l=s[a],r={shape:"rect",id:l.id,domId:l.domId,labelText:_(l.id),labelStyle:"",style:"fill: none; stroke: black",padding:((y=i().flowchart)==null?void 0:y.padding)??((c=i().class)==null?void 0:c.padding)};t.setNode(l.id,r),R(l.classes,t,p,n,l.id),d.info("setNode",r)})},"addNamespaces"),R=m(function(s,t,p,n,e){const a=Object.keys(s);d.info("keys:",a),d.info(s),a.filter(l=>s[l].parent==e).forEach(function(l){var h,b;const o=s[l],r=o.cssClasses.join(" "),y=C(o.styles),c=o.label??o.id,u=0,f={labelStyle:y.labelStyle,shape:"class_box",labelText:_(c),classData:o,rx:u,ry:u,class:r,style:y.style,id:o.id,domId:o.domId,tooltip:n.db.getTooltip(o.id,e)||"",haveCallback:o.haveCallback,link:o.link,width:o.type==="group"?500:void 0,type:o.type,padding:((h=i().flowchart)==null?void 0:h.padding)??((b=i().class)==null?void 0:b.padding)};t.setNode(o.id,f),e&&t.setParent(o.id,e),d.info("setNode",f)})},"addClasses"),H=m(function(s,t,p,n){d.info(s),s.forEach(function(e,a){var b,v;const l=e,o="",r={labelStyle:"",style:""},y=l.text,c=0,x={labelStyle:r.labelStyle,shape:"note",labelText:_(y),noteData:l,rx:c,ry:c,class:o,style:r.style,id:l.id,domId:l.id,tooltip:"",type:"note",padding:((b=i().flowchart)==null?void 0:b.padding)??((v=i().class)==null?void 0:v.padding)};if(t.setNode(l.id,x),d.info("setNode",x),!l.class||!(l.class in n))return;const f=p+a,h={id:`edgeNote${f}`,classes:"relation",pattern:"dotted",arrowhead:"none",startLabelRight:"",endLabelLeft:"",arrowTypeStart:"none",arrowTypeEnd:"none",style:"fill:none",labelStyle:"",curve:A(T.curve,E)};t.setEdge(l.id,l.class,h,f)})},"addNotes"),V=m(function(s,t){const p=i().flowchart;let n=0;s.forEach(function(e){var l;n++;const a={classes:"relation",pattern:e.relation.lineType==1?"dashed":"solid",id:`id_${e.id1}_${e.id2}_${n}`,arrowhead:e.type==="arrow_open"?"none":"normal",startLabelRight:e.relationTitle1==="none"?"":e.relationTitle1,endLabelLeft:e.relationTitle2==="none"?"":e.relationTitle2,arrowTypeStart:S(e.relation.type1),arrowTypeEnd:S(e.relation.type2),style:"fill:none",labelStyle:"",curve:A(p==null?void 0:p.curve,E)};if(d.info(a,e),e.style!==void 0){const o=C(e.style);a.style=o.style,a.labelStyle=o.labelStyle}e.text=e.title,e.text===void 0?e.style!==void 0&&(a.arrowheadStyle="fill: #333"):(a.arrowheadStyle="fill: #333",a.labelpos="c",((l=i().flowchart)==null?void 0:l.htmlLabels)??i().htmlLabels?(a.labelType="html",a.label='<span class="edgeLabel">'+e.text+"</span>"):(a.labelType="text",a.label=e.text.replace(M.lineBreakRegex,`
`),e.style===void 0&&(a.style=a.style||"stroke: #333; stroke-width: 1.5px;fill:none"),a.labelStyle=a.labelStyle.replace("color:","fill:"))),t.setEdge(e.id1,e.id2,a,n)})},"addRelations"),W=m(function(s){T={...T,...s}},"setConf"),J=m(async function(s,t,p,n){d.info("Drawing class - ",t);const e=i().flowchart??i().class,a=i().securityLevel;d.info("config:",e);const l=(e==null?void 0:e.nodeSpacing)??50,o=(e==null?void 0:e.rankSpacing)??50,r=new P({multigraph:!0,compound:!0}).setGraph({rankdir:n.db.getDirection(),nodesep:l,ranksep:o,marginx:8,marginy:8}).setDefaultEdgeLabel(function(){return{}}),y=n.db.getNamespaces(),c=n.db.getClasses(),u=n.db.getRelations(),x=n.db.getNotes();d.info(u),F(y,r,t,n),R(c,r,t,n),V(u,r),H(x,r,u.length+1,c);let f;a==="sandbox"&&(f=k("#i"+t));const h=a==="sandbox"?k(f.nodes()[0].contentDocument.body):k("body"),b=h.select(`[id="${t}"]`),v=h.select("#"+t+" g");if(await G(v,r,["aggregation","extension","composition","dependency","lollipop"],"classDiagram",t),z.insertTitle(b,"classTitleText",(e==null?void 0:e.titleTopMargin)??5,n.db.getDiagramTitle()),q(r,b,e==null?void 0:e.diagramPadding,e==null?void 0:e.useMaxWidth),!(e!=null&&e.htmlLabels)){const L=a==="sandbox"?f.nodes()[0].contentDocument:document,I=L.querySelectorAll('[id="'+t+'"] .edgeLabel .label');for(const w of I){const N=w.getBBox(),g=L.createElementNS("http://www.w3.org/2000/svg","rect");g.setAttribute("rx",0),g.setAttribute("ry",0),g.setAttribute("width",N.width),g.setAttribute("height",N.height),w.insertBefore(g,w.firstChild)}}},"draw");function S(s){let t;switch(s){case 0:t="aggregation";break;case 1:t="extension";break;case 2:t="composition";break;case 3:t="dependency";break;case 4:t="lollipop";break;default:t="none"}return t}m(S,"getArrowMarker");var K={setConf:W,draw:J},re={parser:$,db:D,renderer:K,styles:B,init:s=>{s.class||(s.class={}),s.class.arrowMarkerAbsolute=s.arrowMarkerAbsolute,D.clear()}};export{re as diagram};