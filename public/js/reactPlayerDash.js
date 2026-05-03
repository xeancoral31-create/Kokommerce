"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["reactPlayerDash"],{

/***/ "./node_modules/custom-media-element/dist/custom-media-element.js":
/*!************************************************************************!*\
  !*** ./node_modules/custom-media-element/dist/custom-media-element.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Attributes": () => (/* binding */ Attributes),
/* harmony export */   "CustomAudioElement": () => (/* binding */ CustomAudioElement),
/* harmony export */   "CustomMediaMixin": () => (/* binding */ CustomMediaMixin),
/* harmony export */   "CustomVideoElement": () => (/* binding */ CustomVideoElement),
/* harmony export */   "Events": () => (/* binding */ Events)
/* harmony export */ });
const Events = [
  "abort",
  "canplay",
  "canplaythrough",
  "durationchange",
  "emptied",
  "encrypted",
  "ended",
  "error",
  "loadeddata",
  "loadedmetadata",
  "loadstart",
  "pause",
  "play",
  "playing",
  "progress",
  "ratechange",
  "seeked",
  "seeking",
  "stalled",
  "suspend",
  "timeupdate",
  "volumechange",
  "waiting",
  "waitingforkey",
  "resize",
  "enterpictureinpicture",
  "leavepictureinpicture",
  "webkitbeginfullscreen",
  "webkitendfullscreen",
  "webkitpresentationmodechanged"
];
const Attributes = [
  "autopictureinpicture",
  "disablepictureinpicture",
  "disableremoteplayback",
  "autoplay",
  "controls",
  "controlslist",
  "crossorigin",
  "loop",
  "muted",
  "playsinline",
  "poster",
  "preload",
  "src"
];
function getAudioTemplateHTML(attrs) {
  return (
    /*html*/
    `
    <style>
      :host {
        display: inline-flex;
        line-height: 0;
        flex-direction: column;
        justify-content: end;
      }

      audio {
        width: 100%;
      }
    </style>
    <slot name="media">
      <audio${serializeAttributes(attrs)}></audio>
    </slot>
    <slot></slot>
  `
  );
}
function getVideoTemplateHTML(attrs) {
  return (
    /*html*/
    `
    <style>
      :host {
        display: inline-block;
        line-height: 0;
      }

      video {
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
        min-height: 100%;
        object-fit: var(--media-object-fit, contain);
        object-position: var(--media-object-position, 50% 50%);
      }

      video::-webkit-media-text-track-container {
        transform: var(--media-webkit-text-track-transform);
        transition: var(--media-webkit-text-track-transition);
      }
    </style>
    <slot name="media">
      <video${serializeAttributes(attrs)}></video>
    </slot>
    <slot></slot>
  `
  );
}
function CustomMediaMixin(superclass, { tag, is }) {
  const nativeElTest = globalThis.document?.createElement?.(tag, { is });
  const nativeElProps = nativeElTest ? getNativeElProps(nativeElTest) : [];
  return class CustomMedia extends superclass {
    static getTemplateHTML = tag.endsWith("audio") ? getAudioTemplateHTML : getVideoTemplateHTML;
    static shadowRootOptions = { mode: "open" };
    static Events = Events;
    static #isDefined = false;
    static get observedAttributes() {
      CustomMedia.#define();
      const natAttrs = nativeElTest?.constructor?.observedAttributes ?? [];
      return [
        ...natAttrs,
        ...Attributes
      ];
    }
    static #define() {
      if (this.#isDefined) return;
      this.#isDefined = true;
      const propsToAttrs = new Set(this.observedAttributes);
      propsToAttrs.delete("muted");
      for (const prop of nativeElProps) {
        if (prop in this.prototype) continue;
        if (typeof nativeElTest[prop] === "function") {
          this.prototype[prop] = function(...args) {
            this.#init();
            const fn = () => {
              if (this.call) return this.call(prop, ...args);
              const nativeFn = this.nativeEl?.[prop];
              return nativeFn?.apply(this.nativeEl, args);
            };
            return fn();
          };
        } else {
          const config = {
            get() {
              this.#init();
              const attr = prop.toLowerCase();
              if (propsToAttrs.has(attr)) {
                const val = this.getAttribute(attr);
                return val === null ? false : val === "" ? true : val;
              }
              return this.get?.(prop) ?? this.nativeEl?.[prop];
            }
          };
          if (prop !== prop.toUpperCase()) {
            config.set = function(val) {
              this.#init();
              const attr = prop.toLowerCase();
              if (propsToAttrs.has(attr)) {
                if (val === true || val === false || val == null) {
                  this.toggleAttribute(attr, Boolean(val));
                } else {
                  this.setAttribute(attr, val);
                }
                return;
              }
              if (this.set) {
                this.set(prop, val);
                return;
              }
              if (this.nativeEl) {
                this.nativeEl[prop] = val;
              }
            };
          }
          Object.defineProperty(this.prototype, prop, config);
        }
      }
    }
    // Private fields
    #isInit = false;
    #nativeEl = null;
    #childMap = /* @__PURE__ */ new Map();
    #childObserver;
    #slotChangeHandler;
    get;
    set;
    call;
    // If the custom element is defined before the custom element's HTML is parsed
    // no attributes will be available in the constructor (construction process).
    // Wait until initializing in the attributeChangedCallback or
    // connectedCallback or accessing any properties.
    get nativeEl() {
      this.#init();
      return this.#nativeEl ?? this.querySelector(":scope > [slot=media]") ?? this.querySelector(tag) ?? this.shadowRoot?.querySelector(tag) ?? null;
    }
    set nativeEl(val) {
      this.#nativeEl = val;
    }
    get defaultMuted() {
      return this.hasAttribute("muted");
    }
    set defaultMuted(val) {
      this.toggleAttribute("muted", val);
    }
    get src() {
      return this.getAttribute("src");
    }
    set src(val) {
      this.setAttribute("src", `${val}`);
    }
    get preload() {
      return this.getAttribute("preload") ?? this.nativeEl?.preload;
    }
    set preload(val) {
      this.setAttribute("preload", `${val}`);
    }
    #init() {
      if (this.#isInit) return;
      this.#isInit = true;
      this.init();
    }
    init() {
      if (!this.shadowRoot) {
        this.attachShadow({ mode: "open" });
        const attrs = namedNodeMapToObject(this.attributes);
        if (is) attrs.is = is;
        if (tag) attrs.part = tag;
        this.shadowRoot.innerHTML = this.constructor.getTemplateHTML(attrs);
      }
      this.nativeEl.muted = this.hasAttribute("muted");
      for (const prop of nativeElProps) {
        this.#upgradeProperty(prop);
      }
      this.#setupListeners();
    }
    #setupListeners() {
      this.#childObserver = new MutationObserver(this.#syncMediaChildAttribute.bind(this));
      this.#slotChangeHandler = () => this.#syncMediaChildren();
      this.shadowRoot?.addEventListener("slotchange", this.#slotChangeHandler);
      this.#syncMediaChildren();
      for (const type of this.constructor.Events) {
        this.shadowRoot?.addEventListener(type, this, true);
      }
    }
    handleEvent(event) {
      if (event.target === this.nativeEl) {
        this.dispatchEvent(new CustomEvent(event.type, { detail: event.detail }));
      }
    }
    #syncMediaChildren() {
      const removeNativeChildren = new Map(this.#childMap);
      const defaultSlot = this.shadowRoot?.querySelector("slot:not([name])");
      const mediaChildren = defaultSlot?.assignedElements({ flatten: true }).filter((el) => ["track", "source"].includes(el.localName));
      mediaChildren.forEach((el) => {
        removeNativeChildren.delete(el);
        let clone = this.#childMap.get(el);
        if (!clone) {
          clone = el.cloneNode();
          this.#childMap.set(el, clone);
          this.#childObserver?.observe(el, { attributes: true });
        }
        this.nativeEl?.append(clone);
        this.#enableDefaultTrack(clone);
      });
      removeNativeChildren.forEach((clone, el) => {
        clone.remove();
        this.#childMap.delete(el);
      });
    }
    #syncMediaChildAttribute(mutations) {
      for (const mutation of mutations) {
        if (mutation.type === "attributes") {
          const { target, attributeName } = mutation;
          const clone = this.#childMap.get(target);
          if (clone && attributeName) {
            clone.setAttribute(attributeName, target.getAttribute(attributeName) ?? "");
            this.#enableDefaultTrack(clone);
          }
        }
      }
    }
    #enableDefaultTrack(trackEl) {
      if (trackEl && trackEl.localName === "track" && trackEl.default && (trackEl.kind === "chapters" || trackEl.kind === "metadata") && trackEl.track.mode === "disabled") {
        trackEl.track.mode = "hidden";
      }
    }
    #upgradeProperty(prop) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        const value = this[prop];
        delete this[prop];
        this[prop] = value;
      }
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
      this.#init();
      this.#forwardAttribute(attrName, oldValue, newValue);
    }
    #forwardAttribute(attrName, _oldValue, newValue) {
      if (["id", "class"].includes(attrName)) return;
      if (!CustomMedia.observedAttributes.includes(attrName) && this.constructor.observedAttributes.includes(attrName)) {
        return;
      }
      if (newValue === null) {
        this.nativeEl?.removeAttribute(attrName);
      } else if (this.nativeEl?.getAttribute(attrName) !== newValue) {
        this.nativeEl?.setAttribute(attrName, newValue);
      }
    }
    connectedCallback() {
      this.#init();
      if (!this.#slotChangeHandler) {
        this.#setupListeners();
      }
    }
    disconnectedCallback() {
      this.#childObserver?.disconnect();
      this.#childObserver = void 0;
      if (this.#slotChangeHandler) {
        this.shadowRoot?.removeEventListener("slotchange", this.#slotChangeHandler);
        this.#slotChangeHandler = void 0;
      }
      for (const type of this.constructor.Events) {
        this.shadowRoot?.removeEventListener(type, this, true);
      }
      this.#childMap.forEach((clone) => clone.remove());
      this.#childMap.clear();
      this.#nativeEl = null;
    }
  };
}
function getNativeElProps(nativeElTest) {
  const nativeElProps = [];
  for (let proto = Object.getPrototypeOf(nativeElTest); proto && proto !== HTMLElement.prototype; proto = Object.getPrototypeOf(proto)) {
    const props = Object.getOwnPropertyNames(proto);
    nativeElProps.push(...props);
  }
  return nativeElProps;
}
function serializeAttributes(attrs) {
  let html = "";
  for (const key in attrs) {
    if (!Attributes.includes(key)) continue;
    const value = attrs[key];
    if (value === "") html += ` ${key}`;
    else html += ` ${key}="${value}"`;
  }
  return html;
}
function namedNodeMapToObject(namedNodeMap) {
  const obj = {};
  for (const attr of namedNodeMap) {
    obj[attr.name] = attr.value;
  }
  return obj;
}
const CustomVideoElement = CustomMediaMixin(globalThis.HTMLElement ?? class {
}, {
  tag: "video"
});
const CustomAudioElement = CustomMediaMixin(globalThis.HTMLElement ?? class {
}, {
  tag: "audio"
});



