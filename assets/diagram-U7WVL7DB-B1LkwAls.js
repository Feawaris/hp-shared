import{p as w}from"./chunk-6I6DG3ZD-CIddFwyR.js";import{aw as B,s as S,g as z,y as F,z as P,b as W,c as T,l as x,_ as c,ax as v,aM as D,B as _,at as A,j as E}from"./mermaid.core-Ximo2tF3.js";import{p as N}from"./mermaid-parser.esm-Ch4iEwht.js";import"./app-CCG_6pY4.js";import"./commonjsHelpers-Cpj98o6Y.js";import"./transform-Dgtl54Jv.js";var C={packet:[]},m=structuredClone(C),L=B.packet,M=c(()=>{const t=v({...L,...D().packet});return t.showBits&&(t.paddingY+=10),t},"getConfig"),Y=c(()=>m.packet,"getPacket"),I=c(t=>{t.length>0&&m.packet.push(t)},"pushWord"),O=c(()=>{_(),m=structuredClone(C)},"clear"),h={pushWord:I,getPacket:Y,getConfig:M,clear:O,setAccTitle:S,getAccTitle:z,setDiagramTitle:F,getDiagramTitle:P,getAccDescription:W,setAccDescription:T},j=1e4,G=c(t=>{w(t,h);let e=-1,o=[],n=1;const{bitsPerRow:s}=h.getConfig();for(let{start:a,end:r,label:p}of t.blocks){if(r&&r<a)throw new Error(`Packet block ${a} - ${r} is invalid. End must be greater than start.`);if(a!==e+1)throw new Error(`Packet block ${a} - ${r??a} is not contiguous. It should start from ${e+1}.`);for(e=r??a,x.debug(`Packet block ${a} - ${e} with label ${p}`);o.length<=s+1&&h.getPacket().length<j;){const[b,i]=H({start:a,end:r,label:p},n,s);if(o.push(b),b.end+1===n*s&&(h.pushWord(o),o=[],n++),!i)break;({start:a,end:r,label:p}=i)}}h.pushWord(o)},"populate"),H=c((t,e,o)=>{if(t.end===void 0&&(t.end=t.start),t.start>t.end)throw new Error(`Block start ${t.start} is greater than block end ${t.end}.`);return t.end+1<=e*o?[t,void 0]:[{start:t.start,end:e*o-1,label:t.label},{start:e*o,end:t.end,label:t.label}]},"getNextFittingBlock"),K={parse:async t=>{const e=await N("packet",t);x.debug(e),G(e)}},R=c((t,e,o,n)=>{const s=n.db,a=s.getConfig(),{rowHeight:r,paddingY:p,bitWidth:b,bitsPerRow:i}=a,u=s.getPacket(),l=s.getDiagramTitle(),g=r+p,d=g*(u.length+1)-(l?0:r),k=b*i+2,f=A(e);f.attr("viewbox",`0 0 ${k} ${d}`),E(f,d,k,a.useMaxWidth);for(const[y,$]of u.entries())U(f,$,y,a);f.append("text").text(l).attr("x",k/2).attr("y",d-g/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),U=c((t,e,o,{rowHeight:n,paddingX:s,paddingY:a,bitWidth:r,bitsPerRow:p,showBits:b})=>{const i=t.append("g"),u=o*(n+a)+a;for(const l of e){const g=l.start%p*r+1,d=(l.end-l.start+1)*r-s;if(i.append("rect").attr("x",g).attr("y",u).attr("width",d).attr("height",n).attr("class","packetBlock"),i.append("text").attr("x",g+d/2).attr("y",u+n/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(l.label),!b)continue;const k=l.end===l.start,f=u-2;i.append("text").attr("x",g+(k?d/2:0)).attr("y",f).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",k?"middle":"start").text(l.start),k||i.append("text").attr("x",g+d).attr("y",f).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(l.end)}},"drawWord"),X={draw:R},q={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},J=c(({packet:t}={})=>{const e=v(q,t);return`
	.packetByte {
		font-size: ${e.byteFontSize};
	}
	.packetByte.start {
		fill: ${e.startByteColor};
	}
	.packetByte.end {
		fill: ${e.endByteColor};
	}
	.packetLabel {
		fill: ${e.labelColor};
		font-size: ${e.labelFontSize};
	}
	.packetTitle {
		fill: ${e.titleColor};
		font-size: ${e.titleFontSize};
	}
	.packetBlock {
		stroke: ${e.blockStrokeColor};
		stroke-width: ${e.blockStrokeWidth};
		fill: ${e.blockFillColor};
	}
	`},"styles"),rt={parser:K,db:h,renderer:X,styles:J};export{rt as diagram};
