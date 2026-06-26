'use client';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { useOnboardingStyles } from './style';
import { Skeleton } from 'primereact/skeleton';
import { usePermissions } from '@/app/routes/permissoes';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { handleActiveOrInativeEmpresa } from '../controller/controller';
import { highlightSearchTerm } from '@/app/components/dataTableComponent/types/types';
import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { DataTableComponent, defaultExpandButtonTemplate, editButton, toggleStatusOrDeleteButton } from '@/app/components/dataTableComponent/DataTableComponent';

export function ListarEmpresas({
    listPaginationEmpresa,
    setListPaginationEmpresa,
    loading,
    setLoading,
    searchTerm,
    listarInativos,
    showOnboardingHint = false,
    onboardingCnpj = '',
    mobileLoadMoreVisible,
    mobileLoadMoreLoading,
    onMobileLoadMore
}: {
    listPaginationEmpresa: Record<string, any>;
    loading: boolean;
    searchTerm: string;
    deletar: (id: number) => Promise<void>;
    ativar: (id: number) => Promise<void>;
    setSelectedEmpresa: Dispatch<SetStateAction<CompanyEntity | null>>;
    setListPaginationEmpresa: Dispatch<SetStateAction<any>>;
    selectedEmpresa: CompanyEntity | null;
    setLoading: (state: boolean) => void;
    listarInativos: boolean;
    showOnboardingHint?: boolean;
    onboardingCnpj?: string;
    mobileLoadMoreVisible?: boolean;
    mobileLoadMoreLoading?: boolean;
    onMobileLoadMore?: () => void | Promise<void>;
}) {
    const {
   onboardingWrapperStyle,
   onboardingMessageStyle
} = useOnboardingStyles();
    const router = useRouter();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const msgs = useRef<Messages>(null);
    const { permissaoEmpresa } = usePermissions();
    const { layoutConfig } = useContext(LayoutContext);
    const isDarkMode = layoutConfig.colorScheme === 'dark';
    const [expandedRows, setExpandedRows] = useState<CompanyEntity[]>([]);
    const onboardingFocusDoneRef = useRef(false);
    const onboardingButtonRef = useRef<HTMLButtonElement | null>(null);
    const normalizedOnboardingCnpj = onboardingCnpj.replace(/\D/g, '');
    const [onboardingHintPosition, setOnboardingHintPosition] = useState<{ top: number; left: number } | null>(null);
  

    const updateOnboardingHintPosition = () => {
        const targetButton = onboardingButtonRef.current;

        if (!showOnboardingHint || !targetButton) {
            setOnboardingHintPosition(null);
            return;
        }

        const buttonRect = targetButton.getBoundingClientRect();
        const hintWidth = isMobile ? 192 : 256;
        const hintHeight = 72;
        const gap = 12;
        const preferredLeft = buttonRect.left - hintWidth - gap;
        const fallbackLeft = buttonRect.right + gap;
        const left = preferredLeft >= 12 ? preferredLeft : Math.min(fallbackLeft, window.innerWidth - hintWidth - 12);
        const top = Math.min(
            Math.max(buttonRect.top + (buttonRect.height / 2) - (hintHeight / 2), 12),
            window.innerHeight - hintHeight - 12
        );

        setOnboardingHintPosition({ top, left });
    };

    useEffect(() => {
        if (!showOnboardingHint || loading || onboardingFocusDoneRef.current || !onboardingButtonRef.current) {
            return;
        }

        onboardingButtonRef.current.focus();
        onboardingButtonRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
        updateOnboardingHintPosition();
        onboardingFocusDoneRef.current = true;
    }, [showOnboardingHint, loading, listPaginationEmpresa]);

    useEffect(() => {
        if (!showOnboardingHint || loading) {
            setOnboardingHintPosition(null);
            return;
        }

        const handleWindowUpdate = () => updateOnboardingHintPosition();

        handleWindowUpdate();
        window.addEventListener('resize', handleWindowUpdate);
        window.addEventListener('scroll', handleWindowUpdate, true);

        return () => {
            window.removeEventListener('resize', handleWindowUpdate);
            window.removeEventListener('scroll', handleWindowUpdate, true);
        };
    }, [showOnboardingHint, loading, isMobile, listPaginationEmpresa]);

    const renderOnboardingEditButton = (rowData: CompanyEntity) => {
        const rowCnpj = rowData.cnpj?.replace(/\D/g, '') ?? '';
        const isOnboardingTarget =
            showOnboardingHint &&
            normalizedOnboardingCnpj.length > 0 &&
            rowCnpj === normalizedOnboardingCnpj;

        if (!isOnboardingTarget) {
            return editButton(rowData, '/configuracoes/empresas/created', router);
        }

        return (
            <div style={onboardingWrapperStyle}>
                {editButton(
                    rowData,
                    '/configuracoes/empresas/created',
                    router,
                    onboardingButtonRef
                )}
            </div>
        );
    };

    const rowExpansionTemplate = (data: CompanyEntity) => {
        return (
            <div className="company-details p-3 shadow-sm rounded">
                <h5 className="company-title">Detalhes da Empresa</h5>
                <p className="company-detail">
                    <strong className="company-label">Razão Social:</strong> {data.razao_social}
                </p>
                <p className="company-detail">
                    <strong className="company-label">Nome Fantasia:</strong> {data.nome_fantasia}
                </p>
                <p className="company-detail">
                    <strong className="company-label">CNPJ:</strong> {data.cnpj}
                </p>
                <p className="company-detail">
                    <strong className="company-label">Telefone:</strong> {data.telefone}
                </p>
            </div>
        );
    };
    const changeStatusActivateandDelete = async (rowData: CompanyEntity) => {
        await handleActiveOrInativeEmpresa(rowData, msgs, listPaginationEmpresa, listarInativos, setLoading, searchTerm, setListPaginationEmpresa);
    };
    return (
        <div className="mt-0">
            
            <Messages ref={msgs} className="custom-messages" />
            {showOnboardingHint && onboardingHintPosition && (
                <div
                    style={{
                        ...onboardingMessageStyle,
                        top: onboardingHintPosition.top,
                        left: onboardingHintPosition.left
                    }}
                >
                   Finalize o cadastrado de informações da empresa para emissão das Notas Fiscais.
                </div>
            )}
            {loading ? (
                <LoadingScreen loadingText={'Carregando Empresas...'} />
            ) : (
                <>
                    {isMobile && (
                        <div>
                            <DataTableComponent
                                value={listPaginationEmpresa?.content as CompanyEntity[]}
                                loading={loading}
                                totalRecords={listPaginationEmpresa?.size ?? 0}
                                expandedRows={expandedRows}
                                setExpandedRows={setExpandedRows}
                                rowExpansionTemplate={rowExpansionTemplate}
                                expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                isDarkMode={isDarkMode}
                                searchTerm={searchTerm}
                                editButtonTemplate={
                                    permissaoEmpresa.update ?
                                        (rowData) => renderOnboardingEditButton(rowData)
                                        : undefined}
                                toggleStatusOrDeleteButtonTemplate={
                                    permissaoEmpresa.delete ? (rowData) =>
                                        toggleStatusOrDeleteButton({
                                            entity: rowData,
                                            onToggle: changeStatusActivateandDelete,
                                            entityType: ''
                                        })
                                        : undefined}
                                showExpandButton={true}
                                columns={[
                                    {
                                        field: 'nomeFantasia',
                                        header: 'Nome Fantasia',
                                        body: (data) => {
                                            const isStatusInactive = data.ativo === false;
                                            return loading ? <Skeleton /> : <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>{highlightSearchTerm(limitarText(data.nome_fantasia, 25), searchTerm)}</span>;
                                        }
                                    }
                                ]}
                                listarInativos={listarInativos}
                                mobileLoadMoreVisible={mobileLoadMoreVisible}
                                mobileLoadMoreLoading={mobileLoadMoreLoading}
                                onMobileLoadMore={onMobileLoadMore}
                            />
                        </div>
                    )}
                    {isDesktop && (
                        <div>
                            <DataTableComponent
                                value={listPaginationEmpresa?.content as CompanyEntity[]}
                                loading={loading}
                                totalRecords={listPaginationEmpresa?.size ?? 0}
                                setExpandedRows={setExpandedRows}
                                expandedRows={expandedRows}
                                isDarkMode={isDarkMode}
                                searchTerm={searchTerm}
                                rowExpansionTemplate={rowExpansionTemplate}
                                expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                editButtonTemplate={
                                    permissaoEmpresa.update ?
                                        (rowData) => renderOnboardingEditButton(rowData)
                                        : undefined}
                                toggleStatusOrDeleteButtonTemplate={
                                    permissaoEmpresa.delete ? (rowData) =>
                                        toggleStatusOrDeleteButton({
                                            entity: rowData,
                                            onToggle: changeStatusActivateandDelete,
                                            entityType: ''
                                        })
                                        : undefined}
                                columns={[
                                    {
                                        field: 'razaoSocial',
                                        header: 'Razão social',
                                        body: (data) => {
                                            const isStatusInactive = data.ativo === false;
                                            return loading ? <Skeleton /> : <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>{highlightSearchTerm(limitarText(data.razao_social, 25), searchTerm)}</span>;
                                        }
                                    },
                                    {
                                        field: 'nomeFantasia',
                                        header: 'Nome Fantasia',
                                        body: (data) => {
                                            const isStatusInactive = data.ativo === false;
                                            return loading ? <Skeleton /> : <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>{highlightSearchTerm(limitarText(data.nome_fantasia, 25), searchTerm)}</span>;
                                        }
                                    },
                                    {
                                        field: 'cnpj',
                                        header: 'CNPJ',
                                        body: (data) => {
                                            const isStatusInactive = data.ativo === false;
                                            return loading ? <Skeleton /> : <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>{highlightSearchTerm(limitarText(data.cnpj, 20), searchTerm)}</span>;
                                        }
                                    }
                                ]}
                                listarInativos={listarInativos}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
export default ListarEmpresas;
