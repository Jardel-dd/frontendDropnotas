'use client';

import './styled.css';
import Link from 'next/link';
import type { ElementType } from 'react';
import {
    ArrowSquareOut,
    BookOpen,
    Briefcase,
    ChartBar,
    CheckCircle,
    ClipboardText,
    CreditCard,
    Folders,
    GearSix,
    House,
    PlayCircle,
    Receipt,
    Wallet,
    Wrench
} from 'phosphor-react';

type Tutorial = {
    title: string;
    objective: string;
    route: string;
    icon: ElementType;
    steps: string[];
    videoUrl?: string;
    resources?: TutorialResource[];
};

type TutorialResource = {
    label: string;
    href: string;
};

const tutorials: Tutorial[] = [
    {
        title: 'Dashboard',
        objective: 'Acompanhar rapidamente os indicadores e o desempenho das notas de serviço.',
        route: '/dashboard',
        icon: House,
        steps: ['Filtre o período e os dados desejados.', 'Analise os indicadores, status e valores das notas.']
    },
    {
        title: 'Cadastros',
        objective: 'Manter as informações que dão suporte à operação.',
        route: '/cadastro/pessoas',
        icon: Folders,
        resources: [
            {
                label: 'Clientes e fornecedores',
                href: 'https://www.youtube.com/'
            },
            {
                label: 'Serviços',
                href: 'https://www.youtube.com/'
            },
            {
                label: 'Perfil Tributário',
                href: 'https://www.youtube.com/'
            },
            {
                label: 'Vendedores',
                href: 'https://www.youtube.com/'
            },
            {
                label: 'Usuários',
                href: 'https://www.youtube.com/'
            },
            {
                label: 'Permissões',
                href: 'https://www.youtube.com/'
            },
            {
                label: 'Forma de pagamento',
                href: 'https://www.youtube.com/'
            },
            {
                label: 'Categoria de contrato',
                href: 'https://www.youtube.com/'
            }
        ],
        steps: []
    },
    {
        title: 'Contratos',
        objective: 'Registrar e acompanhar os contratos vinculados aos seus clientes e serviços.',
        route: '/contrato',
        icon: Briefcase,
        steps: ['Crie um contrato com as condições acordadas.', 'Consulte a situação e o histórico sempre que necessário.']
    },
    {
        title: 'Ordens de serviço',
        objective: 'Planejar, registrar e acompanhar a execução dos serviços contratados.',
        route: '/ordemServicos',
        icon: Wrench,
        steps: ['Crie uma ordem para o serviço solicitado.', 'Atualize as datas e o status até a conclusão.']
    },
    {
        title: 'NFS-e',
        objective: 'Emitir, consultar e acompanhar as notas fiscais de serviço.',
        route: '/notaServico',
        icon: Receipt,
        steps: ['Preencha os dados do cliente e do serviço.', 'Emita a nota e acompanhe a autorização.']
    },
    {
        title: 'Finanças',
        objective: 'Controlar contas a pagar, contas a receber e comissões.',
        route: '/financas',
        icon: Wallet,
        resources: [
            {
                label: 'Contas a Pagar',
                href: 'https://www.youtube.com/'
            },
            {
                label: 'Contas a Receber',
                href: 'https://www.youtube.com/'
            },
            {
                label: 'Comissões',
                href: 'https://www.youtube.com/'
            }
        ],
        steps: []
    },
    {
        title: 'Relatórios',
        objective: 'Transformar os dados do sistema em informações para análise e decisão.',
        route: '/relatorios/servicos',
        icon: ChartBar,
        resources: [
            {
                label: 'Serviços',
                href: 'https://www.youtube.com/'
            },
            {
                label: 'Recebimentos',
                href: 'https://www.youtube.com/'
            }
        ],
        steps: []
    },
    {
        title: 'Configurações',
        objective: 'Preparar empresas, preferências visuais e parâmetros do sistema.',
        route: '/configuracoes',
        icon: GearSix,
        resources: [
            {
                label: 'Minhas Empresas',
                href: 'https://www.youtube.com/'
            },
            {
                label: 'Temas',
                href: 'https://www.youtube.com/'
            }
        ],
        steps: []
    },
    {
        title: 'Assinaturas',
        objective: 'Consultar o plano e gerenciar informações de cobrança da conta.',
        route: '/assinaturas',
        icon: CreditCard,
        steps: ['Confira a situação da assinatura.', 'Acompanhe os pagamentos vinculados ao plano.']
    }
];

