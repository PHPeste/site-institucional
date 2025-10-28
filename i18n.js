/**
 * PHPeste i18n System
 * Sistema de internacionalização leve e sem build process
 */

class I18n {
  constructor() {
    this.currentLocale = 'pt-BR';
    this.translations = {};
    this.supportedLocales = ['pt-BR', 'en-US'];
    this.initialized = false;
  }

  /**
   * Inicializa o sistema de i18n
   */
  async init() {
    try {
      // 1. Detectar idioma preferido (localStorage > navegador > padrão)
      this.currentLocale = this.detectLocale();

      // 2. Carregar traduções
      await this.loadTranslations(this.currentLocale);

      // 3. Aplicar traduções ao DOM
      this.applyTranslations();

      // 4. Atualizar atributos HTML
      this.updateHTMLAttributes();

      this.initialized = true;

      console.log(`[i18n] Sistema inicializado com sucesso. Idioma: ${this.currentLocale}`);
    } catch (error) {
      console.error('[i18n] Erro ao inicializar:', error);
      // Fallback: se falhar, usar português
      if (this.currentLocale !== 'pt-BR') {
        this.currentLocale = 'pt-BR';
        await this.init();
      }
    }
  }

  /**
   * Detecta o idioma preferido do usuário
   */
  detectLocale() {
    // 1. Verificar localStorage
    const savedLocale = localStorage.getItem('phpeste-locale');
    if (savedLocale && this.supportedLocales.includes(savedLocale)) {
      return savedLocale;
    }

    // 2. Verificar parâmetro URL (?lang=en-US)
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && this.supportedLocales.includes(urlLang)) {
      return urlLang;
    }

