import{a as C,b as ut,i as ft,c as T,e as pt,d as vt,f as Tt,g as $,h as Nt,s as At,j as Ct}from"./chunk-3S7HWTL5-CA0QfM8E.js";import{n as W,_ as y,o as H,p as gt,d as G,r as yt,e as mt,l as P,q as Y,t as It}from"./mermaid.core-CE49DK09.js";import{h as _,f as wt,G as Bt}from"./graph-BDymcfIa.js";import{d as b}from"./transform-Dgtl54Jv.js";import{u as Mt,r as Dt,p as Rt,l as Pt,d as D}from"./layout-Dx_QUwFc.js";import{l as Gt}from"./line-CpA_g4Gi.js";import"./chunk-ANTO7JYN-ZfOw0i8N.js";import"./clone-fOkIGXZv.js";import"./chunk-QOU2KDNW-CvxJ1Iib.js";import"./channel-DRi_rq0Q.js";import"./app-C4616Opf.js";import"./commonjsHelpers-Cpj98o6Y.js";import"./array-DEnAxiAM.js";import"./path-CbwjOpE9.js";import"./point-DWREGWZc.js";function Ut(r){if(!r.ok)throw new Error(r.status+" "+r.statusText);return r.text()}function Wt(r,e){return fetch(r,e).then(Ut)}function zt(r){return(e,t)=>Wt(e,t).then(n=>new DOMParser().parseFromString(n,r))}var Vt=zt("image/svg+xml"),X={normal:Yt,vee:Ht,undirected:Xt};function $t(r){X=r}function Yt(r,e,t,n){var a=r.append("marker").attr("id",e).attr("viewBox","0 0 10 10").attr("refX",9).attr("refY",5).attr("markerUnits","strokeWidth").attr("markerWidth",8).attr("markerHeight",6).attr("orient","auto"),s=a.append("path").attr("d","M 0 0 L 10 5 L 0 10 z").style("stroke-width",1).style("stroke-dasharray","1,0");C(s,t[n+"Style"]),t[n+"Class"]&&s.attr("class",t[n+"Class"])}function Ht(r,e,t,n){var a=r.append("marker").attr("id",e).attr("viewBox","0 0 10 10").attr("refX",9).attr("refY",5).attr("markerUnits","strokeWidth").attr("markerWidth",8).attr("markerHeight",6).attr("orient","auto"),s=a.append("path").attr("d","M 0 0 L 10 5 L 0 10 L 4 5 z").style("stroke-width",1).style("stroke-dasharray","1,0");C(s,t[n+"Style"]),t[n+"Class"]&&s.attr("class",t[n+"Class"])}function Xt(r,e,t,n){var a=r.append("marker").attr("id",e).attr("viewBox","0 0 10 10").attr("refX",9).attr("refY",5).attr("markerUnits","strokeWidth").attr("markerWidth",8).attr("markerHeight",6).attr("orient","auto"),s=a.append("path").attr("d","M 0 5 L 10 5").style("stroke-width",1).style("stroke-dasharray","1,0");C(s,t[n+"Style"]),t[n+"Class"]&&s.attr("class",t[n+"Class"])}function Ft(r,e){var t=r;return t.node().appendChild(e.label),C(t,e.labelStyle),t}function qt(r,e){for(var t=r.append("text"),n=Qt(e.label).split(`
`),a=0;a<n.length;a++)t.append("tspan").attr("xml:space","preserve").attr("dy","1em").attr("x","1").text(n[a]);return C(t,e.labelStyle),t}function Qt(r){for(var e="",t=!1,n,a=0;a<r.length;++a)if(n=r[a],t){switch(n){case"n":e+=`
`;break;default:e+=n}t=!1}else n==="\\"?t=!0:e+=n;return e}function Z(r,e,t){var n=e.label,a=r.append("g");e.labelType==="svg"?Ft(a,e):typeof n!="string"||e.labelType==="html"?ut(a,e):qt(a,e);var s=a.node().getBBox(),i;switch(t){case"top":i=-e.height/2;break;case"bottom":i=e.height/2-s.height;break;default:i=-s.height/2}return a.attr("transform","translate("+-s.width/2+","+i+")"),a}var F=function(r,e){var t=e.nodes().filter(function(s){return ft(e,s)}),n=r.selectAll("g.cluster").data(t,function(s){return s});T(n.exit(),e).style("opacity",0).remove();var a=n.enter().append("g").attr("class","cluster").attr("id",function(s){var i=e.node(s);return i.id}).style("opacity",0).each(function(s){var i=e.node(s),o=b(this);b(this).append("rect");var c=o.append("g").attr("class","label");Z(c,i,i.clusterLabelPos)});return n=n.merge(a),n=T(n,e).style("opacity",1),n.selectAll("rect").each(function(s){var i=e.node(s),o=b(this);C(o,i.style)}),n};function Kt(r){F=r}let q=function(r,e){var t=r.selectAll("g.edgeLabel").data(e.edges(),function(a){return pt(a)}).classed("update",!0);t.exit().remove(),t.enter().append("g").classed("edgeLabel",!0).style("opacity",0),t=r.selectAll("g.edgeLabel"),t.each(function(a){var s=b(this);s.select(".label").remove();var i=e.edge(a),o=Z(s,e.edge(a),0).classed("label",!0),c=o.node().getBBox();i.labelId&&o.attr("id",i.labelId),_(i,"width")||(i.width=c.width),_(i,"height")||(i.height=c.height)});var n;return t.exit?n=t.exit():n=t.selectAll(null),T(n,e).style("opacity",0).remove(),t};function Jt(r){q=r}function dt(r,e){return r.intersect(e)}var Q=function(r,e,t){var n=r.selectAll("g.edgePath").data(e.edges(),function(i){return pt(i)}).classed("update",!0),a=ee(n,e);re(n,e);var s=n.merge!==void 0?n.merge(a):n;return T(s,e).style("opacity",1),s.each(function(i){var o=b(this),c=e.edge(i);c.elem=this,c.id&&o.attr("id",c.id),vt(o,c.class,(o.classed("update")?"update ":"")+"edgePath")}),s.selectAll("path.path").each(function(i){var o=e.edge(i);o.arrowheadId=Mt("arrowhead");var c=b(this).attr("marker-end",function(){return"url("+Ot(location.href,o.arrowheadId)+")"}).style("fill","none");T(c,e).attr("d",function(d){return jt(e,d)}),C(c,o.style)}),s.selectAll("defs *").remove(),s.selectAll("defs").each(function(i){var o=e.edge(i),c=t[o.arrowhead];c(b(this),o.arrowheadId,o,"arrowhead")}),s};function Zt(r){Q=r}function Ot(r,e){var t=r.split("#")[0];return t+"#"+e}function jt(r,e){var t=r.edge(e),n=r.node(e.v),a=r.node(e.w),s=t.points.slice(1,t.points.length-1);return s.unshift(dt(n,s[0])),s.push(dt(a,s[s.length-1])),xt(t,s)}function xt(r,e){var t=(Gt||Vt.line)().x(function(n){return n.x}).y(function(n){return n.y});return(t.curve||t.interpolate)(r.curve),t(e)}function te(r){var e=r.getBBox(),t=r.ownerSVGElement.getScreenCTM().inverse().multiply(r.getScreenCTM()).translate(e.width/2,e.height/2);return{x:t.e,y:t.f}}function ee(r,e){var t=r.enter().append("g").attr("class","edgePath").style("opacity",0);return t.append("path").attr("class","path").attr("d",function(n){var a=e.edge(n),s=e.node(n.v).elem,i=Dt(a.points.length).map(function(){return te(s)});return xt(a,i)}),t.append("defs"),t}function re(r,e){var t=r.exit();T(t,e).style("opacity",0).remove()}var K=function(r,e,t){var n=e.nodes().filter(function(i){return!ft(e,i)}),a=r.selectAll("g.node").data(n,function(i){return i}).classed("update",!0);a.exit().remove(),a.enter().append("g").attr("class","node").style("opacity",0),a=r.selectAll("g.node"),a.each(function(i){var o=e.node(i),c=b(this);vt(c,o.class,(c.classed("update")?"update ":"")+"node"),c.select("g.label").remove();var d=c.append("g").attr("class","label"),l=Z(d,o),v=t[o.shape],h=Rt(l.node().getBBox(),"width","height");o.elem=this,o.id&&c.attr("id",o.id),o.labelId&&d.attr("id",o.labelId),_(o,"width")&&(h.width=o.width),_(o,"height")&&(h.height=o.height),h.width+=o.paddingLeft+o.paddingRight,h.height+=o.paddingTop+o.paddingBottom,d.attr("transform","translate("+(o.paddingLeft-o.paddingRight)/2+","+(o.paddingTop-o.paddingBottom)/2+")");var u=b(this);u.select(".label-container").remove();var p=v(u,h,o).classed("label-container",!0);C(p,o.style);var m=p.node().getBBox();o.width=m.width,o.height=m.height});var s;return a.exit?s=a.exit():s=a.selectAll(null),T(s,e).style("opacity",0).remove(),a};function ae(r){K=r}function ne(r,e){var t=r.filter(function(){return!b(this).classed("update")});function n(a){var s=e.node(a);return"translate("+s.x+","+s.y+")"}t.attr("transform",n),T(r,e).style("opacity",1).attr("transform",n),T(t.selectAll("rect"),e).attr("width",function(a){return e.node(a).width}).attr("height",function(a){return e.node(a).height}).attr("x",function(a){var s=e.node(a);return-s.width/2}).attr("y",function(a){var s=e.node(a);return-s.height/2})}function se(r,e){var t=r.filter(function(){return!b(this).classed("update")});function n(a){var s=e.edge(a);return _(s,"x")?"translate("+s.x+","+s.y+")":""}t.attr("transform",n),T(r,e).style("opacity",1).attr("transform",n)}function ie(r,e){var t=r.filter(function(){return!b(this).classed("update")});function n(a){var s=e.node(a);return"translate("+s.x+","+s.y+")"}t.attr("transform",n),T(r,e).style("opacity",1).attr("transform",n)}function bt(r,e,t,n){var a=r.x,s=r.y,i=a-n.x,o=s-n.y,c=Math.sqrt(e*e*o*o+t*t*i*i),d=Math.abs(e*t*i/c);n.x<a&&(d=-d);var l=Math.abs(e*t*o/c);return n.y<s&&(l=-l),{x:a+d,y:s+l}}function oe(r,e,t){return bt(r,e,e,t)}function le(r,e,t,n){var a,s,i,o,c,d,l,v,h,u,p,m,f,g,S;if(a=e.y-r.y,i=r.x-e.x,c=e.x*r.y-r.x*e.y,h=a*t.x+i*t.y+c,u=a*n.x+i*n.y+c,!(h!==0&&u!==0&&ht(h,u))&&(s=n.y-t.y,o=t.x-n.x,d=n.x*t.y-t.x*n.y,l=s*r.x+o*r.y+d,v=s*e.x+o*e.y+d,!(l!==0&&v!==0&&ht(l,v))&&(p=a*o-s*i,p!==0)))return m=Math.abs(p/2),f=i*d-o*c,g=f<0?(f-m)/p:(f+m)/p,f=s*c-a*d,S=f<0?(f-m)/p:(f+m)/p,{x:g,y:S}}function ht(r,e){return r*e>0}function N(r,e,t){var n=r.x,a=r.y,s=[],i=Number.POSITIVE_INFINITY,o=Number.POSITIVE_INFINITY;e.forEach(function(p){i=Math.min(i,p.x),o=Math.min(o,p.y)});for(var c=n-r.width/2-i,d=a-r.height/2-o,l=0;l<e.length;l++){var v=e[l],h=e[l<e.length-1?l+1:0],u=le(r,t,{x:c+v.x,y:d+v.y},{x:c+h.x,y:d+h.y});u&&s.push(u)}return s.length?(s.length>1&&s.sort(function(p,m){var f=p.x-t.x,g=p.y-t.y,S=Math.sqrt(f*f+g*g),B=m.x-t.x,E=m.y-t.y,z=Math.sqrt(B*B+E*E);return S<z?-1:S===z?0:1}),s[0]):(console.log("NO INTERSECTION FOUND, RETURN NODE CENTER",r),r)}function O(r,e){var t=r.x,n=r.y,a=e.x-t,s=e.y-n,i=r.width/2,o=r.height/2,c,d;return Math.abs(s)*i>Math.abs(a)*o?(s<0&&(o=-o),c=s===0?0:o*a/s,d=o):(a<0&&(i=-i),c=i,d=a===0?0:i*s/a),{x:t+c,y:n+d}}var J={rect:de,ellipse:he,circle:ue,diamond:fe};function ce(r){J=r}function de(r,e,t){var n=r.insert("rect",":first-child").attr("rx",t.rx).attr("ry",t.ry).attr("x",-e.width/2).attr("y",-e.height/2).attr("width",e.width).attr("height",e.height);return t.intersect=function(a){return O(t,a)},n}function he(r,e,t){var n=e.width/2,a=e.height/2,s=r.insert("ellipse",":first-child").attr("x",-e.width/2).attr("y",-e.height/2).attr("rx",n).attr("ry",a);return t.intersect=function(i){return bt(t,n,a,i)},s}function ue(r,e,t){var n=Math.max(e.width,e.height)/2,a=r.insert("circle",":first-child").attr("x",-e.width/2).attr("y",-e.height/2).attr("r",n);return t.intersect=function(s){return oe(t,n,s)},a}function fe(r,e,t){var n=e.width*Math.SQRT2/2,a=e.height*Math.SQRT2/2,s=[{x:0,y:-a},{x:-n,y:0},{x:0,y:a},{x:n,y:0}],i=r.insert("polygon",":first-child").attr("points",s.map(function(o){return o.x+","+o.y}).join(" "));return t.intersect=function(o){return N(t,s,o)},i}function pe(){var r=function(e,t){ye(t);var n=R(e,"output"),a=R(n,"clusters"),s=R(n,"edgePaths"),i=q(R(n,"edgeLabels"),t),o=K(R(n,"nodes"),t,J);Pt(t),ie(o,t),se(i,t),Q(s,t,X);var c=F(a,t);ne(c,t),me(t)};return r.createNodes=function(e){return arguments.length?(ae(e),r):K},r.createClusters=function(e){return arguments.length?(Kt(e),r):F},r.createEdgeLabels=function(e){return arguments.length?(Jt(e),r):q},r.createEdgePaths=function(e){return arguments.length?(Zt(e),r):Q},r.shapes=function(e){return arguments.length?(ce(e),r):J},r.arrows=function(e){return arguments.length?($t(e),r):X},r}var ve={paddingLeft:10,paddingRight:10,paddingTop:10,paddingBottom:10,rx:0,ry:0,shape:"rect"},ge={arrowhead:"normal",curve:W};function ye(r){r.nodes().forEach(function(e){var t=r.node(e);!_(t,"label")&&!r.children(e).length&&(t.label=e),_(t,"paddingX")&&D(t,{paddingLeft:t.paddingX,paddingRight:t.paddingX}),_(t,"paddingY")&&D(t,{paddingTop:t.paddingY,paddingBottom:t.paddingY}),_(t,"padding")&&D(t,{paddingLeft:t.padding,paddingRight:t.padding,paddingTop:t.padding,paddingBottom:t.padding}),D(t,ve),wt(["paddingLeft","paddingRight","paddingTop","paddingBottom"],function(n){t[n]=Number(t[n])}),_(t,"width")&&(t._prevWidth=t.width),_(t,"height")&&(t._prevHeight=t.height)}),r.edges().forEach(function(e){var t=r.edge(e);_(t,"label")||(t.label=""),D(t,ge)})}function me(r){wt(r.nodes(),function(e){var t=r.node(e);_(t,"_prevWidth")?t.width=t._prevWidth:delete t.width,_(t,"_prevHeight")?t.height=t._prevHeight:delete t.height,delete t._prevWidth,delete t._prevHeight})}function R(r,e){var t=r.select("g."+e);return t.empty()&&(t=r.append("g").attr("class",e)),t}function j(r,e,t){const n=e.width,a=e.height,s=(n+a)*.9,i=[{x:s/2,y:0},{x:s,y:-s/2},{x:s/2,y:-s},{x:0,y:-s/2}],o=A(r,s,s,i);return t.intersect=function(c){return N(t,i,c)},o}y(j,"question");function tt(r,e,t){const a=e.height,s=a/4,i=e.width+2*s,o=[{x:s,y:0},{x:i-s,y:0},{x:i,y:-a/2},{x:i-s,y:-a},{x:s,y:-a},{x:0,y:-a/2}],c=A(r,i,a,o);return t.intersect=function(d){return N(t,o,d)},c}y(tt,"hexagon");function et(r,e,t){const n=e.width,a=e.height,s=[{x:-a/2,y:0},{x:n,y:0},{x:n,y:-a},{x:-a/2,y:-a},{x:0,y:-a/2}],i=A(r,n,a,s);return t.intersect=function(o){return N(t,s,o)},i}y(et,"rect_left_inv_arrow");function rt(r,e,t){const n=e.width,a=e.height,s=[{x:-2*a/6,y:0},{x:n-a/6,y:0},{x:n+2*a/6,y:-a},{x:a/6,y:-a}],i=A(r,n,a,s);return t.intersect=function(o){return N(t,s,o)},i}y(rt,"lean_right");function at(r,e,t){const n=e.width,a=e.height,s=[{x:2*a/6,y:0},{x:n+a/6,y:0},{x:n-2*a/6,y:-a},{x:-a/6,y:-a}],i=A(r,n,a,s);return t.intersect=function(o){return N(t,s,o)},i}y(at,"lean_left");function nt(r,e,t){const n=e.width,a=e.height,s=[{x:-2*a/6,y:0},{x:n+2*a/6,y:0},{x:n-a/6,y:-a},{x:a/6,y:-a}],i=A(r,n,a,s);return t.intersect=function(o){return N(t,s,o)},i}y(nt,"trapezoid");function st(r,e,t){const n=e.width,a=e.height,s=[{x:a/6,y:0},{x:n-a/6,y:0},{x:n+2*a/6,y:-a},{x:-2*a/6,y:-a}],i=A(r,n,a,s);return t.intersect=function(o){return N(t,s,o)},i}y(st,"inv_trapezoid");function it(r,e,t){const n=e.width,a=e.height,s=[{x:0,y:0},{x:n+a/2,y:0},{x:n,y:-a/2},{x:n+a/2,y:-a},{x:0,y:-a}],i=A(r,n,a,s);return t.intersect=function(o){return N(t,s,o)},i}y(it,"rect_right_inv_arrow");function ot(r,e,t){const n=e.height,a=e.width+n/4,s=r.insert("rect",":first-child").attr("rx",n/2).attr("ry",n/2).attr("x",-a/2).attr("y",-n/2).attr("width",a).attr("height",n);return t.intersect=function(i){return O(t,i)},s}y(ot,"stadium");function lt(r,e,t){const n=e.width,a=e.height,s=[{x:0,y:0},{x:n,y:0},{x:n,y:-a},{x:0,y:-a},{x:0,y:0},{x:-8,y:0},{x:n+8,y:0},{x:n+8,y:-a},{x:-8,y:-a},{x:-8,y:0}],i=A(r,n,a,s);return t.intersect=function(o){return N(t,s,o)},i}y(lt,"subroutine");function ct(r,e,t){const n=e.width,a=n/2,s=a/(2.5+n/50),i=e.height+s,o="M 0,"+s+" a "+a+","+s+" 0,0,0 "+n+" 0 a "+a+","+s+" 0,0,0 "+-n+" 0 l 0,"+i+" a "+a+","+s+" 0,0,0 "+n+" 0 l 0,"+-i,c=r.attr("label-offset-y",s).insert("path",":first-child").attr("d",o).attr("transform","translate("+-n/2+","+-(i/2+s)+")");return t.intersect=function(d){const l=O(t,d),v=l.x-t.x;if(a!=0&&(Math.abs(v)<t.width/2||Math.abs(v)==t.width/2&&Math.abs(l.y-t.y)>t.height/2-s)){let h=s*s*(1-v*v/(a*a));h!=0&&(h=Math.sqrt(h)),h=s-h,d.y-t.y>0&&(h=-h),l.y+=h}return l},c}y(ct,"cylinder");function kt(r){r.shapes().question=j,r.shapes().hexagon=tt,r.shapes().stadium=ot,r.shapes().subroutine=lt,r.shapes().cylinder=ct,r.shapes().rect_left_inv_arrow=et,r.shapes().lean_right=rt,r.shapes().lean_left=at,r.shapes().trapezoid=nt,r.shapes().inv_trapezoid=st,r.shapes().rect_right_inv_arrow=it}y(kt,"addToRender");function St(r){r({question:j}),r({hexagon:tt}),r({stadium:ot}),r({subroutine:lt}),r({cylinder:ct}),r({rect_left_inv_arrow:et}),r({lean_right:rt}),r({lean_left:at}),r({trapezoid:nt}),r({inv_trapezoid:st}),r({rect_right_inv_arrow:it})}y(St,"addToRenderV2");function A(r,e,t,n){return r.insert("polygon",":first-child").attr("points",n.map(function(a){return a.x+","+a.y}).join(" ")).attr("transform","translate("+-e/2+","+t/2+")")}y(A,"insertPolygonShape");var we={addToRender:kt,addToRenderV2:St},_t={},xe=y(function(r){const e=Object.keys(r);for(const t of e)_t[t]=r[t]},"setConf"),Lt=y(async function(r,e,t,n,a,s){const i=n?n.select(`[id="${t}"]`):b(`[id="${t}"]`),o=a||document,c=Object.keys(r);for(const d of c){const l=r[d];let v="default";l.classes.length>0&&(v=l.classes.join(" "));const h=H(l.styles);let u=l.text!==void 0?l.text:l.id,p;if(gt(G().flowchart.htmlLabels)){const g={label:await yt(u.replace(/fa[blrs]?:fa-[\w-]+/g,S=>`<i class='${S.replace(":"," ")}'></i>`),G())};p=ut(i,g).node(),p.parentNode.removeChild(p)}else{const g=o.createElementNS("http://www.w3.org/2000/svg","text");g.setAttribute("style",h.labelStyle.replace("color:","fill:"));const S=u.split(mt.lineBreakRegex);for(const B of S){const E=o.createElementNS("http://www.w3.org/2000/svg","tspan");E.setAttributeNS("http://www.w3.org/XML/1998/namespace","xml:space","preserve"),E.setAttribute("dy","1em"),E.setAttribute("x","1"),E.textContent=B,g.appendChild(E)}p=g}let m=0,f="";switch(l.type){case"round":m=5,f="rect";break;case"square":f="rect";break;case"diamond":f="question";break;case"hexagon":f="hexagon";break;case"odd":f="rect_left_inv_arrow";break;case"lean_right":f="lean_right";break;case"lean_left":f="lean_left";break;case"trapezoid":f="trapezoid";break;case"inv_trapezoid":f="inv_trapezoid";break;case"odd_right":f="rect_left_inv_arrow";break;case"circle":f="circle";break;case"ellipse":f="ellipse";break;case"stadium":f="stadium";break;case"subroutine":f="subroutine";break;case"cylinder":f="cylinder";break;case"group":f="rect";break;default:f="rect"}P.warn("Adding node",l.id,l.domId),e.setNode(s.db.lookUpDomId(l.id),{labelType:"svg",labelStyle:h.labelStyle,shape:f,label:p,rx:m,ry:m,class:v,style:h.style,id:s.db.lookUpDomId(l.id)})}},"addVertices"),Et=y(async function(r,e,t){let n=0,a,s;if(r.defaultStyle!==void 0){const i=H(r.defaultStyle);a=i.style,s=i.labelStyle}for(const i of r){n++;const o="L-"+i.start+"-"+i.end,c="LS-"+i.start,d="LE-"+i.end,l={};i.type==="arrow_open"?l.arrowhead="none":l.arrowhead="normal";let v="",h="";if(i.style!==void 0){const u=H(i.style);v=u.style,h=u.labelStyle}else switch(i.stroke){case"normal":v="fill:none",a!==void 0&&(v=a),s!==void 0&&(h=s);break;case"dotted":v="fill:none;stroke-width:2px;stroke-dasharray:3;";break;case"thick":v=" stroke-width: 3.5px;fill:none";break}l.style=v,l.labelStyle=h,i.interpolate!==void 0?l.curve=Y(i.interpolate,W):r.defaultInterpolate!==void 0?l.curve=Y(r.defaultInterpolate,W):l.curve=Y(_t.curve,W),i.text===void 0?i.style!==void 0&&(l.arrowheadStyle="fill: #333"):(l.arrowheadStyle="fill: #333",l.labelpos="c",gt(G().flowchart.htmlLabels)?(l.labelType="html",l.label=`<span id="L-${o}" class="edgeLabel L-${c}' L-${d}" style="${l.labelStyle}">${await yt(i.text.replace(/fa[blrs]?:fa-[\w-]+/g,u=>`<i class='${u.replace(":"," ")}'></i>`),G())}</span>`):(l.labelType="text",l.label=i.text.replace(mt.lineBreakRegex,`
`),i.style===void 0&&(l.style=l.style||"stroke: #333; stroke-width: 1.5px;fill:none"),l.labelStyle=l.labelStyle.replace("color:","fill:"))),l.id=o,l.class=c+" "+d,l.minlen=i.length||1,e.setEdge(t.db.lookUpDomId(i.start),t.db.lookUpDomId(i.end),l,n)}},"addEdges"),be=y(function(r,e){return P.info("Extracting classes"),e.db.getClasses()},"getClasses"),ke=y(async function(r,e,t,n){P.info("Drawing flowchart");const{securityLevel:a,flowchart:s}=G();let i;a==="sandbox"&&(i=b("#i"+e));const o=a==="sandbox"?b(i.nodes()[0].contentDocument.body):b("body"),c=a==="sandbox"?i.nodes()[0].contentDocument:document;let d=n.db.getDirection();d===void 0&&(d="TD");const l=s.nodeSpacing||50,v=s.rankSpacing||50,h=new Bt({multigraph:!0,compound:!0}).setGraph({rankdir:d,nodesep:l,ranksep:v,marginx:8,marginy:8}).setDefaultEdgeLabel(function(){return{}});let u;const p=n.db.getSubGraphs();for(let w=p.length-1;w>=0;w--)u=p[w],n.db.addVertex(u.id,u.title,"group",void 0,u.classes);const m=n.db.getVertices();P.warn("Get vertices",m);const f=n.db.getEdges();let g=0;for(g=p.length-1;g>=0;g--){u=p[g],Ct("cluster").append("text");for(let w=0;w<u.nodes.length;w++)P.warn("Setting subgraph",u.nodes[w],n.db.lookUpDomId(u.nodes[w]),n.db.lookUpDomId(u.id)),h.setParent(n.db.lookUpDomId(u.nodes[w]),n.db.lookUpDomId(u.id))}await Lt(m,h,e,o,c,n),await Et(f,h,n);const S=new pe;we.addToRender(S),S.arrows().none=y(function(k,L,x,M){const I=k.append("marker").attr("id",L).attr("viewBox","0 0 10 10").attr("refX",9).attr("refY",5).attr("markerUnits","strokeWidth").attr("markerWidth",8).attr("markerHeight",6).attr("orient","auto").append("path").attr("d","M 0 0 L 0 0 L 0 0 z");C(I,x[M+"Style"])},"normal"),S.arrows().normal=y(function(k,L){k.append("marker").attr("id",L).attr("viewBox","0 0 10 10").attr("refX",9).attr("refY",5).attr("markerUnits","strokeWidth").attr("markerWidth",8).attr("markerHeight",6).attr("orient","auto").append("path").attr("d","M 0 0 L 10 5 L 0 10 z").attr("class","arrowheadPath").style("stroke-width",1).style("stroke-dasharray","1,0")},"normal");const B=o.select(`[id="${e}"]`),E=o.select("#"+e+" g");for(S(E,h),E.selectAll("g.node").attr("title",function(){return n.db.getTooltip(this.id)}),n.db.indexNodes("subGraph"+g),g=0;g<p.length;g++)if(u=p[g],u.title!=="undefined"){const w=c.querySelectorAll("#"+e+' [id="'+n.db.lookUpDomId(u.id)+'"] rect'),k=c.querySelectorAll("#"+e+' [id="'+n.db.lookUpDomId(u.id)+'"]'),L=w[0].x.baseVal.value,x=w[0].y.baseVal.value,M=w[0].width.baseVal.value,I=b(k[0]).select(".label");I.attr("transform",`translate(${L+M/2}, ${x+14})`),I.attr("id",e+"Text");for(let V=0;V<u.classes.length;V++)k[0].classList.add(u.classes[V])}if(!s.htmlLabels){const w=c.querySelectorAll('[id="'+e+'"] .edgeLabel .label');for(const k of w){const L=k.getBBox(),x=c.createElementNS("http://www.w3.org/2000/svg","rect");x.setAttribute("rx",0),x.setAttribute("ry",0),x.setAttribute("width",L.width),x.setAttribute("height",L.height),k.insertBefore(x,k.firstChild)}}It(h,B,s.diagramPadding,s.useMaxWidth),Object.keys(m).forEach(function(w){const k=m[w];if(k.link){const L=o.select("#"+e+' [id="'+n.db.lookUpDomId(w)+'"]');if(L){const x=c.createElementNS("http://www.w3.org/2000/svg","a");x.setAttributeNS("http://www.w3.org/2000/svg","class",k.classes.join(" ")),x.setAttributeNS("http://www.w3.org/2000/svg","href",k.link),x.setAttributeNS("http://www.w3.org/2000/svg","rel","noopener"),a==="sandbox"?x.setAttributeNS("http://www.w3.org/2000/svg","target","_top"):k.linkTarget&&x.setAttributeNS("http://www.w3.org/2000/svg","target",k.linkTarget);const M=L.insert(function(){return x},":first-child"),U=L.select(".label-container");U&&M.append(function(){return U.node()});const I=L.select(".label");I&&M.append(function(){return I.node()})}}})},"draw"),Se={setConf:xe,addVertices:Lt,addEdges:Et,getClasses:be,draw:ke},We={parser:Tt,db:$,renderer:Nt,styles:At,init:r=>{r.flowchart||(r.flowchart={}),r.flowchart.arrowMarkerAbsolute=r.arrowMarkerAbsolute,Se.setConf(r.flowchart),$.clear(),$.setGen("gen-1")}};export{We as diagram};