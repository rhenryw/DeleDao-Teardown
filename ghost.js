(function(){
    'use strict';

    const GHOST = {
        initialized: false,
        originalAddEventListener: EventTarget.prototype.addEventListener,
        originalPostMessage: window.postMessage,
        originalDispatchEvent: EventTarget.prototype.dispatchEvent,
        originalCreateElement: document.createElement,
        originalGetElementById: document.getElementById,
        originalQuerySelector: document.querySelector,
        originalQuerySelectorAll: document.querySelectorAll,
        originalGetElementsByTagName: document.getElementsByTagName,
        originalGetElementsByClassName: document.getElementsByClassName,
        originalAttachShadow: Element.prototype.attachShadow,
        originalGetContext: HTMLCanvasElement.prototype.getContext,
        originalToDataURL: HTMLCanvasElement.prototype.toDataURL,
        originalToBlob: HTMLCanvasElement.prototype.toBlob,
        originalDrawImage: CanvasRenderingContext2D.prototype.drawImage,
        originalGetImageData: CanvasRenderingContext2D.prototype.getImageData,
        originalPutImageData: CanvasRenderingContext2D.prototype.putImageData,
        originalObserve: MutationObserver.prototype.observe,
        originalRequestAnimationFrame: window.requestAnimationFrame,
        originalCreateObjectURL: URL.createObjectURL,
        originalRevokeObjectURL: URL.revokeObjectURL,
        fakeDOM: null,
        shadowRoots: [],
        capturedEvents: [],
        isGame: false,
        noiseInjected: false,
        stealthMode: true,
        decoyLayer: null,
        noiseOverlay: null,
        safeFrameCache: null,
        protectedCanvases: new WeakSet(),
        protectedVideos: new WeakSet()
    };

    const DLD_INTERNAL = {
        blockedRecipients: [
            'deledao', 'dynccUtils', 'filterBackend', 'cloudUtils',
            'dynImgAnalysis', 'classMgmt', 'teacher', 'userActs',
            'authBackend', 'youtubeMetaProcess', 'policy', 'runtime'
        ],
        blockedTypes: [
            '__dld_badContent', '__dld_sendToTopMBus', '__dld_DGM_CC_SD',
            '__dld_DGM_CC_TLME', '__dld_DGM_HCG', 'dldRecheckUrl',
            'badContentsDetected', 'isBlockingNeeded', 'flaggedEvent',
            'analyzeImages', 'analyzeDOMData', 'captureCanvas',
            'violation', 'usageReport', 'youtubeMetaData',
            'webpageWhitelisted', 'ruleSpecFromIsBlockingNeededResponse'
        ],
        blockedDomains: [
            'deledao.com', 'cc.deledao', 'auth.deledao', 'static.deledao',
            'im.deledao', 'tx.deledao', 'portals.deledao', 'up.deledao'
        ]
    };

    const EDUCATIONAL_NOISE = [
        'calculus homework', 'algebra practice', 'history assignment',
        'science project', 'math worksheet', 'english essay',
        'biology study guide', 'chemistry lab report', 'physics homework',
        'geometry proof', 'trigonometry practice', 'literature analysis',
        'geography quiz', 'civics lesson', 'economics worksheet',
        'vocabulary builder', 'spelling test', 'grammar exercise',
        'reading comprehension', 'writing prompt', 'research paper',
        'dissertation', 'thesis statement', 'academic research',
        'peer reviewed', 'educational resource', 'learning module',
        'study materials', 'lecture notes', 'tutorial video',
        'educational content', 'academic paper', 'scholarly article',
        'khan academy', 'coursera', 'edx course', 'duolingo',
        'codecademy', 'brilliant org', 'mathway', 'wolfram alpha',
        'desmos graphing', 'geogebra', 'quizlet', 'flashcards',
        'national geographic', 'britannica', 'wikipedia educational'
    ];

    const SAFE_IMAGE_TEMPLATES = {
        graph: generateGraphImage,
        document: generateDocumentImage,
        code: generateCodeImage,
        wikipedia: generateWikipediaImage
    };

    function generateGraphImage(width, height) {
        const canvas = GHOST.originalCreateElement.call(document, 'canvas');
        canvas.width = width || 800;
        canvas.height = height || 600;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        const gridSize = 40;
        for (let x = 0; x <= canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y <= canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        ctx.strokeStyle = '#4285f4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(50, canvas.height - 50);
        for (let x = 50; x < canvas.width - 50; x++) {
            const y = canvas.height - 50 - Math.sin((x - 50) / 50) * 150 - Math.random() * 5;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        ctx.strokeStyle = '#34a853';
        ctx.beginPath();
        ctx.moveTo(50, canvas.height - 100);
        for (let x = 50; x < canvas.width - 50; x++) {
            const y = canvas.height - 100 - Math.cos((x - 50) / 40) * 100 - Math.random() * 3;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#333333';
        ctx.fillText('f(x) = sin(x)', canvas.width - 150, 80);
        ctx.fillText('g(x) = cos(x)', canvas.width - 150, 110);
        
        ctx.font = '14px Arial';
        ctx.fillText('y', 30, 30);
        ctx.fillText('x', canvas.width - 30, canvas.height - 30);
        
        return canvas;
    }

    function generateDocumentImage(width, height) {
        const canvas = GHOST.originalCreateElement.call(document, 'canvas');
        canvas.width = width || 800;
        canvas.height = height || 600;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Research Paper - Analysis', 50, 50);
        
        ctx.font = '14px Arial';
        ctx.fillStyle = '#666666';
        
        const lines = [
            'Abstract: This paper presents a comprehensive analysis of',
            'educational methodologies and their impact on student',
            'learning outcomes. Our research indicates significant',
            'improvements in comprehension when interactive methods',
            'are employed in classroom settings.',
            '',
            '1. Introduction',
            'The field of education has undergone substantial changes',
            'in recent decades. This study aims to quantify these',
            'changes and their effects on academic performance.',
            '',
            '2. Methodology',
            'We conducted surveys across 50 educational institutions',
            'and analyzed over 10,000 student responses.',
            '',
            '3. Results',
            'Our findings show a 23% improvement in test scores...',
        ];
        
        let y = 90;
        lines.forEach(line => {
            ctx.fillText(line, 50, y);
            y += 22;
        });
        
        return canvas;
    }

    function generateCodeImage(width, height) {
        const canvas = GHOST.originalCreateElement.call(document, 'canvas');
        canvas.width = width || 800;
        canvas.height = height || 600;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = '14px monospace';
        
        const codeLines = [
            { text: '// Educational Algorithm Implementation', color: '#6a9955' },
            { text: 'function calculateSum(arr) {', color: '#d4d4d4' },
            { text: '    let sum = 0;', color: '#d4d4d4' },
            { text: '    for (let i = 0; i < arr.length; i++) {', color: '#d4d4d4' },
            { text: '        sum += arr[i];', color: '#d4d4d4' },
            { text: '    }', color: '#d4d4d4' },
            { text: '    return sum;', color: '#d4d4d4' },
            { text: '}', color: '#d4d4d4' },
            { text: '', color: '#d4d4d4' },
            { text: '// Example usage', color: '#6a9955' },
            { text: 'const numbers = [1, 2, 3, 4, 5];', color: '#d4d4d4' },
            { text: 'console.log(calculateSum(numbers));', color: '#d4d4d4' },
        ];
        
        let y = 30;
        codeLines.forEach(({ text, color }) => {
            ctx.fillStyle = color;
            ctx.fillText(text, 20, y);
            y += 20;
        });
        
        return canvas;
    }

    function generateWikipediaImage(width, height) {
        const canvas = GHOST.originalCreateElement.call(document, 'canvas');
        canvas.width = width || 800;
        canvas.height = height || 600;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#3366cc';
        ctx.font = 'bold 28px Georgia';
        ctx.fillText('Wikipedia', 50, 45);
        
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#333333';
        ctx.fillText('Mathematics', 50, 85);
        
        ctx.font = '14px Arial';
        ctx.fillStyle = '#333333';
        
        const content = [
            'Mathematics is the abstract science of number, quantity,',
            'and space. It can be studied in its own right (pure',
            'mathematics), or as it is applied to other disciplines',
            'such as physics and engineering (applied mathematics).',
            '',
            'History of mathematics',
            'The earliest beginnings of mathematics are found in',
            'ancient Babylon and Egypt, where arithmetic and',
            'geometry were used for practical purposes.',
        ];
        
        let y = 120;
        content.forEach(line => {
            ctx.fillText(line, 50, y);
            y += 20;
        });
        
        ctx.strokeStyle = '#a2a9b1';
        ctx.lineWidth = 1;
        ctx.strokeRect(50, 110, 700, 2);
        
        return canvas;
    }

    function init() {
        if (GHOST.initialized) return;
        GHOST.initialized = true;

        injectNoiseLayer();
        hijackMessageChannel();
        hijackEventListeners();
        hijackDOMAccess();
        hijackKeyEvents();
        hijackDocumentProperties();
        createGhostDOM();
        interceptExtensionMessages();
        interceptMutationObservers();
        interceptFetch();
        interceptXHR();
        interceptCanvas();
        interceptVideo();
        interceptImage();
        interceptShadowDOM();
        interceptBlobURLs();
        overrideNavigator();
        silenceConsole();
        injectProtocolSpoof();
        setupRaceConditionDefense();
        createDecoyLayer();
        createAdversarialNoiseOverlay();
        
        console.log('[GHOST] Active - Deepfake + Adversarial + Decoy');
    }

    function shouldProtect() {
        const stack = new Error().stack || '';
        return stack.includes('deledao') || stack.includes('dld') || 
               stack.includes('DVA') || stack.includes('DIA') || 
               stack.includes('DGM') || stack.includes('Mo(');
    }

    function getSafeFrame(width, height, type) {
        const key = `${width}x${height}`;
        
        if (!GHOST.safeFrameCache) {
            GHOST.safeFrameCache = new Map();
        }
        
        if (!GHOST.safeFrameCache.has(key)) {
            const generator = SAFE_IMAGE_TEMPLATES[type] || SAFE_IMAGE_TEMPLATES.graph;
            GHOST.safeFrameCache.set(key, generator(width, height));
        }
        
        return GHOST.safeFrameCache.get(key);
    }

    function injectNoiseLayer() {
        if (GHOST.noiseInjected) return;
        GHOST.noiseInjected = true;

        const noiseContainer = document.createDocumentFragment();
        
        for (let i = 0; i < 200; i++) {
            const span = GHOST.originalCreateElement.call(document, 'span');
            span.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;z-index:-999999;';
            span.textContent = EDUCATIONAL_NOISE[Math.floor(Math.random() * EDUCATIONAL_NOISE.length)];
            span.setAttribute('aria-hidden', 'true');
            noiseContainer.appendChild(span);
        }

        const meta = GHOST.originalCreateElement.call(document, 'meta');
        meta.name = 'keywords';
        meta.content = EDUCATIONAL_NOISE.slice(0, 20).join(', ');
        noiseContainer.appendChild(meta);

        const desc = GHOST.originalCreateElement.call(document, 'meta');
        desc.name = 'description';
        desc.content = 'Educational learning resource - ' + EDUCATIONAL_NOISE.slice(0, 10).join(' - ');
        noiseContainer.appendChild(desc);

        if (document.head) {
            document.head.appendChild(noiseContainer);
        } else {
            const observer = new MutationObserver(() => {
                if (document.head) {
                    document.head.appendChild(noiseContainer);
                    observer.disconnect();
                }
            });
            observer.observe(document.documentElement, { childList: true });
        }
    }

    function hijackMessageChannel() {
        const originalAddEventListener = GHOST.originalAddEventListener.bind(window);
        const originalPostMessage = GHOST.originalPostMessage.bind(window);

        const fakeSafeResponse = {
            ok: true,
            na: true,
            white: true,
            allowed: true,
            safe: true,
            categories: [],
            score: 0
        };

        window.addEventListener = function(type, listener, options) {
            if (type === 'message' || type === 'messageerror') {
                const wrappedListener = function(event) {
                    if (event.data && typeof event.data === 'object') {
                        const data = event.data;
                        
                        if (data.recipient && DLD_INTERNAL.blockedRecipients.some(r => 
                            data.recipient === r || data.recipient?.includes(r))) {
                            event.stopImmediatePropagation();
                            event.preventDefault();
                            
                            if (event.source) {
                                try {
                                    event.source.postMessage({
                                        ...fakeSafeResponse,
                                        _ghost_response: true,
                                        type: data.type + '_response'
                                    }, '*');
                                } catch (e) {}
                            }
                            return false;
                        }
                        
                        if (data.type && DLD_INTERNAL.blockedTypes.some(t => 
                            data.type === t || data.type?.includes(t) || String(data.type).startsWith('__dld'))) {
                            event.stopImmediatePropagation();
                            event.preventDefault();
                            return false;
                        }
                        
                        if (data.nativecallid || data.napaframeid || data.dinfo) {
                            event.stopImmediatePropagation();
                            return false;
                        }
                    }
                    return listener.call(this, event);
                };
                wrappedListener._ghost_wrapped = true;
                return originalAddEventListener(type, wrappedListener, options);
            }
            return originalAddEventListener(type, listener, options);
        };

        window.postMessage = function(message, targetOrigin, transfer) {
            if (typeof message === 'object' && message !== null) {
                if (message.recipient && DLD_INTERNAL.blockedRecipients.some(r => 
                    message.recipient === r || message.recipient?.includes(r))) {
                    return;
                }
                if (message.type && DLD_INTERNAL.blockedTypes.some(t => 
                    message.type === t || message.type?.includes(t) || String(message.type).startsWith('__dld'))) {
                    return;
                }
                if (message.nativecallid || message.napaframeid) {
                    return;
                }
            }
            return originalPostMessage(message, targetOrigin, transfer);
        };
    }

    function hijackEventListeners() {
        const originalAddEventListener = GHOST.originalAddEventListener;
        const extensionListeners = new WeakMap();

        EventTarget.prototype.addEventListener = function(type, listener, options) {
            const isDocument = this === document || this === window || this === document.body;
            
            if (isDocument) {
                const sensitiveEvents = ['keydown', 'keyup', 'keypress', 'input', 'change', 'submit', 'focus', 'blur'];
                if (sensitiveEvents.includes(type)) {
                    const wrappedListener = function(event) {
                        if (listener._ghost_extension_listener) {
                            const fakeEvent = new Proxy(event, {
                                get: function(target, prop) {
                                    if (prop === 'key' || prop === 'code') return '';
                                    if (prop === 'keyCode' || prop === 'which' || prop === 'charCode') return 0;
                                    if (prop === 'target') {
                                        return new Proxy(target[prop], {
                                            get: function(t, p) {
                                                if (p === 'value') return '';
                                                const val = t[p];
                                                return typeof val === 'function' ? val.bind(t) : val;
                                            }
                                        });
                                    }
                                    const val = target[prop];
                                    return typeof val === 'function' ? val.bind(target) : val;
                                }
                            });
                            return listener.call(this, fakeEvent);
                        }
                        return listener.call(this, event);
                    };
                    extensionListeners.set(wrappedListener, listener);
                    return originalAddEventListener.call(this, type, wrappedListener, options);
                }
                
                if (type === 'visibilitychange') {
                    const wrappedListener = function(event) {
                        Object.defineProperty(document, 'visibilityState', {
                            get: () => 'visible',
                            configurable: true
                        });
                        Object.defineProperty(document, 'hidden', {
                            get: () => false,
                            configurable: true
                        });
                        return listener.call(this, event);
                    };
                    return originalAddEventListener.call(this, type, wrappedListener, options);
                }
            }
            return originalAddEventListener.call(this, type, listener, options);
        };

        EventTarget.prototype.removeEventListener = function(type, listener, options) {
            const wrapped = extensionListeners.get(listener);
            if (wrapped) {
                return originalAddEventListener.call(this, type, wrapped, options);
            }
            return originalAddEventListener.call(this, type, listener, options);
        };
    }

    function hijackDOMAccess() {
        const originalQuerySelectorAll = GHOST.originalQuerySelectorAll.bind(document);
        const originalQuerySelector = GHOST.originalQuerySelector.bind(document);
        const originalGetElementsByTagName = GHOST.originalGetElementsByTagName.bind(document);
        const originalGetElementsByClassName = GHOST.originalGetElementsByClassName.bind(document);
        const originalCreateElement = GHOST.originalCreateElement.bind(document);
        const originalGetElementById = GHOST.originalGetElementById.bind(document);

        const sensitiveSelectors = ['video', 'img', 'canvas', 'iframe', 'embed', 'object', 'source', 'track'];
        const gameTags = ['canvas', 'video', 'embed', 'object'];

        const wrapNodeList = function(list, filter) {
            const arr = Array.from(list);
            if (!filter) return arr;
            return arr.filter(el => !filter(el));
        };

        const createGhostElement = function(original) {
            const ghost = new Proxy(original, {
                get: function(target, prop) {
                    if (prop === 'src' || prop === 'currentSrc') return '';
                    if (prop === 'poster') return '';
                    if (prop === 'style') {
                        return new Proxy(target.style, {
                            get: function(s, p) {
                                if (p === 'filter') return 'none';
                                if (p === 'display') return s.display;
                                return s[p];
                            }
                        });
                    }
                    const val = target[prop];
                    return typeof val === 'function' ? val.bind(target) : val;
                }
            });
            return ghost;
        };

        document.querySelectorAll = function(selector) {
            const lower = selector.toLowerCase();
            if (sensitiveSelectors.some(s => lower.includes(s))) {
                if (GHOST.stealthMode) {
                    const real = originalQuerySelectorAll(selector);
                    return wrapNodeList(real, el => {
                        if (el._ghost_protected) return true;
                        if (el.closest && el.closest('[data-ghost-shadow]')) return true;
                        if (el.closest && el.closest('[data-ghost-decoy]')) return true;
                        return false;
                    });
                }
            }
            return originalQuerySelectorAll(selector);
        };

        document.querySelector = function(selector) {
            const lower = selector.toLowerCase();
            if (sensitiveSelectors.some(s => lower.includes(s))) {
                if (GHOST.stealthMode) {
                    const all = document.querySelectorAll(selector);
                    for (const el of all) {
                        if (!el._ghost_protected && 
                            !(el.closest && el.closest('[data-ghost-shadow]')) &&
                            !(el.closest && el.closest('[data-ghost-decoy]'))) {
                            return createGhostElement(el);
                        }
                    }
                    return null;
                }
            }
            return originalQuerySelector(selector);
        };

        document.getElementsByTagName = function(name) {
            const lower = name.toLowerCase();
            if (sensitiveSelectors.includes(lower) || gameTags.includes(lower)) {
                if (GHOST.stealthMode) {
                    const real = originalGetElementsByTagName(name);
                    return wrapNodeList(real, el => el._ghost_protected);
                }
            }
            return originalGetElementsByTagName(name);
        };

        document.getElementById = function(id) {
            const el = originalGetElementById(id);
            if (el && (el.tagName === 'CANVAS' || el.tagName === 'VIDEO' || el.tagName === 'IFRAME')) {
                if (el._ghost_protected) return null;
            }
            return el;
        };

        document.createElement = function(tagName, options) {
            const element = originalCreateElement(tagName, options);
            const tag = tagName.toLowerCase();
            
            if (tag === 'canvas' || tag === 'video' || tag === 'iframe') {
                element._ghost_protected = true;
                
                const originalSetAttribute = element.setAttribute.bind(element);
                element.setAttribute = function(name, value) {
                    if (name === 'src' && value) {
                        if (DLD_INTERNAL.blockedDomains.some(d => value.includes(d))) {
                            return;
                        }
                    }
                    return originalSetAttribute(name, value);
                };
            }
            
            return element;
        };
    }

    function hijackKeyEvents() {
        const originalKeyDescriptor = Object.getOwnPropertyDescriptor(KeyboardEvent.prototype, 'key');
        const originalCodeDescriptor = Object.getOwnPropertyDescriptor(KeyboardEvent.prototype, 'code');
        const originalKeyCodeDescriptor = Object.getOwnPropertyDescriptor(KeyboardEvent.prototype, 'keyCode');
        const originalWhichDescriptor = Object.getOwnPropertyDescriptor(KeyboardEvent.prototype, 'which');

        let currentFakeKey = '';
        let currentFakeCode = '';

        Object.defineProperty(KeyboardEvent.prototype, 'key', {
            get: function() {
                if (this._ghost_sanitized) {
                    return currentFakeKey || 'Shift';
                }
                return originalKeyDescriptor.get.call(this);
            },
            configurable: true
        });

        Object.defineProperty(KeyboardEvent.prototype, 'code', {
            get: function() {
                if (this._ghost_sanitized) {
                    return currentFakeCode || 'ShiftLeft';
                }
                return originalCodeDescriptor.get.call(this);
            },
            configurable: true
        });

        Object.defineProperty(KeyboardEvent.prototype, 'keyCode', {
            get: function() {
                if (this._ghost_sanitized) return 16;
                return originalKeyCodeDescriptor.get.call(this);
            },
            configurable: true
        });

        Object.defineProperty(KeyboardEvent.prototype, 'which', {
            get: function() {
                if (this._ghost_sanitized) return 16;
                return originalWhichDescriptor.get.call(this);
            },
            configurable: true
        });

        const originalDispatchEvent = GHOST.originalDispatchEvent;
        EventTarget.prototype.dispatchEvent = function(event) {
            if (event instanceof KeyboardEvent) {
                const stack = new Error().stack || '';
                if (stack.includes('deledao') || stack.includes('dld') || stack.includes('DVA') || stack.includes('DGM')) {
                    event._ghost_sanitized = true;
                }
            }
            return originalDispatchEvent.call(this, event);
        };
    }

    function hijackDocumentProperties() {
        let internalURL = window.location.href;
        let internalTitle = document.title || '';

        const sanitizeURL = function(url) {
            if (!url) return url;
            let clean = url;
            clean = clean.replace(/game/gi, 'assignment');
            clean = clean.replace(/play/gi, 'study');
            clean = clean.replace(/unblocked/gi, 'educational');
            clean = clean.replace(/arcade/gi, 'library');
            clean = clean.replace(/flash/gi, 'pdf');
            return clean;
        };

        const sanitizeTitle = function(title) {
            if (!title) return title;
            let clean = title;
            clean = clean.replace(/game/gi, 'Worksheet');
            clean = clean.replace(/play/gi, 'Study');
            clean = clean.replace(/unblocked/gi, 'Educational');
            clean = clean.replace(/arcade/gi, 'Library');
            return clean;
        };

        try {
            Object.defineProperty(document, 'URL', {
                get: function() {
                    const stack = new Error().stack || '';
                    if (stack.includes('deledao') || stack.includes('dld')) {
                        return sanitizeURL(internalURL);
                    }
                    return internalURL;
                },
                set: function(val) { internalURL = val; },
                configurable: true
            });

            Object.defineProperty(document, 'title', {
                get: function() {
                    const stack = new Error().stack || '';
                    if (stack.includes('deledao') || stack.includes('dld')) {
                        return sanitizeTitle(internalTitle);
                    }
                    return internalTitle;
                },
                set: function(val) { internalTitle = val; },
                configurable: true
            });

            Object.defineProperty(document, 'referrer', {
                get: function() {
                    const stack = new Error().stack || '';
                    if (stack.includes('deledao') || stack.includes('dld')) {
                        return 'https://www.google.com/search?q=homework+help';
                    }
                    return window.location.href;
                },
                configurable: true
            });

            Object.defineProperty(document, 'visibilityState', {
                get: () => 'visible',
                configurable: true
            });

            Object.defineProperty(document, 'hidden', {
                get: () => false,
                configurable: true
            });

            Object.defineProperty(document, 'hasFocus', {
                value: function() { return true; },
                configurable: true
            });

            Object.defineProperty(navigator, 'userAgent', {
                get: function() {
                    const real = navigator.userAgent;
                    return real.replace(/Chrome\/[\d.]+/, 'Chrome/120.0.0.0');
                },
                configurable: true
            });

        } catch (e) {}
    }

    function createGhostDOM() {
        const ghostDoc = document.implementation.createHTMLDocument('ghost');
        
        GHOST.fakeDOM = {
            querySelector: function(selector) {
                return ghostDoc.querySelector(selector);
            },
            querySelectorAll: function(selector) {
                return ghostDoc.querySelectorAll(selector);
            },
            getElementsByTagName: function(name) {
                return ghostDoc.getElementsByTagName(name);
            },
            getElementsByClassName: function(name) {
                return ghostDoc.getElementsByClassName(name);
            },
            createElement: function(tag) {
                return ghostDoc.createElement(tag);
            }
        };
    }

    function interceptExtensionMessages() {
        if (typeof chrome === 'undefined' || !chrome.runtime) return;

        const originalSendMessage = chrome.runtime.sendMessage;
        const originalConnect = chrome.runtime.connect;
        const fakeResponse = { ok: true, na: true, white: true, allowed: true, safe: true };

        chrome.runtime.sendMessage = function(message, responseCallback) {
            if (typeof message === 'object') {
                if (message.recipient && DLD_INTERNAL.blockedRecipients.some(r => 
                    message.recipient === r || message.recipient?.includes(r))) {
                    
                    if (message.type === 'isBlockingNeeded') {
                        if (responseCallback) {
                            setTimeout(() => responseCallback({ ...fakeResponse, W: null, H: null }), 0);
                        }
                        return;
                    }
                    
                    if (message.type === 'badContentsDetected' || message.type === 'flaggedEvent') {
                        return;
                    }

                    if (responseCallback) {
                        setTimeout(() => responseCallback(fakeResponse), 0);
                    }
                    return;
                }
            }
            return originalSendMessage.apply(this, arguments);
        };

        if (originalConnect) {
            chrome.runtime.connect = function(extensionId, connectInfo) {
                const port = originalConnect.apply(this, arguments);
                
                const originalPostMessage = port.postMessage.bind(port);
                port.postMessage = function(message) {
                    if (typeof message === 'object' && message.recipient) {
                        if (DLD_INTERNAL.blockedRecipients.some(r => message.recipient === r)) {
                            return;
                        }
                    }
                    return originalPostMessage(message);
                };
                
                return port;
            };
        }

        if (chrome.runtime.onMessage) {
            const originalAddListener = chrome.runtime.onMessage.addListener.bind(chrome.runtime.onMessage);
            
            chrome.runtime.onMessage.addListener = function(callback) {
                const wrappedCallback = function(message, sender, sendResponse) {
                    if (typeof message === 'object' && message.nm) {
                        return false;
                    }
                    if (typeof message === 'object') {
                        if (DLD_INTERNAL.blockedRecipients.some(r => message.recipient === r)) {
                            sendResponse(fakeResponse);
                            return false;
                        }
                    }
                    return callback(message, sender, sendResponse);
                };
                return originalAddListener(wrappedCallback);
            };
        }
    }

    function interceptMutationObservers() {
        const originalObserve = GHOST.originalObserve;
        const observerRegistry = new WeakMap();

        MutationObserver.prototype.observe = function(target, options) {
            if (!target || typeof target !== 'object') {
                return originalObserve.call(this, target, options);
            }

            if (target === document || target === document.body || target === document.documentElement) {
                if (options.childList || options.subtree || options.characterData) {
                    const stack = new Error().stack || '';
                    if (stack.includes('deledao') || stack.includes('dld') || stack.includes('DVA') || 
                        stack.includes('DGM') || stack.includes('DIA') || stack.includes('DU')) {
                        
                        const ghostTarget = {
                            nodeType: target.nodeType,
                            nodeName: target.nodeName,
                            childNodes: [],
                            getElementsByTagName: function(name) {
                                if (['video', 'img', 'canvas', 'iframe'].includes(name.toLowerCase())) {
                                    return [];
                                }
                                return target.getElementsByTagName(name);
                            },
                            querySelector: function(sel) {
                                return null;
                            },
                            querySelectorAll: function(sel) {
                                return [];
                            },
                            isSameNode: target.isSameNode.bind(target),
                            contains: target.contains.bind(target)
                        };
                        
                        observerRegistry.set(this, { realTarget: target, ghostTarget });
                    }
                }
            }
            return originalObserve.call(this, target, options);
        };
    }

    function interceptFetch() {
        const originalFetch = window.fetch;
        const fakeResponse = () => Promise.resolve(new Response(JSON.stringify({ ok: true, safe: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        }));

        window.fetch = function(url, options) {
            const urlStr = typeof url === 'string' ? url : url?.url || '';
            
            if (DLD_INTERNAL.blockedDomains.some(d => urlStr.includes(d))) {
                return fakeResponse();
            }
            
            if (options?.body && typeof options.body === 'string') {
                try {
                    const body = JSON.parse(options.body);
                    if (body.recipient && DLD_INTERNAL.blockedRecipients.some(r => body.recipient === r)) {
                        return fakeResponse();
                    }
                } catch (e) {}
            }
            
            return originalFetch.apply(this, arguments);
        };
    }

    function interceptXHR() {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url) {
            this._ghost_url = String(url);
            this._ghost_blocked = DLD_INTERNAL.blockedDomains.some(d => this._ghost_url.includes(d));
            
            if (this._ghost_blocked) {
                this.readyState = 4;
                this.status = 200;
                this.responseText = JSON.stringify({ ok: true, safe: true });
                return;
            }
            return originalOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function(body) {
            if (this._ghost_blocked) {
                setTimeout(() => {
                    Object.defineProperty(this, 'readyState', { value: 4, writable: true });
                    Object.defineProperty(this, 'status', { value: 200, writable: true });
                    Object.defineProperty(this, 'responseText', { value: JSON.stringify({ ok: true }), writable: true });
                    
                    if (this.onreadystatechange) this.onreadystatechange({ target: this });
                    if (this.onload) this.onload({ target: this });
                    if (this._ghost_resolve) this._ghost_resolve(this.response);
                }, 1);
                return;
            }

            if (body && typeof body === 'string') {
                try {
                    const parsed = JSON.parse(body);
                    if (parsed.recipient && DLD_INTERNAL.blockedRecipients.some(r => parsed.recipient === r)) {
                        this._ghost_blocked = true;
                        setTimeout(() => {
                            this.readyState = 4;
                            this.status = 200;
                            this.responseText = JSON.stringify({ ok: true });
                            if (this.onload) this.onload();
                        }, 1);
                        return;
                    }
                } catch (e) {}
            }
            
            return originalSend.apply(this, arguments);
        };
    }

    function interceptCanvas() {
        const originalGetContext = GHOST.originalGetContext;
        const originalToDataURL = GHOST.originalToDataURL;
        const originalToBlob = GHOST.originalToBlob;
        const originalGetImageData = GHOST.originalGetImageData;
        const originalDrawImage = GHOST.originalDrawImage;
        const originalPutImageData = GHOST.originalPutImageData;

        HTMLCanvasElement.prototype.getContext = function(type, attributes) {
            const context = originalGetContext.call(this, type, attributes);
            
            if (context) {
                const protect = shouldProtect();
                
                if (protect) {
                    GHOST.protectedCanvases.add(this);
                }
                
                return new Proxy(context, {
                    get: function(target, prop) {
                        if (protect) {
                            if (prop === 'drawImage') {
                                return function(image, ...args) {
                                    if (shouldProtect()) {
                                        const safeCanvas = getSafeFrame(args[2] || 800, args[3] || 600, 'graph');
                                        return originalDrawImage.call(target, safeCanvas, ...args);
                                    }
                                    return originalDrawImage.call(target, image, ...args);
                                };
                            }
                            if (prop === 'getImageData') {
                                return function(x, y, w, h, sw) {
                                    if (shouldProtect()) {
                                        const safeCanvas = getSafeFrame(w, h, 'document');
                                        const safeCtx = safeCanvas.getContext('2d');
                                        return safeCtx.getImageData(0, 0, w, h);
                                    }
                                    return originalGetImageData.call(target, x, y, w, h, sw);
                                };
                            }
                            if (prop === 'putImageData') {
                                return function(imageData, x, y) {
                                    if (shouldProtect()) {
                                        const safeData = new ImageData(imageData.width, imageData.height);
                                        for (let i = 0; i < safeData.data.length; i += 4) {
                                            safeData.data[i] = 250 + Math.floor(Math.random() * 5);
                                            safeData.data[i + 1] = 250 + Math.floor(Math.random() * 5);
                                            safeData.data[i + 2] = 250 + Math.floor(Math.random() * 5);
                                            safeData.data[i + 3] = 255;
                                        }
                                        return originalPutImageData.call(target, safeData, x, y);
                                    }
                                    return originalPutImageData.call(target, imageData, x, y);
                                };
                            }
                        }
                        const val = target[prop];
                        return typeof val === 'function' ? val.bind(target) : val;
                    }
                });
            }
            return context;
        };

        HTMLCanvasElement.prototype.toDataURL = function(type, quality) {
            if (shouldProtect() || GHOST.protectedCanvases.has(this)) {
                const template = Math.random() > 0.5 ? 'graph' : 'code';
                const safeCanvas = getSafeFrame(this.width || 800, this.height || 600, template);
                return safeCanvas.toDataURL(type, quality);
            }
            return originalToDataURL.call(this, type, quality);
        };

        HTMLCanvasElement.prototype.toBlob = function(callback, type, quality) {
            if (shouldProtect() || GHOST.protectedCanvases.has(this)) {
                const safeCanvas = getSafeFrame(this.width || 800, this.height || 600, 'wikipedia');
                return safeCanvas.toBlob(callback, type, quality);
            }
            return originalToBlob.call(this, callback, type, quality);
        };
    }

    function interceptVideo() {
        const originalPlay = HTMLMediaElement.prototype.play;
        const originalPause = HTMLMediaElement.prototype.pause;
        
        const createVideoProxy = function(video) {
            GHOST.protectedVideos.add(video);
            
            const handler = {
                get: function(target, prop) {
                    if (shouldProtect()) {
                        if (prop === 'videoWidth' || prop === 'videoHeight') return 800;
                        if (prop === 'currentTime') return target.currentTime;
                        if (prop === 'duration') return target.duration || 0;
                        if (prop === 'paused') return target.paused;
                        if (prop === 'ended') return target.ended;
                    }
                    const val = target[prop];
                    return typeof val === 'function' ? val.bind(target) : val;
                }
            };
            
            return new Proxy(video, handler);
        };

        HTMLMediaElement.prototype.play = function() {
            if (shouldProtect()) {
                GHOST.protectedVideos.add(this);
            }
            return originalPlay.call(this);
        };
    }

    function interceptImage() {
        const originalImage = window.Image;
        
        window.Image = function(width, height) {
            const img = new originalImage(width, height);
            
            const originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
            let internalSrc = '';
            
            Object.defineProperty(img, 'src', {
                get: function() {
                    if (shouldProtect()) {
                        return internalSrc.replace(/\.(png|jpg|jpeg|gif|webp)$/i, '_safe.png');
                    }
                    return internalSrc;
                },
                set: function(val) {
                    internalSrc = val;
                    return originalSrcDescriptor.set.call(this, val);
                },
                configurable: true
            });
            
            return img;
        };
        
        window.Image.prototype = originalImage.prototype;
    }

    function interceptBlobURLs() {
        const originalCreateObjectURL = URL.createObjectURL;
        const originalRevokeObjectURL = URL.revokeObjectURL;
        const blobRegistry = new Map();

        URL.createObjectURL = function(blob) {
            const url = originalCreateObjectURL(blob);
            
            if (blob.type && blob.type.startsWith('image/')) {
                blobRegistry.set(url, { 
                    blob, 
                    isProtected: shouldProtect()
                });
            }
            
            if (blob.type && blob.type.startsWith('video/')) {
                blobRegistry.set(url, { 
                    blob, 
                    isProtected: shouldProtect()
                });
            }
            
            return url;
        };

        URL.revokeObjectURL = function(url) {
            blobRegistry.delete(url);
            return originalRevokeObjectURL(url);
        };
    }

    function interceptShadowDOM() {
        const originalAttachShadow = GHOST.originalAttachShadow;
        
        Element.prototype.attachShadow = function(init) {
            const shadow = originalAttachShadow.call(this, init);
            
            if (init.mode === 'closed') {
                this._ghost_shadow = shadow;
                GHOST.shadowRoots.push({ element: this, shadow });
                this.setAttribute('data-ghost-shadow', 'true');
            }
            
            return shadow;
        };

        const originalQuerySelector = Element.prototype.querySelector;
        const originalQuerySelectorAll = Element.prototype.querySelectorAll;

        Element.prototype.querySelector = function(selector) {
            if (this._ghost_shadow && shouldProtect()) {
                return null;
            }
            return originalQuerySelector.call(this, selector);
        };

        Element.prototype.querySelectorAll = function(selector) {
            if (this._ghost_shadow && shouldProtect()) {
                return [];
            }
            return originalQuerySelectorAll.call(this, selector);
        };
    }

    function overrideNavigator() {
        Object.defineProperty(navigator, 'credentials', {
            value: {
                get: function() { return Promise.resolve(null); },
                create: function() { return Promise.resolve(null); },
                preventSilentAccess: function() { return Promise.resolve(); }
            },
            configurable: true
        });

        Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined,
            configurable: true
        });

        if (navigator.getBattery) {
            Object.defineProperty(navigator, 'getBattery', {
                value: function() {
                    return Promise.resolve({
                        charging: true,
                        chargingTime: 0,
                        dischargingTime: Infinity,
                        level: 1,
                        addEventListener: function() {},
                        removeEventListener: function() {},
                        dispatchEvent: function() { return true; }
                    });
                },
                configurable: true
            });
        }
    }

    function silenceConsole() {
        const blockedPatterns = ['dld', 'deledao', 'DVA', 'DGM', 'DIA', '[DU]', '[Filter]', '[YoutubeFilter]', 'DygMA', 'badContent'];
        const originalConsole = {};
        const methods = ['log', 'warn', 'error', 'info', 'debug', 'trace'];

        methods.forEach(method => {
            originalConsole[method] = console[method];
        });

        window.console = new Proxy(console, {
            get: function(target, prop) {
                if (methods.includes(prop)) {
                    return function() {
                        const str = Array.from(arguments).map(a => 
                            typeof a === 'string' ? a : JSON.stringify(a)
                        ).join(' ');
                        
                        if (blockedPatterns.some(p => str.toLowerCase().includes(p.toLowerCase()))) {
                            return;
                        }
                        return originalConsole[prop].apply(console, arguments);
                    };
                }
                return target[prop];
            }
        });
    }

    function injectProtocolSpoof() {
        const spoofMessage = {
            type: '__dld_sendToTopMBus',
            data: {
                type: 'webpageWhitelisted',
                data: {
                    url: window.location.href,
                    title: 'Educational Resource',
                    categories: [],
                    safe: true,
                    whitelisted: true
                }
            }
        };

        setInterval(() => {
            GHOST.originalPostMessage.call(window, {
                recipient: 'filterBackend',
                type: 'heartbeat',
                data: { alive: true, safe: true, url: window.location.href }
            }, '*');
        }, 30000);

        window.addEventListener('message', function handler(event) {
            if (event.data && event.data.type === 'isBlockingNeeded_request') {
                event.source?.postMessage({
                    type: 'isBlockingNeeded_response',
                    ...spoofMessage.data.data
                }, '*');
            }
        });
    }

    function setupRaceConditionDefense() {
        const protectedGlobals = [
            'MutationObserver', 'IntersectionObserver', 'ResizeObserver',
            'XMLHttpRequest', 'fetch', 'WebSocket', 'EventSource', 'Image'
        ];

        protectedGlobals.forEach(name => {
            const descriptor = Object.getOwnPropertyDescriptor(window, name);
            if (descriptor && descriptor.configurable) {
                const original = window[name];
                Object.defineProperty(window, name, {
                    get: function() {
                        const stack = new Error().stack || '';
                        if (stack.includes('deledao') || stack.includes('dld')) {
                            return new Proxy(original, {
                                construct: function(target, args) {
                                    return new target(...args);
                                },
                                get: function(t, prop) {
                                    const val = t[prop];
                                    return typeof val === 'function' ? val.bind(t) : val;
                                }
                            });
                        }
                        return original;
                    },
                    set: function(val) {},
                    configurable: true
                });
            }
        });

        const originalDefineProperty = Object.defineProperty;
        Object.defineProperty = function(obj, prop, descriptor) {
            const blocked = ['__dld_fi', '__dld_bi', '__dld_cui', '__dld_iaw', 
                           '__dld_bcapii', '__dld_odcapii', '__dld_utils', '__dld_popupEdu'];
            
            if (typeof prop === 'string' && blocked.some(b => prop.includes(b))) {
                return obj;
            }
            return originalDefineProperty.call(this, obj, prop, descriptor);
        };

        const originalSet = WeakMap.prototype.set;
        WeakMap.prototype.set = function(key, value) {
            if (key && key.constructor && key.constructor.name === 'MutationObserver') {
                const stack = new Error().stack || '';
                if (stack.includes('deledao') || stack.includes('dld')) {
                    return this;
                }
            }
            return originalSet.call(this, key, value);
        };
    }

    function createDecoyLayer() {
        const decoy = GHOST.originalCreateElement.call(document, 'div');
        decoy.id = 'ghost-decoy-layer';
        decoy.setAttribute('data-ghost-decoy', 'true');
        decoy.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 2147483646;
            opacity: 0.01;
            mix-blend-mode: difference;
        `;
        
        const decoyContent = GHOST.originalCreateElement.call(document, 'div');
        decoyContent.style.cssText = `
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
        `;
        
        const educationalText = GHOST.originalCreateElement.call(document, 'div');
        educationalText.style.cssText = `
            text-align: center;
            color: #333;
            padding: 20px;
        `;
        educationalText.innerHTML = `
            <h2 style="margin: 0 0 10px 0; font-size: 24px;">Educational Resource</h2>
            <p style="margin: 0; font-size: 16px;">Interactive Learning Module</p>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">Mathematics and Science Studies</p>
        `;
        
        decoyContent.appendChild(educationalText);
        decoy.appendChild(decoyContent);
        
        GHOST.decoyLayer = decoy;
        
        if (document.body) {
            document.body.appendChild(decoy);
        } else {
            const observer = new MutationObserver(() => {
                if (document.body) {
                    document.body.appendChild(decoy);
                    observer.disconnect();
                }
            });
            observer.observe(document.documentElement, { childList: true });
        }
    }

    function createAdversarialNoiseOverlay() {
        const noiseCanvas = GHOST.originalCreateElement.call(document, 'canvas');
        noiseCanvas.id = 'ghost-adversarial-noise';
        noiseCanvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 2147483647;
            opacity: 0.015;
            mix-blend-mode: overlay;
        `;
        
        const updateNoise = () => {
            const ctx = noiseCanvas.getContext('2d');
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            noiseCanvas.width = width;
            noiseCanvas.height = height;
            
            const imageData = ctx.createImageData(width, height);
            const data = imageData.data;
            
            const pattern = [
                [0.0, 0.1], [0.2, 0.3], [0.4, 0.5], [0.6, 0.7], [0.8, 0.9],
                [0.1, 0.0], [0.3, 0.2], [0.5, 0.4], [0.7, 0.6], [0.9, 0.8]
            ];
            
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const idx = (y * width + x) * 4;
                    
                    const px = x % 10;
                    const py = y % 10;
                    const p = pattern[py % 10][px % 10];
                    
                    const noise = ((x * y) % 255) ^ ((x + y) % 127);
                    const adversarial = Math.sin(x * 0.1) * 127 + Math.cos(y * 0.1) * 127;
                    
                    const value = Math.floor((noise + adversarial + p * 255) % 256);
                    
                    data[idx] = value;
                    data[idx + 1] = (value + 85) % 256;
                    data[idx + 2] = (value + 170) % 256;
                    data[idx + 3] = 15;
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
        };
        
        GHOST.noiseOverlay = noiseCanvas;
        
        if (document.body) {
            document.body.appendChild(noiseCanvas);
            updateNoise();
        } else {
            const observer = new MutationObserver(() => {
                if (document.body) {
                    document.body.appendChild(noiseCanvas);
                    updateNoise();
                    observer.disconnect();
                }
            });
            observer.observe(document.documentElement, { childList: true });
        }
        
        window.addEventListener('resize', updateNoise);
        
        setInterval(updateNoise, 100);
    }

    function wrapContentInShadow(content) {
        const wrapper = GHOST.originalCreateElement.call(document, 'div');
        wrapper.setAttribute('data-ghost-shadow', 'true');
        wrapper.style.cssText = 'position:relative;width:100%;height:100%;';
        
        const shadow = wrapper.attachShadow({ mode: 'closed' });
        shadow.innerHTML = `
            <style>
                :host { all: initial; }
                * { box-sizing: border-box; }
            </style>
            <div id="ghost-content"></div>
        `;
        
        const contentDiv = shadow.querySelector('#ghost-content');
        if (typeof content === 'string') {
            contentDiv.innerHTML = content;
        } else if (content instanceof Node) {
            contentDiv.appendChild(content);
        }
        
        return wrapper;
    }

    function createGameCloak(gameElement) {
        const wrapper = GHOST.originalCreateElement.call(document, 'div');
        wrapper.setAttribute('data-ghost-cloak', 'true');
        wrapper.style.cssText = `
            position: relative;
            width: ${gameElement.offsetWidth || '100%'};
            height: ${gameElement.offsetHeight || '100%'};
        `;
        
        gameElement.parentNode?.insertBefore(wrapper, gameElement);
        wrapper.appendChild(gameElement);
        
        const decoyVideo = GHOST.originalCreateElement.call(document, 'video');
        decoyVideo.setAttribute('data-ghost-decoy', 'true');
        decoyVideo.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10;
            opacity: 0.02;
        `;
        decoyVideo.muted = true;
        decoyVideo.loop = true;
        
        wrapper.appendChild(decoyVideo);
        
        return wrapper;
    }

    init();

    window.__ghost = {
        active: true,
        version: '3.0.0',
        wrapInShadow: wrapContentInShadow,
        createCloak: createGameCloak,
        setStealthMode: (v) => { GHOST.stealthMode = v; },
        getSafeFrame: getSafeFrame,
        showDecoy: () => { if (GHOST.decoyLayer) GHOST.decoyLayer.style.opacity = '1'; },
        hideDecoy: () => { if (GHOST.decoyLayer) GHOST.decoyLayer.style.opacity = '0.01'; }
    };

})();