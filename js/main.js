/**
 * BETALINK - Hospitality Management Platform
 * Interactive UI Engine, Animation System & Controllers
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgressBar();
  initSmartHeader();
  initMobileNav();
  initScrollReveal();
  initAnimatedCounters();
  initProductSwitcher();
  initRoiSimulator();
  initFaqAccordion();
  initDemoModals();
  initLeadForms();
  initClientFilter();
  initTerritoryRadar();
  initCaseStudyModal();
});

/* -------------------------------------------------------------
 * 1. Top Scroll Progress Bar
 * ------------------------------------------------------------- */
function initScrollProgressBar() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  const updateProgress = () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (height > 0) {
      const scrolled = (winScroll / height) * 100;
      bar.style.width = scrolled + '%';
    }
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* -------------------------------------------------------------
 * 2. Smart Header
 * ------------------------------------------------------------- */
function initSmartHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* -------------------------------------------------------------
 * 3. Mobile Navigation & Drawer
 * ------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!toggleBtn || !navMenu) return;

  const toggleNav = () => {
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.classList.toggle('open', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  toggleBtn.addEventListener('click', toggleNav);

  // Close when clicking nav link
  document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggleBtn.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });
}

/* -------------------------------------------------------------
 * 4. Scroll Reveal Animations
 * ------------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  // Add reveal class to sections and cards automatically if not present
  document.querySelectorAll('.workflow-step-card, .hotel-card, .module-item, .integration-card, .faq-item, .roi-card, .comparison-card').forEach((el, index) => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(index % 3) * 0.12}s`;
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* -------------------------------------------------------------
 * 5. Animated Number Counters on Scroll
 * ------------------------------------------------------------- */
function initAnimatedCounters() {
  const statBar = document.querySelector('.client-stat-bar');
  if (!statBar) return;

  let animated = false;
  const counters = statBar.querySelectorAll('.counter-val');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          if (!isNaN(target)) {
            animateValue(counter, 0, target, 1400);
          }
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  observer.observe(statBar);

  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic ease out
      obj.textContent = Math.floor(ease * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.textContent = end;
      }
    };
    window.requestAnimationFrame(step);
  }
}

/* -------------------------------------------------------------
 * 6. Hero Product Switcher (Gootel vs Appetito)
 * ------------------------------------------------------------- */
function initProductSwitcher() {
  const tabs = document.querySelectorAll('.switcher-tab');
  const panes = document.querySelectorAll('.preview-pane');
  const titleText = document.getElementById('windowTitleText');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetProduct = tab.getAttribute('data-target');
      const isEn = document.documentElement.lang === 'en';

      tabs.forEach(t => t.classList.remove('active', 'coral-active'));

      if (targetProduct === 'appetito') {
        tab.classList.add('active', 'coral-active');
        if (titleText) {
          titleText.textContent = isEn
            ? 'Appetito Cloud POS · Mobile Order Taking & Kitchen Display'
            : 'Appetito Cloud POS · Gestione Comande & Ristorante';
        }
      } else {
        tab.classList.add('active');
        if (titleText) {
          titleText.textContent = isEn
            ? 'Gootel Cloud PMS · Hotel Management & Official Police Reporting'
            : 'Gootel Cloud PMS · Gestione Hotel & Alloggiati Web';
        }
      }

      panes.forEach(pane => {
        pane.classList.toggle('active', pane.id === `preview-${targetProduct}`);
      });
    });
  });
}

/* -------------------------------------------------------------
 * 7. Interactive ROI / Time-Saved Simulator
 * ------------------------------------------------------------- */
function initRoiSimulator() {
  const roomSlider = document.getElementById('roomRange');
  const tableSlider = document.getElementById('tableRange');
  const roomVal = document.getElementById('roomVal');
  const tableVal = document.getElementById('tableVal');
  const hoursSavedMetric = document.getElementById('hoursSavedMetric');
  const euroGainMetric = document.getElementById('euroGainMetric');
  const errorRateMetric = document.getElementById('errorRateMetric');

  if (!roomSlider || !tableSlider) return;

  function recalculate() {
    const rooms = parseInt(roomSlider.value, 10);
    const tables = parseInt(tableSlider.value, 10);
    const isEn = document.documentElement.lang === 'en';

    roomVal.textContent = rooms;
    tableVal.textContent = tables;

    const hoursHotelMonth = Math.round(rooms * 1.8);
    const hoursRestMonth = Math.round(tables * 1.4);
    const totalHours = hoursHotelMonth + hoursRestMonth;

    const estimatedExtraRevenue = Math.round(rooms * 145 + tables * 60);

    hoursSavedMetric.textContent = `${totalHours} ${isEn ? 'hrs' : 'ore'}`;
    euroGainMetric.textContent = `+€${estimatedExtraRevenue.toLocaleString(isEn ? 'en-US' : 'it-IT')}`;
    errorRateMetric.textContent = `-95%`;
  }

  roomSlider.addEventListener('input', recalculate);
  tableSlider.addEventListener('input', recalculate);
  window.addEventListener('languageChanged', recalculate);
  recalculate();
}