/***/ }),

/***/ "./node_modules/dash-video-element/dist/dash-video-element.js":
/*!********************************************************************!*\
  !*** ./node_modules/dash-video-element/dist/dash-video-element.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ dash_video_element_default)
/* harmony export */ });
/* harmony import */ var custom_media_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! custom-media-element */ "./node_modules/custom-media-element/dist/custom-media-element.js");
/* harmony import */ var media_tracks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! media-tracks */ "./node_modules/media-tracks/dist/index.js");


class DashVideoElement extends (0,media_tracks__WEBPACK_IMPORTED_MODULE_1__.MediaTracksMixin)(custom_media_element__WEBPACK_IMPORTED_MODULE_0__.CustomVideoElement) {
  static shadowRootOptions = { ...custom_media_element__WEBPACK_IMPORTED_MODULE_0__.CustomVideoElement.shadowRootOptions };
  static getTemplateHTML = (attrs) => {
    const { src, ...rest } = attrs;
    return custom_media_element__WEBPACK_IMPORTED_MODULE_0__.CustomVideoElement.getTemplateHTML(rest);
  };
  #apiInit;
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName !== "src") {
      super.attributeChangedCallback(attrName, oldValue, newValue);
    }
    if (attrName === "src" && oldValue != newValue) {
      this.load();
    }
  }
  async _initThumbnails(representation) {
    const generateAllCues = async (totalThumbnails2, thumbnailDuration2) => {
      const promises = [];
      const timescale = representation.timescale || 1;
      const startNumber = representation.startNumber || 1;
      const pto = representation.presentationTimeOffset ? representation.presentationTimeOffset / timescale : 0;
      const tduration = representation.segmentDuration;
      for (let thIndex = 0; thIndex < totalThumbnails2; thIndex++) {
        const startTime = calculateThumbnailStartTime({
          thIndex,
          thduration: thumbnailDuration2,
          ttiles: totalThumbnails2,
          tduration,
          startNumber,
          pto
        });
        const endTime = startTime + thumbnailDuration2;
        const promise = new Promise((resolve, reject) => {
          this.api.provideThumbnail(startTime, ({ url, width, height, x, y }) => {
            try {
              const cue = new VTTCue(
                startTime,
                endTime,
                `${url}#xywh=${x},${y},${width},${height}`
              );
              resolve(cue);
            } catch (err) {
              reject(err);
            }
          });
        });
        promises.push(promise);
      }
      return await Promise.all(promises).catch((e) => console.error("Error processing thumbnails", e));
    };
    const { totalThumbnails, thumbnailDuration } = calculateThumbnailTimes(representation);
    const cues = await generateAllCues(totalThumbnails, thumbnailDuration);
    let track = this.nativeEl.querySelector('track[label="thumbnails"]');
    if (!track) {
      track = createThumbnailTrack();
      this.nativeEl.appendChild(track);
      const vttUrl = cuesToVttBlobUrl(cues);
      track.src = vttUrl;
      track.dispatchEvent(new Event("change"));
    }
  }
  async load() {
    if (this.#apiInit) {
      this.api.attachSource(this.src);
      return;
    }
    this.#apiInit = true;
    const Dash = await __webpack_require__.e(/*! import() */ "node_modules_dashjs_dist_modern_esm_dash_all_min_js").then(__webpack_require__.bind(__webpack_require__, /*! dashjs */ "./node_modules/dashjs/dist/modern/esm/dash.all.min.js"));
    this.api = Dash.MediaPlayer().create();
    this.api.initialize(this.nativeEl, this.src, this.autoplay);
    this.api.on(Dash.MediaPlayer.events.STREAM_INITIALIZED, () => {
      const bitrateList = this.api.getRepresentationsByType("video");
      let videoTrack = this.videoTracks.getTrackById("main");
      if (!videoTrack) {
        videoTrack = this.addVideoTrack("main");
        videoTrack.id = "main";
        videoTrack.selected = true;
      }
      bitrateList.forEach((rep) => {
        const bitrate = rep.bandwidth ?? rep.bitrate ?? (Number.isFinite(rep.bitrateInKbit) ? rep.bitrateInKbit * 1e3 : void 0);
        const rendition = videoTrack.addRendition(rep.id, rep.width, rep.height, rep.mimeType ?? rep.codec, bitrate);
        rendition.id = rep.id;
      });
      this.videoRenditions.addEventListener("change", () => {
        const selected = this.videoRenditions[this.videoRenditions.selectedIndex];
        if (selected == null ? void 0 : selected.id) {
          this.api.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: false } } } });
          this.api.setRepresentationForTypeById("video", selected.id, true);
        } else {
          this.api.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: true } } } });
        }
      });
      if (!this.api.isDynamic()) {
        const imageReps = this.api.getRepresentationsByType("image");
        imageReps.forEach(async (rep, idx) => {
          if (idx > 0) return;
          this._initThumbnails(rep);
        });
      }
    });
  }
}
function calculateThumbnailTimes(representation) {
  var _a, _b;
  const essentialProp = representation.essentialProperties[0];
  const [htiles, vtiles] = essentialProp.value.split("x").map(Number);
  const ttiles = htiles * vtiles;
  const periodDuration = ((_b = (_a = representation.adaptation) == null ? void 0 : _a.period) == null ? void 0 : _b.duration) || null;
  const tileDuration = representation.segmentDuration;
  const timescale = representation.timescale || 1;
  const tduration = tileDuration / timescale;
  const thduration = tduration / ttiles;
  const totalThumbnails = periodDuration != null ? Math.ceil(periodDuration / thduration) : Math.ceil(tileDuration / thduration);
  return { totalThumbnails, thumbnailDuration: thduration };
}
function calculateThumbnailStartTime({ thIndex, tduration, thduration, ttiles, startNumber, pto }) {
  const tnumber = Math.floor(thIndex / ttiles) + startNumber;
  const thnumber = thIndex % ttiles + 1;
  const tileStartTime = (tnumber - 1) * tduration - pto;
  const thumbnailStartTime = (thnumber - 1) * thduration;
  return tileStartTime + thumbnailStartTime;
}
function createThumbnailTrack() {
  const track = document.createElement("track");
  track.kind = "metadata";
  track.label = "thumbnails";
  track.srclang = "en";
  track.mode = "hidden";
  track.default = true;
  return track;
}
function cuesToVttBlobUrl(cues) {
  let vtt = "WEBVTT\n\n";
  for (const cue of cues) {
    vtt += `${formatTime(cue.startTime)} --> ${formatTime(cue.endTime)}
`;
    vtt += `${cue.text}

`;
  }
  const blob = new Blob([vtt], { type: "text/vtt" });
  return URL.createObjectURL(blob);
  function formatTime(t) {
    const h = String(Math.floor(t / 3600)).padStart(2, "0");
    const m = String(Math.floor(t % 3600 / 60)).padStart(2, "0");
    const s = (t % 60).toFixed(3).padStart(6, "0");
    return `${h}:${m}:${s}`;
  }
}
if (globalThis.customElements && !globalThis.customElements.get("dash-video")) {
  globalThis.customElements.define("dash-video", DashVideoElement);
}
var dash_video_element_default = DashVideoElement;



