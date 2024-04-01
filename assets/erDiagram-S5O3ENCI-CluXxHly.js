import{_ as p,d as F,s as kt,g as xt,c as Rt,b as Ot,y as bt,z as Nt,l as X,B as Tt,A as At,j as Mt,al as vt,ap as St}from"./mermaid.core-Bzdd6s6u.js";import{G as wt}from"./graph-DszbNLHH.js";import{d as at}from"./transform-Dgtl54Jv.js";import{l as It}from"./layout-KvA4secL.js";import{l as Dt}from"./line-DyyY4ME-.js";import"./app-DzJi2Cyx.js";import"./commonjsHelpers-Cpj98o6Y.js";import"./array-DEnAxiAM.js";import"./path-CbwjOpE9.js";import"./point-DWREGWZc.js";const Lt=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;function Bt(t){return typeof t=="string"&&Lt.test(t)}const M=[];for(let t=0;t<256;++t)M.push((t+256).toString(16).slice(1));function Ct(t,e=0){return M[t[e+0]]+M[t[e+1]]+M[t[e+2]]+M[t[e+3]]+"-"+M[t[e+4]]+M[t[e+5]]+"-"+M[t[e+6]]+M[t[e+7]]+"-"+M[t[e+8]]+M[t[e+9]]+"-"+M[t[e+10]]+M[t[e+11]]+M[t[e+12]]+M[t[e+13]]+M[t[e+14]]+M[t[e+15]]}function Pt(t){if(!Bt(t))throw TypeError("Invalid UUID");let e;const r=new Uint8Array(16);return r[0]=(e=parseInt(t.slice(0,8),16))>>>24,r[1]=e>>>16&255,r[2]=e>>>8&255,r[3]=e&255,r[4]=(e=parseInt(t.slice(9,13),16))>>>8,r[5]=e&255,r[6]=(e=parseInt(t.slice(14,18),16))>>>8,r[7]=e&255,r[8]=(e=parseInt(t.slice(19,23),16))>>>8,r[9]=e&255,r[10]=(e=parseInt(t.slice(24,36),16))/1099511627776&255,r[11]=e/4294967296&255,r[12]=e>>>24&255,r[13]=e>>>16&255,r[14]=e>>>8&255,r[15]=e&255,r}function Yt(t){t=unescape(encodeURIComponent(t));const e=[];for(let r=0;r<t.length;++r)e.push(t.charCodeAt(r));return e}const Zt="6ba7b810-9dad-11d1-80b4-00c04fd430c8",Ft="6ba7b811-9dad-11d1-80b4-00c04fd430c8";function Wt(t,e,r){function u(c,_,f,o){var h;if(typeof c=="string"&&(c=Yt(c)),typeof _=="string"&&(_=Pt(_)),((h=_)===null||h===void 0?void 0:h.length)!==16)throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");let m=new Uint8Array(16+c.length);if(m.set(_),m.set(c,_.length),m=r(m),m[6]=m[6]&15|e,m[8]=m[8]&63|128,f){o=o||0;for(let g=0;g<16;++g)f[o+g]=m[g];return f}return Ct(m)}try{u.name=t}catch{}return u.DNS=Zt,u.URL=Ft,u}function Ut(t,e,r,u){switch(t){case 0:return e&r^~e&u;case 1:return e^r^u;case 2:return e&r^e&u^r&u;case 3:return e^r^u}}function it(t,e){return t<<e|t>>>32-e}function zt(t){const e=[1518500249,1859775393,2400959708,3395469782],r=[1732584193,4023233417,2562383102,271733878,3285377520];if(typeof t=="string"){const f=unescape(encodeURIComponent(t));t=[];for(let o=0;o<f.length;++o)t.push(f.charCodeAt(o))}else Array.isArray(t)||(t=Array.prototype.slice.call(t));t.push(128);const u=t.length/4+2,c=Math.ceil(u/16),_=new Array(c);for(let f=0;f<c;++f){const o=new Uint32Array(16);for(let h=0;h<16;++h)o[h]=t[f*64+h*4]<<24|t[f*64+h*4+1]<<16|t[f*64+h*4+2]<<8|t[f*64+h*4+3];_[f]=o}_[c-1][14]=(t.length-1)*8/Math.pow(2,32),_[c-1][14]=Math.floor(_[c-1][14]),_[c-1][15]=(t.length-1)*8&4294967295;for(let f=0;f<c;++f){const o=new Uint32Array(80);for(let y=0;y<16;++y)o[y]=_[f][y];for(let y=16;y<80;++y)o[y]=it(o[y-3]^o[y-8]^o[y-14]^o[y-16],1);let h=r[0],m=r[1],g=r[2],k=r[3],R=r[4];for(let y=0;y<80;++y){const T=Math.floor(y/20),D=it(h,5)+Ut(T,m,g,k)+R+e[T]+o[y]>>>0;R=k,k=g,g=it(m,30)>>>0,m=h,h=D}r[0]=r[0]+h>>>0,r[1]=r[1]+m>>>0,r[2]=r[2]+g>>>0,r[3]=r[3]+k>>>0,r[4]=r[4]+R>>>0}return[r[0]>>24&255,r[0]>>16&255,r[0]>>8&255,r[0]&255,r[1]>>24&255,r[1]>>16&255,r[1]>>8&255,r[1]&255,r[2]>>24&255,r[2]>>16&255,r[2]>>8&255,r[2]&255,r[3]>>24&255,r[3]>>16&255,r[3]>>8&255,r[3]&255,r[4]>>24&255,r[4]>>16&255,r[4]>>8&255,r[4]&255]}const Ht=Wt("v5",80,zt);var nt=function(){var t=p(function(S,i,n,l){for(n=n||{},l=S.length;l--;n[S[l]]=i);return n},"o"),e=[6,8,10,20,22,24,26,27,28],r=[1,10],u=[1,11],c=[1,12],_=[1,13],f=[1,14],o=[1,15],h=[1,21],m=[1,22],g=[1,23],k=[1,24],R=[1,25],y=[6,8,10,13,15,18,19,20,22,24,26,27,28,41,42,43,44,45],T=[1,34],D=[27,28,46,47],W=[41,42,43,44,45],U=[17,34],Y=[1,54],A=[1,53],v=[17,34,36,38],O={trace:p(function(){},"trace"),yy:{},symbols_:{error:2,start:3,ER_DIAGRAM:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NEWLINE:10,entityName:11,relSpec:12,":":13,role:14,BLOCK_START:15,attributes:16,BLOCK_STOP:17,SQS:18,SQE:19,title:20,title_value:21,acc_title:22,acc_title_value:23,acc_descr:24,acc_descr_value:25,acc_descr_multiline_value:26,ALPHANUM:27,ENTITY_NAME:28,attribute:29,attributeType:30,attributeName:31,attributeKeyTypeList:32,attributeComment:33,ATTRIBUTE_WORD:34,attributeKeyType:35,COMMA:36,ATTRIBUTE_KEY:37,COMMENT:38,cardinality:39,relType:40,ZERO_OR_ONE:41,ZERO_OR_MORE:42,ONE_OR_MORE:43,ONLY_ONE:44,MD_PARENT:45,NON_IDENTIFYING:46,IDENTIFYING:47,WORD:48,$accept:0,$end:1},terminals_:{2:"error",4:"ER_DIAGRAM",6:"EOF",8:"SPACE",10:"NEWLINE",13:":",15:"BLOCK_START",17:"BLOCK_STOP",18:"SQS",19:"SQE",20:"title",21:"title_value",22:"acc_title",23:"acc_title_value",24:"acc_descr",25:"acc_descr_value",26:"acc_descr_multiline_value",27:"ALPHANUM",28:"ENTITY_NAME",34:"ATTRIBUTE_WORD",36:"COMMA",37:"ATTRIBUTE_KEY",38:"COMMENT",41:"ZERO_OR_ONE",42:"ZERO_OR_MORE",43:"ONE_OR_MORE",44:"ONLY_ONE",45:"MD_PARENT",46:"NON_IDENTIFYING",47:"IDENTIFYING",48:"WORD"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[9,5],[9,4],[9,3],[9,1],[9,7],[9,6],[9,4],[9,2],[9,2],[9,2],[9,1],[11,1],[11,1],[16,1],[16,2],[29,2],[29,3],[29,3],[29,4],[30,1],[31,1],[32,1],[32,3],[35,1],[33,1],[12,3],[39,1],[39,1],[39,1],[39,1],[39,1],[40,1],[40,1],[14,1],[14,1],[14,1]],performAction:p(function(i,n,l,d,E,a,V){var s=a.length-1;switch(E){case 1:break;case 2:this.$=[];break;case 3:a[s-1].push(a[s]),this.$=a[s-1];break;case 4:case 5:this.$=a[s];break;case 6:case 7:this.$=[];break;case 8:d.addEntity(a[s-4]),d.addEntity(a[s-2]),d.addRelationship(a[s-4],a[s],a[s-2],a[s-3]);break;case 9:d.addEntity(a[s-3]),d.addAttributes(a[s-3],a[s-1]);break;case 10:d.addEntity(a[s-2]);break;case 11:d.addEntity(a[s]);break;case 12:d.addEntity(a[s-6],a[s-4]),d.addAttributes(a[s-6],a[s-1]);break;case 13:d.addEntity(a[s-5],a[s-3]);break;case 14:d.addEntity(a[s-3],a[s-1]);break;case 15:case 16:this.$=a[s].trim(),d.setAccTitle(this.$);break;case 17:case 18:this.$=a[s].trim(),d.setAccDescription(this.$);break;case 19:case 43:this.$=a[s];break;case 20:case 41:case 42:this.$=a[s].replace(/"/g,"");break;case 21:case 29:this.$=[a[s]];break;case 22:a[s].push(a[s-1]),this.$=a[s];break;case 23:this.$={attributeType:a[s-1],attributeName:a[s]};break;case 24:this.$={attributeType:a[s-2],attributeName:a[s-1],attributeKeyTypeList:a[s]};break;case 25:this.$={attributeType:a[s-2],attributeName:a[s-1],attributeComment:a[s]};break;case 26:this.$={attributeType:a[s-3],attributeName:a[s-2],attributeKeyTypeList:a[s-1],attributeComment:a[s]};break;case 27:case 28:case 31:this.$=a[s];break;case 30:a[s-2].push(a[s]),this.$=a[s-2];break;case 32:this.$=a[s].replace(/"/g,"");break;case 33:this.$={cardA:a[s],relType:a[s-1],cardB:a[s-2]};break;case 34:this.$=d.Cardinality.ZERO_OR_ONE;break;case 35:this.$=d.Cardinality.ZERO_OR_MORE;break;case 36:this.$=d.Cardinality.ONE_OR_MORE;break;case 37:this.$=d.Cardinality.ONLY_ONE;break;case 38:this.$=d.Cardinality.MD_PARENT;break;case 39:this.$=d.Identification.NON_IDENTIFYING;break;case 40:this.$=d.Identification.IDENTIFYING;break}},"anonymous"),table:[{3:1,4:[1,2]},{1:[3]},t(e,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:9,20:r,22:u,24:c,26:_,27:f,28:o},t(e,[2,7],{1:[2,1]}),t(e,[2,3]),{9:16,11:9,20:r,22:u,24:c,26:_,27:f,28:o},t(e,[2,5]),t(e,[2,6]),t(e,[2,11],{12:17,39:20,15:[1,18],18:[1,19],41:h,42:m,43:g,44:k,45:R}),{21:[1,26]},{23:[1,27]},{25:[1,28]},t(e,[2,18]),t(y,[2,19]),t(y,[2,20]),t(e,[2,4]),{11:29,27:f,28:o},{16:30,17:[1,31],29:32,30:33,34:T},{11:35,27:f,28:o},{40:36,46:[1,37],47:[1,38]},t(D,[2,34]),t(D,[2,35]),t(D,[2,36]),t(D,[2,37]),t(D,[2,38]),t(e,[2,15]),t(e,[2,16]),t(e,[2,17]),{13:[1,39]},{17:[1,40]},t(e,[2,10]),{16:41,17:[2,21],29:32,30:33,34:T},{31:42,34:[1,43]},{34:[2,27]},{19:[1,44]},{39:45,41:h,42:m,43:g,44:k,45:R},t(W,[2,39]),t(W,[2,40]),{14:46,27:[1,49],28:[1,48],48:[1,47]},t(e,[2,9]),{17:[2,22]},t(U,[2,23],{32:50,33:51,35:52,37:Y,38:A}),t([17,34,37,38],[2,28]),t(e,[2,14],{15:[1,55]}),t([27,28],[2,33]),t(e,[2,8]),t(e,[2,41]),t(e,[2,42]),t(e,[2,43]),t(U,[2,24],{33:56,36:[1,57],38:A}),t(U,[2,25]),t(v,[2,29]),t(U,[2,32]),t(v,[2,31]),{16:58,17:[1,59],29:32,30:33,34:T},t(U,[2,26]),{35:60,37:Y},{17:[1,61]},t(e,[2,13]),t(v,[2,30]),t(e,[2,12])],defaultActions:{34:[2,27],41:[2,22]},parseError:p(function(i,n){if(n.recoverable)this.trace(i);else{var l=new Error(i);throw l.hash=n,l}},"parseError"),parse:p(function(i){var n=this,l=[0],d=[],E=[null],a=[],V=this.table,s="",j=0,lt=0,_t=2,ct=1,Et=a.slice.call(arguments,1),N=Object.create(this.lexer),H={yy:{}};for(var $ in this.yy)Object.prototype.hasOwnProperty.call(this.yy,$)&&(H.yy[$]=this.yy[$]);N.setInput(i,H.yy),H.yy.lexer=N,H.yy.parser=this,typeof N.yylloc>"u"&&(N.yylloc={});var tt=N.yylloc;a.push(tt);var mt=N.options&&N.options.ranges;typeof H.yy.parseError=="function"?this.parseError=H.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function gt(I){l.length=l.length-2*I,E.length=E.length-I,a.length=a.length-I}p(gt,"popStack");function ht(){var I;return I=d.pop()||N.lex()||ct,typeof I!="number"&&(I instanceof Array&&(d=I,I=d.pop()),I=n.symbols_[I]||I),I}p(ht,"lex");for(var w,G,B,et,K={},q,Z,dt,J;;){if(G=l[l.length-1],this.defaultActions[G]?B=this.defaultActions[G]:((w===null||typeof w>"u")&&(w=ht()),B=V[G]&&V[G][w]),typeof B>"u"||!B.length||!B[0]){var rt="";J=[];for(q in V[G])this.terminals_[q]&&q>_t&&J.push("'"+this.terminals_[q]+"'");N.showPosition?rt="Parse error on line "+(j+1)+`:
`+N.showPosition()+`
Expecting `+J.join(", ")+", got '"+(this.terminals_[w]||w)+"'":rt="Parse error on line "+(j+1)+": Unexpected "+(w==ct?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(rt,{text:N.match,token:this.terminals_[w]||w,line:N.yylineno,loc:tt,expected:J})}if(B[0]instanceof Array&&B.length>1)throw new Error("Parse Error: multiple actions possible at state: "+G+", token: "+w);switch(B[0]){case 1:l.push(w),E.push(N.yytext),a.push(N.yylloc),l.push(B[1]),w=null,lt=N.yyleng,s=N.yytext,j=N.yylineno,tt=N.yylloc;break;case 2:if(Z=this.productions_[B[1]][1],K.$=E[E.length-Z],K._$={first_line:a[a.length-(Z||1)].first_line,last_line:a[a.length-1].last_line,first_column:a[a.length-(Z||1)].first_column,last_column:a[a.length-1].last_column},mt&&(K._$.range=[a[a.length-(Z||1)].range[0],a[a.length-1].range[1]]),et=this.performAction.apply(K,[s,lt,j,H.yy,B[1],E,a].concat(Et)),typeof et<"u")return et;Z&&(l=l.slice(0,-1*Z*2),E=E.slice(0,-1*Z),a=a.slice(0,-1*Z)),l.push(this.productions_[B[1]][0]),E.push(K.$),a.push(K._$),dt=V[l[l.length-2]][l[l.length-1]],l.push(dt);break;case 3:return!0}}return!0},"parse")},b=function(){var S={EOF:1,parseError:p(function(n,l){if(this.yy.parser)this.yy.parser.parseError(n,l);else throw new Error(n)},"parseError"),setInput:function(i,n){return this.yy=n||this.yy||{},this._input=i,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var i=this._input[0];this.yytext+=i,this.yyleng++,this.offset++,this.match+=i,this.matched+=i;var n=i.match(/(?:\r\n?|\n).*/g);return n?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),i},unput:function(i){var n=i.length,l=i.split(/(?:\r\n?|\n)/g);this._input=i+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-n),this.offset-=n;var d=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),l.length-1&&(this.yylineno-=l.length-1);var E=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:l?(l.length===d.length?this.yylloc.first_column:0)+d[d.length-l.length].length-l[0].length:this.yylloc.first_column-n},this.options.ranges&&(this.yylloc.range=[E[0],E[0]+this.yyleng-n]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(i){this.unput(this.match.slice(i))},pastInput:function(){var i=this.matched.substr(0,this.matched.length-this.match.length);return(i.length>20?"...":"")+i.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var i=this.match;return i.length<20&&(i+=this._input.substr(0,20-i.length)),(i.substr(0,20)+(i.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var i=this.pastInput(),n=new Array(i.length+1).join("-");return i+this.upcomingInput()+`
`+n+"^"},test_match:function(i,n){var l,d,E;if(this.options.backtrack_lexer&&(E={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(E.yylloc.range=this.yylloc.range.slice(0))),d=i[0].match(/(?:\r\n?|\n).*/g),d&&(this.yylineno+=d.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:d?d[d.length-1].length-d[d.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+i[0].length},this.yytext+=i[0],this.match+=i[0],this.matches=i,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(i[0].length),this.matched+=i[0],l=this.performAction.call(this,this.yy,this,n,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),l)return l;if(this._backtrack){for(var a in E)this[a]=E[a];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var i,n,l,d;this._more||(this.yytext="",this.match="");for(var E=this._currentRules(),a=0;a<E.length;a++)if(l=this._input.match(this.rules[E[a]]),l&&(!n||l[0].length>n[0].length)){if(n=l,d=a,this.options.backtrack_lexer){if(i=this.test_match(l,E[a]),i!==!1)return i;if(this._backtrack){n=!1;continue}else return!1}else if(!this.options.flex)break}return n?(i=this.test_match(n,E[d]),i!==!1?i:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:p(function(){var n=this.next();return n||this.lex()},"lex"),begin:p(function(n){this.conditionStack.push(n)},"begin"),popState:p(function(){var n=this.conditionStack.length-1;return n>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:p(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:p(function(n){return n=this.conditionStack.length-1-Math.abs(n||0),n>=0?this.conditionStack[n]:"INITIAL"},"topState"),pushState:p(function(n){this.begin(n)},"pushState"),stateStackSize:p(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:p(function(n,l,d,E){switch(d){case 0:return this.begin("acc_title"),22;case 1:return this.popState(),"acc_title_value";case 2:return this.begin("acc_descr"),24;case 3:return this.popState(),"acc_descr_value";case 4:this.begin("acc_descr_multiline");break;case 5:this.popState();break;case 6:return"acc_descr_multiline_value";case 7:return 10;case 8:break;case 9:return 8;case 10:return 28;case 11:return 48;case 12:return 4;case 13:return this.begin("block"),15;case 14:return 36;case 15:break;case 16:return 37;case 17:return 34;case 18:return 34;case 19:return 38;case 20:break;case 21:return this.popState(),17;case 22:return l.yytext[0];case 23:return 18;case 24:return 19;case 25:return 41;case 26:return 43;case 27:return 43;case 28:return 43;case 29:return 41;case 30:return 41;case 31:return 42;case 32:return 42;case 33:return 42;case 34:return 42;case 35:return 42;case 36:return 43;case 37:return 42;case 38:return 43;case 39:return 44;case 40:return 44;case 41:return 44;case 42:return 44;case 43:return 41;case 44:return 42;case 45:return 43;case 46:return 45;case 47:return 46;case 48:return 47;case 49:return 47;case 50:return 46;case 51:return 46;case 52:return 46;case 53:return 27;case 54:return l.yytext[0];case 55:return 6}},"anonymous"),rules:[/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:[\s]+)/i,/^(?:"[^"%\r\n\v\b\\]+")/i,/^(?:"[^"]*")/i,/^(?:erDiagram\b)/i,/^(?:\{)/i,/^(?:,)/i,/^(?:\s+)/i,/^(?:\b((?:PK)|(?:FK)|(?:UK))\b)/i,/^(?:(.*?)[~](.*?)*[~])/i,/^(?:[\*A-Za-z_][A-Za-z0-9\-_\[\]\(\)]*)/i,/^(?:"[^"]*")/i,/^(?:[\n]+)/i,/^(?:\})/i,/^(?:.)/i,/^(?:\[)/i,/^(?:\])/i,/^(?:one or zero\b)/i,/^(?:one or more\b)/i,/^(?:one or many\b)/i,/^(?:1\+)/i,/^(?:\|o\b)/i,/^(?:zero or one\b)/i,/^(?:zero or more\b)/i,/^(?:zero or many\b)/i,/^(?:0\+)/i,/^(?:\}o\b)/i,/^(?:many\(0\))/i,/^(?:many\(1\))/i,/^(?:many\b)/i,/^(?:\}\|)/i,/^(?:one\b)/i,/^(?:only one\b)/i,/^(?:1\b)/i,/^(?:\|\|)/i,/^(?:o\|)/i,/^(?:o\{)/i,/^(?:\|\{)/i,/^(?:\s*u\b)/i,/^(?:\.\.)/i,/^(?:--)/i,/^(?:to\b)/i,/^(?:optionally to\b)/i,/^(?:\.-)/i,/^(?:-\.)/i,/^(?:[A-Za-z_][A-Za-z0-9\-_]*)/i,/^(?:.)/i,/^(?:$)/i],conditions:{acc_descr_multiline:{rules:[5,6],inclusive:!1},acc_descr:{rules:[3],inclusive:!1},acc_title:{rules:[1],inclusive:!1},block:{rules:[14,15,16,17,18,19,20,21,22],inclusive:!1},INITIAL:{rules:[0,2,4,7,8,9,10,11,12,13,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55],inclusive:!0}}};return S}();O.lexer=b;function L(){this.yy={}}return p(L,"Parser"),L.prototype=O,O.Parser=L,new L}();nt.parser=nt;var Gt=nt,z={},ot=[],Kt={ZERO_OR_ONE:"ZERO_OR_ONE",ZERO_OR_MORE:"ZERO_OR_MORE",ONE_OR_MORE:"ONE_OR_MORE",ONLY_ONE:"ONLY_ONE",MD_PARENT:"MD_PARENT"},Vt={NON_IDENTIFYING:"NON_IDENTIFYING",IDENTIFYING:"IDENTIFYING"},ft=p(function(t,e=void 0){return z[t]===void 0?(z[t]={attributes:[],alias:e},X.info("Added new entity :",t)):z[t]&&!z[t].alias&&e&&(z[t].alias=e,X.info(`Add alias '${e}' to entity '${t}'`)),z[t]},"addEntity"),Xt=p(()=>z,"getEntities"),Qt=p(function(t,e){let r=ft(t),u;for(u=e.length-1;u>=0;u--)r.attributes.push(e[u]),X.debug("Added attribute ",e[u].attributeName)},"addAttributes"),jt=p(function(t,e,r,u){let c={entityA:t,roleA:e,entityB:r,relSpec:u};ot.push(c),X.debug("Added new relationship :",c)},"addRelationship"),qt=p(()=>ot,"getRelationships"),Jt=p(function(){z={},ot=[],Tt()},"clear"),$t={Cardinality:Kt,Identification:Vt,getConfig:()=>F().er,addEntity:ft,addAttributes:Qt,getEntities:Xt,addRelationship:jt,getRelationships:qt,clear:Jt,setAccTitle:kt,getAccTitle:xt,setAccDescription:Rt,getAccDescription:Ot,setDiagramTitle:bt,getDiagramTitle:Nt},C={ONLY_ONE_START:"ONLY_ONE_START",ONLY_ONE_END:"ONLY_ONE_END",ZERO_OR_ONE_START:"ZERO_OR_ONE_START",ZERO_OR_ONE_END:"ZERO_OR_ONE_END",ONE_OR_MORE_START:"ONE_OR_MORE_START",ONE_OR_MORE_END:"ONE_OR_MORE_END",ZERO_OR_MORE_START:"ZERO_OR_MORE_START",ZERO_OR_MORE_END:"ZERO_OR_MORE_END",MD_PARENT_END:"MD_PARENT_END",MD_PARENT_START:"MD_PARENT_START"},te=p(function(t,e){let r;t.append("defs").append("marker").attr("id",C.MD_PARENT_START).attr("refX",0).attr("refY",7).attr("markerWidth",190).attr("markerHeight",240).attr("orient","auto").append("path").attr("d","M 18,7 L9,13 L1,7 L9,1 Z"),t.append("defs").append("marker").attr("id",C.MD_PARENT_END).attr("refX",19).attr("refY",7).attr("markerWidth",20).attr("markerHeight",28).attr("orient","auto").append("path").attr("d","M 18,7 L9,13 L1,7 L9,1 Z"),t.append("defs").append("marker").attr("id",C.ONLY_ONE_START).attr("refX",0).attr("refY",9).attr("markerWidth",18).attr("markerHeight",18).attr("orient","auto").append("path").attr("stroke",e.stroke).attr("fill","none").attr("d","M9,0 L9,18 M15,0 L15,18"),t.append("defs").append("marker").attr("id",C.ONLY_ONE_END).attr("refX",18).attr("refY",9).attr("markerWidth",18).attr("markerHeight",18).attr("orient","auto").append("path").attr("stroke",e.stroke).attr("fill","none").attr("d","M3,0 L3,18 M9,0 L9,18"),r=t.append("defs").append("marker").attr("id",C.ZERO_OR_ONE_START).attr("refX",0).attr("refY",9).attr("markerWidth",30).attr("markerHeight",18).attr("orient","auto"),r.append("circle").attr("stroke",e.stroke).attr("fill","white").attr("cx",21).attr("cy",9).attr("r",6),r.append("path").attr("stroke",e.stroke).attr("fill","none").attr("d","M9,0 L9,18"),r=t.append("defs").append("marker").attr("id",C.ZERO_OR_ONE_END).attr("refX",30).attr("refY",9).attr("markerWidth",30).attr("markerHeight",18).attr("orient","auto"),r.append("circle").attr("stroke",e.stroke).attr("fill","white").attr("cx",9).attr("cy",9).attr("r",6),r.append("path").attr("stroke",e.stroke).attr("fill","none").attr("d","M21,0 L21,18"),t.append("defs").append("marker").attr("id",C.ONE_OR_MORE_START).attr("refX",18).attr("refY",18).attr("markerWidth",45).attr("markerHeight",36).attr("orient","auto").append("path").attr("stroke",e.stroke).attr("fill","none").attr("d","M0,18 Q 18,0 36,18 Q 18,36 0,18 M42,9 L42,27"),t.append("defs").append("marker").attr("id",C.ONE_OR_MORE_END).attr("refX",27).attr("refY",18).attr("markerWidth",45).attr("markerHeight",36).attr("orient","auto").append("path").attr("stroke",e.stroke).attr("fill","none").attr("d","M3,9 L3,27 M9,18 Q27,0 45,18 Q27,36 9,18"),r=t.append("defs").append("marker").attr("id",C.ZERO_OR_MORE_START).attr("refX",18).attr("refY",18).attr("markerWidth",57).attr("markerHeight",36).attr("orient","auto"),r.append("circle").attr("stroke",e.stroke).attr("fill","white").attr("cx",48).attr("cy",18).attr("r",6),r.append("path").attr("stroke",e.stroke).attr("fill","none").attr("d","M0,18 Q18,0 36,18 Q18,36 0,18"),r=t.append("defs").append("marker").attr("id",C.ZERO_OR_MORE_END).attr("refX",39).attr("refY",18).attr("markerWidth",57).attr("markerHeight",36).attr("orient","auto"),r.append("circle").attr("stroke",e.stroke).attr("fill","white").attr("cx",9).attr("cy",18).attr("r",6),r.append("path").attr("stroke",e.stroke).attr("fill","none").attr("d","M21,18 Q39,0 57,18 Q39,36 21,18")},"insertMarkers"),P={ERMarkers:C,insertMarkers:te},ee=/[^\dA-Za-z](\W)*/g,x={},Q=new Map,re=p(function(t){const e=Object.keys(t);for(const r of e)x[r]=t[r]},"setConf"),ae=p((t,e,r)=>{const u=x.entityPadding/3,c=x.entityPadding/3,_=x.fontSize*.85,f=e.node().getBBox(),o=[];let h=!1,m=!1,g=0,k=0,R=0,y=0,T=f.height+u*2,D=1;r.forEach(A=>{A.attributeKeyTypeList!==void 0&&A.attributeKeyTypeList.length>0&&(h=!0),A.attributeComment!==void 0&&(m=!0)}),r.forEach(A=>{const v=`${e.node().id}-attr-${D}`;let O=0;const b=St(A.attributeType),L=t.append("text").classed("er entityLabel",!0).attr("id",`${v}-type`).attr("x",0).attr("y",0).style("dominant-baseline","middle").style("text-anchor","left").style("font-family",F().fontFamily).style("font-size",_+"px").text(b),S=t.append("text").classed("er entityLabel",!0).attr("id",`${v}-name`).attr("x",0).attr("y",0).style("dominant-baseline","middle").style("text-anchor","left").style("font-family",F().fontFamily).style("font-size",_+"px").text(A.attributeName),i={};i.tn=L,i.nn=S;const n=L.node().getBBox(),l=S.node().getBBox();if(g=Math.max(g,n.width),k=Math.max(k,l.width),O=Math.max(n.height,l.height),h){const d=A.attributeKeyTypeList!==void 0?A.attributeKeyTypeList.join(","):"",E=t.append("text").classed("er entityLabel",!0).attr("id",`${v}-key`).attr("x",0).attr("y",0).style("dominant-baseline","middle").style("text-anchor","left").style("font-family",F().fontFamily).style("font-size",_+"px").text(d);i.kn=E;const a=E.node().getBBox();R=Math.max(R,a.width),O=Math.max(O,a.height)}if(m){const d=t.append("text").classed("er entityLabel",!0).attr("id",`${v}-comment`).attr("x",0).attr("y",0).style("dominant-baseline","middle").style("text-anchor","left").style("font-family",F().fontFamily).style("font-size",_+"px").text(A.attributeComment||"");i.cn=d;const E=d.node().getBBox();y=Math.max(y,E.width),O=Math.max(O,E.height)}i.height=O,o.push(i),T+=O+u*2,D+=1});let W=4;h&&(W+=2),m&&(W+=2);const U=g+k+R+y,Y={width:Math.max(x.minEntityWidth,Math.max(f.width+x.entityPadding*2,U+c*W)),height:r.length>0?T:Math.max(x.minEntityHeight,f.height+x.entityPadding*2)};if(r.length>0){const A=Math.max(0,(Y.width-U-c*W)/(W/2));e.attr("transform","translate("+Y.width/2+","+(u+f.height/2)+")");let v=f.height+u*2,O="attributeBoxOdd";o.forEach(b=>{const L=v+u+b.height/2;b.tn.attr("transform","translate("+c+","+L+")");const S=t.insert("rect","#"+b.tn.node().id).classed(`er ${O}`,!0).attr("x",0).attr("y",v).attr("width",g+c*2+A).attr("height",b.height+u*2),i=parseFloat(S.attr("x"))+parseFloat(S.attr("width"));b.nn.attr("transform","translate("+(i+c)+","+L+")");const n=t.insert("rect","#"+b.nn.node().id).classed(`er ${O}`,!0).attr("x",i).attr("y",v).attr("width",k+c*2+A).attr("height",b.height+u*2);let l=parseFloat(n.attr("x"))+parseFloat(n.attr("width"));if(h){b.kn.attr("transform","translate("+(l+c)+","+L+")");const d=t.insert("rect","#"+b.kn.node().id).classed(`er ${O}`,!0).attr("x",l).attr("y",v).attr("width",R+c*2+A).attr("height",b.height+u*2);l=parseFloat(d.attr("x"))+parseFloat(d.attr("width"))}m&&(b.cn.attr("transform","translate("+(l+c)+","+L+")"),t.insert("rect","#"+b.cn.node().id).classed(`er ${O}`,"true").attr("x",l).attr("y",v).attr("width",y+c*2+A).attr("height",b.height+u*2)),v+=b.height+u*2,O=O==="attributeBoxOdd"?"attributeBoxEven":"attributeBoxOdd"})}else Y.height=Math.max(x.minEntityHeight,T),e.attr("transform","translate("+Y.width/2+","+Y.height/2+")");return Y},"drawAttributes"),ie=p(function(t,e,r){const u=Object.keys(e);let c;return u.forEach(function(_){const f=pt(_,"entity");Q.set(_,f);const o=t.append("g").attr("id",f);c=c===void 0?f:c;const h="text-"+f,m=o.append("text").classed("er entityLabel",!0).attr("id",h).attr("x",0).attr("y",0).style("dominant-baseline","middle").style("text-anchor","middle").style("font-family",F().fontFamily).style("font-size",x.fontSize+"px").text(e[_].alias??_),{width:g,height:k}=ae(o,m,e[_].attributes),y=o.insert("rect","#"+h).classed("er entityBox",!0).attr("x",0).attr("y",0).attr("width",g).attr("height",k).node().getBBox();r.setNode(f,{width:y.width,height:y.height,shape:"rect",id:f})}),c},"drawEntities"),ne=p(function(t,e){e.nodes().forEach(function(r){r!==void 0&&e.node(r)!==void 0&&t.select("#"+r).attr("transform","translate("+(e.node(r).x-e.node(r).width/2)+","+(e.node(r).y-e.node(r).height/2)+" )")})},"adjustEntities"),yt=p(function(t){return(t.entityA+t.roleA+t.entityB).replace(/\s/g,"")},"getEdgeName"),se=p(function(t,e){return t.forEach(function(r){e.setEdge(Q.get(r.entityA),Q.get(r.entityB),{relationship:r},yt(r))}),t},"addRelationships"),ut=0,oe=p(function(t,e,r,u,c){ut++;const _=r.edge(Q.get(e.entityA),Q.get(e.entityB),yt(e)),f=Dt().x(function(T){return T.x}).y(function(T){return T.y}).curve(vt),o=t.insert("path","#"+u).classed("er relationshipLine",!0).attr("d",f(_.points)).style("stroke",x.stroke).style("fill","none");e.relSpec.relType===c.db.Identification.NON_IDENTIFYING&&o.attr("stroke-dasharray","8,8");let h="";switch(x.arrowMarkerAbsolute&&(h=window.location.protocol+"//"+window.location.host+window.location.pathname+window.location.search,h=h.replace(/\(/g,"\\("),h=h.replace(/\)/g,"\\)")),e.relSpec.cardA){case c.db.Cardinality.ZERO_OR_ONE:o.attr("marker-end","url("+h+"#"+P.ERMarkers.ZERO_OR_ONE_END+")");break;case c.db.Cardinality.ZERO_OR_MORE:o.attr("marker-end","url("+h+"#"+P.ERMarkers.ZERO_OR_MORE_END+")");break;case c.db.Cardinality.ONE_OR_MORE:o.attr("marker-end","url("+h+"#"+P.ERMarkers.ONE_OR_MORE_END+")");break;case c.db.Cardinality.ONLY_ONE:o.attr("marker-end","url("+h+"#"+P.ERMarkers.ONLY_ONE_END+")");break;case c.db.Cardinality.MD_PARENT:o.attr("marker-end","url("+h+"#"+P.ERMarkers.MD_PARENT_END+")");break}switch(e.relSpec.cardB){case c.db.Cardinality.ZERO_OR_ONE:o.attr("marker-start","url("+h+"#"+P.ERMarkers.ZERO_OR_ONE_START+")");break;case c.db.Cardinality.ZERO_OR_MORE:o.attr("marker-start","url("+h+"#"+P.ERMarkers.ZERO_OR_MORE_START+")");break;case c.db.Cardinality.ONE_OR_MORE:o.attr("marker-start","url("+h+"#"+P.ERMarkers.ONE_OR_MORE_START+")");break;case c.db.Cardinality.ONLY_ONE:o.attr("marker-start","url("+h+"#"+P.ERMarkers.ONLY_ONE_START+")");break;case c.db.Cardinality.MD_PARENT:o.attr("marker-start","url("+h+"#"+P.ERMarkers.MD_PARENT_START+")");break}const m=o.node().getTotalLength(),g=o.node().getPointAtLength(m*.5),k="rel"+ut,y=t.append("text").classed("er relationshipLabel",!0).attr("id",k).attr("x",g.x).attr("y",g.y).style("text-anchor","middle").style("dominant-baseline","middle").style("font-family",F().fontFamily).style("font-size",x.fontSize+"px").text(e.roleA).node().getBBox();t.insert("rect","#"+k).classed("er relationshipLabelBox",!0).attr("x",g.x-y.width/2).attr("y",g.y-y.height/2).attr("width",y.width).attr("height",y.height)},"drawRelationshipFromLayout"),le=p(function(t,e,r,u){x=F().er,X.info("Drawing ER diagram");const c=F().securityLevel;let _;c==="sandbox"&&(_=at("#i"+e));const o=(c==="sandbox"?at(_.nodes()[0].contentDocument.body):at("body")).select(`[id='${e}']`);P.insertMarkers(o,x);let h;h=new wt({multigraph:!0,directed:!0,compound:!1}).setGraph({rankdir:x.layoutDirection,marginx:20,marginy:20,nodesep:100,edgesep:100,ranksep:100}).setDefaultEdgeLabel(function(){return{}});const m=ie(o,u.db.getEntities(),h),g=se(u.db.getRelationships(),h);It(h),ne(o,h),g.forEach(function(D){oe(o,D,h,m,u)});const k=x.diagramPadding;At.insertTitle(o,"entityTitleText",x.titleTopMargin,u.db.getDiagramTitle());const R=o.node().getBBox(),y=R.width+k*2,T=R.height+k*2;Mt(o,T,y,x.useMaxWidth),o.attr("viewBox",`${R.x-k} ${R.y-k} ${y} ${T}`)},"draw"),ce="28e9f9db-3c8d-5aa5-9faf-44286ae5937c";function pt(t="",e=""){const r=t.replace(ee,"");return`${st(e)}${st(r)}${Ht(t,ce)}`}p(pt,"generateId");function st(t=""){return t.length>0?`${t}-`:""}p(st,"strWithHyphen");var he={setConf:re,draw:le},de=p(t=>`
  .entityBox {
    fill: ${t.mainBkg};
    stroke: ${t.nodeBorder};
  }

  .attributeBoxOdd {
    fill: ${t.attributeBackgroundColorOdd};
    stroke: ${t.nodeBorder};
  }

  .attributeBoxEven {
    fill:  ${t.attributeBackgroundColorEven};
    stroke: ${t.nodeBorder};
  }

  .relationshipLabelBox {
    fill: ${t.tertiaryColor};
    opacity: 0.7;
    background-color: ${t.tertiaryColor};
      rect {
        opacity: 0.5;
      }
  }

    .relationshipLine {
      stroke: ${t.lineColor};
    }

  .entityTitleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${t.textColor};
  }    
  #MD_PARENT_START {
    fill: #f5f5f5 !important;
    stroke: ${t.lineColor} !important;
    stroke-width: 1;
  }
  #MD_PARENT_END {
    fill: #f5f5f5 !important;
    stroke: ${t.lineColor} !important;
    stroke-width: 1;
  }
  
`,"getStyles"),ue=de,Oe={parser:Gt,db:$t,renderer:he,styles:ue};export{Oe as diagram};
