import{l as t,_ as s,at as n,j as i,au as p}from"./mermaid.core-CE49DK09.js";import{p as g}from"./mermaid-parser.esm-Ch4iEwht.js";import"./app-C4616Opf.js";import"./commonjsHelpers-Cpj98o6Y.js";import"./transform-Dgtl54Jv.js";var v={parse:async r=>{const a=await g("info",r);t.debug(a)}},d={version:p},m=s(()=>d.version,"getVersion"),c={getVersion:m},l=s((r,a,o)=>{t.debug(`rendering info diagram
`+r);const e=n(a);i(e,100,400,!0),e.append("g").append("text").attr("x",100).attr("y",40).attr("class","version").attr("font-size",32).style("text-anchor","middle").text(`v${o}`)},"draw"),u={draw:l},S={parser:v,db:c,renderer:u};export{S as diagram};