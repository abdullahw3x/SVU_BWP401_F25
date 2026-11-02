document.addEventListener('DOMContentLoaded', () => {
  // Back to top button.
  const top = document.getElementById('topBtn');

  if (top) {
    const update = () => top.classList.toggle('show', scrollY > 350);

    addEventListener('scroll', update, { passive: true });
    update();

    top.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Featured slider: on mobile, show one card at a time.
  const featured = document.getElementById('featured');

  if (featured) {
    const cards = [...featured.querySelectorAll('.event-item')];
    const dots = document.getElementById('dots');
    let active = 0;

    // Create one dot button for each card.
    cards.forEach((_, i) => {
      const btn = document.createElement('button');

      btn.setAttribute('aria-label', `استعراض النشاط ${i + 1}`);
      btn.onclick = () => show(i);
      dots.appendChild(btn);
    });

    function show(i) {
      // Keep the index inside the cards range.
      active = (i + cards.length) % cards.length;

      // On mobile, hide every card except the active one.
      if (innerWidth < 576) {
        cards.forEach((c, n) => c.classList.toggle('d-none', n !== active));
      }

      // Highlight the dot that matches the active card.
      [...dots.children].forEach((d, n) => d.classList.toggle('active', n === active));
    }

    document.getElementById('next')?.addEventListener('click', () => show(active + 1));
    document.getElementById('prev')?.addEventListener('click', () => show(active - 1));

    addEventListener('resize', () => {
      // On resize, show all cards and update the state again.
      cards.forEach(c => c.classList.remove('d-none'));
      show(active);
    });

    show(0);
  }


  // Search and filter events by text, category, month and location.
  const grid = document.getElementById('eventsGrid');

  if (grid) {
    const items = [...grid.querySelectorAll('.event-item')];
    const q = document.getElementById('q');
    const cat = document.getElementById('cat');
    const date = document.getElementById('date');
    const loc = document.getElementById('loc');
    const count = document.getElementById('count');
    const empty = document.getElementById('empty');

    // Read ?category=... from the URL and apply it on page load.
    const initial = new URLSearchParams(location.search).get('category');

    if (initial && cat.querySelector(`option[value="${initial}"]`)) {
      cat.value = initial;
    }

    function filter() {
      let n = 0;

      items.forEach(el => {
        const text = (el.dataset.title + ' ' + el.dataset.search + ' ' + el.textContent)
          .toLocaleLowerCase('ar');

        const ok =
          (!q.value || text.includes(q.value.toLocaleLowerCase('ar').trim())) &&
          (!cat.value || el.dataset.category === cat.value) &&
          (!date.value || el.dataset.date.startsWith(date.value)) &&
          (!loc.value || el.dataset.location === loc.value);

        el.classList.toggle('d-none', !ok);
        if (ok) n++;
      });

      count.textContent = `عدد الأنشطة المطابقة: ${n}`;
      empty.classList.toggle('d-none', n !== 0);
    }

    [q, cat, date, loc].forEach(x => {
      x.addEventListener('input', filter);
      x.addEventListener('change', filter);
    });

    document.getElementById('search')?.addEventListener('click', filter);

    document.getElementById('reset')?.addEventListener('click', () => {
      q.value = cat.value = date.value = loc.value = '';
      filter();
    });

    filter();
  }

  // Data for the six sample event pages.
  const data = {
    '1': [
      'ورشة تطوير المهارات الرقمية',
      'culture',
      'ثقافة ومعارف',
      '2026-10-28',
      '28 تشرين الأول 2026',
      '11:00 صباحاً',
      'دمشق / عبر الإنترنت',
      'خطوات تطبيقية لصقل المهارات الرقمية والتعرّف على أدوات نافعة في الدراسة والعمل.',
      'assets/images/cardx_1.png'
    ],
    '2': [
      'ملتقى الطلاب الجامعي',
      'social',
      'طلاب ومجتمع',
      '2026-10-30',
      '30 تشرين الأول 2026',
      '04:00 مساءً',
      'دمشق',
      'جلسة تعارف يتبادل فيها الطلاب الأفكار حول الأنشطة والمبادرات الجامعية.',
      'assets/images/cardx_3.png'
    ],
    '3': [
      'سهرة موسيقية شبابية',
      'music',
      'فنون وموسيقى',
      '2026-11-02',
      '2 تشرين الثاني 2026',
      '06:30 مساءً',
      'حمص',
      'أمسية فنية تجريبية تسلّط الضوء على المواهب الموسيقية الشابة وإبداعها.',
      'assets/images/cardx_2.png'
    ],
    '4': [
      'حلقة نقاش حول الابتكار',
      'culture',
      'ثقافة ومعارف',
      '2026-11-05',
      '5 تشرين الثاني 2026',
      '12:00 ظهراً',
      'اللاذقية',
      'جلسة حوارية تنبض بالتفكير الإبداعي وتفتح باب نقاش الأفكار الطازجة.',
      'assets/images/cardx_4.png'
    ],
    '5': [
      'يوم التحديات الرياضية',
      'sport',
      'رياضة ونشاطات',
      '2026-11-07',
      '7 تشرين الثاني 2026',
      '10:00 صباحاً',
      'حلب',
      'أنشطة جماعية وتحدّيات ودّية تحثّ على الحركة وتُعزّز روح الفريق.',
      'assets/images/cardx_5.png'
    ],
    '6': [
      'مبادرة يد الخير',
      'social',
      'طلاب ومجتمع',
      '2026-11-09',
      '9 تشرين الثاني 2026',
      '09:30 صباحاً',
      'طرطوس',
      'مبادرة طلابية تدعو إلى العمل التطوعي والمساهمة الإيجابية في حياة المجتمع.',
      'assets/images/cardx_6.png'
    ]
  };

  const title = document.getElementById('detailTitle');

  if (title) {
    // Get the id from the URL, or use event 1 by default.
    const d = data[new URLSearchParams(location.search).get('id') || '1'] || data['1'];

    title.textContent = d[0];
    document.getElementById('titleHero').textContent = d[0];

    const tag = document.getElementById('detailTag');
    tag.textContent = d[2];
    tag.className = 'badge tag-' + d[1];

    document.getElementById('detailDate').textContent = d[4];
    document.getElementById('detailTime').textContent = d[5];
    document.getElementById('detailLoc').textContent = d[6];
    document.getElementById('mapLoc').textContent = d[6];
    document.getElementById('desc').textContent = d[7];

    const img = document.getElementById('detailImg');
    img.src = d[8];
    img.alt = d[0];

    document.title = d[0] + ' | دليل الفعاليات';

    // "Add to calendar" button: create and download an .ics file.
    document.getElementById('calendar').onclick = () => {
      const start = d[3].replaceAll('-', '') + 'T110000';
      const end = d[3].replaceAll('-', '') + 'T120000';

      const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:${d[0]}`,
        `LOCATION:${d[6]}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
      a.download = 'event.ics';
      a.click();

      document.getElementById('actionMsg').textContent = 'تم إعداد ملف تقويم تجريبي جاهز للتنزيل.';
    };

    // Share button: use the system share, copy the link, or show a prompt.
    document.getElementById('share').onclick = async () => {
      try {
        if (navigator.share) {
          await navigator.share({ title: d[0], url: location.href });
        } else if (navigator.clipboard && isSecureContext) {
          await navigator.clipboard.writeText(location.href);
          document.getElementById('actionMsg').textContent = 'تم حفظ رابط النشاط في الحافظة.';
        } else {
          prompt('انسخ رابط النشاط', location.href);
        }
      } catch (e) {
        // Closing the share window is not an error.
        if (e.name !== 'AbortError') {
          document.getElementById('actionMsg').textContent = 'انسخ الرابط من شريط المتصفح لمشاركته.';
        }
      }
    };
  }

  // This form does not send an email.
  const form = document.getElementById('contactForm');

  if (form) {
    const alert = document.getElementById('alert');
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    form.addEventListener('submit', e => {
      e.preventDefault();

      // Mark the fields that are not valid.
      [name, email, message].forEach(x =>
        x.classList.toggle('is-invalid', !x.checkValidity())
      );

      alert.classList.remove('d-none', 'alert-success', 'alert-danger');

      if (!form.checkValidity()) {
        alert.classList.add('alert-danger');
        alert.textContent = 'عدّل الحقول المعلَّمة قبل المتابعة.';
        form.querySelector(':invalid')?.focus();
        return;
      }

      alert.classList.add('alert-success');
      alert.textContent =
        `شكراً ${name.value.trim()}، تمت مراجعة بياناتك بنجاح. هذا نموذج توضيحي ولا يرسل بريداً حقيقياً.`;

      form.reset();
      [name, email, message].forEach(x => x.classList.remove('is-invalid'));
    });

    // Remove the red border as soon as the field is valid.
    [name, email, message].forEach(x =>
      x.addEventListener('input', () => {
        if (x.checkValidity()) x.classList.remove('is-invalid');
      })
    );
  }
});