/***/ }),

/***/ "./node_modules/dash-video-element/dist/react.js":
/*!*******************************************************!*\
  !*** ./node_modules/dash-video-element/dist/react.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ react_default)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _dash_video_element_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dash-video-element.js */ "./node_modules/dash-video-element/dist/dash-video-element.js");
"use client";

// dist/react.ts



// ../../node_modules/ce-la-react/dist/ce-la-react.js
var reservedReactProps = /* @__PURE__ */ new Set([
  "style",
  "children",
  "ref",
  "key",
  "suppressContentEditableWarning",
  "suppressHydrationWarning",
  "dangerouslySetInnerHTML"
]);
var reactPropToAttrNameMap = {
  className: "class",
  htmlFor: "for"
};
function defaultToAttributeName(propName) {
  return propName.toLowerCase();
}
function defaultToAttributeValue(propValue) {
  if (typeof propValue === "boolean") return propValue ? "" : void 0;
  if (typeof propValue === "function") return void 0;
  if (typeof propValue === "object" && propValue !== null) return void 0;
  return propValue;
}
function createComponent({
  react: React2,
  tagName,
  elementClass,
  events,
  displayName,
  defaultProps,
  toAttributeName = defaultToAttributeName,
  toAttributeValue = defaultToAttributeValue
}) {
  const IS_REACT_19_OR_NEWER = Number.parseInt(React2.version) >= 19;
  const ReactComponent = React2.forwardRef((props, ref) => {
    var _a, _b;
    const elementRef = React2.useRef(null);
    const prevElemPropsRef = React2.useRef(/* @__PURE__ */ new Map());
    const eventProps = {};
    const attrs = {};
    const reactProps = {};
    const elementProps = {};
    for (const [k, v] of Object.entries(props)) {
      if (reservedReactProps.has(k)) {
        reactProps[k] = v;
        continue;
      }
      const attrName = toAttributeName(reactPropToAttrNameMap[k] ?? k);
      if (elementClass.prototype && k in elementClass.prototype && !(k in (((_a = globalThis.HTMLElement) == null ? void 0 : _a.prototype) ?? {})) && !((_b = elementClass.observedAttributes) == null ? void 0 : _b.some((attr) => attr === attrName))) {
        elementProps[k] = v;
        continue;
      }
      if (k.startsWith("on")) {
        eventProps[k] = v;
        continue;
      }
      const attrValue = toAttributeValue(v);
      if (attrName && attrValue != null) {
        attrs[attrName] = String(attrValue);
        if (!IS_REACT_19_OR_NEWER) {
          reactProps[attrName] = attrValue;
        }
      }
      if (attrName && IS_REACT_19_OR_NEWER) {
        const attrValueFromDefault = defaultToAttributeValue(v);
        if (attrValue !== attrValueFromDefault) {
          reactProps[attrName] = attrValue;
        } else {
          reactProps[attrName] = v;
        }
      }
    }
    if (typeof window !== "undefined") {
      for (const propName in eventProps) {
        const callback = eventProps[propName];
        const useCapture = propName.endsWith("Capture");
        const eventName = ((events == null ? void 0 : events[propName]) ?? propName.slice(2).toLowerCase()).slice(
          0,
          useCapture ? -7 : void 0
        );
        React2.useLayoutEffect(() => {
          const eventTarget = elementRef == null ? void 0 : elementRef.current;
          if (!eventTarget || typeof callback !== "function") return;
          eventTarget.addEventListener(eventName, callback, useCapture);
          return () => {
            eventTarget.removeEventListener(eventName, callback, useCapture);
          };
        }, [elementRef == null ? void 0 : elementRef.current, callback]);
      }
      React2.useLayoutEffect(() => {
        if (elementRef.current === null) return;
        const newElemProps = /* @__PURE__ */ new Map();
        for (const key in elementProps) {
          setProperty(elementRef.current, key, elementProps[key]);
          prevElemPropsRef.current.delete(key);
          newElemProps.set(key, elementProps[key]);
        }
        for (const [key, _value] of prevElemPropsRef.current) {
          setProperty(elementRef.current, key, void 0);
        }
        prevElemPropsRef.current = newElemProps;
      });
    }
    if (typeof window === "undefined" && (elementClass == null ? void 0 : elementClass.getTemplateHTML) && (elementClass == null ? void 0 : elementClass.shadowRootOptions)) {
      const { mode, delegatesFocus } = elementClass.shadowRootOptions;
      const templateShadowRoot = React2.createElement("template", {
        shadowrootmode: mode,
        shadowrootdelegatesfocus: delegatesFocus,
        dangerouslySetInnerHTML: {
          __html: elementClass.getTemplateHTML(attrs, props)
        },
        key: "ce-la-react-ssr-template-shadow-root"
      });
      reactProps.children = [templateShadowRoot, reactProps.children];
    }
    return React2.createElement(tagName, {
      ...defaultProps,
      ...reactProps,
      ref: React2.useCallback(
        (node) => {
          elementRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref !== null) {
            ref.current = node;
          }
        },
        [ref]
      )
    }, reactProps.children);
  });
  ReactComponent.displayName = displayName ?? elementClass.name;
  return ReactComponent;
}
function setProperty(node, name, value) {
  var _a;
  node[name] = value;
  if (value == null && name in (((_a = globalThis.HTMLElement) == null ? void 0 : _a.prototype) ?? {})) {
    node.removeAttribute(name);
  }
}