/* -------------------------------------------------------------
 * 8. FAQ Accordion
 * ------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherAns = other.querySelector('.faq-answer');
        if (otherAns) otherAns.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* -------------------------------------------------------------
 * 9. Interactive Demo Modals
 * ------------------------------------------------------------- */
function initDemoModals() {
  const modal = document.getElementById('demoModal');
  const openButtons = document.querySelectorAll('[data-open-demo]');
  const closeButtons = document.querySelectorAll('[data-close-demo]');

  if (!modal) return;

  function openModal(defaultProduct = 'both') {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    const gootelCheck = modal.querySelector('#modalGootel');
    const appetitoCheck = modal.querySelector('#modalAppetito');

    if (gootelCheck && appetitoCheck) {
      if (defaultProduct === 'gootel') {
        gootelCheck.checked = true;
        appetitoCheck.checked = false;
      } else if (defaultProduct === 'appetito') {
        gootelCheck.checked = false;
        appetitoCheck.checked = true;
      } else {
        gootelCheck.checked = true;
        appetitoCheck.checked = true;
      }
    }
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = btn.getAttribute('data-product') || 'both';
      openModal(product);
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

/* -------------------------------------------------------------
 * 10. Client Category Filter
 * ------------------------------------------------------------- */
function initClientFilter() {
  const filterBtns = document.querySelectorAll('.client-filter-btn');
  const cards = document.querySelectorAll('.hotel-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------
 * 11. Territory Interactive Radar & Hub (Bilingual)
 * ------------------------------------------------------------- */
function initTerritoryRadar() {
  const townButtons = document.querySelectorAll('.territory-town-btn');
  const titleEl = document.getElementById('territoryTownTitle');
  const descEl = document.getElementById('territoryTownDesc');
  const chipsEl = document.getElementById('territoryHotelChips');
  const badgeEl = document.querySelector('.territory-display-badge');

  const territoryData = {
    it: {
      andalo: {
        title: "Andalo · Cuore Operativo Betalink",
        badge: "📍 Sede Centrale (Via Rindole)",
        desc: "Ad Andalo gestiamo le strutture alberghiere storiche del paese. La nostra sede è in Via Rindole a meno di 5 minuti, con disponibilità per affiancamento diretto del personale alla reception o in sala.",
        chips: ["Hotel Diamant 4★", "Hotel Adler 4★S", "Hotel Stella Alpina 3★S", "Hotel Antares", "Residence Piccolo", "Hotel Bottamedi"]
      },
      molveno: {
        title: "Molveno & Lago · Turismo Internazionale",
        badge: "🚗 7 min da Andalo (4.5 km)",
        desc: "A Molveno i nostri clienti gestiscono flussi internazionali di ospiti. Con l'integrazione Channel Manager Simple Booking e la tassa di soggiorno comunale automatica, il personale lavora in totale serenità.",
        chips: ["Hotel Panorama 4★ Vista Lago", "Hotel Olympia Molveno", "B&B La Costa"]
      },
      fai: {
        title: "Fai della Paganella · Wellness & Montagna",
        badge: "🚗 8 min da Andalo (5.0 km)",
        desc: "A Fai della Paganella Betalink è la scelta di riferimento per hotel panoramici e soggiorni relax, sincronizzando le presenze ISTAT per gli arrivi stagionali estivi e invernali.",
        chips: ["Hotel Belvedere 4★ Panoramico", "Hotel Fai", "Partner Paganella"]
      },
      quota: {
        title: "Cima Paganella & Rifugi · Alta Quota",
        badge: "🚠 Impianti di Quota · Cloud",
        desc: "Sui rifugi alpini e terrazze panoramiche della Paganella, la velocità e la stabilità di Appetito garantiscono centinaia di comande contemporanee da smartphone con zero blocchi.",
        chips: ["Rifugio Alpenrose (220 Coperti)", "Baite di Quota", "Servizio Bar & Terrazza"]
      }
    },
    en: {
      andalo: {
        title: "Andalo · Betalink Operating Headquarters",
        badge: "📍 Central HQ (Via Rindole)",
        desc: "In Andalo we power the historic leading hotels of the village. Our headquarters are located in Via Rindole less than 5 minutes away, ready for hands-on front desk and restaurant support.",
        chips: ["Hotel Diamant 4★", "Hotel Adler 4★S", "Hotel Stella Alpina 3★S", "Hotel Antares", "Residence Piccolo", "Hotel Bottamedi"]
      },
      molveno: {
        title: "Molveno & Lake · International Tourism",
        badge: "🚗 7 min from Andalo (4.5 km)",
        desc: "In Molveno our hotel partners manage international guest flows. With two-way Simple Booking Channel Manager sync and automated city tourist tax, front desk teams work in complete serenity.",
        chips: ["Hotel Panorama 4★ Lake View", "Hotel Olympia Molveno", "B&B La Costa"]
      },
      fai: {
        title: "Fai della Paganella · Wellness & Mountains",
        badge: "🚗 8 min from Andalo (5.0 km)",
        desc: "In Fai della Paganella Betalink is the premier choice for panoramic wellness hotels, synchronizing regional ISTAT statistics for summer hiking and winter ski seasons.",
        chips: ["Hotel Belvedere 4★ Panoramic", "Hotel Fai", "Paganella Partner"]
      },
      quota: {
        title: "Cima Paganella Peak & Alpine Huts",
        badge: "🚠 High Altitude · Cloud",
        desc: "On alpine huts and sun terraces across Paganella, the speed and resilience of Appetito ensure hundreds of concurrent smartphone orders with zero slowdowns.",
        chips: ["Rifugio Alpenrose (220 Covers)", "Mountain Chalets", "Terrace & Bar Service"]
      }
    }
  };

  let currentTown = 'andalo';

  function updateTerritory(townKey) {
    currentTown = townKey || currentTown;
    const lang = document.documentElement.lang === 'en' ? 'en' : 'it';
    const data = territoryData[lang][currentTown];
    if (!data) return;

    if (titleEl) titleEl.textContent = data.title;
    if (badgeEl) badgeEl.textContent = data.badge;
    if (descEl) descEl.textContent = data.desc;
    if (chipsEl) {
      chipsEl.innerHTML = data.chips.map(chip => `<span class="hotel-chip-tag">${chip}</span>`).join('');
    }
  }

  townButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const townKey = btn.getAttribute('data-town');
      townButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateTerritory(townKey);
    });
  });

  window.addEventListener('languageChanged', () => {
    updateTerritory();
  });
}

