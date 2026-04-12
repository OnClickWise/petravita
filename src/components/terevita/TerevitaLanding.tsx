'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import { getTerevitaLandingConfig, submitTerevitaLead } from '@/lib/terevita-api';
import type { TerevitaLandingConfig } from '@/lib/terevita-types';
import { StackedCoverageCarousel } from '@/components/terevita/StackedCoverageCarousel';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

const sans = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const landingSlug = process.env.NEXT_PUBLIC_TEREVITA_SLUG || 'terevita';
const whatsappUrl =
  process.env.NEXT_PUBLIC_TEREVITA_WHATSAPP ||
  'https://wa.me/5511997503611?text=Ola%2C%20gostaria%20de%20conhecer%20a%20Terevita.';
const instagramUrl = process.env.NEXT_PUBLIC_TEREVITA_INSTAGRAM || 'https://www.instagram.com/terevita_corretora/';
const footerPhone = process.env.NEXT_PUBLIC_TEREVITA_PHONE || '+55 11 99750-3611';
const footerEmail = process.env.NEXT_PUBLIC_TEREVITA_EMAIL || 'contato@terevita.com.br';

const navItems = [
  { id: 'inicio', label: 'Home' },
  { id: 'protecao', label: 'Proteção' },
  { id: 'portfolio', label: 'Coberturas' },
  { id: 'jornada', label: 'Jornada' },
  { id: 'contato', label: 'Contato' },
] as const;

const highlights = [
  'Seguro de vida familiar',
  'Proteção de renda e invalidez',
  'Doenças graves e despesas médicas',
  'Assistência funeral e suporte',
];

const portfolioCards = [
  {
    id: 'protecao-completa',
    title: 'Proteção completa',
    subtitle: 'Uma arquitetura de proteção para família, renda e patrimônio em um único plano consultivo.',
    image: '/terevita/protecao-completa.jpeg',
  },
  {
    id: 'seguro-vida-familiar',
    title: 'Seguro de vida familiar',
    subtitle: 'Uma base de proteção para manter dependentes amparados e a rotina mais previsível.',
    image: '/terevita/seguro-de-vida-familiar.jpeg',
  },
  {
    id: 'renda-protegida',
    title: 'Renda protegida',
    subtitle: 'Estrutura para afastamento, invalidez e continuidade do padrão de vida.',
    image: '/terevita/protecao-renda-dit-rit.jpeg',
  },
  {
    id: 'doencas-graves',
    title: 'Doenças graves',
    subtitle: 'Apoio financeiro quando o momento exige foco em tratamento, não em conta a pagar.',
    image: '/terevita/diagnostico-doencas-graves.jpeg',
  },
  {
    id: 'internacao-hospitalar',
    title: 'Internação hospitalar',
    subtitle: 'Cobertura para dias de internação, com suporte quando a recuperação pede estabilidade.',
    image: '/terevita/diaria-internacao-hospitalar.jpeg',
  },
  {
    id: 'invalidez-permanente',
    title: 'Invalidez permanente',
    subtitle: 'Proteção para situações em que a continuidade financeira precisa estar garantida.',
    image: '/terevita/invalidez-permanente.jpeg',
  },
  {
    id: 'cirurgias-despesas-medicas',
    title: 'Cirurgias e despesas médicas',
    subtitle: 'Cobertura para apoiar procedimentos e custos inesperados do cuidado com a saúde.',
    image: '/terevita/cirurgias-despesas-medicas.jpeg',
  },
  {
    id: 'assistencia-funeral',
    title: 'Assistência funeral',
    subtitle: 'Suporte para reduzir a carga operacional e emocional em momentos sensíveis.',
    image: '/terevita/assistencia-funeral.jpeg',
  },
];

const coverageOptions = portfolioCards.map((card) => card.title);

const timeline = [
  {
    step: '01',
    title: 'Imprevisto surge',
    text: 'A Terevita atua como corretora especializada em seguro de vida e planejamento financeiro, garantindo proteção estruturada para preservar sua estabilidade mesmo diante de imprevistos.',
  },
  {
    step: '02',
    title: 'Cobertura responde',
    text: 'Seguro, renda ou assistência ajudam a atravessar o período sem desmontar a operação financeira.',
  },
  {
    step: '03',
    title: 'Família preservada',
    text: 'O que estava planejado continua em pé, com mais previsibilidade e menos ruído.',
  },
];