// dist/react.ts
var react_default = createComponent({
  react: react__WEBPACK_IMPORTED_MODULE_0__,
  tagName: "dash-video",
  elementClass: _dash_video_element_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  toAttributeName(propName) {
    if (propName === "muted") return "";
    if (propName === "defaultMuted") return "muted";
    return defaultToAttributeName(propName);
  }
});

/*! Bundled license information:

ce-la-react/dist/ce-la-react.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *
   * Modified version of `@lit/react` for vanilla custom elements with support for SSR.
   *)
*/


/***/ }),

/***/ "./node_modules/media-tracks/dist/audio-rendition-list.js":
/*!****************************************************************!*\
  !*** ./node_modules/media-tracks/dist/audio-rendition-list.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AudioRenditionList": () => (/* binding */ AudioRenditionList),
/* harmony export */   "addRendition": () => (/* binding */ addRendition),
/* harmony export */   "removeRendition": () => (/* binding */ removeRendition),
/* harmony export */   "selectedChanged": () => (/* binding */ selectedChanged)
/* harmony export */ });
/* harmony import */ var _rendition_event_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rendition-event.js */ "./node_modules/media-tracks/dist/rendition-event.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./node_modules/media-tracks/dist/utils.js");


function addRendition(track, rendition) {
  const renditionList = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(track).media?.deref()?.audioRenditions;
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(rendition).media = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(track).media;
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(rendition).track = track;
  const renditionSet = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(track).renditionSet;
  renditionSet.add(rendition);
  const index = renditionSet.size - 1;
  if (!(index in AudioRenditionList.prototype)) {
    Object.defineProperty(AudioRenditionList.prototype, index, {
      get() {
        return getCurrentRenditions(this)[index];
      }
    });
  }
  queueMicrotask(() => {
    if (!renditionList || !track.enabled) return;
    renditionList.dispatchEvent(new _rendition_event_js__WEBPACK_IMPORTED_MODULE_0__.RenditionEvent("addrendition", { rendition }));
  });
}
function removeRendition(rendition) {
  const renditionList = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(rendition).media?.deref()?.audioRenditions;
  const track = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(rendition).track;
  const renditionSet = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(track).renditionSet;
  renditionSet.delete(rendition);
  queueMicrotask(() => {
    const track2 = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(rendition).track;
    if (!renditionList || !track2.enabled) return;
    renditionList.dispatchEvent(new _rendition_event_js__WEBPACK_IMPORTED_MODULE_0__.RenditionEvent("removerendition", { rendition }));
  });
}
function selectedChanged(rendition) {
  const renditionList = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(rendition).media?.deref()?.audioRenditions;
  if (!renditionList || (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(renditionList).changeRequested) return;
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(renditionList).changeRequested = true;
  queueMicrotask(() => {
    delete (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(renditionList).changeRequested;
    const track = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(rendition).track;
    if (!track.enabled) return;
    renditionList.dispatchEvent(new Event("change"));
  });
}
function getCurrentRenditions(renditionList) {
  const media = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(renditionList).media?.deref();
  if (!media) return [];
  return [...media.audioTracks].filter((track) => track.enabled).flatMap((track) => [...(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(track).renditionSet]);
}
class AudioRenditionList extends EventTarget {
  #addRenditionCallback;
  #removeRenditionCallback;
  #changeCallback;
  [Symbol.iterator]() {
    return getCurrentRenditions(this).values();
  }
  get length() {
    return getCurrentRenditions(this).length;
  }
  getRenditionById(id) {
    return getCurrentRenditions(this).find((rendition) => `${rendition.id}` === `${id}`) ?? null;
  }
  get selectedIndex() {
    return getCurrentRenditions(this).findIndex((rendition) => rendition.selected);
  }
  set selectedIndex(index) {
    for (const [i, rendition] of getCurrentRenditions(this).entries()) {
      rendition.selected = i === index;
    }
  }
  get onaddrendition() {
    return this.#addRenditionCallback;
  }
  set onaddrendition(callback) {
    if (this.#addRenditionCallback) {
      this.removeEventListener("addrendition", this.#addRenditionCallback);
      this.#addRenditionCallback = void 0;
    }
    if (typeof callback == "function") {
      this.#addRenditionCallback = callback;
      this.addEventListener("addrendition", callback);
    }
  }
  get onremoverendition() {
    return this.#removeRenditionCallback;
  }
  set onremoverendition(callback) {
    if (this.#removeRenditionCallback) {
      this.removeEventListener("removerendition", this.#removeRenditionCallback);
      this.#removeRenditionCallback = void 0;
    }
    if (typeof callback == "function") {
      this.#removeRenditionCallback = callback;
      this.addEventListener("removerendition", callback);
    }
  }
  get onchange() {
    return this.#changeCallback;
  }
  set onchange(callback) {
    if (this.#changeCallback) {
      this.removeEventListener("change", this.#changeCallback);
      this.#changeCallback = void 0;
    }
    if (typeof callback == "function") {
      this.#changeCallback = callback;
      this.addEventListener("change", callback);
    }
  }
}



/***/ }),

/***/ "./node_modules/media-tracks/dist/audio-rendition.js":
/*!***********************************************************!*\
  !*** ./node_modules/media-tracks/dist/audio-rendition.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AudioRendition": () => (/* binding */ AudioRendition)
/* harmony export */ });
/* harmony import */ var _audio_rendition_list_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./audio-rendition-list.js */ "./node_modules/media-tracks/dist/audio-rendition-list.js");

class AudioRendition {
  src;
  id;
  bitrate;
  codec;
  #selected = false;
  get selected() {
    return this.#selected;
  }
  set selected(val) {
    if (this.#selected === val) return;
    this.#selected = val;
    (0,_audio_rendition_list_js__WEBPACK_IMPORTED_MODULE_0__.selectedChanged)(this);
  }
}



/***/ }),

/***/ "./node_modules/media-tracks/dist/audio-track-list.js":
/*!************************************************************!*\
  !*** ./node_modules/media-tracks/dist/audio-track-list.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AudioTrackList": () => (/* binding */ AudioTrackList),
