class GoogleDocsHTML{static isMutationIgnored(e,t){return"attributes"===e.type&&e.target===t&&("class"===e.attributeName||"data-lt-tweaks"===e.attributeName)||(!!(e.target instanceof HTMLElement&&(e.target.classList.contains("kix-table-row-border-dragger")||e.target.classList.contains("kix-table-column-border-dragger")))||(!!("childList"===e.type&&1===e.addedNodes.length&&e.addedNodes[0]instanceof HTMLElement&&e.addedNodes[0].classList.contains("kix-htmloverlay-under-text"))||(!!("childList"===e.type&&1===e.removedNodes.length&&e.removedNodes[0]instanceof HTMLElement&&e.removedNodes[0].classList.contains("kix-htmloverlay-under-text"))||!!("attributes"===e.type&&"dir"===e.attributeName&&e.target instanceof HTMLElement&&(e.target.classList.contains("kix-tablerenderer-table")||e.target.classList.contains("kix-tablerenderer"))))))}static isPage(e){return e.classList.contains(this.PAGE_CLASS_NAME)}static initPage(e){e.setAttribute("data-lt-tweaks","gdocs")}static destroyPage(e){e.removeAttribute("data-lt-tweaks")}static hasPreviousPage(e){let t=e.previousElementSibling;for(;t;){if(this.isPage(t))return!0;t=t.previousElementSibling}return!1}static getNextPage(e){let t=e.nextElementSibling;for(;t;){if(this.isPage(t))return t;t=t.nextElementSibling}return null}static isIgnoredElement(e){const t=e.tagName.toUpperCase();return CEElementInspector.SKIPPING_TAGS.includes(t)||e.classList.contains("kix-selection-overlay")||e.classList.contains("kix-htmloverlay-under-text")||e.classList.contains("kix-lineview-decorations")||e.classList.contains("suggest-changes-top-colorbar")||e.classList.contains("suggest-changes-bottom-colorbar")||e.classList.contains("kix-spelling-error-overlay-container")||e.classList.contains("kix-lineview-background")||e.classList.contains("kix-table-row-border-dragger")||e.classList.contains("kix-table-column-border-dragger")||e.classList.contains("kix-commentoverlayrenderer-resolved")||e.classList.contains("kix-commentoverlayrenderer-highlighted")||e.classList.contains("kix-commentoverlayrenderer-resolved-highlighted")||e.classList.contains("kix-commentoverlayrenderer-smart-todo-highlighted")||e.classList.contains("kix-commentoverlayrenderer-normal")||e.classList.contains("kix-findandreplaceoverlayprovider-match")||e.classList.contains("kix-findselectionprovider-underlay-match")||e.classList.contains("kix-embeddedobject-crop")||e.classList.contains("kix-embeddedobject-view")||e.classList.contains("kix-embeddedobject-suggestion-overlay")||e.classList.contains("kix-footnotenumberview")||e.classList.contains("kix-page-header")||0===e.offsetHeight}static isElementCompatible(e){return e.matches(this.UNHANDLED_PAGE_SELECTOR)}static isBlockElement(e,t){return!e.classList.contains("kix-lineview-content")&&!e.classList.contains(this.LINE_CLASS_NAME)&&CEElementInspector.DISPLAY_BLOCK_VALUES.includes(t.display||"")}static replaceText(e,t,s){if(!(e=normalizeWhiteSpaces(e).replace(this.NBSP_REGEXP," ")).trim())return removeZWC(e);const o=s.parentElement;if(o&&!t.nextSibling&&(o.classList.contains(this.TEXT_BLOCK_CLASS_NAME)&&o.lastElementChild===s||o.parentElement&&o.parentElement.classList.contains(this.TEXT_BLOCK_CLASS_NAME)&&o.parentElement.lastElementChild.lastElementChild===s)&&(e=e.replace(this.ZWNJ_END_REGEXP," ")),!(e=removeZWC(e)).trim())return e;if(s.classList.contains(this.TEXT_BLOCK_CLASS_NAME)&&this.FOOTNOTE_NUMBER_REGEXP.test(e)&&[6,7,8,9].includes(parseInt(s.style.fontSize))&&"super"===s.style.verticalAlign)return"\ufeff".repeat(e.length);const n=s.closest(`.${this.LINE_CLASS_NAME}`);if(!n)return this._replaceText(e,s,o);const i=n.querySelectorAll(this.STRIKETHROUGH_SELECTOR);if(!i.length)return this._replaceText(e,s,o);const r=s.getBoundingClientRect(),a=Array.from(i).find((e=>{const t=e.getBoundingClientRect();return isRectsIntersect({top:r.top,right:r.right-1,bottom:r.bottom,left:r.left+1},t)}));if(!a)return this._replaceText(e,s,o);const l=a.getBoundingClientRect();if(l.width<2)return this._replaceText(e,s,o);const c=t.nodeValue,d=new Range;let u=!1;for(let e=0;e<c.length;e++){if(isZWC(c.charAt(e)))continue;d.setStart(t,e),d.setEnd(t,e);const s=d.getBoundingClientRect(),o=Math.abs(s.left-l.left)<.9;if(s.left>l.left||o){u=!0;break}}if(!u)return this._replaceText(e,s,o);const g=new Range;for(let e=d.startOffset;e<c.length;e++){if(e>d.startOffset&&isZWC(c.charAt(e-1)))continue;g.setStart(t,e),g.setEnd(t,e);const s=g.getBoundingClientRect();if(s.left>l.right&&s.left-l.right>.5){g.setStart(t,Math.max(e-1,0)),g.setEnd(t,Math.max(e-1,0));break}}const h=new Range;h.setStart(d.startContainer,d.startOffset),h.setEnd(g.endContainer,g.endOffset);const E=c.substring(h.startOffset,h.endOffset);return e=removeZWC(c.substring(0,h.startOffset))+"\ufeff".repeat(removeZWC(E).length)+removeZWC(c.substring(h.endOffset,c.length)),this._replaceText(e,s,o)}static getReplacementText(e){return""}static _replaceText(e,t,s){let o=null;s&&"A"===s.tagName?o=s:"A"===t.tagName&&(o=t);const n=e.trim();if(o){if(this.URL_FRAGMENT_REG_EXP.test(e)||this.FILE_NAME_REGEXP.test(e))return"\ufeff".repeat(e.length);if(n.length>10&&o.href.includes(n))return"\ufeff".repeat(e.length)}else if(!this.WHITE_SPACE_REGEXP.test(n)&&this.URL_FRAGMENT_REG_EXP.test(n))return"\ufeff".repeat(e.length);return t.classList.contains("kix-wordhtmlgenerator-word-node")?e:e.replace(this.BULLET_POINT_REGEXP,(e=>"\ufeff".repeat(e.length)))}static _updateTextBoxes(e,t){this._domMeasurement=this._domMeasurement||new DomMeasurement(document),this._domMeasurement.clearCache();const s=this._domMeasurement.getTextBoundingBoxes(t,e,!1);return{textBoxes:s,firstTextBox:s[0],lastTextBox:s[s.length-1]}}static getUnhandledPages(){return Array.from(document.querySelectorAll(this.UNHANDLED_PAGE_SELECTOR))}static _lockMousemove(){this._mousemoveCapture||(this._mousemoveCapture=addUseCaptureEvent(document,"mousemove",(e=>e.stopImmediatePropagation())))}static _unlockMousemove(){this._mousemoveCapture&&(this._mousemoveCapture.destroy(),this._mousemoveCapture=null)}static applyFix(e){const{offset:t,length:s,replacementText:o,editor:n}=e,i=n.inputAreaWrapper.getTextRanges(t,s),r=document.querySelector(".kix-appview-editor");if(!r)return Tracker.trackError("other","google_docs:apply_fix1"),Promise.reject();const a=GoogleDocs.getIframeWin();if(!a)return Tracker.trackError("other","google_docs:apply_fix3"),Promise.reject();const l=a.document.querySelector("[contenteditable=true]");if(!l)return Tracker.trackError("other","google_docs:apply_fix4"),Promise.reject();this._domMeasurement=this._domMeasurement||new DomMeasurement(document);const c=this._domMeasurement.getBorderBox(r,!1);let{firstTextBox:d,lastTextBox:u}=this._updateTextBoxes(n.inputArea,i);d.top<c.top?r.scrollTop-=c.top-d.top:u.bottom>c.bottom&&(r.scrollTop+=u.bottom-c.bottom);const g=this._updateTextBoxes(n.inputArea,i);d=g.firstTextBox,u=g.lastTextBox;const h=i[0].textNode.parentElement;if(!h)return Tracker.trackError("other","google_docs:apply_fix5"),Promise.reject();const E=i[i.length-1].textNode.parentElement;if(!E)return Tracker.trackError("other","google_docs:apply_fix6"),Promise.reject();const m={clientX:Math.round(d.left+2),clientY:Math.round(d.top+d.height/2),bubbles:!0,shftKey:!1,detail:GoogleDocs.MOUSE_EVENT_DETAIL};return this._lockMousemove(),wait(20).then((()=>(h.dispatchEvent(new MouseEvent("mousedown",Object.assign({},m))),wait(20)))).then((()=>(h.dispatchEvent(new MouseEvent("mouseup",Object.assign({},m))),h.dispatchEvent(new MouseEvent("click",Object.assign({},m))),wait(20)))).then((()=>{this._unlockMousemove();const e={clientX:Math.ceil(d.left),clientY:Math.round(d.top+d.height/2),bubbles:!0,shftKey:!1,detail:GoogleDocs.MOUSE_EVENT_DETAIL},t={clientX:Math.floor(u.right),clientY:Math.round(u.top+u.height/2),bubbles:!0,shftKey:!0,detail:GoogleDocs.MOUSE_EVENT_DETAIL},s={shiftKey:!0,key:"Shift",code:"ShiftLeft",keyCode:16,charCode:0,which:16,location:1};h.dispatchEvent(new MouseEvent("mousedown",e)),E.dispatchEvent(new MouseEvent("mousemove",t)),l.dispatchEvent(new a.KeyboardEvent("keydown",s)),E.dispatchEvent(new MouseEvent("mouseup",t)),l.dispatchEvent(new a.KeyboardEvent("keyup",s));const n=a,i=o.replace(/\s/g," ");let r;try{r=new n.ClipboardEvent("paste",{clipboardData:new n.DataTransfer,bubbles:!0}),r.clipboardData.setData("text/plain",i)}catch(e){r=new n.ClipboardEvent("paste",{bubbles:!0})}return l.dispatchEvent(r),l.textContent=i,Promise.resolve()})).finally((()=>this._unlockMousemove()))}static _ignoreCSSUserSelect(){BrowserDetector.isSafari()&&document.body.classList.add("lt-gdocs-ignore-user-select")}static _unignoreCSSUserSelect(){BrowserDetector.isSafari()&&document.body.classList.remove("lt-gdocs-ignore-user-select")}static getSelection(){let e=Array.from(document.body.querySelectorAll(".kix-selection-overlay:not([style*='rgb(31'])"));if(!e.length)return null;if(e=e.filter((e=>{const t=e.getBoundingClientRect();return t.top>-20&&t.bottom<window.innerHeight+20})),!e.length)return null;const t=e[0].getBoundingClientRect(),s=1===e.length?t:e[e.length-1].getBoundingClientRect();this._ignoreCSSUserSelect();let o=getRangeAtPoint({x:t.left+1,y:Math.round(t.bottom-.3*t.height)}),n=getRangeAtPoint({x:s.right-.5,y:Math.round(s.bottom-.3*s.height)});return this._unignoreCSSUserSelect(),o&&n&&(o.startContainer!==n.startContainer||o.startOffset!==n.startOffset||(this._ignoreCSSUserSelect(),o=getRangeAtPoint({x:t.left,y:Math.round(t.top+.3*t.height)}),n=getRangeAtPoint({x:s.right,y:Math.round(s.top+.3*s.height)}),this._unignoreCSSUserSelect(),o&&n))?{startNode:o.startContainer,startOffset:o.startOffset,endNode:n.endContainer,endOffset:n.endOffset,isCollapsed:!1}:null}static getSelectedText(){const e=this.getSelection();if(!e)return"";const t=new Range;return t.setStart(e.startNode,e.startOffset),t.setEnd(e.endNode,e.endOffset),t.toString()}}GoogleDocsHTML.BULLET_POINT_REGEXP=/^([\u25CF\u25CB\u25C6\u27A2\u25A0\u25A1\u2605\u274F\u2794\u21B5\u2756\u25AA\u2751\u2022\-\–\—o]|[VIX]+\.|[a-z0-9]{1,3}\.|\d{1,2}\.?\)|\d{1,2}\.\d{1,2}\.|\d{1,2}\.\d{1,2}\.\d{1,2}\.|[a-z]{1,2}\.?\)|[A-Z]{1,2}\.?\)|[A-Z]\.)$/g,GoogleDocsHTML.ZWNJ_END_REGEXP=/(\u200C|\s)?$/,GoogleDocsHTML.URL_FRAGMENT_REG_EXP=/[&\?#][a-z0-9]+|%[A-Z0-9]{2}|[a-z0-9]=\!?[a-z0-9]|[a-z0-9\.]{2,}\![a-z0-9\.]{2,}|[\-_][a-z0-9]{5,}[\-_][a-z0-9]{5,}[\-_][a-z0-9]{5,}|\/.+?\/.+/i,GoogleDocsHTML.FILE_NAME_REGEXP=/^[a-z0-9_\-\/\\]+\.[a-z]{2,4}$/i,GoogleDocsHTML.WHITE_SPACE_REGEXP=/\s/,GoogleDocsHTML.FOOTNOTE_NUMBER_REGEXP=/^\d{1,2}$/,GoogleDocsHTML.NBSP_REGEXP=/\u00A0/g,GoogleDocsHTML.PAGE_CLASS_NAME="kix-page",GoogleDocsHTML.LINE_CLASS_NAME="kix-lineview",GoogleDocsHTML.TEXT_BLOCK_CLASS_NAME="kix-lineview-text-block",GoogleDocsHTML.UNHANDLED_PAGE_SELECTOR=".kix-page:not([data-lt-tweaks])",GoogleDocsHTML.STRIKETHROUGH_SELECTOR=".kix-lineview-decorations [style*='height:1px;border-top:3px'], .kix-lineview-decorations [style*='height: 1px; border-top: 3px']",GoogleDocsHTML._mousemoveCapture=null,"undefined"!=typeof module&&(module.exports=GoogleDocsHTML);