const faq = [
  {
    q: 'O que a Terevita oferece?',
    a: 'Proteção financeira consultiva para vida, renda, doenças graves, assistência e outras coberturas pensadas para preservar família e patrimônio.',
  },
  {
    q: 'Para quem a Terevita faz sentido?',
    a: 'A Terevita é para quem valoriza um planejamento financeiro bem estruturado, com proteção inteligente, claro nas decisões e soluções sob medida para cada fase da vida.',
  },
  {
    q: 'Como funciona o atendimento?',
    a: 'Você preenche o formulário, o time recebe a solicitação e entra em contato para entender perfil, objetivos e indicar a melhor composição de cobertura.',
  },
  {
    q: 'Em quanto tempo recebo retorno?',
    a: 'A ideia é dar retorno rápido e consultivo, normalmente em até 24 horas úteis, para seguir com a proposta sem deixar a conversa esfriar.',
  },
];

function formatPhone(phone?: string | null) {
  return phone || 'Telefone comercial não informado';
}

function ArrowDownIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5v14" />
      <path d="m6 13 6 6 6-6" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m18 15-6-6-6 6" />
      <path d="M12 9v10" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-1 4 8.5 8.5 0 0 1-7.5 4.5 8.38 8.38 0 0 1-4-.97L3 21l1.97-5.5A8.38 8.38 0 0 1 4 11.5a8.5 8.5 0 0 1 4.5-7.5A8.38 8.38 0 0 1 12.5 3h.5A8.5 8.5 0 0 1 21 11.5Z" />
    </svg>
  );
}