/* harmony export */   "addAudioTrack": () => (/* binding */ addAudioTrack),
/* harmony export */   "enabledChanged": () => (/* binding */ enabledChanged),
/* harmony export */   "removeAudioTrack": () => (/* binding */ removeAudioTrack)
/* harmony export */ });
/* harmony import */ var _change_event_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./change-event.js */ "./node_modules/media-tracks/dist/change-event.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./node_modules/media-tracks/dist/utils.js");


function addAudioTrack(media, track) {
  const trackList = media.audioTracks;
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(track).media = new WeakRef(media);
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(track).renditionSet) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(track).renditionSet = /* @__PURE__ */ new Set();
  }
  const trackSet = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(trackList).trackSet;
  trackSet.add(track);
  const index = trackSet.size - 1;
  if (!(index in AudioTrackList.prototype)) {
    Object.defineProperty(AudioTrackList.prototype, index, {
      get() {
        return [...(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(this).trackSet][index];
      }
    });
  }
  queueMicrotask(() => {
    trackList.dispatchEvent(new _change_event_js__WEBPACK_IMPORTED_MODULE_0__.TrackEvent("addtrack", { track }));
  });
}
function removeAudioTrack(track) {
  const trackList = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(track).media?.deref()?.audioTracks;
  if (!trackList) return;
  const trackSet = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(trackList).trackSet;
  trackSet.delete(track);
  queueMicrotask(() => {
    trackList.dispatchEvent(new _change_event_js__WEBPACK_IMPORTED_MODULE_0__.TrackEvent("removetrack", { track }));
  });
}
function enabledChanged(track) {
  const trackList = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(track).media?.deref()?.audioTracks;
  if (!trackList || (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(trackList).changeRequested) return;
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(trackList).changeRequested = true;
  queueMicrotask(() => {
    delete (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(trackList).changeRequested;
    trackList.dispatchEvent(new Event("change"));
  });
}
class AudioTrackList extends EventTarget {
  #addTrackCallback;
  #removeTrackCallback;
  #changeCallback;
  constructor() {
    super();
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(this).trackSet = /* @__PURE__ */ new Set();
  }
  get #tracks() {
    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(this).trackSet;
  }
  [Symbol.iterator]() {
    return this.#tracks.values();
  }
  get length() {
    return this.#tracks.size;
  }
  getTrackById(id) {
    return [...this.#tracks].find((track) => track.id === id) ?? null;
  }
  get onaddtrack() {
    return this.#addTrackCallback;
  }
  set onaddtrack(callback) {
    if (this.#addTrackCallback) {
      this.removeEventListener("addtrack", this.#addTrackCallback);
      this.#addTrackCallback = void 0;
    }
    if (typeof callback == "function") {
      this.#addTrackCallback = callback;
      this.addEventListener("addtrack", callback);
    }
  }
  get onremovetrack() {
    return this.#removeTrackCallback;
  }
  set onremovetrack(callback) {
    if (this.#removeTrackCallback) {
      this.removeEventListener("removetrack", this.#removeTrackCallback);
      this.#removeTrackCallback = void 0;
    }
    if (typeof callback == "function") {
      this.#removeTrackCallback = callback;
      this.addEventListener("removetrack", callback);
    }
  }
  get onchange() {
    return this.#changeCallback;
  }
  set onchange(callback) {
    if (this.#changeCallback) {
      this.removeEventListener("change", this.#changeCallback);
      this.#changeCallback = void 0;
    }
    if (typeof callback == "function") {
      this.#changeCallback = callback;
      this.addEventListener("change", callback);
    }
  }
}



/***/ }),

/***/ "./node_modules/media-tracks/dist/audio-track.js":
/*!*******************************************************!*\
  !*** ./node_modules/media-tracks/dist/audio-track.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AudioTrack": () => (/* binding */ AudioTrack),
/* harmony export */   "AudioTrackKind": () => (/* binding */ AudioTrackKind)
/* harmony export */ });
/* harmony import */ var _audio_rendition_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./audio-rendition.js */ "./node_modules/media-tracks/dist/audio-rendition.js");
/* harmony import */ var _audio_track_list_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./audio-track-list.js */ "./node_modules/media-tracks/dist/audio-track-list.js");
/* harmony import */ var _audio_rendition_list_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./audio-rendition-list.js */ "./node_modules/media-tracks/dist/audio-rendition-list.js");



const AudioTrackKind = {
  alternative: "alternative",
  descriptions: "descriptions",
  main: "main",
  "main-desc": "main-desc",
  translation: "translation",
  commentary: "commentary"
};
class AudioTrack {
  id;
  kind;
  label = "";
  language = "";
  sourceBuffer;
  #enabled = false;
  addRendition(src, codec, bitrate) {
    const rendition = new _audio_rendition_js__WEBPACK_IMPORTED_MODULE_0__.AudioRendition();
    rendition.src = src;
    rendition.codec = codec;
    rendition.bitrate = bitrate;
    (0,_audio_rendition_list_js__WEBPACK_IMPORTED_MODULE_2__.addRendition)(this, rendition);
    return rendition;
  }
  removeRendition(rendition) {
    (0,_audio_rendition_list_js__WEBPACK_IMPORTED_MODULE_2__.removeRendition)(rendition);
  }
  get enabled() {
    return this.#enabled;
  }
  set enabled(val) {
    if (this.#enabled === val) return;
    this.#enabled = val;
    (0,_audio_track_list_js__WEBPACK_IMPORTED_MODULE_1__.enabledChanged)(this);
  }
}



/***/ }),

/***/ "./node_modules/media-tracks/dist/change-event.js":
/*!********************************************************!*\
  !*** ./node_modules/media-tracks/dist/change-event.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TrackEvent": () => (/* binding */ TrackEvent)
/* harmony export */ });
class TrackEvent extends Event {
  track;
  constructor(type, init) {
    super(type);
    this.track = init.track;
  }
}



/***/ }),

/***/ "./node_modules/media-tracks/dist/index.js":
/*!*************************************************!*\
  !*** ./node_modules/media-tracks/dist/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AudioRendition": () => (/* reexport safe */ _audio_rendition_js__WEBPACK_IMPORTED_MODULE_7__.AudioRendition),
