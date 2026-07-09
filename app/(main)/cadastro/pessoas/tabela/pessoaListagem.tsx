'use client';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { Skeleton } from 'primereact/skeleton';
import { usePermissions } from '@/app/routes/permissoes';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { Dispatch, SetStateAction, useContext, useRef, useState } from 'react';
import { highlightSearchTerm } from '@/app/components/dataTableComponent/types/types';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { DataTableComponent, defaultExpandButtonTemplate, editButton, toggleStatusOrDeleteButton } from '@/app/components/dataTableComponent/DataTableComponent';

export function ListarClientesFornecedores(
    {
        listPaginationClientesFornecedores,
        loading,
        searchTerm,
        listarInativos,
        cliente,
        fornecedor,
        deletar,
        ativar,
        mobileLoadMoreVisible,
        mobileLoadMoreLoading,
        onMobileLoadMore
    }: {
        listPaginationClientesFornecedores: Record<string, any>;
        loading: boolean;
        searchTerm: string;
        deletar: (id: number) => Promise<void>;
        ativar: (id: number) => Promise<void>;
        setListPaginationClientesFornecedores: Dispatch<SetStateAction<any>>;
        setLoading: (state: boolean) => void;
        listarInativos: boolean;
        cliente: boolean;
        fornecedor: boolean;
        mobileLoadMoreVisible?: boolean;
        mobileLoadMoreLoading?: boolean;
        onMobileLoadMore?: () => void | Promise<void>;
    }
) {
    const router = useRouter();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const msgs = useRef<Messages>(null);
    const { permissaoPessoa } = usePermissions();
    const { layoutConfig } = useContext(LayoutContext);
    const isDarkMode = layoutConfig.colorScheme === 'dark';
    const [expandedRows, setExpandedRows] = useState<any[]>([]);
    const listLoadingShellStyle = {
        position: 'relative' as const,
        display: 'flex',
        flexDirection: 'column' as const,
        flex: '1 1 auto',
        minHeight: 'clamp(24rem, 60vh, 40rem)'
    };
    const listLoadingOverlayStyle = {
        position: 'absolute' as const,
        inset: 0,
        zIndex: 3
    };
    const changeStatusActivateandDelete = async (rowData: PessoaEntity) => {
        if (rowData.ativo) {
            await deletar(rowData.id!);
            return;
        }

        await ativar(rowData.id!);
    };
    return (
        <div style={{ marginTop: '0', display: 'flex', flex: '1 1 auto', minHeight: 0, flexDirection: 'column' }}>
            <Messages ref={msgs} className="custom-messages" />
            <>
                    {isMobile && (
                        <div style={listLoadingShellStyle}>
                            <DataTableComponent
                                value={listPaginationClientesFornecedores?.content as PessoaEntity[]}
                                loading={false}
                                totalRecords={listPaginationClientesFornecedores?.totalElements ?? 0}
                                expandedRows={false}
                                setExpandedRows={() => { }}
                                rowExpansionTemplate={() => null}
                                expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                isDarkMode={isDarkMode}
                                searchTerm={searchTerm}
                                editButtonTemplate={
                                    permissaoPessoa.update ? (rowData) => editButton(rowData, '/cadastro/pessoas/created', router) : undefined
                                }
                                toggleStatusOrDeleteButtonTemplate={
                                    permissaoPessoa.delete
                                        ? (rowData) =>
                                            toggleStatusOrDeleteButton({
                                                entity: rowData,
                                                onToggle: changeStatusActivateandDelete,
                                                entityType: ''
                                            })
                                        : undefined
                                }
                                showExpandButton={false}
                                columns={[
                                    {
                                        field: 'razao_social',
                                        header: 'Razao Social',
                                        body: (data) => {
                                            const isStatusInactive = data.ativo === false;
                                            return loading ? (
                                                <Skeleton />
                                            ) : (
                                                <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>
                                                    {highlightSearchTerm(limitarText(data.razao_social, 25), searchTerm)}
                                                </span>
                                            );
                                        }
                                    }
                                ]}
                                listarInativos={listarInativos}
                                cliente={cliente}
                                fornecedor={fornecedor}
                                mobileLoadMoreVisible={!loading && mobileLoadMoreVisible}
                                mobileLoadMoreLoading={mobileLoadMoreLoading}
                                onMobileLoadMore={onMobileLoadMore}
                                mobileBodyScroll
                            />
                            {loading && (
                                <div style={listLoadingOverlayStyle}>
                                    <LoadingScreen loadingText="Carregando Clientes ou Fornecedores..." fullScreen={false} />
                                </div>
                            )}
                        </div>
                    )}
                    {isDesktop && (
                        <div style={listLoadingShellStyle}>
                            <DataTableComponent
                                value={listPaginationClientesFornecedores?.content as PessoaEntity[]}
                                loading={false}
                                totalRecords={listPaginationClientesFornecedores?.totalElements ?? 0}
                                expandedRows={false}
                                setExpandedRows={() => { }}
                                rowExpansionTemplate={() => null}
                                expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                isDarkMode={isDarkMode}
                                searchTerm={searchTerm}
                                editButtonTemplate={
                                    permissaoPessoa.update ? (rowData) => editButton(rowData, '/cadastro/pessoas/created', router) : undefined
                                }
                                toggleStatusOrDeleteButtonTemplate={
                                    permissaoPessoa.delete
                                        ? (rowData) =>
                                            toggleStatusOrDeleteButton({
                                                entity: rowData,
                                                onToggle: changeStatusActivateandDelete,
                                                entityType: ''
                                            })
                                        : undefined
                                }
                                showExpandButton={false}
                                columns={[
                                    {
                                        field: 'razao_social',
                                        header: 'Razao Social',
                                        body: (data) => {
                                            const isStatusInactive = data.ativo === false;
                                            return loading ? (
                                                <Skeleton />
                                            ) : (
                                                <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>
                                                    {highlightSearchTerm(limitarText(data.razao_social, 80), searchTerm)}
                                                </span>
                                            );
                                        }
                                    },
                                    {
                                        field: 'documento',
                                        header: 'CPF/CNPJ',
                                        body: (data) => {
                                            const isStatusInactive = data.ativo === false;
                                            const idValue = data?.cpf ?? data?.cnpj ?? data?.razao_social ?? '';
                                            const display = idValue ? limitarText(idValue, 25) : '-';

                                            return loading ? (
                                                <Skeleton />
                                            ) : (
                                                <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>
                                                    {highlightSearchTerm(display, searchTerm)}
                                                </span>
                                            );
                                        }
                                    }
                                ]}
                                listarInativos={listarInativos}
                                cliente={cliente}
                                fornecedor={fornecedor}
                            />
                            {loading && (
                                <div style={listLoadingOverlayStyle}>
                                    <LoadingScreen loadingText="Carregando Clientes ou Fornecedores..." fullScreen={false} />
                                </div>
                            )}
                        </div>
                    )}
            </>
        </div>
    );
}

export default ListarClientesFornecedores;