    // 3. Detectar idioma do navegador
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('en')) {
      return 'en-US';
    }
    if (browserLang.startsWith('pt')) {
      return 'pt-BR';
    }

    // 4. Fallback: português
    return 'pt-BR';
  }

  /**
   * Carrega o arquivo de traduções
   */
  async loadTranslations(locale) {
    try {
      const response = await fetch(`locales/${locale}.json`);
      if (!response.ok) {
        throw new Error(`Erro ao carregar traduções: ${response.status}`);
      }
      this.translations = await response.json();
      console.log(`[i18n] Traduções carregadas para ${locale}`);
    } catch (error) {
      console.error(`[i18n] Erro ao carregar traduções para ${locale}:`, error);
      throw error;
    }
  }

  /**
   * Busca uma tradução por chave (ex: "hero.title")
   */
  translate(key) {
    const keys = key.split('.');
    let value = this.translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`[i18n] Tradução não encontrada para: ${key}`);
        return key;
      }
    }

    return value || key;
  }

  /**
   * Aplica traduções a todos os elementos com data-i18n
   */
  applyTranslations() {
    // Elementos com data-i18n (texto)
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (key) {
        const translation = this.translate(key);
        // Permite HTML se a tradução contém tags
        if (translation.includes('<')) {
          element.innerHTML = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Elementos com data-i18n-html (sempre HTML)
    const htmlElements = document.querySelectorAll('[data-i18n-html]');
    htmlElements.forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      if (key) {
        element.innerHTML = this.translate(key);
      }
    });

    // Elementos com data-i18n-placeholder
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      if (key) {
        element.placeholder = this.translate(key);
      }
    });

    // Elementos com data-i18n-alt
    const altElements = document.querySelectorAll('[data-i18n-alt]');
    altElements.forEach(element => {
      const key = element.getAttribute('data-i18n-alt');
      if (key) {
        element.alt = this.translate(key);
      }
    });

    // Elementos com data-i18n-title
    const titleElements = document.querySelectorAll('[data-i18n-title]');
    titleElements.forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      if (key) {
        element.title = this.translate(key);
      }
    });

    // Elementos com data-i18n-aria-label
    const ariaElements = document.querySelectorAll('[data-i18n-aria-label]');
    ariaElements.forEach(element => {
      const key = element.getAttribute('data-i18n-aria-label');
      if (key) {
        element.setAttribute('aria-label', this.translate(key));
      }
    });

    console.log(`[i18n] ${elements.length} elementos traduzidos`);
  }

  /**
   * Atualiza meta tags e outros atributos HTML
   */
  updateHTMLAttributes() {
    // Atualizar atributo lang do HTML
    const ogLocaleMap = {
      'pt-BR': 'pt_BR',
      'en-US': 'en_US'
    };
    document.documentElement.lang = this.currentLocale;

    // Atualizar meta tags
    const metaTitle = document.querySelector('title');
    if (metaTitle) {
      metaTitle.textContent = this.translate('meta.title');
    }

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content = this.translate('meta.description');
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.content = this.translate('meta.keywords');
    }

    const metaLanguage = document.querySelector('meta[name="language"]');
    if (metaLanguage) {
      metaLanguage.content = this.translate('meta.language');
    }

    // Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.content = this.translate('meta.title');
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.content = this.translate('meta.description');
    }

    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) {
      ogLocale.content = ogLocaleMap[this.currentLocale] || 'pt_BR';
    }

    // Twitter
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.content = this.translate('meta.title');
    }

    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.content = this.translate('meta.description');
    }

    console.log('[i18n] Meta tags atualizadas');
  }

  /**
   * Troca o idioma atual
   */
  async changeLocale(newLocale) {
    if (!this.supportedLocales.includes(newLocale)) {
      console.error(`[i18n] Idioma não suportado: ${newLocale}`);
      return;
    }

    if (newLocale === this.currentLocale) {
      console.log('[i18n] Idioma já está selecionado');
      return;
    }

    try {
      // Mostrar loading (opcional)
      document.body.style.opacity = '0.7';
      document.body.style.transition = 'opacity 0.3s';

      // Carregar novas traduções
      this.currentLocale = newLocale;
      await this.loadTranslations(newLocale);

      // Aplicar traduções
      this.applyTranslations();
      this.updateHTMLAttributes();

      // Salvar preferência
      localStorage.setItem('phpeste-locale', newLocale);

      // Atualizar URL sem recarregar
      const url = new URL(window.location);
      url.searchParams.set('lang', newLocale);
      window.history.replaceState({}, '', url);

      // Atualizar botão de idiomas
      this.updateLanguageButton();

      // Remover loading
      document.body.style.opacity = '1';

      console.log(`[i18n] Idioma alterado para: ${newLocale}`);

      // Disparar evento customizado
      window.dispatchEvent(new CustomEvent('localeChanged', {
        detail: { locale: newLocale }
      }));
    } catch (error) {
      console.error('[i18n] Erro ao trocar idioma:', error);
      document.body.style.opacity = '1';
    }
  }

  /**
   * Atualiza o botão de seleção de idiomas
   */
  updateLanguageButton() {
    const langButton = document.getElementById('lang-toggle');
    if (langButton) {
      const flagIcon = langButton.querySelector('#flag-icon');
      const langCode = langButton.querySelector('#lang-code');

      if (this.currentLocale === 'pt-BR') {
        if (flagIcon) flagIcon.textContent = '🇧🇷';
        if (langCode) langCode.textContent = 'PT';
      } else if (this.currentLocale === 'en-US') {
        if (flagIcon) flagIcon.textContent = '🇺🇸';
        if (langCode) langCode.textContent = 'EN';
      }
    }
  }

  /**
   * Retorna o idioma atual
   */
  getCurrentLocale() {
    return this.currentLocale;
  }

  /**
   * Retorna os idiomas suportados
   */
  getSupportedLocales() {
    return this.supportedLocales;
  }
}

// Criar instância global
const i18n = new I18n();

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
  i18n.init();
}

// Exportar para uso global
window.i18n = i18n;