/* harmony export */   "AudioRenditionList": () => (/* reexport safe */ _audio_rendition_list_js__WEBPACK_IMPORTED_MODULE_8__.AudioRenditionList),
/* harmony export */   "AudioTrack": () => (/* reexport safe */ _audio_track_js__WEBPACK_IMPORTED_MODULE_5__.AudioTrack),
/* harmony export */   "AudioTrackList": () => (/* reexport safe */ _audio_track_list_js__WEBPACK_IMPORTED_MODULE_6__.AudioTrackList),
/* harmony export */   "MediaTracksMixin": () => (/* reexport safe */ _mixin_js__WEBPACK_IMPORTED_MODULE_0__.MediaTracksMixin),
/* harmony export */   "RenditionEvent": () => (/* reexport safe */ _rendition_event_js__WEBPACK_IMPORTED_MODULE_10__.RenditionEvent),
/* harmony export */   "TrackEvent": () => (/* reexport safe */ _change_event_js__WEBPACK_IMPORTED_MODULE_9__.TrackEvent),
/* harmony export */   "VideoRendition": () => (/* reexport safe */ _video_rendition_js__WEBPACK_IMPORTED_MODULE_3__.VideoRendition),
/* harmony export */   "VideoRenditionList": () => (/* reexport safe */ _video_rendition_list_js__WEBPACK_IMPORTED_MODULE_4__.VideoRenditionList),
/* harmony export */   "VideoTrack": () => (/* reexport safe */ _video_track_js__WEBPACK_IMPORTED_MODULE_1__.VideoTrack),
/* harmony export */   "VideoTrackList": () => (/* reexport safe */ _video_track_list_js__WEBPACK_IMPORTED_MODULE_2__.VideoTrackList)
/* harmony export */ });
/* harmony import */ var _mixin_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mixin.js */ "./node_modules/media-tracks/dist/mixin.js");
/* harmony import */ var _video_track_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./video-track.js */ "./node_modules/media-tracks/dist/video-track.js");
/* harmony import */ var _video_track_list_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./video-track-list.js */ "./node_modules/media-tracks/dist/video-track-list.js");
/* harmony import */ var _video_rendition_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./video-rendition.js */ "./node_modules/media-tracks/dist/video-rendition.js");
/* harmony import */ var _video_rendition_list_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./video-rendition-list.js */ "./node_modules/media-tracks/dist/video-rendition-list.js");
/* harmony import */ var _audio_track_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./audio-track.js */ "./node_modules/media-tracks/dist/audio-track.js");
/* harmony import */ var _audio_track_list_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./audio-track-list.js */ "./node_modules/media-tracks/dist/audio-track-list.js");
/* harmony import */ var _audio_rendition_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./audio-rendition.js */ "./node_modules/media-tracks/dist/audio-rendition.js");
/* harmony import */ var _audio_rendition_list_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./audio-rendition-list.js */ "./node_modules/media-tracks/dist/audio-rendition-list.js");
/* harmony import */ var _change_event_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./change-event.js */ "./node_modules/media-tracks/dist/change-event.js");
/* harmony import */ var _rendition_event_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./rendition-event.js */ "./node_modules/media-tracks/dist/rendition-event.js");














/***/ }),

/***/ "./node_modules/media-tracks/dist/mixin.js":
/*!*************************************************!*\
  !*** ./node_modules/media-tracks/dist/mixin.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MediaTracksMixin": () => (/* binding */ MediaTracksMixin)
/* harmony export */ });
/* harmony import */ var _video_track_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./video-track.js */ "./node_modules/media-tracks/dist/video-track.js");
/* harmony import */ var _video_track_list_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./video-track-list.js */ "./node_modules/media-tracks/dist/video-track-list.js");
/* harmony import */ var _audio_track_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./audio-track.js */ "./node_modules/media-tracks/dist/audio-track.js");
/* harmony import */ var _audio_track_list_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./audio-track-list.js */ "./node_modules/media-tracks/dist/audio-track-list.js");
/* harmony import */ var _video_rendition_list_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./video-rendition-list.js */ "./node_modules/media-tracks/dist/video-rendition-list.js");
/* harmony import */ var _audio_rendition_list_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./audio-rendition-list.js */ "./node_modules/media-tracks/dist/audio-rendition-list.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils.js */ "./node_modules/media-tracks/dist/utils.js");







const nativeVideoTracksFn = getBaseMediaTracksFn(globalThis.HTMLMediaElement, "video");
const nativeAudioTracksFn = getBaseMediaTracksFn(globalThis.HTMLMediaElement, "audio");
function MediaTracksMixin(MediaElementClass) {
  if (!MediaElementClass?.prototype) return MediaElementClass;
  const videoTracksFn = getBaseMediaTracksFn(MediaElementClass, "video");
  if (!videoTracksFn || `${videoTracksFn}`.includes("[native code]")) {
    Object.defineProperty(MediaElementClass.prototype, "videoTracks", {
      get() {
        return getVideoTracks(this);
      }
    });
  }
  const audioTracksFn = getBaseMediaTracksFn(MediaElementClass, "audio");
  if (!audioTracksFn || `${audioTracksFn}`.includes("[native code]")) {
    Object.defineProperty(MediaElementClass.prototype, "audioTracks", {
      get() {
        return getAudioTracks(this);
      }
    });
  }
  if (!("addVideoTrack" in MediaElementClass.prototype)) {
    MediaElementClass.prototype.addVideoTrack = function(kind, label = "", language = "") {
      const track = new _video_track_js__WEBPACK_IMPORTED_MODULE_0__.VideoTrack();
      track.kind = kind;
      track.label = label;
      track.language = language;
      (0,_video_track_list_js__WEBPACK_IMPORTED_MODULE_1__.addVideoTrack)(this, track);
      return track;
    };
  }
  if (!("removeVideoTrack" in MediaElementClass.prototype)) {
    MediaElementClass.prototype.removeVideoTrack = _video_track_list_js__WEBPACK_IMPORTED_MODULE_1__.removeVideoTrack;
  }
  if (!("addAudioTrack" in MediaElementClass.prototype)) {
    MediaElementClass.prototype.addAudioTrack = function(kind, label = "", language = "") {
      const track = new _audio_track_js__WEBPACK_IMPORTED_MODULE_2__.AudioTrack();
      track.kind = kind;
      track.label = label;
      track.language = language;
      (0,_audio_track_list_js__WEBPACK_IMPORTED_MODULE_3__.addAudioTrack)(this, track);
      return track;
    };
  }
  if (!("removeAudioTrack" in MediaElementClass.prototype)) {
    MediaElementClass.prototype.removeAudioTrack = _audio_track_list_js__WEBPACK_IMPORTED_MODULE_3__.removeAudioTrack;
  }
  if (!("videoRenditions" in MediaElementClass.prototype)) {
    Object.defineProperty(MediaElementClass.prototype, "videoRenditions", {
      get() {
        return initVideoRenditions(this);
      }
    });
  }
  const initVideoRenditions = (media) => {
    let renditions = (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.getPrivate)(media).videoRenditions;
    if (!renditions) {
      renditions = new _video_rendition_list_js__WEBPACK_IMPORTED_MODULE_4__.VideoRenditionList();
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.getPrivate)(renditions).media = new WeakRef(media);
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.getPrivate)(media).videoRenditions = renditions;
    }
    return renditions;
  };
  if (!("audioRenditions" in MediaElementClass.prototype)) {
    Object.defineProperty(MediaElementClass.prototype, "audioRenditions", {
      get() {
        return initAudioRenditions(this);
      }
    });
  }
  const initAudioRenditions = (media) => {
    let renditions = (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.getPrivate)(media).audioRenditions;
    if (!renditions) {
      renditions = new _audio_rendition_list_js__WEBPACK_IMPORTED_MODULE_5__.AudioRenditionList();
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.getPrivate)(renditions).media = new WeakRef(media);
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.getPrivate)(media).audioRenditions = renditions;
    }
    return renditions;
  };
  return MediaElementClass;
}
function getBaseMediaTracksFn(MediaElementClass, type) {
  if (MediaElementClass?.prototype) {
    return Object.getOwnPropertyDescriptor(MediaElementClass.prototype, `${type}Tracks`)?.get;
  }
}
function getVideoTracks(media) {
  let tracks = (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.getPrivate)(media).videoTracks;
  if (!tracks) {
    tracks = new _video_track_list_js__WEBPACK_IMPORTED_MODULE_1__.VideoTrackList();
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.getPrivate)(media).videoTracks = tracks;
    if (nativeVideoTracksFn) {
      const nativeTracks = nativeVideoTracksFn.call(media.nativeEl ?? media);
      for (const nativeTrack of nativeTracks) {
        (0,_video_track_list_js__WEBPACK_IMPORTED_MODULE_1__.addVideoTrack)(media, nativeTrack);
      }
      const onChange = () => {
        tracks.dispatchEvent(new Event("change"));
      };
      const onAddTrack = (event) => {
        if ([...tracks].some((t) => t instanceof _video_track_js__WEBPACK_IMPORTED_MODULE_0__.VideoTrack)) {
          for (const nativeTrack of nativeTracks) {
            (0,_video_track_list_js__WEBPACK_IMPORTED_MODULE_1__.removeVideoTrack)(nativeTrack);
          }
          return;
        }
        (0,_video_track_list_js__WEBPACK_IMPORTED_MODULE_1__.addVideoTrack)(media, event.track);
      };
      const onRemoveTrack = (event) => {
        (0,_video_track_list_js__WEBPACK_IMPORTED_MODULE_1__.removeVideoTrack)(event.track);
      };
      nativeTracks.addEventListener("change", onChange);
      nativeTracks.addEventListener("addtrack", onAddTrack);
      nativeTracks.addEventListener("removetrack", onRemoveTrack);
    }
  }
  return tracks;
}
function getAudioTracks(media) {
  let tracks = (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.getPrivate)(media).audioTracks;
  if (!tracks) {
    tracks = new _audio_track_list_js__WEBPACK_IMPORTED_MODULE_3__.AudioTrackList();
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.getPrivate)(media).audioTracks = tracks;
    if (nativeAudioTracksFn) {
      const nativeTracks = nativeAudioTracksFn.call(media.nativeEl ?? media);
      for (const nativeTrack of nativeTracks) {
        (0,_audio_track_list_js__WEBPACK_IMPORTED_MODULE_3__.addAudioTrack)(media, nativeTrack);
      }
      const onChange = () => {
        tracks.dispatchEvent(new Event("change"));
      };
      const onAddTrack = (event) => {
        if ([...tracks].some((t) => t instanceof _audio_track_js__WEBPACK_IMPORTED_MODULE_2__.AudioTrack)) {
          for (const nativeTrack of nativeTracks) {
            (0,_audio_track_list_js__WEBPACK_IMPORTED_MODULE_3__.removeAudioTrack)(nativeTrack);
          }
          return;
        }
        (0,_audio_track_list_js__WEBPACK_IMPORTED_MODULE_3__.addAudioTrack)(media, event.track);
      };
      const onRemoveTrack = (event) => {
        (0,_audio_track_list_js__WEBPACK_IMPORTED_MODULE_3__.removeAudioTrack)(event.track);
      };
      nativeTracks.addEventListener("change", onChange);
      nativeTracks.addEventListener("addtrack", onAddTrack);
      nativeTracks.addEventListener("removetrack", onRemoveTrack);
    }
  }
  return tracks;
}



