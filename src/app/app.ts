import { Component, computed, signal } from '@angular/core';

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

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  menuOpen = false;
  activeModal = signal<'visit' | 'career' | 'complaint' | null>(null);
  selectedResumeName = signal<string>('');
  selectedFormSegment = signal<string>('Educação Infantil');

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

  onReservationSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const protocol = `ALEXO-2027-${randomNum}`;
    this.showNotification({
      title: 'Pré-Reserva 2027 Registrada com Sucesso!',
      message: `Recebemos os dados para a Campanha de Reserva de Vagas 2027 (${this.selectedFormSegment()}). Nossa secretaria entrará em contato pelo WhatsApp!`,
      type: 'gold',
      protocol
    });
    form.reset();
  }

  onVisitSubmit(event: Event) {
    event.preventDefault();
    this.closeModal();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const protocol = `VISITA-${randomNum}`;
    this.showNotification({
      title: 'Visita Pedagógica Solicitada!',
      message: 'Será um prazer receber sua família no Colégio Alexo! Confirmaremos o dia e horário pelo seu WhatsApp.',
      type: 'success',
      protocol
    });
    (event.target as HTMLFormElement).reset();
  }

  onCareerSubmit(event: Event) {
    event.preventDefault();
    this.closeModal();
    this.showNotification({
      title: 'Currículo Enviado com Sucesso!',
      message: 'Obrigado pelo interesse em fazer parte do Colégio Alexo. Seu perfil foi encaminhado à nossa coordenação.',
      type: 'success'
    });
    this.selectedResumeName.set('');
    (event.target as HTMLFormElement).reset();
  }

  onComplaintSubmit(event: Event) {
    event.preventDefault();
    this.closeModal();
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const protocol = `OUV-ALEXO-${randomNum}`;
    this.showNotification({
      title: 'Manifestação Registrada na Ouvidoria',
      message: 'Sua mensagem foi encaminhada com prioridade à Direção e Coordenação do Colégio Alexo.',
      type: 'warning',
      protocol
    });
    (event.target as HTMLFormElement).reset();
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
