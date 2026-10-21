import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';

export interface ToastMessage {
  title: string;
  message: string;
  type: 'success' | 'warning' | 'gold';
  protocol?: string;
}

export interface EnsinoSegmento {
  id: string;
  shortTitle: string;
  title: string;
  ageRange: string;
  badge: string;
  iconType: 'bear' | 'book1' | 'book2' | 'cap' | 'gear';
  description: string;
  highlights: string[];
  shifts: string;
  whatsappText: string;
}

export interface AprovadoDestaque {
  name: string;
  place: string;
  institution: string;
  quote: string;
}

export type HeroSlideId = 'matriculas' | 'reserva2027' | 'cna' | 'ml';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  // ============================================================================
  // NÚMERO CENTRAL DO WHATSAPP QUE RECEBE OS 4 FORMULÁRIOS DO SITE
  // Formato: 55 (Brasil) + 13 (DDD) + 991460000 (Número sem espaços ou traços)
  // Para trocar o número no futuro, basta alterar o valor abaixo:
  readonly whatsappCentralFormularios = '5513991460000';
  // ============================================================================

  menuOpen = false;
  activeModal = signal<'visit' | 'career' | 'complaint' | null>(null);
  selectedResumeName = signal<string>('');
  selectedFormSegment = signal<string>('Educação Infantil');

  // Carrossel Automático do Hero (4 slides: Matrículas, Reserva 2027, CNA, Movimenta Libras)
  readonly heroSlides: { id: HeroSlideId; label: string }[] = [
    { id: 'matriculas', label: 'Matrículas' },
    { id: 'reserva2027', label: 'Reserva 2027' },
    { id: 'cna', label: 'CNA Inglês' },
    { id: 'ml', label: 'Libras (ML)' }
  ];
  heroCardTab = signal<HeroSlideId>('matriculas');
  carouselPaused = signal<boolean>(false);
  private carouselInterval: ReturnType<typeof setInterval> | null = null;
  private touchStartX = 0;

  // Guia Rápido de Etapa Escolar 2027
  simAgeGroup = signal<'2a5' | '6a10' | '11a14' | '15a17' | 'tecnico'>('6a10');

  toast = signal<ToastMessage | null>(null);
  private toastTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly segmentos: EnsinoSegmento[] = [
    {
      id: 'infantil',
      shortTitle: 'ED INFANTIL',
      title: 'Educação Infantil',
      ageRange: 'Maternal e Pré-Escola (2 a 5 anos)',
      badge: 'Acolhimento & Descobertas',
      iconType: 'bear',
      description:
        'Ambiente seguro, afetivo e estimulante onde cada criança aprende com alegria, desenvolvendo autonomia, psicomotricidade, linguagem e socialização.',
      highlights: [
        'Aprendizado lúdico, projetos sensoriais e psicomotricidade',
        'Acompanhamento afetivo e individualizado em cada descoberta',
        'Iniciação ao letramento, música, artes e convivência'
      ],
      shifts: 'Manhã • Tarde • Integral',
      whatsappText: 'Olá! Gostaria de informações sobre a Reserva de Vagas 2027 para a Educação Infantil no Colégio Alexo.'
    },
    {
      id: 'fund1',
      shortTitle: 'ENSINO FUNDAMENTAL I',
      title: 'Ensino Fundamental I',
      ageRange: '1º ao 5º Ano (6 a 10 anos)',
      badge: 'Base Sólida & Valores',
      iconType: 'book1',
      description:
        'Consolidação da alfabetização, raciocínio lógico-matemático e leitura de mundo, despertando a curiosidade científica e o prazer de aprender.',
      highlights: [
        'Alfabetização plena, interpretação textual e cálculo mental',
        'Projetos interdisciplinares e educação socioemocional',
        'Parceria próxima e contínua com as famílias'
      ],
      shifts: 'Manhã • Tarde',
      whatsappText: 'Olá! Gostaria de informações sobre a Reserva de Vagas 2027 para o Ensino Fundamental I no Colégio Alexo.'
    },
    {
      id: 'fund2',
      shortTitle: 'ENSINO FUNDAMENTAL II',
      title: 'Ensino Fundamental II',
      ageRange: '6º ao 9º Ano (11 a 14 anos)',
      badge: 'Protagonismo & Vestibulinho',
      iconType: 'book2',
      description:
        'Aprofundamento científico, pensamento crítico e preparação forte para os principais Vestibulinhos e Escolas Federais da região.',
      highlights: [
        'Preparação de excelência para Vestibulinhos (IFSP Cubatão e ETECs)',
        'Simulados periódicos, redação estruturada e projetos',
        'Autonomia de estudos e protagonismo estudantil'
      ],
      shifts: 'Manhã • Tarde',
      whatsappText: 'Olá! Gostaria de informações sobre a Reserva de Vagas 2027 para o Ensino Fundamental II no Colégio Alexo.'
    },
    {
      id: 'medio',
      shortTitle: 'ENSINO MÉDIO',
      title: 'Ensino Médio',
      ageRange: '1ª à 3ª Série (15 a 17 anos)',
      badge: 'ENEM & Universidades',
      iconType: 'cap',
      description:
        'Formação acadêmica rigorosa e humana que prepara nossos jovens para o ENEM, vestibulares e escolhas conscientes para seu Projeto de Vida.',
      highlights: [
        'Simulados modelo ENEM/Vestibulares e oficina de redação',
        'Itinerários formativos, orientação vocacional e projeto de vida',
        'Professores especialistas e foco em resultados'
      ],
      shifts: 'Manhã',
      whatsappText: 'Olá! Gostaria de informações sobre a Reserva de Vagas 2027 para o Ensino Médio no Colégio Alexo.'
    },
    {
      id: 'tecnico',
      shortTitle: 'ENSINO TÉCNICO',
      title: 'Ensino Técnico',
      ageRange: 'Formação Profissionalizante',
      badge: 'Prática & Mercado',
      iconType: 'gear',
      description:
        'Qualificação técnica conectada às demandas do mercado de trabalho, unindo prática profissional, inovação e preparação para a carreira.',
      highlights: [
        'Currículo focado na prática profissional e tecnologia',
        'Projetos aplicados e visão voltada ao mercado de trabalho',
        'Certificação técnica com a qualidade do Colégio Alexo'
      ],
      shifts: 'Consulte turmas 2027',
      whatsappText: 'Olá! Gostaria de informações sobre a Reserva de Vagas 2027 para o Ensino Técnico no Colégio Alexo.'
    }
  ];

  readonly aprovados2025: AprovadoDestaque[] = [
    {
      name: 'LIVIA DOS ANJOS',
      place: '2º LUGAR',
      institution: 'ESCOLA FEDERAL DE CUBATÃO',
      quote: 'Conquista extraordinária fruto de dedicação, talento e da base pedagógica construída no Colégio Alexo!'
    },
    {
      name: 'KAUÃ HENRIQUE',
      place: '6º LUGAR',
      institution: 'ESCOLA FEDERAL DE CUBATÃO',
      quote: 'Destaque entre os primeiros colocados no disputado Vestibulinho da Escola Federal de Cubatão!'
    }
  ];

  readonly simRecommendation = computed(() => {
    const group = this.simAgeGroup();
    const map: Record<string, EnsinoSegmento> = {
      '2a5': this.segmentos[0],
      '6a10': this.segmentos[1],
      '11a14': this.segmentos[2],
      '15a17': this.segmentos[3],
      'tecnico': this.segmentos[4]
    };
    return map[group] || this.segmentos[1];
  });

  ngOnInit() {
    this.startCarousel();
  }

  ngOnDestroy() {
    this.stopCarousel();
  }

  private startCarousel() {
    this.stopCarousel();
    this.carouselInterval = setInterval(() => {
      if (!this.carouselPaused()) {
        this.nextSlide(false);
      }
    }, 4500);
  }

  private stopCarousel() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = null;
    }
  }

  pauseCarousel() {
    this.carouselPaused.set(true);
  }

  resumeCarousel() {
    this.carouselPaused.set(false);
  }

  setHeroTab(tab: HeroSlideId) {
    this.heroCardTab.set(tab);
    this.startCarousel();
  }

  nextSlide(resetTimer = true) {
    const currentIndex = this.heroSlides.findIndex((s) => s.id === this.heroCardTab());
    const nextIndex = (currentIndex + 1) % this.heroSlides.length;
    this.heroCardTab.set(this.heroSlides[nextIndex].id);
    if (resetTimer) {
      this.startCarousel();
    }
  }

  prevSlide() {
    const currentIndex = this.heroSlides.findIndex((s) => s.id === this.heroCardTab());
    const prevIndex = (currentIndex - 1 + this.heroSlides.length) % this.heroSlides.length;
    this.heroCardTab.set(this.heroSlides[prevIndex].id);
    this.startCarousel();
  }

  onTouchStart(event: TouchEvent) {
    this.pauseCarousel();
    if (event.touches && event.touches.length > 0) {
      this.touchStartX = event.touches[0].clientX;
    }
  }

  onTouchEnd(event: TouchEvent) {
    if (event.changedTouches && event.changedTouches.length > 0) {
      const deltaX = event.changedTouches[0].clientX - this.touchStartX;
      if (Math.abs(deltaX) > 45) {
        if (deltaX < 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
    }
    this.resumeCarousel();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  setSimAge(group: '2a5' | '6a10' | '11a14' | '15a17' | 'tecnico') {
    this.simAgeGroup.set(group);
  }

  selectSegmentForReservation(segmentTitle: string) {
    this.selectedFormSegment.set(segmentTitle);
    const el = document.getElementById('reserva');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openModal(type: 'visit' | 'career' | 'complaint', event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.menuOpen = false;
    this.activeModal.set(type);
  }

  closeModal() {
    this.activeModal.set(null);
  }

  onResumeSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedResumeName.set(input.files[0].name);
    } else {
      this.selectedResumeName.set('');
    }
  }

  private getFieldValue(form: HTMLFormElement, selector: string): string {
    const el = form.querySelector(selector) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
    if (!el) return '';
    if (el.tagName === 'SELECT') {
      const selectEl = el as HTMLSelectElement;
      return selectEl.options[selectEl.selectedIndex]?.text || selectEl.value;
    }
    return el.value.trim();
  }

  private enviarParaWhatsAppCentral(textoMensagem: string) {
    const url = `https://wa.me/${this.whatsappCentralFormularios}?text=${encodeURIComponent(textoMensagem)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // 1. Funcionalidade: Ficha de Pré-Reserva de Vaga 2027
  onReservationSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const responsavel = this.getFieldValue(form, '#res-responsavel');
    const whatsapp = this.getFieldValue(form, '#res-whatsapp');
    const aluno = this.getFieldValue(form, '#res-aluno');
    const segmento = this.selectedFormSegment();
    const turnoMsg = this.getFieldValue(form, '#res-turno') || 'Não informado';

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const protocol = `ALEXO-2027-${randomNum}`;

    const mensagem = [
      `*PRÉ-RESERVA DE VAGA 2027 - COLÉGIO ALEXO*`,
      `*Protocolo:* ${protocol}`,
      `----------------------------------`,
      `*Responsável:* ${responsavel}`,
      `*WhatsApp:* ${whatsapp}`,
      `*Aluno(a):* ${aluno}`,
      `*Segmento 2027:* ${segmento}`,
      `*Turno / Mensagem:* ${turnoMsg}`
    ].join('\n');

    this.enviarParaWhatsAppCentral(mensagem);

    this.showNotification({
      title: 'Pré-Reserva 2027 Enviada ao WhatsApp!',
      message: `Abrimos o WhatsApp com os dados da pré-reserva (${segmento}). Basta clicar em enviar na conversa!`,
      type: 'gold',
      protocol
    });
    form.reset();
  }

  // 2. Funcionalidade: Agendar Visita Pedagógica
  onVisitSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const nome = this.getFieldValue(form, '#visit-nome');
    const telefone = this.getFieldValue(form, '#visit-telefone');
    const segmento = this.getFieldValue(form, '#visit-segmento');
    const periodo = this.getFieldValue(form, '#visit-periodo');
    const obs = this.getFieldValue(form, '#visit-obs') || 'Sem observações';

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const protocol = `VISITA-${randomNum}`;

    const mensagem = [
      `*AGENDAMENTO DE VISITA PEDAGÓGICA - COLÉGIO ALEXO*`,
      `*Protocolo:* ${protocol}`,
      `----------------------------------`,
      `*Responsável:* ${nome}`,
      `*WhatsApp:* ${telefone}`,
      `*Segmento de Interesse:* ${segmento}`,
      `*Melhor Período:* ${periodo}`,
      `*Observações:* ${obs}`
    ].join('\n');

    this.closeModal();
    this.enviarParaWhatsAppCentral(mensagem);

    this.showNotification({
      title: 'Solicitação de Visita Enviada!',
      message: 'Abrimos o WhatsApp com os dados do seu agendamento para confirmação.',
      type: 'success',
      protocol
    });
    form.reset();
  }

  // 3. Funcionalidade: Trabalhe Conosco (Dados + Indicação de Arquivo/Currículo)
  onCareerSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const nome = this.getFieldValue(form, '#career-nome');
    const telefone = this.getFieldValue(form, '#career-telefone');
    const email = this.getFieldValue(form, '#career-email');
    const area = this.getFieldValue(form, '#career-area');
    const resumo = this.getFieldValue(form, '#career-resumo');
    const arquivoNome = this.selectedResumeName();

    const mensagem = [
      `*TRABALHE CONOSCO - COLÉGIO ALEXO*`,
      `----------------------------------`,
      `*Nome Completo:* ${nome}`,
      `*WhatsApp:* ${telefone}`,
      `*E-mail:* ${email}`,
      `*Área de Atuação:* ${area}`,
      `*Formação & Experiência:* ${resumo}`,
      arquivoNome
        ? `*Currículo em Anexo:* ${arquivoNome} _(anexarei o arquivo nesta conversa)_`
        : `*Currículo:* Não selecionado no formulário`
    ].join('\n');

    this.closeModal();
    this.enviarParaWhatsAppCentral(mensagem);

    this.showNotification({
      title: 'Dados de Carreira Enviados ao WhatsApp!',
      message: arquivoNome
        ? `Envie a mensagem aberta no WhatsApp e anexe o arquivo "${arquivoNome}" na conversa.`
        : 'Abrimos o WhatsApp com seus dados profissionais prontos para envio.',
      type: 'success'
    });
    this.selectedResumeName.set('');
    form.reset();
  }

  // 4. Funcionalidade: Ouvidoria Escolar
  onComplaintSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const nome = this.getFieldValue(form, '#comp-nome');
    const telefone = this.getFieldValue(form, '#comp-telefone');
    const segmento = this.getFieldValue(form, '#comp-segmento');
    const tipo = this.getFieldValue(form, '#comp-tipo');
    const detalhes = this.getFieldValue(form, '#comp-detalhes');

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const protocol = `OUV-ALEXO-${randomNum}`;

    const mensagem = [
      `*OUVIDORIA ESCOLAR - COLÉGIO ALEXO*`,
      `*Protocolo:* ${protocol}`,
      `----------------------------------`,
      `*Nome:* ${nome}`,
      `*WhatsApp para Retorno:* ${telefone}`,
      `*Segmento:* ${segmento}`,
      `*Tipo de Manifestação:* ${tipo}`,
      `*Mensagem Detalhada:* ${detalhes}`
    ].join('\n');

    this.closeModal();
    this.enviarParaWhatsAppCentral(mensagem);

    this.showNotification({
      title: 'Manifestação Registrada na Ouvidoria',
      message: 'Abrimos o WhatsApp com seu protocolo e relato prontos para envio à Direção.',
      type: 'warning',
      protocol
    });
    form.reset();
  }

  closeToast() {
    this.toast.set(null);
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
  }

  private showNotification(data: ToastMessage) {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toast.set(data);
    this.toastTimeout = setTimeout(() => {
      this.toast.set(null);
    }, 8000);
  }
}
