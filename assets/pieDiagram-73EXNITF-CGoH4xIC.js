import{p as V}from"./chunk-6I6DG3ZD-DpblBml2.js";import{av as O,aw as U,y as Z,z as q,s as H,g as J,c as K,b as Q,l as F,_ as g,B as X,d as Y,ax as tt,at as et,ay as at,j as rt}from"./mermaid.core-DHZtE2vT.js";import{p as nt}from"./mermaid-parser.esm-Ch4iEwht.js";import"./transform-Dgtl54Jv.js";import{d as P}from"./arc-C6mTqf-j.js";import{o as it}from"./ordinal-Cboi1Yqb.js";import{a as st}from"./array-DEnAxiAM.js";import{c as S}from"./path-CbwjOpE9.js";import"./app-mYNfyBph.js";import"./commonjsHelpers-Cpj98o6Y.js";import"./init-Gi6I4Gst.js";function ot(t,a){return a<t?-1:a>t?1:a>=t?0:NaN}function lt(t){return t}function ct(){var t=lt,a=ot,m=null,o=S(0),p=S(O),x=S(0);function i(e){var r,l=(e=st(e)).length,c,A,h=0,u=new Array(l),n=new Array(l),v=+o.apply(this,arguments),C=Math.min(O,Math.max(-O,p.apply(this,arguments)-v)),f,T=Math.min(Math.abs(C)/l,x.apply(this,arguments)),$=T*(C<0?-1:1),d;for(r=0;r<l;++r)(d=n[u[r]=r]=+t(e[r],r,e))>0&&(h+=d);for(a!=null?u.sort(function(y,w){return a(n[y],n[w])}):m!=null&&u.sort(function(y,w){return m(e[y],e[w])}),r=0,A=h?(C-l*$)/h:0;r<l;++r,v=f)c=u[r],d=n[c],f=v+(d>0?d*A:0)+$,n[c]={data:e[c],index:r,value:d,startAngle:v,endAngle:f,padAngle:T};return n}return i.value=function(e){return arguments.length?(t=typeof e=="function"?e:S(+e),i):t},i.sortValues=function(e){return arguments.length?(a=e,m=null,i):a},i.sort=function(e){return arguments.length?(m=e,a=null,i):m},i.startAngle=function(e){return arguments.length?(o=typeof e=="function"?e:S(+e),i):o},i.endAngle=function(e){return arguments.length?(p=typeof e=="function"?e:S(+e),i):p},i.padAngle=function(e){return arguments.length?(x=typeof e=="function"?e:S(+e),i):x},i}var R=U.pie,E={sections:{},showData:!1,config:R},z=E.sections,G=E.showData,ut=structuredClone(R),pt=g(()=>structuredClone(ut),"getConfig"),dt=g(()=>{z=structuredClone(E.sections),G=E.showData,X()},"clear"),gt=g(({label:t,value:a})=>{z[t]===void 0&&(z[t]=a,F.debug(`added new section: ${t}, with value: ${a}`))},"addSection"),ft=g(()=>z,"getSections"),mt=g(t=>{G=t},"setShowData"),ht=g(()=>G,"getShowData"),I={getConfig:pt,clear:dt,setDiagramTitle:Z,getDiagramTitle:q,setAccTitle:H,getAccTitle:J,setAccDescription:K,getAccDescription:Q,addSection:gt,getSections:ft,setShowData:mt,getShowData:ht},vt=g((t,a)=>{V(t,a),a.setShowData(t.showData),t.sections.map(a.addSection)},"populateDb"),yt={parse:async t=>{const a=await nt("pie",t);F.debug(a),vt(a,I)}},St=g(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),xt=St,At=g(t=>{const a=Object.entries(t).map(o=>({label:o[0],value:o[1]})).sort((o,p)=>p.value-o.value);return ct().value(o=>o.value)(a)},"createPieArcs"),Ct=g((t,a,m,o)=>{F.debug(`rendering pie chart
`+t);const p=o.db,x=Y(),i=tt(p.getConfig(),x.pie),e=40,r=18,l=4,c=450,A=c,h=et(a),u=h.append("g");u.attr("transform","translate("+A/2+","+c/2+")");const{themeVariables:n}=x;let[v]=at(n.pieOuterStrokeWidth);v??(v=2);const C=i.textPosition,f=Math.min(A,c)/2-e,T=P().innerRadius(0).outerRadius(f),$=P().innerRadius(f*C).outerRadius(f*C);u.append("circle").attr("cx",0).attr("cy",0).attr("r",f+v/2).attr("class","pieOuterCircle");const d=p.getSections(),y=At(d),w=[n.pie1,n.pie2,n.pie3,n.pie4,n.pie5,n.pie6,n.pie7,n.pie8,n.pie9,n.pie10,n.pie11,n.pie12],D=it(w);u.selectAll("mySlices").data(y).enter().append("path").attr("d",T).attr("fill",s=>D(s.data.label)).attr("class","pieCircle");let W=0;Object.keys(d).forEach(s=>{W+=d[s]}),u.selectAll("mySlices").data(y).enter().append("text").text(s=>(s.data.value/W*100).toFixed(0)+"%").attr("transform",s=>"translate("+$.centroid(s)+")").style("text-anchor","middle").attr("class","slice"),u.append("text").text(p.getDiagramTitle()).attr("x",0).attr("y",-(c-50)/2).attr("class","pieTitleText");const M=u.selectAll(".legend").data(D.domain()).enter().append("g").attr("class","legend").attr("transform",(s,b)=>{const k=r+l,_=k*D.domain().length/2,j=12*r,B=b*k-_;return"translate("+j+","+B+")"});M.append("rect").attr("width",r).attr("height",r).style("fill",D).style("stroke",D),M.data(y).append("text").attr("x",r+l).attr("y",r-l).text(s=>{const{label:b,value:k}=s.data;return p.getShowData()?`${b} [${k}]`:b});const L=Math.max(...M.selectAll("text").nodes().map(s=>(s==null?void 0:s.getBoundingClientRect().width)??0)),N=A+e+r+l+L;h.attr("viewBox",`0 0 ${N} ${c}`),rt(h,c,N,i.useMaxWidth)},"draw"),wt={draw:Ct},Wt={parser:yt,db:I,renderer:wt,styles:xt};export{Wt as diagram};
