(function () {
  const STORAGE_KEY = 'portfolioLang';
  const DEFAULT_LANG = 'en';
  const SUPPORTED_LANGS = ['en', 'de', 'zh'];

  const translations = {
    en: {
      homeTitle: 'Photography Portfolio',
      homeDescription: 'Photography portfolio by Hu.',
      projectPageTitle: 'Project Gallery',
      projectPageTitleWithName: '{name} ',
      projectPageDescription: 'Photography project gallery by Hu.',
      AboutText: 'About',
      closeAbout: 'Close about panel',
      closePreview: 'Close preview',
      profileAlt: 'Profile picture',
      previewAlt: 'Preview image',
      nameLabel: 'Name:',
      nameValue: 'Hu',
      natLabel: 'Nationality:',
      natValue: 'Chinese',
      locLabel: 'Location:',
      locValue: 'Nürnberg, Germany',
      emailLabel: 'Email:',
      instagramLabel: 'Instagram:',
      rednoteLabel: 'Rednote:',
      catPortrait: 'Portrait',
      catLandscape: 'Landscape',
      catStreet: 'Street',
      catMoment: 'Moment',
      backHome: '⇽ Back',
      Spring: 'Spring',
      UndertheLights: 'Under the Lights',
      Autumn: 'Autumn',
      Bluehour: 'Blue Hour',
      Cowgirl: 'Cowgirl',
      projectImageAlt: '{name} image {index}',
      portraitAlt: 'Portrait photography',
      landscapeAlt: 'Landscape photography',
      streetAlt: 'Street photography',
      momentAlt: 'Moment photography'
    },
    de: {
      homeTitle: 'Fotografie-Portfolio',
      homeDescription: 'Fotografie-Portfolio von Hu.',
      projectPageTitle: 'Projektgalerie',
      projectPageTitleWithName: '{name} ',
      projectPageDescription: 'Fotografie-Projektgalerie von Hu.',
      AboutText: 'Über',
      closeAbout: 'Info-Fenster schließen',
      closePreview: 'Vorschau schließen',
      profileAlt: 'Profilbild',
      previewAlt: 'Vorschaubild',
      nameLabel: 'Name:',
      nameValue: 'Hu',
      natLabel: 'Nationalität:',
      natValue: 'Chinesisch',
      locLabel: 'Ort:',
      locValue: 'Nürnberg, Deutschland',
      emailLabel: 'E-Mail:',
      instagramLabel: 'Instagram:',
      rednoteLabel: 'Rednote:',
      catPortrait: 'Porträt',
      catLandscape: 'Landschaft',
      catStreet: 'Straße',
      catMoment: 'Augenblick',
      backHome: '⇽ Zurück',
      Spring: 'Frühling',
      UndertheLights: 'Unter den Scheinwerfern',
      Autumn: 'Herbst',
      Bluehour: 'Blaue Stunde',
      Cowgirl: 'Cowgirl',
      projectImageAlt: '{name} Bild {index}',
      portraitAlt: 'Porträtfotografie',
      landscapeAlt: 'Landschaftsfotografie',
      streetAlt: 'Straßenfotografie',
      momentAlt: 'Momentfotografie'
    },
    zh: {
      homeTitle: '摄影主页',
      homeDescription: '胡的摄影作品。',
      projectPageTitle: '摄影作品',
      projectPageTitleWithName: '{name}',
      projectPageDescription: '胡的摄影作品。',
      AboutText: '简介',
      closeAbout: '关闭简介面板',
      closePreview: '关闭预览',
      profileAlt: '头像',
      previewAlt: '预览图片',
      nameLabel: '姓名:',
      nameValue: 'Hu',
      natLabel: '国籍:',
      natValue: '中国',
      locLabel: '地点:',
      locValue: '纽伦堡，德国',
      emailLabel: '邮箱:',
      instagramLabel: 'Instagram:',
      rednoteLabel: '小红书:',
      catPortrait: '人像',
      catLandscape: '风景',
      catStreet: '街拍',
      catMoment: '瞬间',
      backHome: '⇽ 返回',
      Spring: '春',
      UndertheLights: '聚光灯',
      Autumn: '秋',
      Bluehour: '傍晚',
      Cowgirl: '乡村',
      projectImageAlt: '{name} 第 {index} 张图片',
      portraitAlt: '人像',
      landscapeAlt: '风景',
      streetAlt: '街头',
      momentAlt: '瞬间'
    }
  };

  function normalizeLang(lang) {
    return SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
  }

  function getLang() {
    return normalizeLang(localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG);
  }

  function setLang(lang) {
    const normalized = normalizeLang(lang);
    localStorage.setItem(STORAGE_KEY, normalized);
    document.documentElement.lang = normalized;
    return normalized;
  }

  function format(template, vars = {}) {
    return String(template).replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''));
  }

  function t(key, vars = {}, lang = getLang()) {
    const dictionary = translations[lang] || translations[DEFAULT_LANG];
    const fallbackDictionary = translations[DEFAULT_LANG];
    const template = dictionary[key] ?? fallbackDictionary[key] ?? key;
    return typeof template === 'string' ? format(template, vars) : template;
  }

  function applyDataI18n(root = document, lang = getLang()) {
    document.documentElement.lang = lang;

    root.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n;
      element.textContent = t(key, {}, lang);
    });

    root.querySelectorAll('[data-i18n-attr]').forEach((element) => {
      const rules = element.dataset.i18nAttr.split(';').map((item) => item.trim()).filter(Boolean);
      rules.forEach((rule) => {
        const [attr, key] = rule.split(':').map((part) => part.trim());
        if (!attr || !key) return;
        element.setAttribute(attr, t(key, {}, lang));
      });
    });
  }

  function setPageMeta({ titleKey, titleVars = {}, descriptionKey, descriptionVars = {} } = {}, lang = getLang()) {
    if (titleKey) {
      document.title = t(titleKey, titleVars, lang);
    }

    if (descriptionKey) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute('content', t(descriptionKey, descriptionVars, lang));
      }
    }
  }

  window.PortfolioI18n = {
    STORAGE_KEY,
    DEFAULT_LANG,
    SUPPORTED_LANGS,
    translations,
    getLang,
    setLang,
    t,
    applyDataI18n,
    setPageMeta
  };
})();