/***/ }),

/***/ "./node_modules/media-tracks/dist/rendition-event.js":
/*!***********************************************************!*\
  !*** ./node_modules/media-tracks/dist/rendition-event.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RenditionEvent": () => (/* binding */ RenditionEvent)
/* harmony export */ });
class RenditionEvent extends Event {
  rendition;
  constructor(type, init) {
    super(type);
    this.rendition = init.rendition;
  }
}



/***/ }),

/***/ "./node_modules/media-tracks/dist/utils.js":
/*!*************************************************!*\
  !*** ./node_modules/media-tracks/dist/utils.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getPrivate": () => (/* binding */ getPrivate),
/* harmony export */   "setPrivate": () => (/* binding */ setPrivate)
/* harmony export */ });
const privateProps = /* @__PURE__ */ new WeakMap();
function getPrivate(instance) {
  return privateProps.get(instance) ?? setPrivate(instance, {});
}
function setPrivate(instance, props) {
  let saved = privateProps.get(instance);
  if (!saved) privateProps.set(instance, saved = {});
  return Object.assign(saved, props);
}



/***/ }),

/***/ "./node_modules/media-tracks/dist/video-rendition-list.js":
/*!****************************************************************!*\
  !*** ./node_modules/media-tracks/dist/video-rendition-list.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VideoRenditionList": () => (/* binding */ VideoRenditionList),
/* harmony export */   "addRendition": () => (/* binding */ addRendition),
/* harmony export */   "removeRendition": () => (/* binding */ removeRendition),
/* harmony export */   "selectedChanged": () => (/* binding */ selectedChanged)
/* harmony export */ });
/* harmony import */ var _rendition_event_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rendition-event.js */ "./node_modules/media-tracks/dist/rendition-event.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./node_modules/media-tracks/dist/utils.js");


function addRendition(track, rendition) {
  const renditionList = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(track).media?.deref()?.videoRenditions;
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(rendition).media = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(track).media;
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(rendition).track = track;
  const renditionSet = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(track).renditionSet;
  renditionSet.add(rendition);
  const index = renditionSet.size - 1;
  if (!(index in VideoRenditionList.prototype)) {
    Object.defineProperty(VideoRenditionList.prototype, index, {
      get() {
        return getCurrentRenditions(this)[index];
      }
    });
  }
  queueMicrotask(() => {
    if (!renditionList || !track.selected) return;
    renditionList.dispatchEvent(new _rendition_event_js__WEBPACK_IMPORTED_MODULE_0__.RenditionEvent("addrendition", { rendition }));
  });
}
function removeRendition(rendition) {
  const renditionList = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(rendition).media?.deref()?.videoRenditions;
  const track = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(rendition).track;
  const renditionSet = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(track).renditionSet;
  renditionSet.delete(rendition);
  queueMicrotask(() => {
    const track2 = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(rendition).track;
    if (!renditionList || !track2.selected) return;
    renditionList.dispatchEvent(new _rendition_event_js__WEBPACK_IMPORTED_MODULE_0__.RenditionEvent("removerendition", { rendition }));
  });
}
function selectedChanged(rendition) {
  const renditionList = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(rendition).media?.deref()?.videoRenditions;
  if (!renditionList || (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(renditionList).changeRequested) return;
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(renditionList).changeRequested = true;
  queueMicrotask(() => {
    delete (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(renditionList).changeRequested;
    const track = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(rendition).track;
    if (!track.selected) return;
    renditionList.dispatchEvent(new Event("change"));
  });
}
function getCurrentRenditions(renditionList) {
  const media = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(renditionList).media?.deref();
  if (!media) return [];
  return [...media.videoTracks].filter((track) => track.selected).flatMap((track) => [...(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(track).renditionSet]);
}
class VideoRenditionList extends EventTarget {
  #addRenditionCallback;
  #removeRenditionCallback;
  #changeCallback;
  [Symbol.iterator]() {
    return getCurrentRenditions(this).values();
  }
  get length() {
    return getCurrentRenditions(this).length;
  }
  getRenditionById(id) {
    return getCurrentRenditions(this).find((rendition) => `${rendition.id}` === `${id}`) ?? null;
  }
  get selectedIndex() {
    return getCurrentRenditions(this).findIndex((rendition) => rendition.selected);
  }
  set selectedIndex(index) {
    for (const [i, rendition] of getCurrentRenditions(this).entries()) {
      rendition.selected = i === index;
    }
  }
  get onaddrendition() {
    return this.#addRenditionCallback;
  }
  set onaddrendition(callback) {
    if (this.#addRenditionCallback) {
      this.removeEventListener("addrendition", this.#addRenditionCallback);
      this.#addRenditionCallback = void 0;
    }
    if (typeof callback == "function") {
      this.#addRenditionCallback = callback;
      this.addEventListener("addrendition", callback);
    }
  }
  get onremoverendition() {
    return this.#removeRenditionCallback;
  }
  set onremoverendition(callback) {
    if (this.#removeRenditionCallback) {
      this.removeEventListener("removerendition", this.#removeRenditionCallback);
      this.#removeRenditionCallback = void 0;
    }
    if (typeof callback == "function") {
      this.#removeRenditionCallback = callback;
      this.addEventListener("removerendition", callback);
    }
  }
  get onchange() {
    return this.#changeCallback;
  }
  set onchange(callback) {
    if (this.#changeCallback) {
      this.removeEventListener("change", this.#changeCallback);
      this.#changeCallback = void 0;
    }
    if (typeof callback == "function") {
      this.#changeCallback = callback;
      this.addEventListener("change", callback);
    }
  }
}



/***/ }),

/***/ "./node_modules/media-tracks/dist/video-rendition.js":
/*!***********************************************************!*\
  !*** ./node_modules/media-tracks/dist/video-rendition.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VideoRendition": () => (/* binding */ VideoRendition)
/* harmony export */ });
/* harmony import */ var _video_rendition_list_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./video-rendition-list.js */ "./node_modules/media-tracks/dist/video-rendition-list.js");

