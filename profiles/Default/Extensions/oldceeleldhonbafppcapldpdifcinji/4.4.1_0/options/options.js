/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
!function(){const e=document.getElementById("banner"),t=document.getElementById("login"),n=document.getElementById("login-options"),o=document.getElementById("logout-button"),a=document.getElementById("manage-account-button"),s=document.getElementById("login-popup-button"),i=document.getElementById("lt-options__package-badge-container"),l=document.getElementById("managed-login"),d=document.getElementById("managed-login-options"),c=document.getElementById("managed-login-button"),r=document.getElementById("managed-logout-button"),g=document.getElementById("lt-options-discount"),u=document.getElementById("toggleSynonymsSwitch"),m=document.getElementById("togglePickyModeSwitch"),p=document.getElementById("personalDictionary"),y=document.getElementById("personalDictionary-options"),E=document.getElementById("personalDictionaryList"),h=document.getElementById("personalDictionaryInput"),f=document.getElementById("addToPersonalDictionary"),v=document.getElementById("personalDictionary-options__clearAll"),b=document.getElementById("personalDictionary-options__copy"),k=document.getElementById("ignoredRules"),L=document.getElementById("ignoredRules-options"),S=document.getElementById("ignoredRulesList"),_=document.getElementById("ignoredRules-options__clearAll"),I=document.getElementById("disabledDomains"),D=document.getElementById("disabledDomains-options"),C=document.getElementById("disabledDomainsList"),B=document.getElementById("disabledDomainsInput"),M=document.getElementById("addToDisabledDomains"),A=document.getElementById("disabledDomains-options__clearAll"),T=document.getElementById("language"),w=document.getElementById("language-options"),x=document.getElementById("preferred-languages-count"),O=document.getElementById("preferred-languages"),R=document.getElementById("new-preferred-languages"),N=document.getElementById("experimental"),U=document.getElementById("experimental-options"),P=document.getElementById("serverUrl"),V=document.getElementById("serverType-cloud"),G=document.getElementById("serverType-local"),H=document.getElementById("serverType-custom"),q=document.getElementById("localServerAvailabilityWarning"),$=document.getElementById("retryLocalServer"),Y=document.getElementById("customServerUrl"),j=document.getElementById("motherTongue"),F=document.getElementById("variant-en"),W=document.getElementById("variant-de"),z=document.getElementById("variant-pt"),J=document.getElementById("variant-ca"),K=document.getElementById("autoCheckAllDomains"),Q=document.getElementById("autoCheckDomains-options"),X=document.getElementById("autoCheckDomains"),Z=document.getElementById("autoCheckDomainInput"),ee=document.getElementById("addToAutoCheckDomains"),te=document.getElementById("autoCheckDomains-options__clearAll"),ne=document.getElementById("ignoredDomains-options"),oe=document.getElementById("ignoredDomains"),ae=document.getElementById("ignoredDomainInput"),se=document.getElementById("addToIgnoredDomains"),ie=document.getElementById("ignoredDomains-options__clearAll"),le=document.getElementById("copyright-link"),de=document.querySelectorAll("[data-lt-nice-select]"),ce=/^(https?:\/\/)?localhost(:[0-9]{1,5})?(\/.*)?$/i,re=/^(https?:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,15}(:[0-9]{1,5})?(\/.*)?$/i,ge=/^(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}$/,ue=StorageController.create();function me(e){return ce.test(e)||re.test(e)||ge.test(e)}function pe(){const{hasPaidSubscription:e}=ue.getUIState();document.body.classList.toggle("lt-options--plus",e),i.innerHTML="",new PackageBadge(null,e?"premium":"basic","default",i),function(){const{havePremiumAccount:e,username:t}=ue.getSettings(),n=document.getElementById("lt-login"),o=document.getElementById("lt-account");e?(n.style.display="none",o.style.display="block",P.style.display="none",translateElement("#account-text",{key:"settingsLoggedInAs",isHTML:!0,interpolations:[`<strong>${t}</strong>`]})):(n.style.display="block",o.style.display="none",P.style.display="block")}(),ye()}function ye(){const{apiServerUrl:o,disablePersonalDictionary:s,disableIgnoredRules:i,loginUrl:c}=ue.getManagedSettings(),{havePremiumAccount:r,username:g}=ue.getSettings();s&&(p.style.display="none",y.style.display="none"),i&&(k.style.display="none",L.style.display="none"),o&&(P.style.display="none",e.style.display="none"),c&&(e.style.display="none",t.style.display="none",n.style.display="none",a.style.display="none",l.style.display="",d.style.display="");const u=document.getElementById("managed-login-box"),m=document.getElementById("managed-logout-box");r?(u.style.display="none",m.style.display="block",translateElement("#managed-account-text",{key:"settingsLoggedInAs",isHTML:!0,interpolations:[`<strong>${g}</strong>`]})):(u.style.display="block",m.style.display="none")}function Ee(e){if(!(e.target instanceof HTMLButtonElement))return;const t=e.target.closest("[data-preferred-language]");if(!t||"string"!=typeof t.dataset.preferredLanguage)return;const{preferredLanguages:n}=ue.getSettings(),o=n.indexOf(t.dataset.preferredLanguage);-1!==o&&(ue.updateSettings({preferredLanguages:n.slice(0,o).concat(n.slice(o+1))}),fe())}function he(e){if(!(e.target instanceof HTMLSelectElement))return;const{preferredLanguages:t}=ue.getSettings();ue.updateSettings({preferredLanguages:uniq(t.concat([e.target.value]))}),fe()}function fe(){const{preferredLanguages:e}=ue.getSettings(),t=Array.from(document.querySelectorAll("[data-preferred-language]")),n=Array.from(R.querySelectorAll("optgroup"));t.concat(n).forEach((e=>{e.remove()})),e.forEach((e=>{const t=LanguageManager.ALL_LANGUAGES.find((({code:t})=>t===e));if(!t)return;const n=Object.assign(document.createElement("span"),{textContent:t.name,className:"lt-pill-box__item__text"}),o=Object.assign(document.createElement("button"),{className:"lt-pill-box__item__delete lt-icon lt-icon__close_small",type:"button"}),a=Object.assign(document.createElement("div"),{className:"lt-pill-box__item lt-pill-box__item--option"});a.dataset.preferredLanguage=e,a.appendChild(n),a.appendChild(o),O.insertBefore(a,R.parentNode)}));const o=document.createElement("optgroup"),a=document.createElement("optgroup");LanguageManager.ALL_LANGUAGES.forEach((t=>{if(e.includes(t.code))return;const n=Object.assign(document.createElement("option"),{value:t.code,textContent:t.name});LanguageManager.POPULAR_LANGUAGES.includes(t.code)&&o.appendChild(n.cloneNode(!0)),a.appendChild(n)})),o.setAttribute("data-t-attr",JSON.stringify(["label","settingsPreferredLanguagesPopularList"])),a.setAttribute("data-t-attr",JSON.stringify(["label","settingsPreferredLanguagesCompleteList"])),R.appendChild(o),R.appendChild(a),x.textContent=e.length?`(${e.length})`:"",translateSection(R)}function ve(e,t){e.value=t,e.dispatchEvent(new Event("change",{bubbles:!0}))}function be(){ue&&(u.classList.add("lt-toggle--checked"),ue.updateSettings({hasSynonymsEnabled:!0}))}function ke(){ue&&(u.classList.remove("lt-toggle--checked"),ue.updateSettings({hasSynonymsEnabled:!1}))}function Le(){ue&&(m.classList.add("lt-toggle--checked"),ue.updateSettings({hasPickyModeEnabledGlobally:!0}))}function Se(){ue&&(m.classList.remove("lt-toggle--checked"),ue.updateSettings({hasPickyModeEnabledGlobally:!1}))}function _e(e=Dictionary.getSorted(),t=0===Dictionary.get().length){E.innerHTML="";for(const t of e){const e=document.createElement("li");e.className="lt-personal-dictionary__item";const n=document.createElement("span");n.className="lt-personal-dictionary__title",n.textContent=t,e.appendChild(n);const o=document.createElement("span");o.className="lt-personal-dictionary__delete-button",o.dataset.word=t,o.addEventListener("click",Ce),e.appendChild(o),E.appendChild(e)}const n=document.getElementById("personalDictionary-optionsInside"),o=document.getElementById("personalDictionary-options__emptyState"),a=document.getElementById("personalDictionary-options__emptySearch");e.length>0?(n.style.display="block",o.style.display="none",a.style.display="none"):t?(n.style.display="none",o.style.display="block",a.style.display="none"):(n.style.display="none",o.style.display="none",a.style.display="block")}function Ie(){const e=h.value;f.disabled=""===e.trim();const t=Dictionary.getSorted(),n=[];for(const o of t)o.includes(e)&&n.push(o);_e(n,0===t.length)}function De(){const e=h.value.trim();e&&(Dictionary.add(e).then((()=>_e())),h.value="",f.disabled=!0)}function Ce(e){const t=e.currentTarget.dataset.word;t&&Dictionary.remove(t).then(Ie)}function Be(){S.innerHTML="";const e=ue.getSettings().ignoredRules,t=i18nManager.getMessage("enableRuleTooltip");for(const n of e){if(n.language){const e=LanguageManager.getUserLanguageCodes().some((e=>n.language.toLowerCase().startsWith(e)||"*"===n.language));if(StorageControllerClass.getDefaultSettings().ignoredRules.some((e=>e.id===n.id))&&!e)continue}const e=document.createElement("li");e.className="lt-options__rules__item";const o=document.createElement("span");o.className="lt-options__rules__title",o.textContent="- "+(n.description||n.id),e.appendChild(o);const a=document.createElement("span");a.className="lt-options__rules__enable-button",a.setAttribute("title",t),a.dataset.ruleId=n.id,a.textContent=t,a.addEventListener("click",Me),e.appendChild(a),S.appendChild(e)}const n=document.getElementById("ignoredRules-optionsInside"),o=document.getElementById("ignoredRules-options__emptyState");e.length>0?(n.style.display="block",o.style.display="none"):(n.style.display="none",o.style.display="block")}function Me(e){const t=e.currentTarget.dataset.ruleId;if(t){const e=ue.getSettings().ignoredRules.filter((e=>e.id!==t));ue.updateSettings({ignoredRules:e}).then(Be)}}function Ae(e=ue.getSettings().disabledDomains,t=ue.getSettings().disabledDomains.length>0){C.innerHTML="";const n=i18nManager.getMessage("settingsEnableDomain");for(const t of e){const e=document.createElement("li");e.className="lt-options__rules__item";const o=document.createElement("span");o.className="lt-options__rules__title",o.textContent="● "+t,e.appendChild(o);const a=document.createElement("span");a.className="lt-options__rules__enable-button",a.setAttribute("title",n),a.dataset.domain=t,a.textContent=n,a.addEventListener("click",xe),e.appendChild(a),C.appendChild(e)}const o=document.getElementById("disabledDomains-optionsInside"),a=document.getElementById("disabledDomains-options__emptyState"),s=document.getElementById("disabledDomains-options__emptySearch");e.length>0?(o.style.display="block",a.style.display="none",s.style.display="none"):t?(o.style.display="none",a.style.display="block",s.style.display="none"):(o.style.display="none",a.style.display="none",s.style.display="block")}function Te(){const e=B.value;M.disabled=""===e.trim();const t=ue.getSettings().disabledDomains.sort(((e,t)=>e.toLowerCase().localeCompare(t.toLowerCase()))),n=[];for(const o of t)o.includes(e)&&n.push(o);Ae(n,0===t.length)}function we(){const e=B.value.trim(),t=getDomain(e,"");if(""===t.trim()||!me(e))return void alert(i18nManager.getMessage("settingsDomainInvalid"));B.value="",M.disabled=!0;const n=ue.getSettings().disabledDomains;n.includes(t)?Ae(n,!1):(n.push(t),ue.updateSettings({disabledDomains:n}).then((()=>Ae(n,!1))))}function xe(e){const t=e.currentTarget.dataset.domain;if(t){const e=ue.getSettings().disabledDomains.filter((e=>e!==t));ue.updateSettings({disabledDomains:e}).then(Te)}}function Oe(){Re(H.checked),G.checked?Ne():q.style.display="none"}function Re(e=!1){Y.style.display=e?"block":"none",Y.required=e,e?Y.value=Y.dataset.prevValue||"":(Y.dataset.prevValue=Y.value,Y.value="")}function Ne(){fetch(config.LOCAL_SERVER_URL+"/languages",{method:"GET",mode:"cors"}).then((()=>{q.style.display="none"})).catch((()=>{q.style.display="block"}))}function Ue(e=!1){Q.style.display=e?"none":"",ne.style.display=e?"":"none"}function Pe(e=ue.getSettings().autoCheckOnDomains,t=0===ue.getSettings().autoCheckOnDomains.length){X.innerHTML="";const n=i18nManager.getMessage("settingsDeleteAutoCheckDomain");for(const t of e){const e=document.createElement("li");e.className="lt-options__rules__item";const o=document.createElement("span");o.className="lt-options__rules__title",o.textContent="● "+t,e.appendChild(o);const a=document.createElement("span");a.className="lt-options__rules__enable-button",a.setAttribute("title",n),a.dataset.domain=t,a.textContent=n,a.addEventListener("click",He),e.appendChild(a),X.appendChild(e)}const o=document.getElementById("autoCheckDomains-optionsInside"),a=document.getElementById("autoCheckDomains-options__emptyState"),s=document.getElementById("autoCheckDomains-options__emptySearch");e.length>0?(o.style.display="block",a.style.display="none",s.style.display="none"):t?(o.style.display="none",a.style.display="block",s.style.display="none"):(o.style.display="none",a.style.display="none",s.style.display="block")}function Ve(){const e=Z.value;ee.disabled=""===e.trim();const t=ue.getSettings().autoCheckOnDomains.sort(((e,t)=>e.toLowerCase().localeCompare(t.toLowerCase()))),n=[];for(const o of t)o.includes(e)&&n.push(o);Pe(n,0===t.length)}function Ge(){const e=Z.value.trim(),t=getDomain(e,"");if(""===t.trim()||!me(e))return void alert(i18nManager.getMessage("settingsDomainInvalid"));Z.value="",ee.disabled=!0;const n=ue.getSettings().autoCheckOnDomains;n.includes(t)?Pe(n,!1):(n.push(t),ue.updateSettings({autoCheckOnDomains:n}).then((()=>Pe(n,!1))))}function He(e){const t=e.currentTarget.dataset.domain;if(t){const e=ue.getSettings().autoCheckOnDomains.filter((e=>e!==t));ue.updateSettings({autoCheckOnDomains:e}).then((()=>Pe(e,0===e.length)))}}function qe(e=ue.getSettings().ignoreCheckOnDomains,t=0===ue.getSettings().ignoreCheckOnDomains.length){oe.innerHTML="";const n=i18nManager.getMessage("settingsDeleteIgnoredDomain");for(const t of e){const e=document.createElement("li");e.className="lt-options__rules__item";const o=document.createElement("span");o.className="lt-options__rules__title",o.textContent="● "+t,e.appendChild(o);const a=document.createElement("span");a.className="lt-options__rules__enable-button",a.setAttribute("title",n),a.dataset.domain=t,a.textContent=n,a.addEventListener("click",je),e.appendChild(a),oe.appendChild(e)}const o=document.getElementById("ignoredDomains-optionsInside"),a=document.getElementById("ignoredDomains-options__emptyState"),s=document.getElementById("ignoredDomains-options__emptySearch");e.length>0?(o.style.display="block",a.style.display="none",s.style.display="none"):t?(o.style.display="none",a.style.display="block",s.style.display="none"):(o.style.display="none",a.style.display="none",s.style.display="block")}function $e(){const e=ae.value;se.disabled=""===e.trim();const t=ue.getSettings().ignoreCheckOnDomains.sort(((e,t)=>e.toLowerCase().localeCompare(t.toLowerCase()))),n=[];for(const o of t)o.includes(e)&&n.push(o);qe(n,0===t.length)}function Ye(){const e=ae.value.trim(),t=getDomain(e);if(""===t.trim()||!me(e))return void alert(i18nManager.getMessage("settingsDomainInvalid"));ae.value="",se.disabled=!0;const n=ue.getSettings().ignoreCheckOnDomains;n.includes(t)?qe(n,!1):(n.push(t),ue.updateSettings({ignoreCheckOnDomains:n}).then((()=>qe(n,!1))))}function je(e){const t=e.currentTarget.dataset.domain;if(t){const e=ue.getSettings().ignoreCheckOnDomains.filter((e=>e!==t));ue.updateSettings({ignoreCheckOnDomains:e}).then((()=>qe(e,0===e.length)))}}translateSection(document.documentElement),document.documentElement.lang=navigator.language,BrowserDetector.isSafari()?document.getElementById("haveAccountDesc").style.display="none":document.getElementById("haveAccountDesc").innerHTML=i18nManager.getMessage("haveAccountDesc")+" <a target='_blank' href='https://languagetool.org'>LanguageTool.org</a>",document.getElementById("privacyPolicy").innerHTML="<a target='_blank' href='https://languagetool.org/privacy/'>"+i18nManager.getMessage("privacyPolicy")+"</a>",Array.from(document.querySelectorAll("[data-premium-link]")).forEach((e=>{e.addEventListener("click",(e=>{browser.runtime.sendMessage({command:"OPEN_PREMIUM_PAGE",campaign:"addon2-options"}),e.preventDefault()}))}));const Fe=location.hash.replace(/\?.*$/,""),We=document.querySelector(Fe||"#login");We&&We.nextElementSibling&&We.nextElementSibling.classList.contains("lt-toggle-box")&&(We.classList.add("lt-options-toggle--visible"),We.nextElementSibling.classList.add("lt-toggle-box--visible"),Fe&&document.documentElement.scrollTo(0,We.offsetTop-75));let ze;LanguageManager.getUserLanguageCodes().some((e=>e.startsWith("de")||e.startsWith("fr")||e.startsWith("nl")))&&(document.getElementById("made-in-potsdam").style.display="inline"),ue.onReady((function(){pe(),_e(),Be(),Ae(),ye(),Array.from(de).forEach((e=>{const t=e.querySelector("select");null==t||t.addEventListener("change",(()=>{const n=e.querySelector("span")||document.createElement("span"),o=Array.from(t.children).filter((e=>e instanceof HTMLOptionElement)).find((e=>e.value===t.value));n.parentNode&&n.parentNode.removeChild(n),n.textContent=(null==o?void 0:o.textContent)||"",e.insertBefore(n,t),e.dataset.ltNiceSelect=t.value}))})),O.addEventListener("click",Ee),R.addEventListener("change",he),fe();const e=ue.getSettings();e.apiServerUrl===config.MAIN_SERVER_URL?V.checked=!0:e.apiServerUrl===config.LOCAL_SERVER_URL?G.checked=!0:(Re(!0),H.checked=!0,Y.value=e.apiServerUrl),ve(j,e.motherTongue),ve(F,e.enVariant),ve(W,e.deVariant),ve(z,e.ptVariant),ve(J,e.caVariant),K.checked=e.autoCheck,Ue(e.autoCheck),e.hasSynonymsEnabled?be():ke(),function(e){e?Le():Se()}(e.hasPickyModeEnabledGlobally),Pe(),qe(),ue.addEventListener(StorageControllerClass.eventNames.uiStateChanged,(e=>{e.hasPaidSubscription&&e.hasPaidSubscription.newValue&&pe()}))})),ue.onReady((()=>{ue.startChangelogCoupon();const e=ue.getActiveCoupon();e&&(window.clearInterval(ze),ze=window.setInterval((()=>{g.querySelector("#lt-options-dicount-percent").textContent=i18nManager.getMessage("upgradeTeaserDiscount",[e.percent]),g.querySelector("#lt-options-discount-expires").textContent=` – ${i18nManager.getMessage("changelogDiscountExpires")} ${getCountdown(e.expires||0)}`,g.classList.add("lt-options__discount--visible")}),1e3))})),Dictionary.init(ue),Tracker.trackPageView(),o.addEventListener("click",(e=>{e.preventDefault(),function(){const e=document.getElementById("login-success"),t=document.getElementById("login-error");ue.updateSettings({username:"",password:"",userId:null,token:"",isDictionarySynced:!1,havePremiumAccount:!1}).then((()=>{Tracker.trackEvent("Action","logout"),e.style.display="block",translateElement(e,"settingsLogoutSuccess")})).catch((()=>{t.style.display="block",translateElement(t,"settingsUnknownError")})).then((()=>{ue.checkForPaidSubscription().then(pe),browser.runtime.sendMessage({command:"LOGOUT"})}))}()})),a.addEventListener("click",(e=>{e.preventDefault(),window.open("https://languagetool.org/editor/settings/account","_blank")})),c.addEventListener("click",(e=>{e.preventDefault(),function(){const{loginUrl:e}=ue.getManagedSettings();goToManagedLogin(e,((e,t)=>(ue.updatePrivacySettings({allowRemoteCheck:!0}),ue.updateSettings({username:e,password:"",token:t,knownEmail:e,havePremiumAccount:!0}).then((()=>(ye(),ue.checkForPaidSubscription()))).then((()=>{pe(),browser.runtime.sendMessage({command:"START_DICTIONARY_SYNC"}),browser.runtime.sendMessage({command:"LOGIN"})})))))}()})),r.addEventListener("click",(e=>{e.preventDefault(),ue.updateSettings({username:"",password:"",userId:null,token:"",isDictionarySynced:!1,havePremiumAccount:!1}).then((()=>{ye(),ue.checkForPaidSubscription().then(pe),browser.runtime.sendMessage({command:"LOGOUT"})}))})),s.addEventListener("click",(e=>{e.preventDefault(),function(){const e=config.CLIENT_LOGIN_URL,t=document.getElementById("login-error"),n=document.getElementById("login-success");goToLogin(e,((e,o)=>(ue.updatePrivacySettings({allowRemoteCheck:!0}),ue.updateSettings({username:e,password:"",token:o,knownEmail:e,havePremiumAccount:!0,apiServerUrl:config.MAIN_SERVER_URL}).then((()=>(Tracker.trackEvent("Action","login",e),n.style.display="block",translateElement(n,"settingsLoginSuccess"),ye(),ue.checkForPaidSubscription()))).then((()=>{pe(),EnvironmentAdapter.startDictionarySync()})).catch((()=>{Tracker.trackEvent("Action","login_error",e),t.style.display="block",translateElement(t,"settingsLoginError")})).then((()=>{browser.runtime.sendMessage({command:"LOGIN"})})))))}()})),u.addEventListener("click",(()=>{u.classList.contains("lt-toggle--checked")?(ke(),Tracker.trackEvent("Action","disable_synonyms",LanguageManager.getUserLanguageCodes()[0])):(be(),Tracker.trackEvent("Action","enable_synonyms",LanguageManager.getUserLanguageCodes()[0]))})),m.addEventListener("click",(()=>{m.classList.contains("lt-toggle--checked")?(Se(),Tracker.trackEvent("Action","disable_picky_mode",LanguageManager.getUserLanguageCodes()[0])):(Le(),Tracker.trackEvent("Action","enable_picky_mode",LanguageManager.getUserLanguageCodes()[0]))})),p.addEventListener("click",(()=>{y.classList.toggle("lt-toggle-box--visible"),p.classList.toggle("lt-options-toggle--visible")&&h.focus()})),h.addEventListener("keydown",(e=>{"Enter"===e.key&&De()})),h.addEventListener("input",(()=>{setTimeout(Ie,0)})),h.addEventListener("paste",(function(e){if(h.value)return;if(!e.clipboardData)return;const t=e.clipboardData.getData("text/plain");if(!t)return;const n=t.split(/\s+/);n.length<=1||(e.preventDefault(),Dictionary.addBatch(n).then((()=>_e())))})),f.addEventListener("click",De),v.addEventListener("click",(function(){confirm(i18nManager.getMessage("settingsAreYouSure"))&&Dictionary.clear().then((()=>_e([],!0)))})),b.addEventListener("click",(function(){const e=Dictionary.getSorted(),t=document.createElement("textarea");t.value=e.join("\n"),document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t);const n=document.getElementById("personalDictionary-options__copyMessage");n.style.display="block",wait(3e3).then((()=>fadeOut(n,(()=>{n.style.display="none",n.style.opacity="1"}))))})),k.addEventListener("click",(()=>{k.classList.toggle("lt-options-toggle--visible"),L.classList.toggle("lt-toggle-box--visible")})),_.addEventListener("click",(function(){ue.updateSettings({ignoredRules:[]}).then(Be)})),BrowserDetector.isThunderbird()?(I.hidden=!0,document.body.setAttribute("data-is-thunderbird","true")):I.addEventListener("click",(()=>{D.classList.toggle("lt-toggle-box--visible"),I.classList.toggle("lt-options-toggle--visible")&&B.focus()})),B.addEventListener("keydown",(e=>{"Enter"===e.key&&we()})),B.addEventListener("input",(()=>{setTimeout(Te,0)})),B.addEventListener("paste",(function(e){if(B.value)return;if(!e.clipboardData)return;const t=e.clipboardData.getData("text/plain");if(!t)return;const n=t.split(/\s+/);if(n.length<=1)return;e.preventDefault();const o=ue.getSettings().disabledDomains;n.forEach((e=>{const t=getDomain(e,"");t.trim()&&me(e)&&!o.includes(t)&&o.push(t)})),ue.updateSettings({disabledDomains:o}).then(Te)})),M.addEventListener("click",we),A.addEventListener("click",(function(){confirm(i18nManager.getMessage("settingsAreYouSure"))&&ue.updateSettings({disabledDomains:[]}).then((()=>Ae([],!0)))})),T.addEventListener("click",(()=>{T.classList.toggle("lt-options-toggle--visible"),w.classList.toggle("lt-toggle-box--visible")})),N.addEventListener("click",(e=>{N.classList.toggle("lt-options-toggle--visible"),U.classList.toggle("lt-toggle-box--visible")})),V.addEventListener("click",Oe),G.addEventListener("click",Oe),H.addEventListener("click",Oe),$.addEventListener("click",(e=>{e.preventDefault(),Ne()})),P.addEventListener("submit",(e=>{e.preventDefault(),function(){let e="";e=V.checked?config.MAIN_SERVER_URL:G.checked?config.LOCAL_SERVER_URL:Y.value.trim();const t=document.getElementById("serverUrl-success"),n=document.getElementById("serverUrl-error");ue.updateSettings({apiServerUrl:e}).then((()=>{ue.checkForPaidSubscription().then((()=>{pe()})),t.style.display="block",wait(3e3).then((()=>fadeOut(t,(()=>{t.style.display="none",t.style.opacity="1"}))))})).catch((()=>{n.style.display="block",wait(3e3).then((()=>fadeOut(n,(()=>{n.style.display="none",n.style.opacity="1"}))))}))}()})),j.addEventListener("change",(function(){ue.updateSettings({motherTongue:j.value})})),F.addEventListener("change",(function(){ue.updateSettings({enVariant:F.value})})),W.addEventListener("change",(function(){ue.updateSettings({deVariant:W.value})})),z.addEventListener("change",(function(){ue.updateSettings({ptVariant:z.value})})),J.addEventListener("change",(function(){ue.updateSettings({caVariant:J.value})})),K.addEventListener("input",(()=>{ue.updateSettings({autoCheck:K.checked}),Ue(K.checked)})),Z.addEventListener("keydown",(e=>{"Enter"===e.key&&Ge()})),Z.addEventListener("input",(()=>{setTimeout(Ve,0)})),Z.addEventListener("paste",(function(e){if(Z.value)return;if(!e.clipboardData)return;const t=e.clipboardData.getData("text/plain");if(!t)return;const n=t.split(/\s+/);if(n.length<=1)return;e.preventDefault();const o=ue.getSettings().autoCheckOnDomains;n.forEach((e=>{const t=getDomain(e,"");t.trim()&&me(e)&&!o.includes(t)&&o.push(t)})),ue.updateSettings({autoCheckOnDomains:o}).then(Ve)})),ee.addEventListener("click",Ge),te.addEventListener("click",(function(){confirm(i18nManager.getMessage("settingsAreYouSure"))&&ue.updateSettings({autoCheckOnDomains:[]}).then((()=>Pe([],!0)))})),ae.addEventListener("keydown",(e=>{"Enter"===e.key&&Ye()})),ae.addEventListener("input",(()=>{setTimeout($e,0)})),ae.addEventListener("paste",(function(e){if(ae.value)return;if(!e.clipboardData)return;const t=e.clipboardData.getData("text/plain");if(!t)return;const n=t.split(/\s+/);if(n.length<=1)return;e.preventDefault();const o=ue.getSettings().ignoreCheckOnDomains;n.forEach((e=>{const t=getDomain(e);t.trim()&&me(e)&&!o.includes(t)&&o.push(t)})),ue.updateSettings({ignoreCheckOnDomains:o}).then($e)})),se.addEventListener("click",Ye),ie.addEventListener("click",(function(){confirm(i18nManager.getMessage("settingsAreYouSure"))&&ue.updateSettings({ignoreCheckOnDomains:[]}).then((()=>qe([],!0)))})),BrowserDetector.isSafari()&&le instanceof HTMLAnchorElement&&(le.href+=le.href.includes("?")?"&hidePremium=true":"?hidePremium=true"),ue.onReady((()=>{const e=document.querySelector("#heart");if(e){const{showRuleId:t}=ue.getUIState();let n=0;e.style.cursor="default",e.style.userSelect="none",t&&(e.style.color="blue"),e.addEventListener("click",(o=>{4==++n&&(t?(e.style.color="",ue.updateUIState({showRuleId:!1})):(e.style.color="blue",ue.updateUIState({showRuleId:!0}))),o.preventDefault()}))}}))}();