export function TerevitaLanding() {
  const [config, setConfig] = useState<TerevitaLandingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState<(typeof navItems)[number]['id']>('inicio');
  const [showTopButton, setShowTopButton] = useState(false);
  useEffect(() => {
    let mounted = true;

    getTerevitaLandingConfig(landingSlug)
      .then((result) => {
        if (mounted) {
          setConfig(result);
        }
      })
      .catch(() => {
        if (mounted) {
          setConfig(null);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveSection(visible.target.id as (typeof navItems)[number]['id']);
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0.15, 0.3, 0.55, 0.8] },
    );

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateTopButtonVisibility = () => {
      setShowTopButton(window.scrollY > 180);
    };

    updateTopButtonVisibility();
    window.addEventListener('scroll', updateTopButtonVisibility, { passive: true });

    return () => window.removeEventListener('scroll', updateTopButtonVisibility);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSending(true);

    const formData = new FormData(event.currentTarget);
    const consentChecked = formData.get('consent') === 'on';

    try {
      await submitTerevitaLead(landingSlug, {
        name: String(formData.get('name') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        phone: String(formData.get('phone') || '').trim() || undefined,
        location: String(formData.get('location') || '').trim() || undefined,
        interest: String(formData.get('interest') || 'Proteção Terevita').trim(),
        description: String(formData.get('message') || '').trim() || undefined,
        source: 'landing-page-terevita',
        origin_page: '/pt/terevita',
        consent: consentChecked,
        show_on_pipeline: true,
      });

      setSuccess('Lead enviado com sucesso. Em breve o time entra em contato.');
      event.currentTarget.reset();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Falha ao enviar o contato.');
    } finally {
      setSending(false);
    }
  }

  return (
    <main className={`${sans.className} min-h-screen bg-[#f6ecdf] text-[#2a2018]`}>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#d8c6a0] bg-[#f4eee2]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
          <a href="#inicio" className="flex items-center gap-3">
            <Image src="/terevita/logo-terevita.jpeg" alt="Terevita" width={48} height={48} className="rounded-full border border-[#d8c6a0] object-cover" />
            <div className="leading-none">
              <p className={`${serif.className} text-[34px] text-[#4a260f]`}>Terevita</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#8e7549]">Proteção inteligente</p>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-xs font-semibold uppercase tracking-[0.24em] text-[#6f5a3d] lg:flex">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`transition hover:text-[#2f2114] ${activeSection === item.id ? 'text-[#2f2114]' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#a98c5c] bg-white/80 px-5 py-3 text-sm font-semibold text-[#5f4829] transition hover:bg-white"
          >
            Falar no WhatsApp
          </a>
        </div>
      </header>

      <section id="inicio" className="scroll-mt-28 overflow-hidden pt-28 lg:pt-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-14 lg:grid-cols-[1fr_1fr] lg:items-start lg:px-10">
          <div className="relative order-2 lg:order-1 flex flex-col justify-start">
            <h1 className={`${serif.className} mt-6 max-w-2xl text-3xl leading-[0.9] text-[#3f1d08] md:text-4xl lg:text-[4rem]`}>
              Seguro de vida estratégico para proteção familiar, garantindo estabilidade financeira, sucessão patrimonial e tranquilidade para quem você ama.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#5d4c3f]">
              Uma experiência de consultoria em seguro de vida pensada para quem valoriza clareza, estratégia e sofisticação na construção de um planejamento financeiro sólido e na proteção da família.
            </p>

            <div className="mt-10 hidden h-14 w-[340px] md:block">
              <svg viewBox="0 0 340 56" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M2 44C23 44 28 12 52 12C76 12 84 48 106 48C128 48 133 22 155 22C179 22 184 52 209 52C233 52 238 30 260 30C282 30 291 44 338 44" stroke="#d3b277" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="relative order-1 lg:order-2 flex flex-col gap-8">
            <div className="relative overflow-hidden rounded-[34px] border border-[#e0cfaf] bg-[#f0e4d1] p-3 shadow-[0_24px_60px_-32px_rgba(78,61,24,0.6)]">
              <Image
                src="/terevita/arvore-seguranca.jpeg"
                alt="Árvore da segurança Terevita"
                width={1200}
                height={900}
                priority
                className="h-full w-full rounded-[26px] object-cover object-center"
              />
              <div className="absolute right-5 top-5 rounded-full border border-white/60 bg-white/85 p-2 shadow-md">
                <Image src="/terevita/logo-terevita.jpeg" alt="Logo Terevita" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
              </div>
            </div>

            <div className="grid gap-4 grid-cols-3">
              {[
                ['100%', 'clareza comercial'],
                ['+20', 'coberturas do portfólio'],
                ['24h', 'retorno inicial'],
              ].map(([value, label]) => (
                <div key={value} className="rounded-[30px] border border-[#d9c6a1] bg-white/85 p-5 shadow-[0_14px_30px_-20px_rgba(66,44,18,0.5)]">
                  <p className={`${serif.className} text-3xl text-[#4a260f]`}>{value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#7d6745]">{label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="#contato" className="rounded-[18px] border border-[#8f6330] bg-[#f5ead9] px-9 py-3.5 text-lg font-bold text-[#2c180c] shadow-[0_12px_28px_-14px_rgba(75,30,10,0.45)] transition hover:bg-[#ecdbc1]">
                Receber minha proposta
              </a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="rounded-[18px] border border-[#c6ad7d] bg-white/75 px-8 py-3.5 text-lg font-semibold text-[#5b482f] transition hover:bg-white">
                Falar com consultor
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl justify-center pb-4">
          <a href="#protecao" aria-label="Ir para a próxima seção" className="text-[#8c764b] transition hover:text-[#5e472a]">
            <ArrowDownIcon />
          </a>
        </div>
      </section>

      <section id="protecao" className="scroll-mt-28 border-y border-[#dcc8a0] bg-[#efe4cf] px-5 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8f7445]">Proteção</p>
            <h2 className={`${serif.className} mt-2 text-4xl text-[#3f2917] md:text-5xl`}>
              Um posicionamento mais humano, mais claro e mais fácil de vender.
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              'Proteção de vida para família e dependentes',
              'Renda e invalidez com abordagem consultiva',
              'Doenças graves, internação e assistência',
            ].map((text) => (
              <div key={text} className="rounded-[28px] border border-[#d5bf90] bg-white/80 p-6 shadow-sm">
                <p className="text-lg font-semibold text-[#3f2a17]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="portfolio" className="scroll-mt-28 px-5 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8f7445]">Coberturas</p>
              <h2 className={`${serif.className} mt-2 text-4xl text-[#3f2917] md:text-5xl`}>Uma vitrine de proteção com linguagem visual forte.</h2>
            </div>
          </div>

          <div className="mt-8">
            <StackedCoverageCarousel items={portfolioCards} contactHref="#contato" />
          </div>
        </div>
      </section>

      <section id="jornada" className="scroll-mt-28 border-y border-[#dcc8a0] bg-[#f1e6d1] px-5 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8f7445]">Jornada</p>
          <h2 className={`${serif.className} mt-2 text-4xl text-[#3f2917] md:text-5xl`}>O imprevisto não avisa. A estrutura precisa estar pronta.</h2>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {timeline.map((item) => (
              <div key={item.step} className="rounded-[30px] border border-[#d5bf90] bg-white/80 p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8f7445]">{item.step}</p>
                <h3 className={`${serif.className} mt-2 text-3xl text-[#3d2410]`}>{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#625243]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="scroll-mt-28 px-5 py-16 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[36px] border border-[#d7c39d] bg-white p-7 shadow-[0_20px_45px_-32px_rgba(75,47,18,0.42)] lg:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8f7445]">Contato</p>
            <h2 className={`${serif.className} mt-2 text-4xl text-[#3d2410] md:text-5xl`}>Peça uma proposta com atendimento consultivo.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#645548] md:text-base">
              Preencha seus dados e receba um retorno direto com a melhor combinação de proteção para o seu momento.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
              <input
                name="name"
                placeholder="Nome completo"
                required
                className="rounded-2xl border border-[#cfbb95] bg-[#f8f2e6] px-4 py-3 outline-none transition placeholder:text-[#9d8b70] focus:border-[#a88b5e]"
              />
              <input
                name="email"
                type="email"
                placeholder="E-mail"
                required
                className="rounded-2xl border border-[#cfbb95] bg-[#f8f2e6] px-4 py-3 outline-none transition placeholder:text-[#9d8b70] focus:border-[#a88b5e]"
              />
              <input
                name="phone"
                placeholder="WhatsApp"
                className="rounded-2xl border border-[#cfbb95] bg-[#f8f2e6] px-4 py-3 outline-none transition placeholder:text-[#9d8b70] focus:border-[#a88b5e]"
              />
              <input
                name="location"
                placeholder="Cidade / Região"
                className="rounded-2xl border border-[#cfbb95] bg-[#f8f2e6] px-4 py-3 outline-none transition placeholder:text-[#9d8b70] focus:border-[#a88b5e]"
              />
              <select
                name="interest"
                defaultValue=""
                required
                className="rounded-2xl border border-[#cfbb95] bg-[#f8f2e6] px-4 py-3 text-[#2a2018] outline-none transition focus:border-[#a88b5e] md:col-span-2"
              >
                <option value="" disabled>
                  Selecione o motivo do contato / cobertura
                </option>
                {coverageOptions.map((coverage) => (
                  <option key={coverage} value={coverage}>
                    {coverage}
                  </option>
                ))}
                <option value="Outras coberturas / orientação geral">Outras coberturas / orientação geral</option>
              </select>
              <textarea
                name="message"
                rows={5}
                placeholder="Conte um pouco do seu momento e do que deseja proteger"
                className="rounded-2xl border border-[#cfbb95] bg-[#f8f2e6] px-4 py-3 outline-none transition placeholder:text-[#9d8b70] focus:border-[#a88b5e] md:col-span-2"
              />
              <label className="flex items-start gap-3 rounded-2xl border border-[#d8c7a3] bg-[#faf5ea] p-4 md:col-span-2">
                <input name="consent" type="checkbox" required className="mt-1 h-4 w-4 rounded border-[#cfbb95] text-[#5b1f08]" />
                <span className="text-sm leading-7 text-[#5d4b3b]">
                  Concordo com o uso dos meus dados para contato comercial e entendo que a Terevita pode retornar por WhatsApp, telefone ou e-mail.
                </span>
              </label>
              <div className="flex flex-col gap-3 md:col-span-2 md:flex-row">
                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-full border border-[#a87c42] bg-[#f7efe3] px-6 py-3 text-sm font-semibold text-[#2a2018] shadow-[0_8px_20px_-12px_rgba(90,51,18,0.5)] transition hover:bg-[#efe2cf] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? 'Enviando...' : 'Receber minha proposta'}
                </button>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="rounded-full border border-[#c6ad7d] bg-white/70 px-6 py-3 text-sm font-semibold text-[#5f4829] transition hover:bg-white">
                  Abrir WhatsApp comercial
                </a>
              </div>
            </form>

            {success ? <p className="mt-4 text-sm text-emerald-700">{success}</p> : null}
            {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
          </div>

          <aside className="rounded-[36px] border border-[#d7c39d] bg-[#3b2e22] p-7 text-[#f4ebd8] shadow-[0_20px_45px_-32px_rgba(75,47,18,0.42)] lg:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#e4cb95]">Como a conversa acontece</p>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {[
                ['Atendimento humano', 'Você recebe retorno consultivo, sem roteiro engessado.'],
                ['Proposta sob medida', 'A proteção é organizada conforme perfil, fase de vida e objetivo.'],
                ['Canal direto', 'Se preferir, o time continua a conversa por WhatsApp.'],
                ['Análise da cobertura', 'A conversa parte do que precisa ser protegido, não de pacote genérico.'],
                ['Próximos passos', 'Você sai com a direção clara do que faz sentido avançar.'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#d9c08a]">{label}</p>
                  <p className="mt-2 text-sm leading-6 text-[#f2e6d0] break-words">{value}</p>
                </div>
              ))}
            </div>

          </aside>
        </div>
      </section>

      <section id="faq" className="scroll-mt-28 px-5 pb-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8f7445]">FAQ</p>
          <h2 className={`${serif.className} mt-2 text-4xl text-[#3d2410] md:text-5xl`}>Perguntas que ajudam a fechar a conversa.</h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {faq.map((item) => (
              <article key={item.q} className="rounded-[30px] border border-[#dcc8a0] bg-white/85 p-6 shadow-sm">
                <h3 className={`${serif.className} text-3xl text-[#3f2411]`}>{item.q}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5f4d3e]">{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#7a6a55] bg-[#5e5345] px-5 pt-8 pb-6 text-[#f4ede2] lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-center lg:justify-between">
              <a href="#inicio" className="flex items-center gap-3">
                <Image src="/terevita/logo-terevita.jpeg" alt="Terevita" width={42} height={42} className="h-10 w-10 rounded-full object-cover" />
                <div className="leading-none">
                  <p className={`${serif.className} text-3xl text-[#f7f1e7]`}>Terevita</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#d4be97]">Proteção inteligente</p>
                </div>
              </a>

              <div className="flex flex-wrap items-center gap-4 text-sm text-[#eee4d5]">
                <span>Vamos construir sua proposta?</span>
                <a href="#contato" className="rounded-full border border-white/20 px-4 py-2 transition hover:bg-white/5">
                  Contato
                </a>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-4 py-2 transition hover:bg-white/5">
                  WhatsApp →
                </a>
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.7fr_0.7fr_1.1fr] lg:items-start lg:pt-2 lg:pb-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4be97]">Contato</p>
                <div className="mt-5 space-y-3 text-sm leading-7 text-[#f3ebdd]">
                  <p>{footerPhone}</p>
                  <p>{footerEmail}</p>
                  <p>Atendimento consultivo para todo o Brasil</p>
                  <p>Proteção familiar, renda e planejamento financeiro</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4be97]">Sitemap</p>
                <div className="mt-5 grid gap-2 text-sm text-[#f3ebdd]">
                  <a href="#inicio" className="transition hover:text-white">Home</a>
                  <a href="#protecao" className="transition hover:text-white">Proteção</a>
                  <a href="#portfolio" className="transition hover:text-white">Coberturas</a>
                  <a href="#jornada" className="transition hover:text-white">Jornada</a>
                  <a href="#contato" className="transition hover:text-white">Contato</a>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4be97]">Socials</p>
                <div className="mt-5 grid gap-2 text-sm text-[#f3ebdd]">
                  <a href={instagramUrl} target="_blank" rel="noreferrer" className="transition hover:text-white">Instagram</a>
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className="transition hover:text-white">WhatsApp</a>
                  <a href={`mailto:${footerEmail}`} className="transition hover:text-white">E-mail</a>
                  <a href="#faq" className="transition hover:text-white">FAQ</a>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4be97]">Updates</p>
                <p className="mt-5 max-w-md text-sm leading-7 text-[#f3ebdd]">
                  Receba novidades ocasionais sobre proteção e planejamento, sem ruído e sem excesso de mensagens.
                </p>
                <div className="mt-5 flex max-w-md items-stretch overflow-hidden rounded-2xl border border-white/10 bg-[#6a5e4f]">
                  <input
                    type="email"
                    placeholder="Seu email"
                    aria-label="Seu email"
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-[#f7f1e7] outline-none placeholder:text-[#c8b6a0]"
                  />
                  <a href="#contato" className="flex items-center justify-center px-4 text-lg text-[#f7f1e7] transition hover:bg-white/5" aria-label="Ir para contato">
                    →
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-white/10 pt-5 text-sm text-[#e1d3bf] md:flex-row md:items-center md:justify-between">
              <p>© 2026 Terevita. Todos os direitos reservados.</p>
              <div className="flex flex-wrap gap-4">
                <a href="#inicio" className="transition hover:text-white">Topo</a>
                <a href="#faq" className="transition hover:text-white">FAQ</a>
                <a href="#contato" className="transition hover:text-white">Back to top</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Voltar ao topo"
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#c6ad7d] bg-[#f6efdf] text-[#5b4a30] shadow-xl transition-all duration-300 ease-out hover:scale-105 ${showTopButton ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}
        >
          <ArrowUpIcon />
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Conversar no WhatsApp"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:scale-105"
        >
          <MessageIcon />
          WhatsApp
        </a>
      </div>
    </main>
  );
}