const videoButtonLabel = (tutorial: Tutorial) => tutorial.videoUrl ? 'Assistir vídeo' : 'Vídeo em breve';

export default function TutoriaisPage() {
    return (
        <div className="card styled-container-main-all-routes">
        <div className="scrollable-container ">
        <main className="tutorials-page">
            <div className="tutorials-shell">
                <section className="card tutorials-hero">
                    <div className="tutorials-hero-copy">
                        <span className="tutorials-eyebrow">
                            <BookOpen size={17} weight="fill" />
                            Central de ajuda
                        </span>
                        <h1>Aprenda a usar o DropNotas</h1>
                        <p>
                            Encontre o objetivo de cada área do sistema, os primeiros passos e os vídeos
                            demonstrativos para realizar suas tarefas com segurança.
                        </p>
                    </div>
                    <div className="tutorials-hero-guide" aria-label="Como usar os tutoriais">
                        <span className="tutorials-hero-guide-icon"><PlayCircle size={30} weight="fill" /></span>
                        <div>
                            <strong>Comece pelo menu que precisa usar</strong>
                            <span>Leia o resumo, assista ao vídeo e abra a tela correspondente.</span>
                        </div>
                    </div>
                </section>

                <section aria-labelledby="tutorials-list-title">
                    <div className="tutorials-section-heading">
                        <div>
                            <span className="tutorials-section-kicker">Guias por módulo</span>
                            <h2 id="tutorials-list-title">Tutoriais disponíveis</h2>
                        </div>
                        <p>Os vídeos serão habilitados em cada card assim que forem publicados.</p>
                    </div>

                    <div className="tutorials-grid">
                        {tutorials.map((tutorial) => {
                            const Icon = tutorial.icon;

                            return (
                                <article className="tutorial-card" key={tutorial.title}>
                                    <div className="tutorial-card-heading">
                                        <span className="tutorial-card-icon"><Icon size={26} weight="duotone" /></span>
                                        <div>
                                            <h3>{tutorial.title}</h3>
                                            <p>{tutorial.objective}</p>
                                        </div>
                                    </div>

                                    {tutorial.steps.length > 0 && (
                                        <div className="tutorial-card-steps">
                                            {tutorial.steps.map((step) => (
                                                <span key={step}>
                                                    <CheckCircle size={16} weight="fill" />
                                                    {step}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {tutorial.resources && (
                                        <div className="tutorial-card-resources">
                                            <span>Conteúdos deste módulo</span>
                                            {tutorial.resources.map((resource) => (
                                                <Link
                                                    className="tutorial-resource-link"
                                                    href={resource.href}
                                                    key={resource.label}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {resource.label}
                                                    <ArrowSquareOut size={16} weight="bold" />
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    <div className="tutorial-card-actions">
                                        <Link className="tutorial-open-link" href={tutorial.route}>
                                            Abrir menu
                                            <ArrowSquareOut size={17} weight="bold" />
                                        </Link>
                                        {tutorial.videoUrl ? (
                                            <a
                                                className="tutorial-video-link"
                                                href={tutorial.videoUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <PlayCircle size={17} weight="fill" />
                                                {videoButtonLabel(tutorial)}
                                            </a>
                                        ) : (
                                            <span className="tutorial-video-pending" title="O vídeo deste módulo será publicado em breve.">
                                                <PlayCircle size={17} weight="fill" />
                                                {videoButtonLabel(tutorial)}
                                            </span>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>
                <section className="tutorials-support-note " aria-label="Sugestão de suporte">
                    <ClipboardText size={22} weight="duotone" />
                    <p>
                        Não encontrou o que procurava? Entre em contato conosco:{' '}
                        <a
                            className="tutorials-support-link"
                            href="https://api.whatsapp.com/send/?phone=5521971336076&text=Ol%C3%A1%21+Gostaria+de+um+atendimento.&type=phone_number&app_absent=0"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Falar pelo WhatsApp
                        </a>
                    </p>
                </section>
            </div>
        </main>
        </div>
        </div>
    );
}