/* -------------------------------------------------------------
 * 12. Case Study Modal Engine (Bilingual)
 * ------------------------------------------------------------- */
function initCaseStudyModal() {
  const modal = document.getElementById('caseStudyModal');
  if (!modal) return;

  const openBtns = document.querySelectorAll('[data-open-case]');
  const closeBtns = document.querySelectorAll('[data-close-case]');

  const titleEl = document.getElementById('caseModalTitle');
  const catEl = document.getElementById('caseModalCategory');
  const locEl = document.getElementById('caseModalLocation');
  const imgEl = document.getElementById('caseModalImg');
  const logoEl = document.getElementById('caseModalLogo');
  const challengeEl = document.getElementById('caseModalChallenge');
  const solutionEl = document.getElementById('caseModalSolution');
  const stat1El = document.getElementById('caseModalStat1');
  const stat2El = document.getElementById('caseModalStat2');
  const stat3El = document.getElementById('caseModalStat3');
  const quoteEl = document.getElementById('caseModalQuote');

  const caseData = {
    it: {
      diamant: {
        name: "Hotel Diamant",
        category: "4★ Family & Wellness Resort",
        location: "Andalo (TN) · Altopiano della Paganella",
        img: "assets/images/hotel_diamant.jpg",
        logo: "assets/images/Logo_Diamant.png",
        challenge: "Gestire oltre 60 camere con arrivi concentrati di famiglie nel weekend. Il vecchio software locale si bloccava spesso, creando lunghe attese al banco check-in e ansia per l'invio alla Questura.",
        solution: "Passaggio completo a Gootel PMS Cloud, sincronizzazione OTA con Simple Booking ed esportazione automatica certificata per Alloggiati Web della Polizia di Stato.",
        stat1: "-75%",
        stat2: "0 Overbooking",
        stat3: "100%",
        quote: "\"Con Gootel il check-in è fulmineo e l'invio alla Questura è una formalità da 30 secondi.\""
      },
      adler: {
        name: "Hotel Adler",
        category: "4★ S Historic & Luxury Spa",
        location: "Andalo (TN) · Centro Storico",
        img: "assets/images/hotel_adler.jpg",
        logo: "assets/images/Logo_Adler.png",
        challenge: "Necessità di trasparenza contabile assoluta per una clientela esigente con trattamenti wellness, emissione immediata di fatture elettroniche SDI e gestione della tassa di soggiorno.",
        solution: "Implementazione di Gootel Multiutente con fatturazione SDI integrata, archivio ospiti a norma GDPR e reportistica fiscale automatica per la contabilità aziendale.",
        stat1: "100% SDI",
        stat2: "0 Errori",
        stat3: "30 Min Training",
        quote: "\"Per una struttura con elevati standard spa, la trasparenza e l'integrazione della fatturazione SDI sono essenziali. Betalink offre affidabilità totale.\""
      },
      panorama: {
        name: "Hotel Panorama",
        category: "4★ Vista Panoramica Lago",
        location: "Molveno (TN) · Vista Lago",
        img: "assets/images/hotel_panorama.jpg",
        logo: "assets/images/Logo_Panorama.png",
        challenge: "Evitare doppi ordini e sovrapposizioni tra Booking.com, portali esteri e prenotazioni dirette, massimizzando il rendimento delle camere panoramiche.",
        solution: "Collegamento bidirezionale continuo di Gootel con Simple Booking, preventivatore rapido e modulo di pagamento sicuro per caparre confirmatorie.",
        stat1: "+24% Dirette",
        stat2: "0 Sovrapposizioni",
        stat3: "1 Clic ISTAT",
        quote: "\"La sincronizzazione istantanea con i canali OTA ci ha permesso di azzerare i rischi di overbooking e massimizzare l'occupazione delle camere vista lago.\""
      },
      alpenrose: {
        name: "Rifugio Alpenrose",
        category: "Rifugio Alpino & Ristorante Tipico",
        location: "Dolomiti di Brenta · Quota Panoramica",
        img: "assets/images/rifugio_alpenrose.jpg",
        logo: "assets/images/Logo_Alpenrose.png",
        challenge: "Oltre 200 coperti contemporanei a pranzo in terrazza solarium. I vecchi palmari proprietari si rompevano con facilità e la linea dati instabile causava ritardi in cucina.",
        solution: "Adozione di Appetito Cloud POS con comande inviate da normali smartphone dei camerieri, stampanti termiche RT Epson in cucina/bar e gestione sale separate.",
        stat1: "220 Coperti",
        stat2: "-95% Errori",
        stat3: "< 2 min Ordine",
        quote: "\"A pranzo con centinaia di escursionisti in terrazza non possiamo permetterci blocchi di sistema. Con Appetito i camerieri usano normali cellulari e la cucina riceve gli ordini all'istante.\""
      },
      belvedere: {
        name: "Hotel Belvedere",
        category: "4★ Panoramico & Relax",
        location: "Fai della Paganella (TN)",
        img: "assets/images/hotel_belvedere.jpg",
        logo: "assets/images/Logo_Belvedere.svg",
        challenge: "Gestione di gruppi estivi e ospiti individuali con complesse rendicontazioni ISTAT provinciali per i flussi turistici dell'Altopiano.",
        solution: "Gootel PMS con modulo automatico ISTAT C72 per il Trentino, calcolo esenzioni tassa di soggiorno e modulo cassa rapido integrato con stampante Epson.",
        stat1: "0 Sanzioni",
        stat2: "-80% Pratiche",
        stat3: "100% Cloud",
        quote: "\"L'integrazione rapida delle schedine ISTAT C72 e la cassa unificata hanno liberato ore preziose alla nostra reception.\""
      },
      stellaalpina: {
        name: "Hotel Stella Alpina",
        category: "3★ S Tradizione & Famiglia",
        location: "Andalo (TN) · Posizione Centrale",
        img: "assets/images/hotel_stella_alpina.jpg",
        logo: "assets/images/Logo_StellaAlpina.png",
        challenge: "Struttura a conduzione familiare storica: cercavano un software moderno e in cloud, ma semplice da usare senza dover assumere personale informatico dedicato.",
        solution: "Gootel PMS Cloud con listini stagionali intuitivi, preventivi rapidi e il grande vantaggio del supporto tecnico a 500 metri dalla reception.",
        stat1: "15 min Setup",
        stat2: "5 min Assistenza",
        stat3: "Zero Pensieri",
        quote: "\"Siamo una famiglia di albergatori da 3 generazioni: cercavamo un software senza fronzoli. Betalink ha sede a 500 metri: una sicurezza impagabile.\""
      }
    },
    en: {
      diamant: {
        name: "Hotel Diamant",
        category: "4★ Family & Wellness Resort",
        location: "Andalo (TN) · Paganella Dolomites",
        img: "assets/images/hotel_diamant.jpg",
        logo: "assets/images/Logo_Diamant.png",
        challenge: "Managing 60+ rooms with large weekend arrivals of families. Legacy local software suffered freezes, leading to front-desk queues and stress regarding mandatory police deadlines.",
        solution: "Full migration to Gootel PMS Cloud with digital pre-check-in, Simple Booking two-way OTA sync, and automated police guest export.",
        stat1: "-75%",
        stat2: "0 Overbooking",
        stat3: "100%",
        quote: "\"With Gootel, check-in is instantaneous and mandatory police filing is a 30-second breeze.\""
      },
      adler: {
        name: "Hotel Adler",
        category: "4★ S Historic & Luxury Spa",
        location: "Andalo (TN) · Historic Center",
        img: "assets/images/hotel_adler.jpg",
        logo: "assets/images/Logo_Adler.png",
        challenge: "Demand for transparent guest accounting with multi-treatment wellness packages, instant electronic invoicing (SDI), and accurate tourist tax calculation.",
        solution: "Deployment of Gootel Multi-User with direct SDI e-invoicing, GDPR-compliant guest archives, and automated financial reporting for hotel administration.",
        stat1: "100% SDI",
        stat2: "0 Errors",
        stat3: "30 Min Setup",
        quote: "\"For a high-end luxury spa hotel, accounting clarity and electronic invoicing are paramount. Betalink delivers total peace of mind.\""
      },
      panorama: {
        name: "Hotel Panorama",
        category: "4★ Lake View Panoramic Hotel",
        location: "Molveno (TN) · Lake Molveno",
        img: "assets/images/hotel_panorama.jpg",
        logo: "assets/images/Logo_Panorama.png",
        challenge: "Preventing double-bookings between Booking.com, international travel agencies, and direct website inquiries, while maximizing occupancy of lake-view rooms.",
        solution: "Continuous two-way synchronization via Simple Booking, fast email proposal generator, and integrated deposit processing.",
        stat1: "+24% Direct",
        stat2: "0 Conflicts",
        stat3: "1-Click ISTAT",
        quote: "\"Real-time synchronization with OTAs eliminated overbookings while maximizing lake-view room occupancy.\""
      },
      alpenrose: {
        name: "Rifugio Alpenrose",
        category: "Alpine Chalet & Scenic Restaurant",
        location: "Brenta Dolomites · High Altitude",
        img: "assets/images/rifugio_alpenrose.jpg",
        logo: "assets/images/Logo_Alpenrose.png",
        challenge: "Over 200 concurrent guests during peak lunch hours on the panoramic terrace. Clunky POS devices cracked when dropped and spotty signals stalled the kitchen.",
        solution: "Adoption of Appetito Cloud POS with waiters using standard smartphones, instant wireless kitchen/bar printing, and certified Epson RT registers.",
        stat1: "220 Covers",
        stat2: "-95% Errors",
        stat3: "< 2 min Order",
        quote: "\"On busy lunch services with hundreds of hikers, system crashes are intolerable. With Appetito, waiters use phones and the kitchen gets orders instantly.\""
      },
      belvedere: {
        name: "Hotel Belvedere",
        category: "4★ Panoramic Wellness Hotel",
        location: "Fai della Paganella (TN)",
        img: "assets/images/hotel_belvedere.jpg",
        logo: "assets/images/Logo_Belvedere.svg",
        challenge: "Handling complex seasonal visitor groups and tedious manual monthly ISTAT tourist statistics filings.",
        solution: "Gootel PMS Cloud with automated regional ISTAT C72 generation, tourist tax exemption management, and fast cashiering.",
        stat1: "0 Penalties",
        stat2: "-80% Paperwork",
        stat3: "100% Cloud",
        quote: "\"Automated ISTAT compliance and unified cashiering have liberated dozens of valuable hours at our front desk.\""
      },
      stellaalpina: {
        name: "Hotel Stella Alpina",
        category: "3★ S Charming Alpine Family Hotel",
        location: "Andalo (TN) · Central Location",
        img: "assets/images/hotel_stella_alpina.jpg",
        logo: "assets/images/Logo_StellaAlpina.png",
        challenge: "A 3rd-generation family-operated hotel seeking modern cloud technology without IT headaches or complex training.",
        solution: "Gootel PMS Cloud with visual room calendars, rapid quote generator, and the immense peace of mind of local technician support 500m away.",
        stat1: "15 min Setup",
        stat2: "5 min Support",
        stat3: "Zero Stress",
        quote: "\"We wanted straightforward software without unnecessary complexity. Having Betalink based 500m from our reception is priceless.\""
      }
    }
  };

  let activeCase = 'diamant';

  function renderCaseModal(key) {
    activeCase = key || activeCase;
    const lang = document.documentElement.lang === 'en' ? 'en' : 'it';
    const data = caseData[lang][activeCase];
    if (!data) return;

    if (titleEl) titleEl.textContent = data.name;
    if (catEl) catEl.textContent = data.category;
    if (locEl) locEl.textContent = data.location;
    if (imgEl) {
      imgEl.src = data.img;
      imgEl.alt = data.name;
    }
    if (logoEl) {
      logoEl.src = data.logo;
      logoEl.alt = `Logo ${data.name}`;
    }
    if (challengeEl) challengeEl.textContent = data.challenge;
    if (solutionEl) solutionEl.textContent = data.solution;
    if (stat1El) stat1El.textContent = data.stat1;
    if (stat2El) stat2El.textContent = data.stat2;
    if (stat3El) stat3El.textContent = data.stat3;
    if (quoteEl) quoteEl.textContent = data.quote;
  }

  function openCaseModal(key) {
    renderCaseModal(key);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCaseModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const hotelKey = btn.getAttribute('data-open-case');
      openCaseModal(hotelKey);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeCaseModal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeCaseModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeCaseModal();
  });

  // Pre-render immediately and on language change
  renderCaseModal(activeCase);
  window.addEventListener('languageChanged', () => {
    renderCaseModal(activeCase);
  });
}

