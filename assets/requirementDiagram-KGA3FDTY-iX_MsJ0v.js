import{_ as l,d as ve,s as Me,g as De,c as Pe,b as Ye,l as xe,B as Ue,j as Be,e as Te}from"./mermaid.core-CE49DK09.js";import{d as ce}from"./transform-Dgtl54Jv.js";import{G as Qe}from"./graph-BDymcfIa.js";import{l as He}from"./layout-Dx_QUwFc.js";import{l as We}from"./line-CpA_g4Gi.js";import"./app-C4616Opf.js";import"./commonjsHelpers-Cpj98o6Y.js";import"./array-DEnAxiAM.js";import"./path-CbwjOpE9.js";import"./point-DWREGWZc.js";var he=function(){var e=l(function($,i,s,a){for(s=s||{},a=$.length;a--;s[$[a]]=i);return s},"o"),t=[1,3],c=[1,4],h=[1,5],d=[1,6],p=[5,6,8,9,11,13,31,32,33,34,35,36,44,62,63],y=[1,18],u=[2,7],o=[1,22],g=[1,23],R=[1,24],I=[1,25],b=[1,26],w=[1,27],q=[1,20],v=[1,28],A=[1,29],M=[62,63],pe=[5,8,9,11,13,31,32,33,34,35,36,44,51,53,62,63],fe=[1,47],ye=[1,48],_e=[1,49],ge=[1,50],Ee=[1,51],Re=[1,52],me=[1,53],O=[53,54],D=[1,64],P=[1,60],Y=[1,61],U=[1,62],B=[1,63],Q=[1,65],z=[1,69],X=[1,70],J=[1,67],Z=[1,68],S=[5,8,9,11,13,31,32,33,34,35,36,44,62,63],ne={trace:l(function(){},"trace"),yy:{},symbols_:{error:2,start:3,directive:4,NEWLINE:5,RD:6,diagram:7,EOF:8,acc_title:9,acc_title_value:10,acc_descr:11,acc_descr_value:12,acc_descr_multiline_value:13,requirementDef:14,elementDef:15,relationshipDef:16,requirementType:17,requirementName:18,STRUCT_START:19,requirementBody:20,ID:21,COLONSEP:22,id:23,TEXT:24,text:25,RISK:26,riskLevel:27,VERIFYMTHD:28,verifyType:29,STRUCT_STOP:30,REQUIREMENT:31,FUNCTIONAL_REQUIREMENT:32,INTERFACE_REQUIREMENT:33,PERFORMANCE_REQUIREMENT:34,PHYSICAL_REQUIREMENT:35,DESIGN_CONSTRAINT:36,LOW_RISK:37,MED_RISK:38,HIGH_RISK:39,VERIFY_ANALYSIS:40,VERIFY_DEMONSTRATION:41,VERIFY_INSPECTION:42,VERIFY_TEST:43,ELEMENT:44,elementName:45,elementBody:46,TYPE:47,type:48,DOCREF:49,ref:50,END_ARROW_L:51,relationship:52,LINE:53,END_ARROW_R:54,CONTAINS:55,COPIES:56,DERIVES:57,SATISFIES:58,VERIFIES:59,REFINES:60,TRACES:61,unqString:62,qString:63,$accept:0,$end:1},terminals_:{2:"error",5:"NEWLINE",6:"RD",8:"EOF",9:"acc_title",10:"acc_title_value",11:"acc_descr",12:"acc_descr_value",13:"acc_descr_multiline_value",19:"STRUCT_START",21:"ID",22:"COLONSEP",24:"TEXT",26:"RISK",28:"VERIFYMTHD",30:"STRUCT_STOP",31:"REQUIREMENT",32:"FUNCTIONAL_REQUIREMENT",33:"INTERFACE_REQUIREMENT",34:"PERFORMANCE_REQUIREMENT",35:"PHYSICAL_REQUIREMENT",36:"DESIGN_CONSTRAINT",37:"LOW_RISK",38:"MED_RISK",39:"HIGH_RISK",40:"VERIFY_ANALYSIS",41:"VERIFY_DEMONSTRATION",42:"VERIFY_INSPECTION",43:"VERIFY_TEST",44:"ELEMENT",47:"TYPE",49:"DOCREF",51:"END_ARROW_L",53:"LINE",54:"END_ARROW_R",55:"CONTAINS",56:"COPIES",57:"DERIVES",58:"SATISFIES",59:"VERIFIES",60:"REFINES",61:"TRACES",62:"unqString",63:"qString"},productions_:[0,[3,3],[3,2],[3,4],[4,2],[4,2],[4,1],[7,0],[7,2],[7,2],[7,2],[7,2],[7,2],[14,5],[20,5],[20,5],[20,5],[20,5],[20,2],[20,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[27,1],[27,1],[27,1],[29,1],[29,1],[29,1],[29,1],[15,5],[46,5],[46,5],[46,2],[46,1],[16,5],[16,5],[52,1],[52,1],[52,1],[52,1],[52,1],[52,1],[52,1],[18,1],[18,1],[23,1],[23,1],[25,1],[25,1],[45,1],[45,1],[48,1],[48,1],[50,1],[50,1]],performAction:l(function(i,s,a,r,f,n,K){var E=n.length-1;switch(f){case 4:this.$=n[E].trim(),r.setAccTitle(this.$);break;case 5:case 6:this.$=n[E].trim(),r.setAccDescription(this.$);break;case 7:this.$=[];break;case 13:r.addRequirement(n[E-3],n[E-4]);break;case 14:r.setNewReqId(n[E-2]);break;case 15:r.setNewReqText(n[E-2]);break;case 16:r.setNewReqRisk(n[E-2]);break;case 17:r.setNewReqVerifyMethod(n[E-2]);break;case 20:this.$=r.RequirementType.REQUIREMENT;break;case 21:this.$=r.RequirementType.FUNCTIONAL_REQUIREMENT;break;case 22:this.$=r.RequirementType.INTERFACE_REQUIREMENT;break;case 23:this.$=r.RequirementType.PERFORMANCE_REQUIREMENT;break;case 24:this.$=r.RequirementType.PHYSICAL_REQUIREMENT;break;case 25:this.$=r.RequirementType.DESIGN_CONSTRAINT;break;case 26:this.$=r.RiskLevel.LOW_RISK;break;case 27:this.$=r.RiskLevel.MED_RISK;break;case 28:this.$=r.RiskLevel.HIGH_RISK;break;case 29:this.$=r.VerifyType.VERIFY_ANALYSIS;break;case 30:this.$=r.VerifyType.VERIFY_DEMONSTRATION;break;case 31:this.$=r.VerifyType.VERIFY_INSPECTION;break;case 32:this.$=r.VerifyType.VERIFY_TEST;break;case 33:r.addElement(n[E-3]);break;case 34:r.setNewElementType(n[E-2]);break;case 35:r.setNewElementDocRef(n[E-2]);break;case 38:r.addRelationship(n[E-2],n[E],n[E-4]);break;case 39:r.addRelationship(n[E-2],n[E-4],n[E]);break;case 40:this.$=r.Relationships.CONTAINS;break;case 41:this.$=r.Relationships.COPIES;break;case 42:this.$=r.Relationships.DERIVES;break;case 43:this.$=r.Relationships.SATISFIES;break;case 44:this.$=r.Relationships.VERIFIES;break;case 45:this.$=r.Relationships.REFINES;break;case 46:this.$=r.Relationships.TRACES;break}},"anonymous"),table:[{3:1,4:2,6:t,9:c,11:h,13:d},{1:[3]},{3:8,4:2,5:[1,7],6:t,9:c,11:h,13:d},{5:[1,9]},{10:[1,10]},{12:[1,11]},e(p,[2,6]),{3:12,4:2,6:t,9:c,11:h,13:d},{1:[2,2]},{4:17,5:y,7:13,8:u,9:c,11:h,13:d,14:14,15:15,16:16,17:19,23:21,31:o,32:g,33:R,34:I,35:b,36:w,44:q,62:v,63:A},e(p,[2,4]),e(p,[2,5]),{1:[2,1]},{8:[1,30]},{4:17,5:y,7:31,8:u,9:c,11:h,13:d,14:14,15:15,16:16,17:19,23:21,31:o,32:g,33:R,34:I,35:b,36:w,44:q,62:v,63:A},{4:17,5:y,7:32,8:u,9:c,11:h,13:d,14:14,15:15,16:16,17:19,23:21,31:o,32:g,33:R,34:I,35:b,36:w,44:q,62:v,63:A},{4:17,5:y,7:33,8:u,9:c,11:h,13:d,14:14,15:15,16:16,17:19,23:21,31:o,32:g,33:R,34:I,35:b,36:w,44:q,62:v,63:A},{4:17,5:y,7:34,8:u,9:c,11:h,13:d,14:14,15:15,16:16,17:19,23:21,31:o,32:g,33:R,34:I,35:b,36:w,44:q,62:v,63:A},{4:17,5:y,7:35,8:u,9:c,11:h,13:d,14:14,15:15,16:16,17:19,23:21,31:o,32:g,33:R,34:I,35:b,36:w,44:q,62:v,63:A},{18:36,62:[1,37],63:[1,38]},{45:39,62:[1,40],63:[1,41]},{51:[1,42],53:[1,43]},e(M,[2,20]),e(M,[2,21]),e(M,[2,22]),e(M,[2,23]),e(M,[2,24]),e(M,[2,25]),e(pe,[2,49]),e(pe,[2,50]),{1:[2,3]},{8:[2,8]},{8:[2,9]},{8:[2,10]},{8:[2,11]},{8:[2,12]},{19:[1,44]},{19:[2,47]},{19:[2,48]},{19:[1,45]},{19:[2,53]},{19:[2,54]},{52:46,55:fe,56:ye,57:_e,58:ge,59:Ee,60:Re,61:me},{52:54,55:fe,56:ye,57:_e,58:ge,59:Ee,60:Re,61:me},{5:[1,55]},{5:[1,56]},{53:[1,57]},e(O,[2,40]),e(O,[2,41]),e(O,[2,42]),e(O,[2,43]),e(O,[2,44]),e(O,[2,45]),e(O,[2,46]),{54:[1,58]},{5:D,20:59,21:P,24:Y,26:U,28:B,30:Q},{5:z,30:X,46:66,47:J,49:Z},{23:71,62:v,63:A},{23:72,62:v,63:A},e(S,[2,13]),{22:[1,73]},{22:[1,74]},{22:[1,75]},{22:[1,76]},{5:D,20:77,21:P,24:Y,26:U,28:B,30:Q},e(S,[2,19]),e(S,[2,33]),{22:[1,78]},{22:[1,79]},{5:z,30:X,46:80,47:J,49:Z},e(S,[2,37]),e(S,[2,38]),e(S,[2,39]),{23:81,62:v,63:A},{25:82,62:[1,83],63:[1,84]},{27:85,37:[1,86],38:[1,87],39:[1,88]},{29:89,40:[1,90],41:[1,91],42:[1,92],43:[1,93]},e(S,[2,18]),{48:94,62:[1,95],63:[1,96]},{50:97,62:[1,98],63:[1,99]},e(S,[2,36]),{5:[1,100]},{5:[1,101]},{5:[2,51]},{5:[2,52]},{5:[1,102]},{5:[2,26]},{5:[2,27]},{5:[2,28]},{5:[1,103]},{5:[2,29]},{5:[2,30]},{5:[2,31]},{5:[2,32]},{5:[1,104]},{5:[2,55]},{5:[2,56]},{5:[1,105]},{5:[2,57]},{5:[2,58]},{5:D,20:106,21:P,24:Y,26:U,28:B,30:Q},{5:D,20:107,21:P,24:Y,26:U,28:B,30:Q},{5:D,20:108,21:P,24:Y,26:U,28:B,30:Q},{5:D,20:109,21:P,24:Y,26:U,28:B,30:Q},{5:z,30:X,46:110,47:J,49:Z},{5:z,30:X,46:111,47:J,49:Z},e(S,[2,14]),e(S,[2,15]),e(S,[2,16]),e(S,[2,17]),e(S,[2,34]),e(S,[2,35])],defaultActions:{8:[2,2],12:[2,1],30:[2,3],31:[2,8],32:[2,9],33:[2,10],34:[2,11],35:[2,12],37:[2,47],38:[2,48],40:[2,53],41:[2,54],83:[2,51],84:[2,52],86:[2,26],87:[2,27],88:[2,28],90:[2,29],91:[2,30],92:[2,31],93:[2,32],95:[2,55],96:[2,56],98:[2,57],99:[2,58]},parseError:l(function(i,s){if(s.recoverable)this.trace(i);else{var a=new Error(i);throw a.hash=s,a}},"parseError"),parse:l(function(i){var s=this,a=[0],r=[],f=[null],n=[],K=this.table,E="",te=0,Ie=0,Le=2,be=1,Oe=n.slice.call(arguments,1),m=Object.create(this.lexer),C={yy:{}};for(var se in this.yy)Object.prototype.hasOwnProperty.call(this.yy,se)&&(C.yy[se]=this.yy[se]);m.setInput(i,C.yy),C.yy.lexer=m,C.yy.parser=this,typeof m.yylloc>"u"&&(m.yylloc={});var ae=m.yylloc;n.push(ae);var Ce=m.options&&m.options.ranges;typeof C.yy.parseError=="function"?this.parseError=C.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function Fe(N){a.length=a.length-2*N,f.length=f.length-N,n.length=n.length-N}l(Fe,"popStack");function Se(){var N;return N=r.pop()||m.lex()||be,typeof N!="number"&&(N instanceof Array&&(r=N,N=r.pop()),N=s.symbols_[N]||N),N}l(Se,"lex");for(var k,F,x,le,H={},ie,V,ke,re;;){if(F=a[a.length-1],this.defaultActions[F]?x=this.defaultActions[F]:((k===null||typeof k>"u")&&(k=Se()),x=K[F]&&K[F][k]),typeof x>"u"||!x.length||!x[0]){var oe="";re=[];for(ie in K[F])this.terminals_[ie]&&ie>Le&&re.push("'"+this.terminals_[ie]+"'");m.showPosition?oe="Parse error on line "+(te+1)+`:
`+m.showPosition()+`
Expecting `+re.join(", ")+", got '"+(this.terminals_[k]||k)+"'":oe="Parse error on line "+(te+1)+": Unexpected "+(k==be?"end of input":"'"+(this.terminals_[k]||k)+"'"),this.parseError(oe,{text:m.match,token:this.terminals_[k]||k,line:m.yylineno,loc:ae,expected:re})}if(x[0]instanceof Array&&x.length>1)throw new Error("Parse Error: multiple actions possible at state: "+F+", token: "+k);switch(x[0]){case 1:a.push(k),f.push(m.yytext),n.push(m.yylloc),a.push(x[1]),k=null,Ie=m.yyleng,E=m.yytext,te=m.yylineno,ae=m.yylloc;break;case 2:if(V=this.productions_[x[1]][1],H.$=f[f.length-V],H._$={first_line:n[n.length-(V||1)].first_line,last_line:n[n.length-1].last_line,first_column:n[n.length-(V||1)].first_column,last_column:n[n.length-1].last_column},Ce&&(H._$.range=[n[n.length-(V||1)].range[0],n[n.length-1].range[1]]),le=this.performAction.apply(H,[E,Ie,te,C.yy,x[1],f,n].concat(Oe)),typeof le<"u")return le;V&&(a=a.slice(0,-1*V*2),f=f.slice(0,-1*V),n=n.slice(0,-1*V)),a.push(this.productions_[x[1]][0]),f.push(H.$),n.push(H._$),ke=K[a[a.length-2]][a[a.length-1]],a.push(ke);break;case 3:return!0}}return!0},"parse")},$e=function(){var $={EOF:1,parseError:l(function(s,a){if(this.yy.parser)this.yy.parser.parseError(s,a);else throw new Error(s)},"parseError"),setInput:function(i,s){return this.yy=s||this.yy||{},this._input=i,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var i=this._input[0];this.yytext+=i,this.yyleng++,this.offset++,this.match+=i,this.matched+=i;var s=i.match(/(?:\r\n?|\n).*/g);return s?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),i},unput:function(i){var s=i.length,a=i.split(/(?:\r\n?|\n)/g);this._input=i+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-s),this.offset-=s;var r=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),a.length-1&&(this.yylineno-=a.length-1);var f=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:a?(a.length===r.length?this.yylloc.first_column:0)+r[r.length-a.length].length-a[0].length:this.yylloc.first_column-s},this.options.ranges&&(this.yylloc.range=[f[0],f[0]+this.yyleng-s]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(i){this.unput(this.match.slice(i))},pastInput:function(){var i=this.matched.substr(0,this.matched.length-this.match.length);return(i.length>20?"...":"")+i.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var i=this.match;return i.length<20&&(i+=this._input.substr(0,20-i.length)),(i.substr(0,20)+(i.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var i=this.pastInput(),s=new Array(i.length+1).join("-");return i+this.upcomingInput()+`
`+s+"^"},test_match:function(i,s){var a,r,f;if(this.options.backtrack_lexer&&(f={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(f.yylloc.range=this.yylloc.range.slice(0))),r=i[0].match(/(?:\r\n?|\n).*/g),r&&(this.yylineno+=r.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:r?r[r.length-1].length-r[r.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+i[0].length},this.yytext+=i[0],this.match+=i[0],this.matches=i,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(i[0].length),this.matched+=i[0],a=this.performAction.call(this,this.yy,this,s,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),a)return a;if(this._backtrack){for(var n in f)this[n]=f[n];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var i,s,a,r;this._more||(this.yytext="",this.match="");for(var f=this._currentRules(),n=0;n<f.length;n++)if(a=this._input.match(this.rules[f[n]]),a&&(!s||a[0].length>s[0].length)){if(s=a,r=n,this.options.backtrack_lexer){if(i=this.test_match(a,f[n]),i!==!1)return i;if(this._backtrack){s=!1;continue}else return!1}else if(!this.options.flex)break}return s?(i=this.test_match(s,f[r]),i!==!1?i:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:l(function(){var s=this.next();return s||this.lex()},"lex"),begin:l(function(s){this.conditionStack.push(s)},"begin"),popState:l(function(){var s=this.conditionStack.length-1;return s>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:l(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:l(function(s){return s=this.conditionStack.length-1-Math.abs(s||0),s>=0?this.conditionStack[s]:"INITIAL"},"topState"),pushState:l(function(s){this.begin(s)},"pushState"),stateStackSize:l(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:l(function(s,a,r,f){switch(r){case 0:return"title";case 1:return this.begin("acc_title"),9;case 2:return this.popState(),"acc_title_value";case 3:return this.begin("acc_descr"),11;case 4:return this.popState(),"acc_descr_value";case 5:this.begin("acc_descr_multiline");break;case 6:this.popState();break;case 7:return"acc_descr_multiline_value";case 8:return 5;case 9:break;case 10:break;case 11:break;case 12:return 8;case 13:return 6;case 14:return 19;case 15:return 30;case 16:return 22;case 17:return 21;case 18:return 24;case 19:return 26;case 20:return 28;case 21:return 31;case 22:return 32;case 23:return 33;case 24:return 34;case 25:return 35;case 26:return 36;case 27:return 37;case 28:return 38;case 29:return 39;case 30:return 40;case 31:return 41;case 32:return 42;case 33:return 43;case 34:return 44;case 35:return 55;case 36:return 56;case 37:return 57;case 38:return 58;case 39:return 59;case 40:return 60;case 41:return 61;case 42:return 47;case 43:return 49;case 44:return 51;case 45:return 54;case 46:return 53;case 47:this.begin("string");break;case 48:this.popState();break;case 49:return"qString";case 50:return a.yytext=a.yytext.trim(),62}},"anonymous"),rules:[/^(?:title\s[^#\n;]+)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:(\r?\n)+)/i,/^(?:\s+)/i,/^(?:#[^\n]*)/i,/^(?:%[^\n]*)/i,/^(?:$)/i,/^(?:requirementDiagram\b)/i,/^(?:\{)/i,/^(?:\})/i,/^(?::)/i,/^(?:id\b)/i,/^(?:text\b)/i,/^(?:risk\b)/i,/^(?:verifyMethod\b)/i,/^(?:requirement\b)/i,/^(?:functionalRequirement\b)/i,/^(?:interfaceRequirement\b)/i,/^(?:performanceRequirement\b)/i,/^(?:physicalRequirement\b)/i,/^(?:designConstraint\b)/i,/^(?:low\b)/i,/^(?:medium\b)/i,/^(?:high\b)/i,/^(?:analysis\b)/i,/^(?:demonstration\b)/i,/^(?:inspection\b)/i,/^(?:test\b)/i,/^(?:element\b)/i,/^(?:contains\b)/i,/^(?:copies\b)/i,/^(?:derives\b)/i,/^(?:satisfies\b)/i,/^(?:verifies\b)/i,/^(?:refines\b)/i,/^(?:traces\b)/i,/^(?:type\b)/i,/^(?:docref\b)/i,/^(?:<-)/i,/^(?:->)/i,/^(?:-)/i,/^(?:["])/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[\w][^\r\n\{\<\>\-\=]*)/i],conditions:{acc_descr_multiline:{rules:[6,7],inclusive:!1},acc_descr:{rules:[4],inclusive:!1},acc_title:{rules:[2],inclusive:!1},unqString:{rules:[],inclusive:!1},token:{rules:[],inclusive:!1},string:{rules:[48,49],inclusive:!1},INITIAL:{rules:[0,1,3,5,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,50],inclusive:!0}}};return $}();ne.lexer=$e;function ee(){this.yy={}}return l(ee,"Parser"),ee.prototype=ne,ne.Parser=ee,new ee}();he.parser=he;var Ke=he,de=[],T={},G={},L={},j={},Ge={REQUIREMENT:"Requirement",FUNCTIONAL_REQUIREMENT:"Functional Requirement",INTERFACE_REQUIREMENT:"Interface Requirement",PERFORMANCE_REQUIREMENT:"Performance Requirement",PHYSICAL_REQUIREMENT:"Physical Requirement",DESIGN_CONSTRAINT:"Design Constraint"},je={LOW_RISK:"Low",MED_RISK:"Medium",HIGH_RISK:"High"},ze={VERIFY_ANALYSIS:"Analysis",VERIFY_DEMONSTRATION:"Demonstration",VERIFY_INSPECTION:"Inspection",VERIFY_TEST:"Test"},Xe={CONTAINS:"contains",COPIES:"copies",DERIVES:"derives",SATISFIES:"satisfies",VERIFIES:"verifies",REFINES:"refines",TRACES:"traces"},Je=l((e,t)=>(G[e]===void 0&&(G[e]={name:e,type:t,id:T.id,text:T.text,risk:T.risk,verifyMethod:T.verifyMethod}),T={},G[e]),"addRequirement"),Ze=l(()=>G,"getRequirements"),et=l(e=>{T!==void 0&&(T.id=e)},"setNewReqId"),tt=l(e=>{T!==void 0&&(T.text=e)},"setNewReqText"),it=l(e=>{T!==void 0&&(T.risk=e)},"setNewReqRisk"),rt=l(e=>{T!==void 0&&(T.verifyMethod=e)},"setNewReqVerifyMethod"),nt=l(e=>(j[e]===void 0&&(j[e]={name:e,type:L.type,docRef:L.docRef},xe.info("Added new requirement: ",e)),L={},j[e]),"addElement"),st=l(()=>j,"getElements"),at=l(e=>{L!==void 0&&(L.type=e)},"setNewElementType"),lt=l(e=>{L!==void 0&&(L.docRef=e)},"setNewElementDocRef"),ot=l((e,t,c)=>{de.push({type:e,src:t,dst:c})},"addRelationship"),ct=l(()=>de,"getRelationships"),ht=l(()=>{de=[],T={},G={},L={},j={},Ue()},"clear"),ut={RequirementType:Ge,RiskLevel:je,VerifyType:ze,Relationships:Xe,getConfig:()=>ve().req,addRequirement:Je,getRequirements:Ze,setNewReqId:et,setNewReqText:tt,setNewReqRisk:it,setNewReqVerifyMethod:rt,setAccTitle:Me,getAccTitle:De,setAccDescription:Pe,getAccDescription:Ye,addElement:nt,getElements:st,setNewElementType:at,setNewElementDocRef:lt,addRelationship:ot,getRelationships:ct,clear:ht},dt=l(e=>`

  marker {
    fill: ${e.relationColor};
    stroke: ${e.relationColor};
  }

  marker.cross {
    stroke: ${e.lineColor};
  }

  svg {
    font-family: ${e.fontFamily};
    font-size: ${e.fontSize};
  }

  .reqBox {
    fill: ${e.requirementBackground};
    fill-opacity: 1.0;
    stroke: ${e.requirementBorderColor};
    stroke-width: ${e.requirementBorderSize};
  }
  
  .reqTitle, .reqLabel{
    fill:  ${e.requirementTextColor};
  }
  .reqLabelBox {
    fill: ${e.relationLabelBackground};
    fill-opacity: 1.0;
  }

  .req-title-line {
    stroke: ${e.requirementBorderColor};
    stroke-width: ${e.requirementBorderSize};
  }
  .relationshipLine {
    stroke: ${e.relationColor};
    stroke-width: 1;
  }
  .relationshipLabel {
    fill: ${e.relationLabelColor};
  }

`,"getStyles"),pt=dt,ue={CONTAINS:"contains",ARROW:"arrow"},ft=l((e,t)=>{let c=e.append("defs").append("marker").attr("id",ue.CONTAINS+"_line_ending").attr("refX",0).attr("refY",t.line_height/2).attr("markerWidth",t.line_height).attr("markerHeight",t.line_height).attr("orient","auto").append("g");c.append("circle").attr("cx",t.line_height/2).attr("cy",t.line_height/2).attr("r",t.line_height/2).attr("fill","none"),c.append("line").attr("x1",0).attr("x2",t.line_height).attr("y1",t.line_height/2).attr("y2",t.line_height/2).attr("stroke-width",1),c.append("line").attr("y1",0).attr("y2",t.line_height).attr("x1",t.line_height/2).attr("x2",t.line_height/2).attr("stroke-width",1),e.append("defs").append("marker").attr("id",ue.ARROW+"_line_ending").attr("refX",t.line_height).attr("refY",.5*t.line_height).attr("markerWidth",t.line_height).attr("markerHeight",t.line_height).attr("orient","auto").append("path").attr("d",`M0,0
      L${t.line_height},${t.line_height/2}
      M${t.line_height},${t.line_height/2}
      L0,${t.line_height}`).attr("stroke-width",1)},"insertLineEndings"),we={ReqMarkers:ue,insertLineEndings:ft},_={},Ne=0,Ae=l((e,t)=>e.insert("rect","#"+t).attr("class","req reqBox").attr("x",0).attr("y",0).attr("width",_.rect_min_width+"px").attr("height",_.rect_min_height+"px"),"newRectNode"),qe=l((e,t,c)=>{let h=_.rect_min_width/2,d=e.append("text").attr("class","req reqLabel reqTitle").attr("id",t).attr("x",h).attr("y",_.rect_padding).attr("dominant-baseline","hanging"),p=0;c.forEach(g=>{p==0?d.append("tspan").attr("text-anchor","middle").attr("x",_.rect_min_width/2).attr("dy",0).text(g):d.append("tspan").attr("text-anchor","middle").attr("x",_.rect_min_width/2).attr("dy",_.line_height*.75).text(g),p++});let y=1.5*_.rect_padding,u=p*_.line_height*.75,o=y+u;return e.append("line").attr("class","req-title-line").attr("x1","0").attr("x2",_.rect_min_width).attr("y1",o).attr("y2",o),{titleNode:d,y:o}},"newTitleNode"),Ve=l((e,t,c,h)=>{let d=e.append("text").attr("class","req reqLabel").attr("id",t).attr("x",_.rect_padding).attr("y",h).attr("dominant-baseline","hanging"),p=0;const y=30;let u=[];return c.forEach(o=>{let g=o.length;for(;g>y&&p<3;){let R=o.substring(0,y);o=o.substring(y,o.length),g=o.length,u[u.length]=R,p++}if(p==3){let R=u[u.length-1];u[u.length-1]=R.substring(0,R.length-4)+"..."}else u[u.length]=o;p=0}),u.forEach(o=>{d.append("tspan").attr("x",_.rect_padding).attr("dy",_.line_height).text(o)}),d},"newBodyNode"),yt=l((e,t,c,h)=>{const d=t.node().getTotalLength(),p=t.node().getPointAtLength(d*.5),y="rel"+Ne;Ne++;const o=e.append("text").attr("class","req relationshipLabel").attr("id",y).attr("x",p.x).attr("y",p.y).attr("text-anchor","middle").attr("dominant-baseline","middle").text(h).node().getBBox();e.insert("rect","#"+y).attr("class","req reqLabelBox").attr("x",p.x-o.width/2).attr("y",p.y-o.height/2).attr("width",o.width).attr("height",o.height).attr("fill","white").attr("fill-opacity","85%")},"addEdgeLabel"),_t=l(function(e,t,c,h,d){const p=c.edge(W(t.src),W(t.dst)),y=We().x(function(o){return o.x}).y(function(o){return o.y}),u=e.insert("path","#"+h).attr("class","er relationshipLine").attr("d",y(p.points)).attr("fill","none");t.type==d.db.Relationships.CONTAINS?u.attr("marker-start","url("+Te.getUrl(_.arrowMarkerAbsolute)+"#"+t.type+"_line_ending)"):(u.attr("stroke-dasharray","10,7"),u.attr("marker-end","url("+Te.getUrl(_.arrowMarkerAbsolute)+"#"+we.ReqMarkers.ARROW+"_line_ending)")),yt(e,u,_,`<<${t.type}>>`)},"drawRelationshipFromLayout"),gt=l((e,t,c)=>{Object.keys(e).forEach(h=>{let d=e[h];h=W(h),xe.info("Added new requirement: ",h);const p=c.append("g").attr("id",h),y="req-"+h,u=Ae(p,y);let o=[],g=qe(p,h+"_title",[`<<${d.type}>>`,`${d.name}`]);o.push(g.titleNode);let R=Ve(p,h+"_body",[`Id: ${d.id}`,`Text: ${d.text}`,`Risk: ${d.risk}`,`Verification: ${d.verifyMethod}`],g.y);o.push(R);const I=u.node().getBBox();t.setNode(h,{width:I.width,height:I.height,shape:"rect",id:h})})},"drawReqs"),Et=l((e,t,c)=>{Object.keys(e).forEach(h=>{let d=e[h];const p=W(h),y=c.append("g").attr("id",p),u="element-"+p,o=Ae(y,u);let g=[],R=qe(y,u+"_title",["<<Element>>",`${h}`]);g.push(R.titleNode);let I=Ve(y,u+"_body",[`Type: ${d.type||"Not Specified"}`,`Doc Ref: ${d.docRef||"None"}`],R.y);g.push(I);const b=o.node().getBBox();t.setNode(p,{width:b.width,height:b.height,shape:"rect",id:p})})},"drawElements"),Rt=l((e,t)=>(e.forEach(function(c){let h=W(c.src),d=W(c.dst);t.setEdge(h,d,{relationship:c})}),e),"addRelationships"),mt=l(function(e,t){t.nodes().forEach(function(c){c!==void 0&&t.node(c)!==void 0&&(e.select("#"+c),e.select("#"+c).attr("transform","translate("+(t.node(c).x-t.node(c).width/2)+","+(t.node(c).y-t.node(c).height/2)+" )"))})},"adjustEntities"),W=l(e=>e.replace(/\s/g,"").replace(/\./g,"_"),"elementString"),It=l((e,t,c,h)=>{_=ve().requirement;const d=_.securityLevel;let p;d==="sandbox"&&(p=ce("#i"+t));const u=(d==="sandbox"?ce(p.nodes()[0].contentDocument.body):ce("body")).select(`[id='${t}']`);we.insertLineEndings(u,_);const o=new Qe({multigraph:!1,compound:!1,directed:!0}).setGraph({rankdir:_.layoutDirection,marginx:20,marginy:20,nodesep:100,edgesep:100,ranksep:100}).setDefaultEdgeLabel(function(){return{}});let g=h.db.getRequirements(),R=h.db.getElements(),I=h.db.getRelationships();gt(g,o,u),Et(R,o,u),Rt(I,o),He(o),mt(u,o),I.forEach(function(A){_t(u,A,o,t,h)});const b=_.rect_padding,w=u.node().getBBox(),q=w.width+b*2,v=w.height+b*2;Be(u,v,q,_.useMaxWidth),u.attr("viewBox",`${w.x-b} ${w.y-b} ${q} ${v}`)},"draw"),bt={draw:It},$t={parser:Ke,db:ut,renderer:bt,styles:pt};export{$t as diagram};