class VideoRendition {
  src;
  id;
  width;
  height;
  bitrate;
  frameRate;
  codec;
  #selected = false;
  get selected() {
    return this.#selected;
  }
  set selected(val) {
    if (this.#selected === val) return;
    this.#selected = val;
    (0,_video_rendition_list_js__WEBPACK_IMPORTED_MODULE_0__.selectedChanged)(this);
  }
}



/***/ }),

/***/ "./node_modules/media-tracks/dist/video-track-list.js":
/*!************************************************************!*\
  !*** ./node_modules/media-tracks/dist/video-track-list.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VideoTrackList": () => (/* binding */ VideoTrackList),
/* harmony export */   "addVideoTrack": () => (/* binding */ addVideoTrack),
/* harmony export */   "removeVideoTrack": () => (/* binding */ removeVideoTrack),
/* harmony export */   "selectedChanged": () => (/* binding */ selectedChanged)
/* harmony export */ });
/* harmony import */ var _change_event_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./change-event.js */ "./node_modules/media-tracks/dist/change-event.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./node_modules/media-tracks/dist/utils.js");


function addVideoTrack(media, track) {
  const trackList = media.videoTracks;
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(track).media = new WeakRef(media);
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(track).renditionSet) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(track).renditionSet = /* @__PURE__ */ new Set();
  }
  const trackSet = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(trackList).trackSet;
  trackSet.add(track);
  const index = trackSet.size - 1;
  if (!(index in VideoTrackList.prototype)) {
    Object.defineProperty(VideoTrackList.prototype, index, {
      get() {
        return [...(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(this).trackSet][index];
      }
    });
  }
  queueMicrotask(() => {
    trackList.dispatchEvent(new _change_event_js__WEBPACK_IMPORTED_MODULE_0__.TrackEvent("addtrack", { track }));
  });
}
function removeVideoTrack(track) {
  const trackList = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(track).media?.deref()?.videoTracks;
  if (!trackList) return;
  const trackSet = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(trackList).trackSet;
  trackSet.delete(track);
  queueMicrotask(() => {
    trackList.dispatchEvent(new _change_event_js__WEBPACK_IMPORTED_MODULE_0__.TrackEvent("removetrack", { track }));
  });
}
function selectedChanged(selected) {
  const trackList = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(selected).media?.deref()?.videoTracks ?? [];
  let hasUnselected = false;
  for (const track of trackList) {
    if (track === selected) continue;
    track.selected = false;
    hasUnselected = true;
  }
  if (hasUnselected) {
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(trackList).changeRequested) return;
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(trackList).changeRequested = true;
    queueMicrotask(() => {
      delete (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(trackList).changeRequested;
      trackList.dispatchEvent(new Event("change"));
    });
  }
}
class VideoTrackList extends EventTarget {
  #addTrackCallback;
  #removeTrackCallback;
  #changeCallback;
  constructor() {
    super();
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(this).trackSet = /* @__PURE__ */ new Set();
  }
  get #tracks() {
    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getPrivate)(this).trackSet;
  }
  [Symbol.iterator]() {
    return this.#tracks.values();
  }
  get length() {
    return this.#tracks.size;
  }
  getTrackById(id) {
    return [...this.#tracks].find((track) => track.id === id) ?? null;
  }
  get selectedIndex() {
    return [...this.#tracks].findIndex((track) => track.selected);
  }
  get onaddtrack() {
    return this.#addTrackCallback;
  }
  set onaddtrack(callback) {
    if (this.#addTrackCallback) {
      this.removeEventListener("addtrack", this.#addTrackCallback);
      this.#addTrackCallback = void 0;
    }
    if (typeof callback == "function") {
      this.#addTrackCallback = callback;
      this.addEventListener("addtrack", callback);
    }
  }
  get onremovetrack() {
    return this.#removeTrackCallback;
  }
  set onremovetrack(callback) {
    if (this.#removeTrackCallback) {
      this.removeEventListener("removetrack", this.#removeTrackCallback);
      this.#removeTrackCallback = void 0;
    }
    if (typeof callback == "function") {
      this.#removeTrackCallback = callback;
      this.addEventListener("removetrack", callback);
    }
  }
  get onchange() {
    return this.#changeCallback;
  }
  set onchange(callback) {
    if (this.#changeCallback) {
      this.removeEventListener("change", this.#changeCallback);
      this.#changeCallback = void 0;
    }
    if (typeof callback == "function") {
      this.#changeCallback = callback;
      this.addEventListener("change", callback);
    }
  }
}



/***/ }),

/***/ "./node_modules/media-tracks/dist/video-track.js":
/*!*******************************************************!*\
  !*** ./node_modules/media-tracks/dist/video-track.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VideoTrack": () => (/* binding */ VideoTrack),
/* harmony export */   "VideoTrackKind": () => (/* binding */ VideoTrackKind)
/* harmony export */ });
/* harmony import */ var _video_track_list_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./video-track-list.js */ "./node_modules/media-tracks/dist/video-track-list.js");
/* harmony import */ var _video_rendition_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./video-rendition.js */ "./node_modules/media-tracks/dist/video-rendition.js");
/* harmony import */ var _video_rendition_list_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./video-rendition-list.js */ "./node_modules/media-tracks/dist/video-rendition-list.js");



const VideoTrackKind = {
  alternative: "alternative",
  captions: "captions",
  main: "main",
  sign: "sign",
  subtitles: "subtitles",
  commentary: "commentary"
};
class VideoTrack {
  id;
  kind;
  label = "";
  language = "";
  sourceBuffer;
  #selected = false;
  addRendition(src, width, height, codec, bitrate, frameRate) {
    const rendition = new _video_rendition_js__WEBPACK_IMPORTED_MODULE_1__.VideoRendition();
    rendition.src = src;
    rendition.width = width;
    rendition.height = height;
    rendition.frameRate = frameRate;
    rendition.bitrate = bitrate;
    rendition.codec = codec;
    (0,_video_rendition_list_js__WEBPACK_IMPORTED_MODULE_2__.addRendition)(this, rendition);
    return rendition;
  }
  removeRendition(rendition) {
    (0,_video_rendition_list_js__WEBPACK_IMPORTED_MODULE_2__.removeRendition)(rendition);
  }
  get selected() {
    return this.#selected;
  }
  set selected(val) {
    if (this.#selected === val) return;
    this.#selected = val;
    if (val !== true) return;
    (0,_video_track_list_js__WEBPACK_IMPORTED_MODULE_0__.selectedChanged)(this);
  }
}



/***/ })

}]);