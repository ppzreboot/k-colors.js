(function(){"use strict";function l(e){const t=new Map,n=new Set(e.data.map(r=>{const a=r.toString();return t.set(a,r),a}));return{map:t,set:n}}function m(e,t,n){let r=0;for(let a=0;a<e;a++)r+=(t[a]-n[a])**2;return r}function f(e,t,n){return Math.sqrt(m(e,t,n))}function h(e){if(e.length<1)throw Error("too few nums");let t=[0,e[0]];for(let n=1;n<e.length;n++)e[n]<t[1]&&(t=[n,e[n]]);return t}function g(e,t){if(t.length===0)throw Error("too few elements");const n=[];for(let r=0;r<e;r++)n[r]=t.reduce((a,i)=>a+=i[r],0)/t.length;return n}function _(e){const t=new Array(e.dimension).fill(1/0),n=new Array(e.dimension).fill(-1/0);for(const r of e.data)for(let a=0;a<e.dimension;a++)r[a]<t[a]&&(t[a]=r[a]),r[a]>n[a]&&(n[a]=r[a]);return{min:t,max:n}}function u(e,t,n,r=[],a=0){a++;const i=r.slice();for(;i.length<t;)i.push(w(n));const s=p(e,i,a);return b(e.dimension,i,s.means)?s:u(e,t,n,s.means,a)}function p(e,t,n){const r=new Map;for(const a of t)r.set(a,[]);for(let a=0;a<e.data.length;a++){const i=e.data[a],[s]=h(t.map(o=>f(e.dimension,o,i)));r.get(t[s]).push({index:a,point:i})}return new k(n,e.dimension,Array.from(r.values()).filter(a=>a.length))}function w(e){const t=[];for(let n=0;n<e.min.length;n++){const r=e.max[n]-e.min[n];t[n]=Math.random()*r+e.min[n]}return t}function b(e,t,n){const r=(i,s)=>{for(let o=0;o<e;o++)if(i[o]!==s[o])return!1;return!0},a=t.length;if(a!==n.length)return!1;for(let i=0;i<a;i++)if(!r(t[i],n[i]))return!1;return!0}class k{constructor(t,n,r){Object.defineProperty(this,"count",{enumerable:!0,configurable:!0,writable:!0,value:t}),Object.defineProperty(this,"clusters",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"means",{enumerable:!0,configurable:!0,writable:!0,value:void 0});const a=[];this.clusters=r.map(i=>{const s=g(n,i.map(({point:o})=>o));return a.push(s),{mean:s,points:i}}),this.means=a}}function y(e,t,n){const a=[e.data[Math.floor(e.data.length*Math.random())]];for(;a.length<t;)a.push(v(e,a));return u(e,t,n,a)}function v(e,t){const n=e.data.map(s=>{const o=t.map(j=>m(e.dimension,j,s));return h(o)[1]}),r=n.reduce((s,o)=>s+o,0),a=Math.random()*r;let i=0;for(let s=0;s<e.data.length;s++)if(i+=n[s],i>=a)return e.data[s];return e.data[e.data.length-1]}class x{constructor(t){Object.defineProperty(this,"points",{enumerable:!0,configurable:!0,writable:!0,value:t}),Object.defineProperty(this,"range",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.range=new P(()=>_(this.points))}k_means(t){const n=l(this.points);return n.set.size<t?Array.from(n.map.values()):u(this.points,t,this.range.val)}k_means_pp(t){const n=l(this.points);return n.set.size<t?Array.from(n.map.values()):y(this.points,t,this.range.val)}}class P{constructor(t){Object.defineProperty(this,"make",{enumerable:!0,configurable:!0,writable:!0,value:t}),Object.defineProperty(this,"value",{enumerable:!0,configurable:!0,writable:!0,value:void 0})}get val(){return this.value??(this.value=this.make())}}function M(e){if(e instanceof ImageData)return e;var t;if(e instanceof HTMLImageElement){const n=e;e=new OffscreenCanvas(n.width,n.height),t=e.getContext("2d"),t.drawImage(n,0,0)}else t=e.getContext("2d");return t.getImageData(0,0,e.width,e.height)}class A{constructor(t){this.img_data=M(t),this.kmpp=new x({data:O(this.img_data),dimension:4})}k_colors(t){return new d(this.kmpp.k_means(t),this.img_data)}k_colors_pp(t){return new d(this.kmpp.k_means_pp(t),this.img_data)}}function I(e){return e.map(t=>t.map(n=>Math.round(n)))}function O(e){const t=e.data,n=[];for(let r=0;r<t.length;r+=4)n.push([t[r],t[r+1],t[r+2],t[r+3]]);return n}class d{constructor(t,n){this.kmpp_result=t,this.img_data=n;const r=t instanceof Array?t:t.means;this.colors=I(r)}get_clustered_image_data(){if(this.kmpp_result instanceof Array)return this.img_data;const t=new Uint8ClampedArray(this.img_data.width*this.img_data.height*4);return this.kmpp_result.clusters.forEach(n=>{n.points.forEach(r=>{t[r.index*4]=n.mean[0],t[r.index*4+1]=n.mean[1],t[r.index*4+2]=n.mean[2],t[r.index*4+3]=n.mean[3]})}),new ImageData(t,this.img_data.width,this.img_data.height)}get_clustered_dataurl(){const t=document.createElement("canvas");return t.width=this.img_data.width,t.height=this.img_data.height,t.getContext("2d").putImageData(this.get_clustered_image_data(),0,0),t.toDataURL()}}let c;self.onmessage=function(e){const{type:t,id:n,data:r}=e.data;switch(t){case"init":c=new A(r);break;case"k_colors":const a={id:n,result:c.k_colors(r).kmpp_result};postMessage(a);break;case"k_colors_pp":const i={id:n,result:c.k_colors_pp(r).kmpp_result};postMessage(i);break;default:throw new Error("unknown message type")}}})();