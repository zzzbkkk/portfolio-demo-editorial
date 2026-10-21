(() => {
  'use strict';
  const { projects, email, imageSizes } = window.PORTFOLIO_DATA;
  const page = document.body.dataset.page;
  const imageUrl = name => `assets/${name}.webp`;
  const thumbnailUrl = name => `assets/thumbs/${name}.webp`;
  const projectUrl = work => `project.html?work=${encodeURIComponent(work.id)}`;
  const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const sizeOf = name => imageSizes[name] || [1, 1];
  const shapeOf = name => { const [w, h] = sizeOf(name); return w / h > 1.3 ? 'wide' : w / h < .9 ? 'portrait' : 'square'; };
  // CSS viewports remove only documented source-canvas whitespace; original files remain intact.
  const characterViews = {
    'ip-black': [388, 303, 696, 662], 'ip-white': [459, 81, 691, 920],
    'ip-lin': [111, 163, 850, 1167], 'ip-yaba': [265, 234, 506, 675], 'ip-fufu': [668, 444, 1065, 799]
  };
  function artworkImage(name, caption, crop = false, priority = 'lazy') {
    const [w, h] = sizeOf(name);
    const image = `<img src="${imageUrl(name)}" alt="${escape(caption)}" width="${w}" height="${h}" loading="${priority === 'lazy' ? 'lazy' : 'eager'}" fetchpriority="${priority === 'high' ? 'high' : 'auto'}">`;
    if (!crop || !characterViews[name]) return image;
    const [x, y, cw, ch] = characterViews[name];
    return `<span class="art-viewport" style="--art-ratio:${cw / ch};--crop-width:${cw}px;--crop-height:${ch}px;--image-width:${w / cw * 100}%;--image-left:${-x / cw * 100}%;--image-top:${-y / ch * 100}%">${image}</span>`;
  }
  function projectTitle(work) {
    const phrases = {
      'book-posters': ['书籍海报', '设计'], 'packaging': ['紫色纹样', '包装'],
      'city-poster': ['福州新年', '城市海报'], 'forest': ['森林里的', '小聚会'],
      'mood': ['小熊', '情绪记录'], 'storybook': ['芬宝儿童 IP', '绘本']
    };
    return phrases[work.id] ? phrases[work.id].map(phrase => `<span class="title-phrase">${escape(phrase)}</span>`).join('<wbr>') : escape(work.name);
  }

  function renderChrome() {
    document.querySelector('#site-header').innerHTML = `<div class="nav-inner"><a class="wordmark" href="index.html" aria-label="林予，返回首页"><span class="wordmark-cn">林予</span><span class="wordmark-en">LIN YU / DEMO</span></a><nav class="desktop-nav" aria-label="主导航"><a href="index.html" ${page === 'home' ? 'aria-current="page"' : ''}>首页</a><a href="works.html" ${page === 'works' ? 'aria-current="page"' : ''}>作品</a><a href="about.html" ${page === 'about' ? 'aria-current="page"' : ''}>关于我</a></nav><a class="header-contact" href="about.html#contact">联系 <span aria-hidden="true">↗</span></a><button class="menu-trigger" type="button" aria-expanded="false" aria-controls="mobile-menu">菜单</button></div>`;
    document.querySelector('#site-footer').innerHTML = `<div class="footer-inner container"><div class="footer-main"><p>有想法，<br>就聊聊。</p><a class="footer-mail" href="demo.html#contact-demo">${email} <span aria-hidden="true">↗</span></a></div><div class="footer-bottom"><a class="footer-name" href="index.html">林予 <span>LIN YU</span></a><nav aria-label="页尾导航"><a href="index.html">首页</a><a href="works.html">作品</a><a href="about.html">关于我</a><a href="about.html#contact">联系</a></nav><span class="footer-field">视觉传达设计作品集</span></div></div>`;
    const menu = document.createElement('dialog');
    menu.id = 'mobile-menu';
    menu.className = 'mobile-menu';
    menu.setAttribute('aria-label', '网站导航');
    menu.innerHTML = `<div class="mobile-menu-top"><a class="wordmark" href="index.html">林予 <span class="wordmark-en">LIN YU / DEMO</span></a><button class="menu-close" type="button" aria-label="关闭导航">关闭 ×</button></div><nav><a href="index.html" ${page === 'home' ? 'aria-current="page"' : ''}>首页</a><a href="works.html" ${page === 'works' ? 'aria-current="page"' : ''}>作品</a><a href="about.html" ${page === 'about' ? 'aria-current="page"' : ''}>关于我</a><a href="about.html#contact">联系</a></nav><a class="mobile-menu-email" href="demo.html#contact-demo">${email}</a>`;
    document.body.append(menu);
    if (page === 'project') document.querySelectorAll('.desktop-nav a[href="works.html"], .mobile-menu nav a[href="works.html"]').forEach(link => link.setAttribute('aria-current', 'location'));
    const trigger = document.querySelector('.menu-trigger');
    const resetMenu = () => { trigger.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-is-open'); };
    trigger.addEventListener('click', () => { menu.showModal(); trigger.setAttribute('aria-expanded', 'true'); document.body.classList.add('menu-is-open'); });
    menu.querySelector('.menu-close').addEventListener('click', () => menu.close());
    menu.addEventListener('close', resetMenu);
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.close()));
  }

  function renderHome() {
    const featured = projects.filter(work => work.featured);
    const fan = document.querySelector('#featured-works');
    const offsets = [-420, -252, -84, 84, 252, 420];
    const angles = [-12, -8, -4, 4, 8, 12];
    fan.innerHTML = featured.map((work, index) => `<a class="fan-card" href="${projectUrl(work)}" style="--offset:${offsets[index]}px;--angle:${angles[index]}deg;--order:${index + 1};--paper:${work.color}" aria-label="查看${escape(work.name)}，${escape(work.category)}"><div class="fan-image ${work.id === 'radio' ? 'fan-pair' : ''}"><img src="${thumbnailUrl(work.cover)}" alt="${escape(work.name)}作品封面" loading="lazy" width="${sizeOf(work.cover)[0]}" height="${sizeOf(work.cover)[1]}">${work.id === 'radio' ? `<img src="${thumbnailUrl('aigc-snow')}" alt="猫狗搭档在雪地中的系列场景" width="900" height="506" loading="lazy">` : ''}</div><span class="fan-mobile-name">${escape(work.name)}<small>${escape(work.category)}</small></span></a>`).join('');
    const caption = document.querySelector('#fan-caption');
    let captionIndex = -1;
    const updateCaption = index => {
      if (captionIndex === index) return;
      captionIndex = index;
      const work = featured[index];
      caption.innerHTML = `<span>${escape(work.name)}</span><small>${escape(work.category)}</small><span class="fan-count" aria-label="第 ${index + 1} 件，共 ${featured.length} 件">${String(index + 1).padStart(2, '0')} / ${String(featured.length).padStart(2, '0')}</span>`;
      if (!reducedMotion()) caption.animate([{ opacity: .25, transform: 'translateY(5px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'ease-out' });
    };
    updateCaption(0);
    const fanCards = Array.from(fan.querySelectorAll('.fan-card'));
    const emphasize = index => {
      fan.classList.add('has-active');
      fanCards.forEach((card, i) => { card.classList.toggle('is-active', i === index); card.style.setProperty('--fan-side', Math.sign(i - index)); });
      updateCaption(index);
    };
    const rest = () => {
      fan.classList.remove('has-active');
      fanCards.forEach(card => { card.classList.remove('is-active'); card.style.setProperty('--fan-side', 0); });
    };
    fanCards.forEach((card, index) => {
      card.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') emphasize(index); });
      card.addEventListener('focus', () => emphasize(index));
    });
    fan.addEventListener('pointerleave', () => {
      const focusedIndex = fanCards.indexOf(document.activeElement);
      if (focusedIndex >= 0) emphasize(focusedIndex);
      else rest();
    });
    fan.addEventListener('focusout', event => { if (!fan.contains(event.relatedTarget)) rest(); });
    const previous = document.querySelector('[data-fan-prev]');
    const next = document.querySelector('[data-fan-next]');
    const updateControls = () => {
      previous.disabled = fan.scrollLeft <= 1;
      next.disabled = fan.scrollLeft + fan.clientWidth >= fan.scrollWidth - 2;
    };
    previous.addEventListener('click', () => fan.scrollBy({ left: -fan.clientWidth * .8, behavior: reducedMotion() ? 'instant' : 'smooth' }));
    next.addEventListener('click', () => fan.scrollBy({ left: fan.clientWidth * .8, behavior: reducedMotion() ? 'instant' : 'smooth' }));
    fan.addEventListener('scroll', updateControls, { passive: true });
    window.addEventListener('resize', updateControls, { passive: true });
    updateControls();
  }

  function renderWorks() {
    const grid = document.querySelector('#work-grid');
    const count = document.querySelector('#result-count');
    const filters = Array.from(document.querySelectorAll('[data-filter]'));
    const order = ['fuzhou-ip', 'book-posters', 'flowers', 'nuo', 'packaging', 'radio', 'cafe', 'city-poster', 'coconut', 'forest', 'mood', 'storybook'];
    const rank = id => order.includes(id) ? order.indexOf(id) : order.length;
    const curated = [...projects].sort((a, b) => rank(a.id) - rank(b.id));
    const thumbs = new Set([...projects.map(work => work.cover), 'poster-sea', 'poster-seventh', 'poster-no-image', 'poster-birds', 'aigc-snow']);
    const coverImage = (name, priority = 'lazy', sizes = '(max-width: 760px) calc(100vw - 40px), 60vw') => {
      const [w, h] = sizeOf(name);
      const tw = name === 'poster-birds' ? 848 : Math.min(w, Math.round(w * Math.min(1, (name.startsWith('poster-') ? 1200 : 900) / Math.max(w, h))));
      const responsive = thumbs.has(name) && tw < w ? ` srcset="${thumbnailUrl(name)} ${tw}w, ${imageUrl(name)} ${w}w" sizes="${['aigc-radio', 'aigc-snow'].includes(name) ? '(max-width: 760px) calc(100vw - 40px), 100vw' : sizes}"` : '';
      return `<img src="${thumbs.has(name) ? thumbnailUrl(name) : imageUrl(name)}"${responsive} alt="" width="${w}" height="${h}" loading="${priority === 'lazy' ? 'lazy' : 'eager'}" fetchpriority="${priority === 'high' ? 'high' : 'auto'}" decoding="async">`;
    };
    const layer = (markup, second = false) => `<div class="cover-layer ${second ? 'cover-layer--alternate' : ''}">${markup}</div>`;
    const cover = work => {
      if (work.id === 'fuzhou-ip') {
        const characters = names => names.map((name, i) => artworkImage(name, '', true, i === 1 ? 'high' : 'eager')).join('');
        return ['ip', layer(characters(['ip-black', 'ip-lin', 'ip-white'])) + layer(characters(['ip-yaba', 'ip-lin', 'ip-fufu']), true)];
      }
      if (work.id === 'book-posters') {
        const sheets = names => names.map(name => `<span class="cover-sheet">${coverImage(name, 'eager', '(max-width: 760px) 55vw, 30vw')}</span>`).join('');
        return ['posters', layer(sheets(['poster-sea', 'poster-birds', 'poster-no-image'])) + layer(sheets(['poster-seventh', 'poster-no-image', 'poster-birds']), true)];
      }
      if (['flowers', 'cafe'].includes(work.id)) {
        const pages = names => names.map(name => `<span class="cover-page">${coverImage(name, 'lazy', '(max-width: 760px) 60vw, 32vw')}</span>`).join('');
        const images = work.id === 'flowers' ? ['flowers-opening', 'flowers-tulip', 'flowers-cover'] : ['cafe-contents', 'cafe-spread', 'cafe-cover'];
        return ['books', layer(pages(images)) + layer(pages([images[2], work.gallery.at(-1).image, images[1]]), true)];
      }
      if (work.id === 'nuo') return ['nuo', layer(coverImage('nuo-mask')) + layer(`<div class="cover-info-sheet">${coverImage('nuo-cover')}</div><div class="cover-info-sheet">${coverImage('nuo-detail')}</div>`, true)];
      if (work.id === 'packaging') return ['photo', layer(coverImage(work.cover)) + layer(coverImage('packaging-detail'), true)];
      if (work.id === 'radio') return ['radio', layer(coverImage(work.cover)) + layer(coverImage('aigc-snow'), true)];
      return [work.id === 'mood' ? 'interface' : work.id === 'storybook' ? 'storybook' : work.id === 'city-poster' ? 'city' : 'art', layer(coverImage(work.cover))];
    };
    const cards = new Map(curated.map(work => {
      const [kind, composition] = cover(work);
      const card = document.createElement('a');
      card.href = projectUrl(work);
      card.dataset.work = work.id;
      card.setAttribute('aria-label', `${work.name}，${work.category}，查看项目`);
      card.innerHTML = `<div class="work-visual cover-${kind}" aria-hidden="true">${composition}</div><div class="work-card-meta"><div><h2>${escape(work.name)}</h2><p>${escape(work.category)}</p></div><span class="work-card-arrow" aria-hidden="true">↗</span></div>`;
      return [work.id, card];
    }));
    const more = document.createElement('div');
    more.className = 'work-section-break';
    more.innerHTML = '<h2>更多创作</h2><p>在不同媒介中继续尝试。</p>';
    let activeFilter;
    const show = (filter, animate = false) => {
      if (activeFilter === filter) return;
      activeFilter = filter;
      const previous = new Map();
      grid.querySelectorAll('.work-item').forEach(card => {
        card.getAnimations().forEach(animation => animation.cancel());
        previous.set(card.dataset.work, card.getBoundingClientRect());
      });
      const matches = filter === 'all' ? curated : curated.filter(work => work.tags.includes(filter));
      const children = [];
      matches.forEach((work, index) => {
        if (filter === 'all' && index === 6) children.push(more);
        const card = cards.get(work.id);
        card.className = `work-item ${filter === 'all' && index >= 6 ? 'work-item--compact' : [0, 3, 4].includes(index % 6) ? 'work-item--wide' : 'work-item--narrow'}`;
        if (filter === 'aigc') card.className = `work-item ${index === 0 ? 'work-item--panorama' : 'work-item--half'}`;
        else if (filter !== 'all' && matches.length % 2 && index === matches.length - 1) card.className = 'work-item work-item--last';
        children.push(card);
      });
      grid.replaceChildren(...children);
      count.textContent = `${matches.length} 件作品`;
      filters.forEach(button => { const active = button.dataset.filter === filter; button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active)); });
      if (animate && !reducedMotion()) matches.forEach((work, index) => {
        const card = cards.get(work.id);
        const before = previous.get(work.id);
        const after = card.getBoundingClientRect();
        const near = rect => rect.top < innerHeight && rect.bottom > 0;
        const from = before && near(before) && near(after)
          ? { transform: `translate(${before.left - after.left}px, ${before.top - after.top}px) scale(${before.width / after.width}, ${before.height / after.height})`, opacity: .65 }
          : { transform: 'translateY(14px)', opacity: .2 };
        card.animate([from, { transform: 'none', opacity: 1 }], { duration: 380, delay: Math.min(index * 30, 90), easing: 'cubic-bezier(.16,1,.3,1)' });
      });
      const toolbar = document.querySelector('.works-toolbar');
      if (animate && grid.getBoundingClientRect().top < toolbar.getBoundingClientRect().bottom) grid.scrollIntoView({ block: 'start', behavior: reducedMotion() ? 'instant' : 'smooth' });
    };
    filters.forEach(button => button.addEventListener('click', () => {
      show(button.dataset.filter, true);
      const bar = button.parentElement;
      bar.scrollTo({ left: button.offsetLeft - bar.offsetLeft - (bar.clientWidth - button.offsetWidth) / 2, behavior: reducedMotion() ? 'instant' : 'smooth' });
    }));
    show('all');
  }

  function figure(item, extra = '') {
    const [width, height] = sizeOf(item.image);
    return `<figure class="gallery-figure media-${shapeOf(item.image)} ${width / height < .6 ? 'media-narrow' : ''} ${extra}"><a href="${imageUrl(item.image)}" data-view-image data-caption="${escape(item.caption)}" aria-label="放大查看：${escape(item.caption)}">${artworkImage(item.image, item.caption, extra === 'character')}<span class="zoom-hint" aria-hidden="true">放大 ↗</span></a><figcaption>${escape(item.caption)}</figcaption></figure>`;
  }

  function renderProject() {
    const id = new URLSearchParams(location.search).get('work');
    const work = projects.find(item => item.id === id);
    const main = document.querySelector('#main');
    if (!work) {
      document.title = '未找到作品 · 林予';
      main.innerHTML = `<div class="not-found container"><h1>这件作品还没找到。</h1><p>回到作品选集，看看其他设计。</p><a class="outline-link" href="works.html">返回作品选集 ↗</a></div>`;
      return;
    }
    document.title = `${work.name} · 林予`;
    const index = projects.indexOf(work);
    const next = projects[(index + 1) % projects.length];
    const ip = work.id === 'fuzhou-ip';
    const introFigure = ip ? `<div class="case-ip-cover">${artworkImage('ip-lin', '林则徐卡通角色', true, 'high')}${artworkImage('ip-white', '白无常卡通角色', true, 'eager')}</div>` : `<div class="case-cover" style="--paper:${work.color}">${artworkImage(work.cover, `${work.name}主视觉`, false, 'high')}</div>`;
    const gallery = ip ? `<section class="case-story container"><div class="case-section-title"><h2>让熟悉的形象，<br>多一点亲近感。</h2><p>保留高帽、官帽、服饰等辨识特征，再以圆润比例、简化五官与鲜明配色重新组织角色。</p></div><div class="character-grid">${work.gallery.slice(0, 5).map(item => figure(item, 'character')).join('')}</div></section><section class="case-applications"><div class="container"><div class="case-section-title"><h2>从角色，<br>延展到日常。</h2><p>以帆布袋、冰箱贴等载体探索文创应用的视觉可能。以下为 AI 辅助生成的应用效果示意。</p></div><div class="application-grid">${work.gallery.slice(5).map(item => figure(item)).join('')}</div></div></section>` : `<section class="project-gallery container" aria-label="${escape(work.name)}作品图集"><div class="gallery-grid ${work.gallery.length === 1 ? 'single-image' : work.gallery.length % 2 ? 'is-odd' : ''}">${work.gallery.map(item => figure(item)).join('')}</div></section>`;
    main.innerHTML = `<div class="project-back container"><a class="text-link" href="works.html">← 返回作品选集</a></div><section class="case-hero container"><div class="case-hero-copy"><p class="case-category">${escape(work.category)}</p><h1>${ip ? '福州城市<br>IP 形象' : projectTitle(work)}</h1><p class="case-intro">${escape(work.intro)}</p><p class="case-note">${escape(work.note)}</p></div>${introFigure}</section>${gallery}<section class="next-project container"><span>下一件作品</span><a href="${projectUrl(next)}"><div class="next-project-image" style="--paper:${next.color}"><img src="${thumbnailUrl(next.cover)}" alt="" width="${sizeOf(next.cover)[0]}" height="${sizeOf(next.cover)[1]}" loading="lazy"></div><div class="next-project-copy"><h2>${projectTitle(next)}</h2><p>${escape(next.category)}</p></div><span class="next-project-arrow" aria-hidden="true">↗</span></a></section>`;
    setupLightbox();
  }

  function setupLightbox() {
    const links = Array.from(document.querySelectorAll('[data-view-image]'));
    if (!links.length) return;
    const viewer = document.createElement('dialog');
    viewer.className = 'image-viewer';
    viewer.setAttribute('aria-label', '作品大图');
    viewer.innerHTML = `<div class="viewer-toolbar"><span class="viewer-counter" aria-live="polite"></span><div class="viewer-actions"><button type="button" class="viewer-zoom" aria-pressed="false">查看原尺寸</button><button type="button" class="viewer-close" aria-label="关闭大图">关闭 ×</button></div></div><div class="viewer-content"><button type="button" class="viewer-image-button" aria-label="查看原尺寸"><span class="viewer-art"><img alt=""></span></button><p class="viewer-load-status" role="status"></p></div><div class="viewer-bottom"><button type="button" class="viewer-prev" aria-label="上一张作品图">←</button><p class="viewer-caption" aria-live="polite"></p><button type="button" class="viewer-next" aria-label="下一张作品图">→</button></div>`;
    document.body.append(viewer);
    const image = viewer.querySelector('img');
    const content = viewer.querySelector('.viewer-content');
    const caption = viewer.querySelector('.viewer-caption');
    const counter = viewer.querySelector('.viewer-counter');
    const status = viewer.querySelector('.viewer-load-status');
    const zoom = viewer.querySelector('.viewer-zoom');
    const imageButton = viewer.querySelector('.viewer-image-button');
    const imageFrame = viewer.querySelector('.viewer-art');
    const previous = viewer.querySelector('.viewer-prev');
    const next = viewer.querySelector('.viewer-next');
    let current = 0;
    let originLink;
    let zoomed = false;
    let cropSize;
    const setZoom = value => {
      zoomed = value;
      content.classList.toggle('is-zoomed', value);
      content.scrollTo(0, 0);
      zoom.setAttribute('aria-pressed', String(value));
      zoom.textContent = value ? '适应屏幕' : '查看原尺寸';
      imageButton.setAttribute('aria-label', value ? '缩回适应屏幕' : '查看原尺寸');
    };
    const updateZoom = () => {
      if (!viewer.open || !image.naturalWidth) return;
      const [nativeWidth, nativeHeight] = cropSize || [image.naturalWidth, image.naturalHeight];
      const canZoom = nativeWidth > content.clientWidth || nativeHeight > content.clientHeight;
      if (!canZoom && [zoom, imageButton].includes(document.activeElement)) {
        (links.length > 1 ? next : viewer.querySelector('.viewer-close')).focus({ preventScroll: true });
      }
      zoom.disabled = imageButton.disabled = !canZoom;
      if (!canZoom) { setZoom(false); zoom.textContent = '已是原尺寸'; }
    };
    const show = index => {
      current = (index + links.length) % links.length;
      const link = links[current];
      setZoom(false);
      const crop = link.querySelector('.art-viewport');
      cropSize = crop ? [parseFloat(crop.style.getPropertyValue('--crop-width')), parseFloat(crop.style.getPropertyValue('--crop-height'))] : null;
      imageButton.classList.toggle('has-character', !!crop);
      imageFrame.className = crop ? 'viewer-art art-viewport' : 'viewer-art';
      imageButton.style.cssText = imageFrame.style.cssText = crop ? crop.style.cssText : '';
      viewer.classList.add('is-loading');
      viewer.setAttribute('aria-busy', 'true');
      status.textContent = '图片加载中…';
      image.src = link.href;
      image.alt = link.dataset.caption;
      caption.textContent = link.dataset.caption;
      counter.textContent = `${current + 1} / ${links.length}`;
      previous.disabled = next.disabled = links.length < 2;
    };
    image.addEventListener('load', () => {
      viewer.classList.remove('is-loading');
      viewer.setAttribute('aria-busy', 'false');
      status.textContent = '';
      updateZoom();
      if (!reducedMotion()) image.animate([{ opacity: 0, transform: 'scale(.985)' }, { opacity: 1, transform: 'none' }], { duration: 180, easing: 'ease-out' });
    });
    image.addEventListener('error', () => { viewer.classList.remove('is-loading'); viewer.setAttribute('aria-busy', 'false'); status.textContent = '图片暂时未能加载，可切换其他图片或关闭后重试。'; });
    previous.addEventListener('click', () => show(current - 1));
    next.addEventListener('click', () => show(current + 1));
    zoom.addEventListener('click', () => setZoom(!zoomed));
    imageButton.addEventListener('click', () => setZoom(!zoomed));
    viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
    viewer.addEventListener('click', event => { if (event.target === viewer || event.target === content) viewer.close(); });
    viewer.addEventListener('keydown', event => {
      if (!zoomed && ['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1)); }
    });
    viewer.addEventListener('close', () => { document.body.classList.remove('viewer-is-open'); originLink?.focus({ preventScroll: true }); });
    window.addEventListener('resize', () => { if (viewer.open) { setZoom(false); updateZoom(); } }, { passive: true });
    links.forEach((link, index) => link.addEventListener('click', event => {
      event.preventDefault();
      originLink = link;
      viewer.showModal();
      document.body.classList.add('viewer-is-open');
      show(index);
    }));
  }

  function reducedMotion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  function setupHero() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const art = hero.querySelector('.hero-art');
    const parallax = hero.querySelector('.hero-parallax');
    const cards = Array.from(hero.querySelectorAll('.hero-stack-card'));
    const name = hero.querySelector('#hero-art-name');
    const status = hero.querySelector('#hero-art-status');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let active = Math.max(0, cards.findIndex(card => card.dataset.slot === '0'));
    let turning = false;
    let turnAnimation;
    let pointerFrame;
    const setSlots = () => cards.forEach((card, index) => {
      const slot = (index - active + cards.length) % cards.length;
      card.dataset.slot = slot;
      card.tabIndex = slot === 0 ? 0 : -1;
      card.setAttribute('aria-hidden', String(slot !== 0));
      card.setAttribute('aria-label', `当前海报：${card.dataset.name}。点击翻看下一张`);
    });
    const resetPointer = () => {
      cancelAnimationFrame(pointerFrame);
      parallax.style.setProperty('--pointer-x', '0px');
      parallax.style.setProperty('--pointer-y', '0px');
      parallax.style.setProperty('--pointer-turn', '0deg');
    };
    const change = async direction => {
      if (turning) return;
      turning = true;
      const current = cards[active];
      const keepFocus = document.activeElement === current;
      if (!motion.matches) {
        turnAnimation = current.animate([
          { transform: getComputedStyle(current).transform, opacity: 1 },
          { transform: `translate(${direction * 58}%, -7%) rotate(${direction * 15}deg)`, opacity: 0 }
        ], { duration: 320, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' });
        try { await turnAnimation.finished; } catch { /* Motion preference can cancel the turn. */ }
      }
      active = (active + direction + cards.length) % cards.length;
      setSlots();
      turnAnimation?.cancel();
      name.innerHTML = `${escape(cards[active].dataset.name)} <span aria-hidden="true">↗</span>`;
      status.textContent = `当前海报：${cards[active].dataset.name}`;
      if (keepFocus) cards[active].focus({ preventScroll: true });
      turning = false;
    };
    cards.forEach(card => card.addEventListener('click', () => change(1)));
    hero.querySelector('[data-hero-prev]').addEventListener('click', () => change(-1));
    hero.querySelector('[data-hero-next]').addEventListener('click', () => change(1));
    art.addEventListener('pointermove', event => {
      if (motion.matches || !finePointer.matches) return;
      const bounds = art.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        parallax.style.setProperty('--pointer-x', `${x * 15}px`);
        parallax.style.setProperty('--pointer-y', `${y * 12}px`);
        parallax.style.setProperty('--pointer-turn', `${x * 2}deg`);
      });
    });
    art.addEventListener('pointerleave', resetPointer);
    const syncMotion = () => {
      hero.classList.toggle('has-scroll-motion', !motion.matches && !!window.CSS?.supports('animation-timeline: view()'));
      hero.classList.toggle('has-entry-motion', !motion.matches);
      if (motion.matches) { resetPointer(); turnAnimation?.cancel(); }
    };
    motion.addEventListener('change', syncMotion);
    setSlots();
    syncMotion();
  }

  function setupFeaturedReveal() {
    const fan = document.querySelector('.fan');
    if (!fan || reducedMotion()) return;
    fan.classList.add('fan-will-enter');
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      fan.classList.add('is-revealed');
      observer.disconnect();
    }, { threshold: .12 });
    observer.observe(fan);
  }

  function setupHeaderContrast() {
    const header = document.querySelector('#site-header');
    const sections = document.querySelectorAll('.selected-section, #site-footer');
    let observer;
    const active = new Set();
    const observe = () => {
      observer?.disconnect();
      active.clear();
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => entry.isIntersecting ? active.add(entry.target) : active.delete(entry.target));
        header.classList.toggle('is-dark', active.size > 0);
      }, { rootMargin: `0px 0px -${Math.max(0, window.innerHeight - header.offsetHeight)}px 0px`, threshold: 0 });
      sections.forEach(section => observer.observe(section));
    };
    observe();
    window.addEventListener('resize', observe, { passive: true });
  }

  function setupCopy() {
    const button = document.querySelector('[data-copy-email]');
    if (!button) return;
    button.addEventListener('click', () => { location.href = 'demo.html#contact-demo'; });
  }

  function setupContentReveal() {
    if (reducedMotion() || !('IntersectionObserver' in window)) return;
    const targets = document.querySelectorAll('.gallery-figure, .home-about > div, .about-background > *, .practice-list > div, .next-project');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
    targets.forEach(target => {
      if (target.getBoundingClientRect().top < window.innerHeight - 24) return;
      target.classList.add('content-reveal');
      observer.observe(target);
    });
    // Keyboard navigation must never land in a still-hidden reveal target.
    document.addEventListener('focusin', event => event.target.closest('.content-reveal')?.classList.add('is-visible'));
  }

  renderChrome();
  if (page === 'home') renderHome();
  if (page === 'works') renderWorks();
  if (page === 'project') renderProject();
  setupCopy();
  setupHeaderContrast();
  setupHero();
  setupFeaturedReveal();
  setupContentReveal();
})();
