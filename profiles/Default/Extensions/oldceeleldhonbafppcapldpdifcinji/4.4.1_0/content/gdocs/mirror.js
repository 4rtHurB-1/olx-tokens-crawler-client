const MATRIX_REG_EXP=/matrix\(([\-0-9\.]+),\s*([\-0-9\.]+),\s*([\-0-9\.]+),\s*([\-0-9\.]+),\s*([\-0-9\.]+),\s*([\-0-9\.]+)\)/,BULLET_POINT_REG_EXP=/^([\u25CF\u25CB\u25C6\u27A2\u25A0\u25A1\u2605\u274F\u2794\u21B5\u2756\u25AA\u2751\u2022\-\–\—o]|[VIX]+\.|[a-z0-9]{1,3}\.|\d{1,2}\.?\)|\d{1,2}\.\d{1,2}\.|\d{1,2}\.\d{1,2}\.\d{1,2}\.|[a-z]{1,2}\.?\)|[A-Z]{1,2}\.?\)|[A-Z]\.)$/,FOOTNOTE_NUMBER_REGEXP=/^\d{1,2}$/,FONT_STYLE_REGEXP=/(italic\s+|oblique\s+|normal\s+)?(.+?)\s+(.+?)\s+"(.+)"/,PUNCTUATION_REG_EXP=/^[\.!\?,;\:…"”“'’‘]/,MULTIPLE_WHITE_SPACE_REG_EXP=/  /g,PAGE_NUMBER_REGEXP=/^\d{1,3}$/,FOOTNOTE_NUMBER_FONT_SIZES=[6,7,8,9];class GoogleDocsCanvasMirror extends Mirror{constructor(t){super(),this._fontSizeFactor=1,this._calculateFontSizeFactor=()=>{if(!BrowserDetector.isFirefox())return;const t=document.createElement("span");t.textContent="h",t.style.fontSize="20px",document.body.append(t);const e=window.getComputedStyle(t).fontSize,i=parseFloat(e);i&&(this._fontSizeFactor=i/20),t.remove()},this._onMimickedElementClick=t=>{void 0!==t.clientX&&void 0!==t.clientY&&this._dispatchClick(t)},this._onMutation=t=>{t.forEach((t=>{t.removedNodes.length&&t.removedNodes.forEach((t=>{this._handleRemovedNode(t)})),t.addedNodes.length&&t.addedNodes.forEach((t=>{this._handleNewNode(t)}))}))},this._mimickedElement=t,this._cache=[],this._mimickedElement.addEventListener("click",this._onMimickedElementClick),this._pageContainer=this._mimickedElement.closest(".kix-page-paginated"),this._calculateFontSizeFactor(),this._render(),this._handleInitialState(),this._observe(),this._interval=window.setInterval(this._calculateFontSizeFactor,2e3)}_render(){this._container||(this._container=createContainerElement(document,GoogleDocsCanvasMirror.TAG_NAME),this._container.dataset.ltScrollTopScaledAndZoomed="0",this._container.dataset.ltScrollTopScaled="0",this._container.dataset.ltScrollLeftScaledAndZoomed="0",this._container.dataset.ltScrollLeftScaled="0",this._container.dataset.ltScrollTop="0",this._container.dataset.ltScrollLeft="0",this._container.style.display="none",this._svg=document.createElementNS("http://www.w3.org/2000/svg","svg"),this._svg.classList.add("notranslate"),this._svg.setAttribute("width","100%"),this._svg.setAttribute("height","100%"),this._container.appendChild(this._svg)),this._mimickedElement.lastElementChild!==this._container&&this._mimickedElement.append(this._container)}_observe(){this._mutationObserver=new MutationObserver(this._onMutation);const t=this._mimickedElement.querySelector("svg");t&&this._mutationObserver.observe(t,{subtree:!0,childList:!0,attributes:!0,characterData:!1})}_dispatchClick(t){const e=new MouseEvent(Mirror.eventNames.click,{view:window,screenX:t.screenX,screenY:t.screenY,clientX:t.clientX,clientY:t.clientY,button:t.button,buttons:t.buttons,ctrlKey:t.ctrlKey,shiftKey:t.shiftKey,altKey:t.altKey,bubbles:!0,cancelable:!0});this.getCloneElement().dispatchEvent(e)}_handleInitialState(){const t=this._mimickedElement.querySelector("svg");t&&t.childNodes.forEach((t=>{"g"===t.nodeName&&this._createNewSVGGroup(t)}))}_handleNewNode(t){if(t.nodeType!==Node.ELEMENT_NODE)return;let e=t;"g"===e.nodeName&&this._createNewSVGGroup(e)}_handleRemovedNode(t){if(t.nodeType!==Node.ELEMENT_NODE)return;let e=t;if("g"!==e.nodeName)return;const i=this._cache.findIndex((t=>t.original===e));i>-1&&(this._cache[i].mirror.remove(),this._cache.splice(i,1))}_getCanvasElements(){return this._pageContainer?Array.from(this._pageContainer.querySelectorAll("canvas.kix-canvas-tile-content")):[]}_createNewSVGGroup(t){const e=[];this._getCanvasElements().forEach((t=>{const i=GoogleDocs.getStrikethroughs(t);if(i.length){const n=(parseFloat(t.style.top)||0)+(parseFloat(t.style.marginTop)||0),s=(parseFloat(t.style.left)||0)+(parseFloat(t.style.marginLeft)||0);i.forEach((t=>{e.push({top:t.top+n,left:t.left+s,bottom:t.bottom+n,right:t.right+s})}))}}));const i=document.createElementNS("http://www.w3.org/2000/svg","g");let n=null,s=!1,r=null;for(let o=0;o<t.childNodes.length;o++){let a=t.childNodes[o];if("rect"!==a.nodeName)return;const l=0===o;let c=a.getAttribute("aria-label")||"";if(l&&BULLET_POINT_REG_EXP.test(c))continue;const h=t.childNodes[o+1],_=document.createElementNS("http://www.w3.org/2000/svg","text"),d=(a.getAttribute("data-font-css")||"").match(FONT_STYLE_REGEXP);if(!d)continue;let[,E,u,m,g]=d,p=parseFloat(a.getAttribute("x")),N=parseFloat(a.getAttribute("y")),f=parseFloat(a.getAttribute("width")),b=parseFloat(a.getAttribute("height"));const v=function(){if(h){const t=parseFloat(h.getAttribute("x"));Math.abs(p+f-t)>.3&&(s=!0)}n=p+f};if(l&&h&&c.length<3&&FOOTNOTE_NUMBER_REGEXP.test(c)&&FOOTNOTE_NUMBER_FONT_SIZES.includes(parseInt(m))){v();continue}if(n===p&&c.length<3&&FOOTNOTE_NUMBER_REGEXP.test(c)&&FOOTNOTE_NUMBER_FONT_SIZES.includes(parseInt(m))){v();continue}if(e.length){const[t,i,n,s]=this._getMatrix(a),r=Math.round(t+(p+f)*n),o=Math.round(i+(N+b/2)*s);if(e.some((t=>Math.abs(r-t.left)<2&&Math.abs(o-t.top)<3))){v();continue}}if(!h&&null!==n&&p-n>100&&c.length<4&&PAGE_NUMBER_REGEXP.test(c))v();else{if(_.textContent=c.replace(MULTIPLE_WHITE_SPACE_REG_EXP,"  "),_.setAttribute("x",String(p)),_.setAttribute("y",String(N+b/2)),E&&_.setAttribute("font-style",E),g&&_.setAttribute("font-family",g),m&&(BrowserDetector.isSafari()&&(m=Math.round(parseFloat(m))+"px"),1!==this._fontSizeFactor&&(m=parseFloat(m)*this._fontSizeFactor+"px"),_.setAttribute("font-size",m)),u&&_.setAttribute("font-weight",u),_.setAttribute("dominant-baseline","central"),_.setAttribute("transform",a.getAttribute("transform")),i.append(_),s&&(s=!1,r&&!PUNCTUATION_REG_EXP.test(c))){const t=r.textContent||"";t.endsWith(" ")||(r.textContent=t+" ")}r=_,v()}}this._insertSVGGroup(t,i)}_getMatrix(t){const e=(t.getAttribute("transform")||"").match(MATRIX_REG_EXP);let i=0,n=0,s=1,r=1;return e&&(i=parseFloat(e[5]),n=parseFloat(e[6]),s=parseFloat(e[1]),r=parseFloat(e[4])),[i,n,s,r]}_insertSVGGroup(t,e){if(!e.childNodes.length||!this._svg)return;const i=e.childNodes[0];if(i.nodeType!==Node.ELEMENT_NODE)return;const[n,s]=this._getMatrix(i),r={original:t,mirror:e,x:n,y:s};if(this._cache.length)for(let t=0;t<this._cache.length;t++){const e=this._cache[t];if(r.y<e.y){this._insertBefore(e,r);break}if(!this._cache[t+1]){this._insertAtEnd(r);break}}else this._insertAtEnd(r)}_insertBefore(t,e){const i=this._cache.indexOf(t);-1!==i&&t.mirror.parentNode&&(t.mirror.parentNode.insertBefore(e.mirror,t.mirror),this._cache.splice(i,0,e))}_insertAtEnd(t){this._svg&&(this._svg.append(t.mirror),this._cache.push(t))}getCloneElement(){return this._container}getTextElement(){throw new Error("Method getTextElement is not implemented in GoogleDocsCanvasMirror.")}enableRangeMeasurements(){return null}disableRangeMeasurements(){return null}destroy(){this._cache=[],this._mimickedElement.removeEventListener("click",this._onMimickedElementClick),this._mutationObserver&&this._mutationObserver.disconnect(),this._container&&this._container.remove(),window.clearInterval(this._interval)}}GoogleDocsCanvasMirror.TAG_NAME="lt-docs-mirror";