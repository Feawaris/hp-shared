import{X as m,e as d,ak as i}from"./vidstack-BuChzGtl-BYPDrtzB.js";import{I as p}from"./vidstack-DQ6dSZwe-BTtv5vWE.js";import"./app-DzJi2Cyx.js";const r=i('<svg viewBox="0 0 32 32" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"></svg>');function f(o,s){const a=m(r);a.innerHTML=p,o.append(a);const e=document.createElement("span");e.classList.add("vds-google-cast-info"),o.append(e);const n=document.createElement("span");n.classList.add("vds-google-cast-device-name"),d(()=>{const{remotePlaybackInfo:c}=s,t=c();return t!=null&&t.deviceName&&(n.textContent=t.deviceName,e.append("Google Cast on ",n)),()=>{e.textContent=""}})}export{f as insertContent};
