(function(){"use strict";function d(t){const e=new Map,n=new Set(t.data.map(a=>{const r=a.toString();return e.set(r,a),r}));return{map:e,set:n}}function c(t,e,n){let a=0;for(let r=0;r<t;r++)a+=(e[r]-n[r])**2;return a}function h(t,e,n){return Math.sqrt(c(t,e,n))}function l(t){if(t.length<1)throw Error("too few nums");let e=[0,t[0]];for(let n=1;n<t.length;n++)t[n]<e[1]&&(e=[n,t[n]]);return e}function f(t,e){if(e.length===0)throw Error("too few elements");const n=[];for(let a=0;a<t;a++)n[a]=e.reduce((r,i)=>r+=i[a],0)/e.length;return n}function g(t){const e=new Array(t.dimension).fill(1/0),n=new Array(t.dimension).fill(-1/0);for(const a of t.data)for(let r=0;r<t.dimension;r++)a[r]<e[r]&&(e[r]=a[r]),a[r]>n[r]&&(n[r]=a[r]);return{min:e,max:n}}function m(t,e,n,a=[],r=0){for(;;){r++;const i=a.slice();for(;i.length<e;)i.push(p(n));const s=_(t,i,r);if(w(t.dimension,i,s.means))return s;a=s.means}}function _(t,e,n){const a=new Map;for(const r of e)a.set(r,[]);for(let r=0;r<t.data.length;r++){const i=t.data[r],[s]=l(e.map(o=>h(t.dimension,o,i)));a.get(e[s]).push({index:r,point:i})}return new b(n,t.dimension,Array.from(a.values()).filter(r=>r.length))}function p(t){const e=[];for(let n=0;n<t.min.length;n++){const a=t.max[n]-t.min[n];e[n]=Math.random()*a+t.min[n]}return e}function w(t,e,n){const a=(i,s)=>{for(let o=0;o<t;o++)if(i[o]!==s[o])return!1;return!0},r=e.length;if(r!==n.length)return!1;for(let i=0;i<r;i++)if(!a(e[i],n[i]))return!1;return!0}class b{constructor(e,n,a){Object.defineProperty(this,"count",{enumerable:!0,configurable:!0,writable:!0,value:e}),Object.defineProperty(this,"clusters",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"means",{enumerable:!0,configurable:!0,writable:!0,value:void 0});const r=[];this.clusters=a.map(i=>{const s=f(n,i.map(({point:o})=>o));return r.push(s),{mean:s,points:i}}),this.means=r}}function y(t,e,n){const r=[t.data[Math.floor(t.data.length*Math.random())]];for(;r.length<e;)r.push(k(t,r));return m(t,e,n,r)}function k(t,e){const n=t.data.map(s=>{const o=e.map(A=>c(t.dimension,A,s));return l(o)[1]}),a=n.reduce((s,o)=>s+o,0),r=Math.random()*a;let i=0;for(let s=0;s<t.data.length;s++)if(i+=n[s],i>=r)return t.data[s];return t.data[t.data.length-1]}class x{constructor(e){Object.defineProperty(this,"points",{enumerable:!0,configurable:!0,writable:!0,value:e}),Object.defineProperty(this,"range",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.range=new v(()=>g(this.points))}cluster(e,n="k_means_pp"){const a=d(this.points);return a.set.size<e?Array.from(a.map.values()):(n==="k_means_pp"?y:m)(this.points,e,this.range.val)}}class v{constructor(e){Object.defineProperty(this,"make",{enumerable:!0,configurable:!0,writable:!0,value:e}),Object.defineProperty(this,"value",{enumerable:!0,configurable:!0,writable:!0,value:void 0})}get val(){return this.value??(this.value=this.make())}}function P(t){if(t instanceof ImageData)return t;var e;if(t instanceof HTMLImageElement){const n=t;t=new OffscreenCanvas(n.width,n.height),e=t.getContext("2d"),e.drawImage(n,0,0)}else e=t.getContext("2d");return e.getImageData(0,0,t.width,t.height)}class M{constructor(e){this.img_data=P(e),this.kmpp=new x({data:O(this.img_data),dimension:4})}dominant(e,n="k_means_pp"){return new j(this.kmpp.cluster(e,n),this.img_data)}}function I(t){return t.map(e=>e.map(n=>Math.round(n)))}function O(t){const e=t.data,n=[];for(let a=0;a<e.length;a+=4)n.push([e[a],e[a+1],e[a+2],e[a+3]]);return n}class j{constructor(e,n){this.kmpp_result=e,this.img_data=n;const a=e instanceof Array?e:e.means;this.colors=I(a)}get_clustered_image_data(){if(this.kmpp_result instanceof Array)return this.img_data;const e=new Uint8ClampedArray(this.img_data.width*this.img_data.height*4);return this.kmpp_result.clusters.forEach(n=>{n.points.forEach(a=>{e[a.index*4]=n.mean[0],e[a.index*4+1]=n.mean[1],e[a.index*4+2]=n.mean[2],e[a.index*4+3]=n.mean[3]})}),new ImageData(e,this.img_data.width,this.img_data.height)}get_clustered_dataurl(){const e=document.createElement("canvas");return e.width=this.img_data.width,e.height=this.img_data.height,e.getContext("2d").putImageData(this.get_clustered_image_data(),0,0),e.toDataURL()}}let u;self.onmessage=function(t){const{type:e,id:n,data:a}=t.data;switch(e){case"init":u=new M(a);break;case"k_means":const r={id:n,result:u.dominant(a,"k_means").kmpp_result};postMessage(r);break;case"k_means_pp":const i={id:n,result:u.dominant(a,"k_means_pp").kmpp_result};postMessage(i);break;default:throw new Error("unknown message type")}}})();