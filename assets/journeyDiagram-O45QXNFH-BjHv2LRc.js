import{d as pt,f as gt,g as at,b as mt}from"./chunk-VDOAVW4H-BN33Osab.js";import{_ as c,d as C,y as xt,z as kt,s as _t,g as vt,c as bt,b as wt,B as Tt,j as St}from"./mermaid.core-sqavcmci.js";import{d as W}from"./transform-Dgtl54Jv.js";import{d as tt}from"./arc-355Af46u.js";import"./app-BguslSDJ.js";import"./commonjsHelpers-Cpj98o6Y.js";import"./path-CbwjOpE9.js";var H=function(){var t=c(function(g,r,n,a){for(n=n||{},a=g.length;a--;n[g[a]]=r);return n},"o"),e=[6,8,10,11,12,14,16,17,18],i=[1,9],o=[1,10],s=[1,11],u=[1,12],h=[1,13],f=[1,14],d={trace:c(function(){},"trace"),yy:{},symbols_:{error:2,start:3,journey:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NEWLINE:10,title:11,acc_title:12,acc_title_value:13,acc_descr:14,acc_descr_value:15,acc_descr_multiline_value:16,section:17,taskName:18,taskData:19,$accept:0,$end:1},terminals_:{2:"error",4:"journey",6:"EOF",8:"SPACE",10:"NEWLINE",11:"title",12:"acc_title",13:"acc_title_value",14:"acc_descr",15:"acc_descr_value",16:"acc_descr_multiline_value",17:"section",18:"taskName",19:"taskData"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,2]],performAction:c(function(r,n,a,y,p,l,S){var _=l.length-1;switch(p){case 1:return l[_-1];case 2:this.$=[];break;case 3:l[_-1].push(l[_]),this.$=l[_-1];break;case 4:case 5:this.$=l[_];break;case 6:case 7:this.$=[];break;case 8:y.setDiagramTitle(l[_].substr(6)),this.$=l[_].substr(6);break;case 9:this.$=l[_].trim(),y.setAccTitle(this.$);break;case 10:case 11:this.$=l[_].trim(),y.setAccDescription(this.$);break;case 12:y.addSection(l[_].substr(8)),this.$=l[_].substr(8);break;case 13:y.addTask(l[_-1],l[_]),this.$="task";break}},"anonymous"),table:[{3:1,4:[1,2]},{1:[3]},t(e,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:i,12:o,14:s,16:u,17:h,18:f},t(e,[2,7],{1:[2,1]}),t(e,[2,3]),{9:15,11:i,12:o,14:s,16:u,17:h,18:f},t(e,[2,5]),t(e,[2,6]),t(e,[2,8]),{13:[1,16]},{15:[1,17]},t(e,[2,11]),t(e,[2,12]),{19:[1,18]},t(e,[2,4]),t(e,[2,9]),t(e,[2,10]),t(e,[2,13])],defaultActions:{},parseError:c(function(r,n){if(n.recoverable)this.trace(r);else{var a=new Error(r);throw a.hash=n,a}},"parseError"),parse:c(function(r){var n=this,a=[0],y=[],p=[null],l=[],S=this.table,_="",B=0,J=0,ut=2,K=1,yt=l.slice.call(arguments,1),k=Object.create(this.lexer),E={yy:{}};for(var O in this.yy)Object.prototype.hasOwnProperty.call(this.yy,O)&&(E.yy[O]=this.yy[O]);k.setInput(r,E.yy),E.yy.lexer=k,E.yy.parser=this,typeof k.yylloc>"u"&&(k.yylloc={});var Y=k.yylloc;l.push(Y);var dt=k.options&&k.options.ranges;typeof E.yy.parseError=="function"?this.parseError=E.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function ft(b){a.length=a.length-2*b,p.length=p.length-b,l.length=l.length-b}c(ft,"popStack");function Q(){var b;return b=y.pop()||k.lex()||K,typeof b!="number"&&(b instanceof Array&&(y=b,b=y.pop()),b=n.symbols_[b]||b),b}c(Q,"lex");for(var v,P,w,q,I={},N,M,D,j;;){if(P=a[a.length-1],this.defaultActions[P]?w=this.defaultActions[P]:((v===null||typeof v>"u")&&(v=Q()),w=S[P]&&S[P][v]),typeof w>"u"||!w.length||!w[0]){var G="";j=[];for(N in S[P])this.terminals_[N]&&N>ut&&j.push("'"+this.terminals_[N]+"'");k.showPosition?G="Parse error on line "+(B+1)+`:
`+k.showPosition()+`
Expecting `+j.join(", ")+", got '"+(this.terminals_[v]||v)+"'":G="Parse error on line "+(B+1)+": Unexpected "+(v==K?"end of input":"'"+(this.terminals_[v]||v)+"'"),this.parseError(G,{text:k.match,token:this.terminals_[v]||v,line:k.yylineno,loc:Y,expected:j})}if(w[0]instanceof Array&&w.length>1)throw new Error("Parse Error: multiple actions possible at state: "+P+", token: "+v);switch(w[0]){case 1:a.push(v),p.push(k.yytext),l.push(k.yylloc),a.push(w[1]),v=null,J=k.yyleng,_=k.yytext,B=k.yylineno,Y=k.yylloc;break;case 2:if(M=this.productions_[w[1]][1],I.$=p[p.length-M],I._$={first_line:l[l.length-(M||1)].first_line,last_line:l[l.length-1].last_line,first_column:l[l.length-(M||1)].first_column,last_column:l[l.length-1].last_column},dt&&(I._$.range=[l[l.length-(M||1)].range[0],l[l.length-1].range[1]]),q=this.performAction.apply(I,[_,J,B,E.yy,w[1],p,l].concat(yt)),typeof q<"u")return q;M&&(a=a.slice(0,-1*M*2),p=p.slice(0,-1*M),l=l.slice(0,-1*M)),a.push(this.productions_[w[1]][0]),p.push(I.$),l.push(I._$),D=S[a[a.length-2]][a[a.length-1]],a.push(D);break;case 3:return!0}}return!0},"parse")},x=function(){var g={EOF:1,parseError:c(function(n,a){if(this.yy.parser)this.yy.parser.parseError(n,a);else throw new Error(n)},"parseError"),setInput:function(r,n){return this.yy=n||this.yy||{},this._input=r,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var r=this._input[0];this.yytext+=r,this.yyleng++,this.offset++,this.match+=r,this.matched+=r;var n=r.match(/(?:\r\n?|\n).*/g);return n?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),r},unput:function(r){var n=r.length,a=r.split(/(?:\r\n?|\n)/g);this._input=r+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-n),this.offset-=n;var y=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),a.length-1&&(this.yylineno-=a.length-1);var p=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:a?(a.length===y.length?this.yylloc.first_column:0)+y[y.length-a.length].length-a[0].length:this.yylloc.first_column-n},this.options.ranges&&(this.yylloc.range=[p[0],p[0]+this.yyleng-n]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(r){this.unput(this.match.slice(r))},pastInput:function(){var r=this.matched.substr(0,this.matched.length-this.match.length);return(r.length>20?"...":"")+r.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var r=this.match;return r.length<20&&(r+=this._input.substr(0,20-r.length)),(r.substr(0,20)+(r.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var r=this.pastInput(),n=new Array(r.length+1).join("-");return r+this.upcomingInput()+`
`+n+"^"},test_match:function(r,n){var a,y,p;if(this.options.backtrack_lexer&&(p={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(p.yylloc.range=this.yylloc.range.slice(0))),y=r[0].match(/(?:\r\n?|\n).*/g),y&&(this.yylineno+=y.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:y?y[y.length-1].length-y[y.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+r[0].length},this.yytext+=r[0],this.match+=r[0],this.matches=r,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(r[0].length),this.matched+=r[0],a=this.performAction.call(this,this.yy,this,n,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),a)return a;if(this._backtrack){for(var l in p)this[l]=p[l];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var r,n,a,y;this._more||(this.yytext="",this.match="");for(var p=this._currentRules(),l=0;l<p.length;l++)if(a=this._input.match(this.rules[p[l]]),a&&(!n||a[0].length>n[0].length)){if(n=a,y=l,this.options.backtrack_lexer){if(r=this.test_match(a,p[l]),r!==!1)return r;if(this._backtrack){n=!1;continue}else return!1}else if(!this.options.flex)break}return n?(r=this.test_match(n,p[y]),r!==!1?r:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:c(function(){var n=this.next();return n||this.lex()},"lex"),begin:c(function(n){this.conditionStack.push(n)},"begin"),popState:c(function(){var n=this.conditionStack.length-1;return n>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:c(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:c(function(n){return n=this.conditionStack.length-1-Math.abs(n||0),n>=0?this.conditionStack[n]:"INITIAL"},"topState"),pushState:c(function(n){this.begin(n)},"pushState"),stateStackSize:c(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:c(function(n,a,y,p){switch(y){case 0:break;case 1:break;case 2:return 10;case 3:break;case 4:break;case 5:return 4;case 6:return 11;case 7:return this.begin("acc_title"),12;case 8:return this.popState(),"acc_title_value";case 9:return this.begin("acc_descr"),14;case 10:return this.popState(),"acc_descr_value";case 11:this.begin("acc_descr_multiline");break;case 12:this.popState();break;case 13:return"acc_descr_multiline_value";case 14:return 17;case 15:return 18;case 16:return 19;case 17:return":";case 18:return 6;case 19:return"INVALID"}},"anonymous"),rules:[/^(?:%(?!\{)[^\n]*)/i,/^(?:[^\}]%%[^\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:#[^\n]*)/i,/^(?:journey\b)/i,/^(?:title\s[^#\n;]+)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:section\s[^#:\n;]+)/i,/^(?:[^#:\n;]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[12,13],inclusive:!1},acc_descr:{rules:[10],inclusive:!1},acc_title:{rules:[8],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,9,11,14,15,16,17,18,19],inclusive:!0}}};return g}();d.lexer=x;function m(){this.yy={}}return c(m,"Parser"),m.prototype=d,d.Parser=m,new m}();H.parser=H;var Mt=H,V="",U=[],R=[],F=[],$t=c(function(){U.length=0,R.length=0,V="",F.length=0,Tt()},"clear"),Et=c(function(t){V=t,U.push(t)},"addSection"),Pt=c(function(){return U},"getSections"),At=c(function(){let t=et();const e=100;let i=0;for(;!t&&i<e;)t=et(),i++;return R.push(...F),R},"getTasks"),Ct=c(function(){const t=[];return R.forEach(i=>{i.people&&t.push(...i.people)}),[...new Set(t)].sort()},"updateActors"),It=c(function(t,e){const i=e.substr(1).split(":");let o=0,s=[];i.length===1?(o=Number(i[0]),s=[]):(o=Number(i[0]),s=i[1].split(","));const u=s.map(f=>f.trim()),h={section:V,type:V,people:u,task:t,score:o};F.push(h)},"addTask"),Vt=c(function(t){const e={section:V,type:V,description:t,task:t,classes:[]};R.push(e)},"addTaskOrg"),et=c(function(){const t=c(function(i){return F[i].processed},"compileTask");let e=!0;for(const[i,o]of F.entries())t(i),e=e&&o.processed;return e},"compileTasks"),Rt=c(function(){return Ct()},"getActors"),rt={getConfig:()=>C().journey,clear:$t,setDiagramTitle:xt,getDiagramTitle:kt,setAccTitle:_t,getAccTitle:vt,setAccDescription:bt,getAccDescription:wt,addSection:Et,getSections:Pt,getTasks:At,addTask:It,addTaskOrg:Vt,getActors:Rt},Ft=c(t=>`.label {
    font-family: 'trebuchet ms', verdana, arial, sans-serif;
    font-family: var(--mermaid-font-family);
    color: ${t.textColor};
  }
  .mouth {
    stroke: #666;
  }

  line {
    stroke: ${t.textColor}
  }

  .legend {
    fill: ${t.textColor};
  }

  .label text {
    fill: #333;
  }
  .label {
    color: ${t.textColor}
  }

  .face {
    ${t.faceColor?`fill: ${t.faceColor}`:"fill: #FFF8DC"};
    stroke: #999;
  }

  .node rect,
  .node circle,
  .node ellipse,
  .node polygon,
  .node path {
    fill: ${t.mainBkg};
    stroke: ${t.nodeBorder};
    stroke-width: 1px;
  }

  .node .label {
    text-align: center;
  }
  .node.clickable {
    cursor: pointer;
  }

  .arrowheadPath {
    fill: ${t.arrowheadColor};
  }

  .edgePath .path {
    stroke: ${t.lineColor};
    stroke-width: 1.5px;
  }

  .flowchart-link {
    stroke: ${t.lineColor};
    fill: none;
  }

  .edgeLabel {
    background-color: ${t.edgeLabelBackground};
    rect {
      opacity: 0.5;
    }
    text-align: center;
  }

  .cluster rect {
  }

  .cluster text {
    fill: ${t.titleColor};
  }

  div.mermaidTooltip {
    position: absolute;
    text-align: center;
    max-width: 200px;
    padding: 2px;
    font-family: 'trebuchet ms', verdana, arial, sans-serif;
    font-family: var(--mermaid-font-family);
    font-size: 12px;
    background: ${t.tertiaryColor};
    border: 1px solid ${t.border2};
    border-radius: 2px;
    pointer-events: none;
    z-index: 100;
  }

  .task-type-0, .section-type-0  {
    ${t.fillType0?`fill: ${t.fillType0}`:""};
  }
  .task-type-1, .section-type-1  {
    ${t.fillType0?`fill: ${t.fillType1}`:""};
  }
  .task-type-2, .section-type-2  {
    ${t.fillType0?`fill: ${t.fillType2}`:""};
  }
  .task-type-3, .section-type-3  {
    ${t.fillType0?`fill: ${t.fillType3}`:""};
  }
  .task-type-4, .section-type-4  {
    ${t.fillType0?`fill: ${t.fillType4}`:""};
  }
  .task-type-5, .section-type-5  {
    ${t.fillType0?`fill: ${t.fillType5}`:""};
  }
  .task-type-6, .section-type-6  {
    ${t.fillType0?`fill: ${t.fillType6}`:""};
  }
  .task-type-7, .section-type-7  {
    ${t.fillType0?`fill: ${t.fillType7}`:""};
  }

  .actor-0 {
    ${t.actor0?`fill: ${t.actor0}`:""};
  }
  .actor-1 {
    ${t.actor1?`fill: ${t.actor1}`:""};
  }
  .actor-2 {
    ${t.actor2?`fill: ${t.actor2}`:""};
  }
  .actor-3 {
    ${t.actor3?`fill: ${t.actor3}`:""};
  }
  .actor-4 {
    ${t.actor4?`fill: ${t.actor4}`:""};
  }
  .actor-5 {
    ${t.actor5?`fill: ${t.actor5}`:""};
  }
`,"getStyles"),Lt=Ft,Z=c(function(t,e){return pt(t,e)},"drawRect"),Bt=c(function(t,e){const o=t.append("circle").attr("cx",e.cx).attr("cy",e.cy).attr("class","face").attr("r",15).attr("stroke-width",2).attr("overflow","visible"),s=t.append("g");s.append("circle").attr("cx",e.cx-15/3).attr("cy",e.cy-15/3).attr("r",1.5).attr("stroke-width",2).attr("fill","#666").attr("stroke","#666"),s.append("circle").attr("cx",e.cx+15/3).attr("cy",e.cy-15/3).attr("r",1.5).attr("stroke-width",2).attr("fill","#666").attr("stroke","#666");function u(d){const x=tt().startAngle(Math.PI/2).endAngle(3*(Math.PI/2)).innerRadius(7.5).outerRadius(6.8181818181818175);d.append("path").attr("class","mouth").attr("d",x).attr("transform","translate("+e.cx+","+(e.cy+2)+")")}c(u,"smile");function h(d){const x=tt().startAngle(3*Math.PI/2).endAngle(5*(Math.PI/2)).innerRadius(7.5).outerRadius(6.8181818181818175);d.append("path").attr("class","mouth").attr("d",x).attr("transform","translate("+e.cx+","+(e.cy+7)+")")}c(h,"sad");function f(d){d.append("line").attr("class","mouth").attr("stroke",2).attr("x1",e.cx-5).attr("y1",e.cy+7).attr("x2",e.cx+5).attr("y2",e.cy+7).attr("class","mouth").attr("stroke-width","1px").attr("stroke","#666")}return c(f,"ambivalent"),e.score>3?u(s):e.score<3?h(s):f(s),o},"drawFace"),lt=c(function(t,e){const i=t.append("circle");return i.attr("cx",e.cx),i.attr("cy",e.cy),i.attr("class","actor-"+e.pos),i.attr("fill",e.fill),i.attr("stroke",e.stroke),i.attr("r",e.r),i.class!==void 0&&i.attr("class",i.class),e.title!==void 0&&i.append("title").text(e.title),i},"drawCircle"),ot=c(function(t,e){return gt(t,e)},"drawText"),Nt=c(function(t,e){function i(s,u,h,f,d){return s+","+u+" "+(s+h)+","+u+" "+(s+h)+","+(u+f-d)+" "+(s+h-d*1.2)+","+(u+f)+" "+s+","+(u+f)}c(i,"genPoints");const o=t.append("polygon");o.attr("points",i(e.x,e.y,50,20,7)),o.attr("class","labelBox"),e.y=e.y+e.labelMargin,e.x=e.x+.5*e.labelMargin,ot(t,e)},"drawLabel"),jt=c(function(t,e,i){const o=t.append("g"),s=at();s.x=e.x,s.y=e.y,s.fill=e.fill,s.width=i.width*e.taskCount+i.diagramMarginX*(e.taskCount-1),s.height=i.height,s.class="journey-section section-type-"+e.num,s.rx=3,s.ry=3,Z(o,s),ct(i)(e.text,o,s.x,s.y,s.width,s.height,{class:"journey-section section-type-"+e.num},i,e.colour)},"drawSection"),st=-1,zt=c(function(t,e,i){const o=e.x+i.width/2,s=t.append("g");st++;const u=300+5*30;s.append("line").attr("id","task"+st).attr("x1",o).attr("y1",e.y).attr("x2",o).attr("y2",u).attr("class","task-line").attr("stroke-width","1px").attr("stroke-dasharray","4 2").attr("stroke","#666"),Bt(s,{cx:o,cy:300+(5-e.score)*30,score:e.score});const h=at();h.x=e.x,h.y=e.y,h.fill=e.fill,h.width=i.width,h.height=i.height,h.class="task task-type-"+e.num,h.rx=3,h.ry=3,Z(s,h);let f=e.x+14;e.people.forEach(d=>{const x=e.actors[d].color,m={cx:f,cy:e.y,r:7,fill:x,stroke:"#000",title:d,pos:e.actors[d].position};lt(s,m),f+=10}),ct(i)(e.task,s,h.x,h.y,h.width,h.height,{class:"task"},i,e.colour)},"drawTask"),Ot=c(function(t,e){mt(t,e)},"drawBackgroundRect"),ct=function(){function t(s,u,h,f,d,x,m,g){const r=u.append("text").attr("x",h+d/2).attr("y",f+x/2+5).style("font-color",g).style("text-anchor","middle").text(s);o(r,m)}c(t,"byText");function e(s,u,h,f,d,x,m,g,r){const{taskFontSize:n,taskFontFamily:a}=g,y=s.split(/<br\s*\/?>/gi);for(let p=0;p<y.length;p++){const l=p*n-n*(y.length-1)/2,S=u.append("text").attr("x",h+d/2).attr("y",f).attr("fill",r).style("text-anchor","middle").style("font-size",n).style("font-family",a);S.append("tspan").attr("x",h+d/2).attr("dy",l).text(y[p]),S.attr("y",f+x/2).attr("dominant-baseline","central").attr("alignment-baseline","central"),o(S,m)}}c(e,"byTspan");function i(s,u,h,f,d,x,m,g){const r=u.append("switch"),a=r.append("foreignObject").attr("x",h).attr("y",f).attr("width",d).attr("height",x).attr("position","fixed").append("xhtml:div").style("display","table").style("height","100%").style("width","100%");a.append("div").attr("class","label").style("display","table-cell").style("text-align","center").style("vertical-align","middle").text(s),e(s,r,h,f,d,x,m,g),o(a,m)}c(i,"byFo");function o(s,u){for(const h in u)h in u&&s.attr(h,u[h])}return c(o,"_setTextAttrs"),function(s){return s.textPlacement==="fo"?i:s.textPlacement==="old"?t:e}}(),Yt=c(function(t){t.append("defs").append("marker").attr("id","arrowhead").attr("refX",5).attr("refY",2).attr("markerWidth",6).attr("markerHeight",4).attr("orient","auto").append("path").attr("d","M 0,0 V 4 L6,2 Z")},"initGraphics"),L={drawRect:Z,drawCircle:lt,drawSection:jt,drawText:ot,drawLabel:Nt,drawTask:zt,drawBackgroundRect:Ot,initGraphics:Yt},qt=c(function(t){Object.keys(t).forEach(function(i){z[i]=t[i]})},"setConf"),$={};function ht(t){const e=C().journey;let i=60;Object.keys($).forEach(o=>{const s=$[o].color,u={cx:20,cy:i,r:7,fill:s,stroke:"#000",pos:$[o].position};L.drawCircle(t,u);const h={x:40,y:i+7,fill:"#666",text:o,textMargin:e.boxTextMargin|5};L.drawText(t,h),i+=20})}c(ht,"drawActorLegend");var z=C().journey,A=z.leftMargin,Gt=c(function(t,e,i,o){const s=C().journey,u=C().securityLevel;let h;u==="sandbox"&&(h=W("#i"+e));const f=u==="sandbox"?W(h.nodes()[0].contentDocument.body):W("body");T.init();const d=f.select("#"+e);L.initGraphics(d);const x=o.db.getTasks(),m=o.db.getDiagramTitle(),g=o.db.getActors();for(const l in $)delete $[l];let r=0;g.forEach(l=>{$[l]={color:s.actorColours[r%s.actorColours.length],position:r},r++}),ht(d),T.insert(0,0,A,Object.keys($).length*50),Wt(d,x,0);const n=T.getBounds();m&&d.append("text").text(m).attr("x",A).attr("font-size","4ex").attr("font-weight","bold").attr("y",25);const a=n.stopy-n.starty+2*s.diagramMarginY,y=A+n.stopx+2*s.diagramMarginX;St(d,a,y,s.useMaxWidth),d.append("line").attr("x1",A).attr("y1",s.height*4).attr("x2",y-A-4).attr("y2",s.height*4).attr("stroke-width",4).attr("stroke","black").attr("marker-end","url(#arrowhead)");const p=m?70:0;d.attr("viewBox",`${n.startx} -25 ${y} ${a+p}`),d.attr("preserveAspectRatio","xMinYMin meet"),d.attr("height",a+p+25)},"draw"),T={data:{startx:void 0,stopx:void 0,starty:void 0,stopy:void 0},verticalPos:0,sequenceItems:[],init:function(){this.sequenceItems=[],this.data={startx:void 0,stopx:void 0,starty:void 0,stopy:void 0},this.verticalPos=0},updateVal:function(t,e,i,o){t[e]===void 0?t[e]=i:t[e]=o(i,t[e])},updateBounds:function(t,e,i,o){const s=C().journey,u=this;let h=0;function f(d){return c(function(m){h++;const g=u.sequenceItems.length-h+1;u.updateVal(m,"starty",e-g*s.boxMargin,Math.min),u.updateVal(m,"stopy",o+g*s.boxMargin,Math.max),u.updateVal(T.data,"startx",t-g*s.boxMargin,Math.min),u.updateVal(T.data,"stopx",i+g*s.boxMargin,Math.max),d!=="activation"&&(u.updateVal(m,"startx",t-g*s.boxMargin,Math.min),u.updateVal(m,"stopx",i+g*s.boxMargin,Math.max),u.updateVal(T.data,"starty",e-g*s.boxMargin,Math.min),u.updateVal(T.data,"stopy",o+g*s.boxMargin,Math.max))},"updateItemBounds")}c(f,"updateFn"),this.sequenceItems.forEach(f())},insert:function(t,e,i,o){const s=Math.min(t,i),u=Math.max(t,i),h=Math.min(e,o),f=Math.max(e,o);this.updateVal(T.data,"startx",s,Math.min),this.updateVal(T.data,"starty",h,Math.min),this.updateVal(T.data,"stopx",u,Math.max),this.updateVal(T.data,"stopy",f,Math.max),this.updateBounds(s,h,u,f)},bumpVerticalPos:function(t){this.verticalPos=this.verticalPos+t,this.data.stopy=this.verticalPos},getVerticalPos:function(){return this.verticalPos},getBounds:function(){return this.data}},X=z.sectionFills,it=z.sectionColours,Wt=c(function(t,e,i){const o=C().journey;let s="";const u=o.height*2+o.diagramMarginY,h=i+u;let f=0,d="#CCC",x="black",m=0;for(const[g,r]of e.entries()){if(s!==r.section){d=X[f%X.length],m=f%X.length,x=it[f%it.length];let a=0;const y=r.section;for(let l=g;l<e.length&&e[l].section==y;l++)a=a+1;const p={x:g*o.taskMargin+g*o.width+A,y:50,text:r.section,fill:d,num:m,colour:x,taskCount:a};L.drawSection(t,p,o),s=r.section,f++}const n=r.people.reduce((a,y)=>($[y]&&(a[y]=$[y]),a),{});r.x=g*o.taskMargin+g*o.width+A,r.y=h,r.width=o.diagramMarginX,r.height=o.diagramMarginY,r.colour=x,r.fill=d,r.num=m,r.actors=n,L.drawTask(t,r,o),T.insert(r.x,r.y,r.x+r.width+o.taskMargin,300+5*30)}},"drawTasks"),nt={setConf:qt,draw:Gt},Dt={parser:Mt,db:rt,renderer:nt,styles:Lt,init:t=>{nt.setConf(t.journey),rt.clear()}};export{Dt as diagram};