/* -------------------------------------------------------------
 * 13. Lead Form Validation & Submission
 * ------------------------------------------------------------- */
function initLeadForms() {
  const forms = document.querySelectorAll('.contact-lead-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('input[name="nome"]');
      const phoneInput = form.querySelector('input[name="telefono"]');
      const consentCheck = form.querySelector('input[name="consenso"]');
      const alertBox = form.querySelector('.form-alert');
      const isEn = document.documentElement.lang === 'en';

      if (!nameInput.value.trim() || !phoneInput.value.trim()) {
        alert(isEn ? 'Please fill in your name and phone number.' : 'Compila il tuo nome e recapito telefonico.');
        return;
      }

      if (consentCheck && !consentCheck.checked) {
        alert(isEn ? 'Consent to data processing is required to be contacted.' : 'È necessario acconsentire al trattamento dati per essere ricontattato.');
        return;
      }

      // Show success state
      if (alertBox) {
        alertBox.className = 'form-alert success';
        alertBox.innerHTML = isEn
          ? `<strong>Request submitted successfully!</strong><br>A Betalink hospitality specialist will contact you at <strong>${phoneInput.value}</strong> to arrange your personalized free demo.`
          : `<strong>Richiesta inviata con successo!</strong><br>Un consulente Betalink ti ricontatterà al <strong>${phoneInput.value}</strong> per concordare la demo gratuita personalizzata.`;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `✓ ${isEn ? 'Request Received' : 'Richiesta Ricevuta'}`;
        submitBtn.style.background = '#10B981';
      }

      setTimeout(() => {
        form.reset();
      }, 4000);
    });
  });
}
