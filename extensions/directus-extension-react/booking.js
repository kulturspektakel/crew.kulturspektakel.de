import{useCollection as e,defineModule as t}from"@directus/extensions-sdk";import{resolveComponent as n,openBlock as r,createBlock as o,withCtx as i,createTextVNode as a,createVNode as s,createElementBlock as c,Fragment as l,renderList as d,toDisplayString as u,pushScopeId as p,popScopeId as f,createElementVNode as m}from"vue";var v={setup(){const t=e("Events");console.log(t)}};const g=e=>(p("data-v-65ee9410"),e=e(),f(),e),b=g((()=>m("iframe",{class:"iframe",src:"/react"},null,-1)));var h=[],y=[];!function(e,t){if(e&&"undefined"!=typeof document){var n,r=!0===t.prepend?"prepend":"append",o=!0===t.singleTag,i="string"==typeof t.container?document.querySelector(t.container):document.getElementsByTagName("head")[0];if(o){var a=h.indexOf(i);-1===a&&(a=h.push(i)-1,y[a]={}),n=y[a]&&y[a][r]?y[a][r]:y[a][r]=s()}else n=s();65279===e.charCodeAt(0)&&(e=e.substring(1)),n.styleSheet?n.styleSheet.cssText+=e:n.appendChild(document.createTextNode(e))}function s(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),t.attributes)for(var n=Object.keys(t.attributes),o=0;o<n.length;o++)e.setAttribute(n[o],t.attributes[n[o]]);var a="prepend"===r?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}("\n.iframe[data-v-65ee9410] {\n  border: 0;\n  width: 100%;\n  height: calc(100% - 60px);\n}\n",{}),v.render=function(e,t,p,f,m,v){const g=n("v-list-item"),h=n("v-list"),y=n("private-view");return r(),o(y,{title:"Booking",smallHeader:"true"},{navigation:i((()=>[a(" tset "),s(h,null,{default:i((()=>[(r(!0),c(l,null,d(e.collection,(e=>(r(),o(g,{key:e.collection},{default:i((()=>[a(u(e.collection),1)])),_:2},1024)))),128))])),_:1})])),default:i((()=>[b])),_:1})},v.__scopeId="data-v-65ee9410",v.__file="src/booking.vue";const k=[],x=[],_=[],A=[t({id:"booking",name:"Booking",icon:"star",routes:[{path:"",component:v}]})],E=[],T=[];export{x as displays,k as interfaces,_ as layouts,A as modules,T as operations,E as panels};
