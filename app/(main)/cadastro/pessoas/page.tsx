'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import ListarPessoa from './tabela/pessoaListagem';
import { usePermissions } from '@/app/routes/permissoes';
import { ClienteFornecedorFilter } from './types/pessoa';
import Input from '@/app/shared/include/input/input-all';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { CheckboxChangeEvent } from 'primereact/checkbox';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { PaginatorPageChangeEvent } from 'primereact/paginator';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import CustomPaginator from '@/app/components/paginator/customPaginator';
import CheckBoxField from '@/app/components/CheckBoxField/checkBoxField';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { ativarPessoa, deletarPessoa, listPessoa } from './controller/controller';
import { DropDownFilterClienteFornecedor } from '@/app/shared/optionsDropDown/options';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { FilterOverlay } from '@/app/components/buttonsComponent/btn-FilterComponent/Btn-Filter';

const ClientesFornecedores: React.FC = () => {
    const router = useRouter();
    const pageSize = usePageSize();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages | null>(null);
    const { permissaoPessoa } = usePermissions();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pessoa, setPessoa] = useState<PessoaEntity>(
        new PessoaEntity({
            id: 0,
            razao_social: '',
            nome_fantasia: '',
            cpf: null,
            rg: null,
            email: '',
            documento_estrangeiro: null,
            cnpj: '',
            inscricao_estadual: '',
            inscricao_municipal: '',
            atividade_principal: '',
            cnae_fiscal: '',
            data_fundacao: '',
            pessoa_cliente: false,
            pessoa_fornecedor: false,
            codigo_regime_tributario: '',
            tipo_pessoa: 'PESSOA_JURIDICA',
            contribuinte: '',
            endereco: {} as EnderecoEntity,
            arquivo_contrato: '',
            id_vendedor_padrao: null,
            ativo: true
        })
    );
    const [visible, setVisible] = useState<boolean>(false);
    const [isClientesFornecedoresCreated, setIsClientesFornecedoresCreated] = useState(false);
    const defaultClienteFornecedorFilter: ClienteFornecedorFilter = {
        cliente: true,
        fornecedor: true
    };
    const [selectedClienteFornecedor, setSelectedClienteFornecedor] = useState<ClienteFornecedorFilter>(defaultClienteFornecedorFilter);
    const [draftClienteFornecedor, setDraftClienteFornecedor] = useState<ClienteFornecedorFilter>(defaultClienteFornecedorFilter);
    const [listarInativos, setListarInativos] = useState<boolean>(false);
    const { cliente, fornecedor } = selectedClienteFornecedor;
    const [listPaginationClientesFornecedores, setListPaginationClientesFornecedores] = useState<Record<string, any>>({
        content: [],
        pageable: {
            pageNumber: 0,
            pageSize: pageSize,
            sort: {
                empty: true,
                unsorted: true,
                sorted: false
            }
        },
        totalPages: 0,
        totalElements: 0,
        last: false,
        size: 10,
        number: 0,
        sort: {
            empty: true,
            unsorted: true,
            sorted: false
        },
        numberOfElements: 0,
        first: true,
        empty: false
    });
    const handleNavigate = () => {
        router.push('/cadastro/pessoas/created');
        setIsClientesFornecedoresCreated(true);
    };
    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setPessoa,
        field: 'razao_social',
        onSearch: (value) => handleListClientesFornecedores(0, value, selectedClienteFornecedor, listarInativos)
    });
    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        setListarInativos(e.checked ?? false);
    };
    const handleListClientesFornecedores = async (pageNumber?: number, _searchTerm?: string, filter?: { cliente: boolean; fornecedor: boolean }, listarInativos = false) => {
        setLoading(true);
        const { cliente, fornecedor } = filter ?? selectedClienteFornecedor;
        try {
            const clientesFornecedores = await listPessoa(
                {
                    ...listPaginationClientesFornecedores,
                    pageable: {
                        ...listPaginationClientesFornecedores.pageable,
                        pageNumber: pageNumber ?? listPaginationClientesFornecedores.pageable.pageNumber,
                        pageSize: pageSize
                    }
                },
                listarInativos,
                cliente,
                fornecedor,
                setLoading,
                _searchTerm ?? searchTerm
            );
            setListPaginationClientesFornecedores(clientesFornecedores);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao Cliente ou Fornecedor '
            });
        } finally {
            setLoading(false);
        }
    };
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        const selectedPage = event.page;
        setListPaginationClientesFornecedores((prev) => ({
            ...prev,
            pageable: {
                ...prev.pageable,
                pageNumber: selectedPage
            }
        }));
        handleListClientesFornecedores(selectedPage, searchTerm, selectedClienteFornecedor, listarInativos);
    };
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };
    const handleClienteFornecedorChange = (e: DropdownChangeEvent) => {
        setDraftClienteFornecedor(e.value);
    };
    const syncDraftFilters = () => {
        setDraftClienteFornecedor(selectedClienteFornecedor);
        setListarInativos(listarInativos);
    };
    const handleClearFilters = () => {
        setSelectedClienteFornecedor(defaultClienteFornecedorFilter);
        setDraftClienteFornecedor(defaultClienteFornecedorFilter);
        setListarInativos(false);
        handleListClientesFornecedores(0, searchTerm, defaultClienteFornecedorFilter, false);
        setVisible(false);
    };
    const handleApplyFilters = () => {
        const firstPage = 0;
        setSelectedClienteFornecedor(draftClienteFornecedor);
        setListarInativos(listarInativos);
        handleListClientesFornecedores(firstPage, searchTerm, draftClienteFornecedor, listarInativos);
        setVisible(false);
    };
    useEffect(() => {
        handleListClientesFornecedores();
    }, []);
    return (
        <div className="w-full">
            <Messages ref={msgs} className="custom-messages" />
            {isMobile && (
                <>
                    <div className="card styled-container-main-all-routes p-2">
                        <div className="grid formgrid p-2">
                            <div className="col-8 mb-0 lg:col-6 lg:mb-0 p-0">
                                <Input
                                    label="Pesquisar Razão Social/CNPJ"
                                    outlined={true}
                                    id="razao_social"
                                    useRightButton={true}
                                    iconRight={'pi pi-search'}
                                    onChange={handleSearchChange}
                                    value={searchTerm}
                                    loading={loading}
                                    onClickSearch={() => searchNow(searchTerm)}
                                    topLabel="Pesquisar:"
                                    showTopLabel
                                />
                            </div>
                            <div className="col-4 mb-0 lg:col-3 lg:mb-0">
                                <div className="container-BTN-Filter-Created">
                                    <FilterOverlay
                                        onOpen={syncDraftFilters}
                                        onApply={handleApplyFilters}
                                        onClear={handleClearFilters}
                                        buttonClassName="height-2-8rem-ml-1rem-mobile">
                                        <Dropdown
                                            value={draftClienteFornecedor}
                                            options={DropDownFilterClienteFornecedor}
                                            onChange={handleClienteFornecedorChange}
                                            placeholder="Selecione o tipo"
                                            topLabel="Cliente ou Fornecedor:"
                                            showTopLabel
                                            label={''}
                                        />
                                        <CheckBoxField
                                            inputId="listarInativos"
                                            label="Listar Desativadas"
                                            checked={listarInativos}
                                            onChange={handleCheckboxChange}
                                        />
                                    </FilterOverlay>
                                    {permissaoPessoa.create && (
                                        <Button icon="pi pi-plus" className="ml-1rem" onClick={handleNavigate} />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <ListarPessoa
                                loading={loading}
                                listPaginationClientesFornecedores={listPaginationClientesFornecedores}
                                deletar={(id) => deletarPessoa(id, msgs, listPaginationClientesFornecedores, listarInativos, cliente, fornecedor, setLoading, searchTerm)}
                                ativar={(id) => ativarPessoa(id, msgs, listPaginationClientesFornecedores, listarInativos, cliente, fornecedor, setLoading, searchTerm)}
                                setLoading={setLoading}
                                searchTerm={searchTerm}
                                listarInativos={listarInativos}
                                cliente={cliente}
                                fornecedor={fornecedor}
                                setListPaginationClientesFornecedores={function (value: any): void {
                                    throw new Error('Function not implemented.');
                                }}
                            />
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <div className="custom-paginator">
                                <CustomPaginator
                                    first={listPaginationClientesFornecedores.pageable.pageNumber * listPaginationClientesFornecedores.pageable.pageSize}
                                    rows={pageSize}
                                    totalRecords={listPaginationClientesFornecedores.totalElements}
                                    onPageChange={onPageChange}
                                    isMobile
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
            {isDesktop && (
                <>
                    <div className="card styled-container-main-all-routes p-2">
                        <div className="scrollable-container">
                            <div className="p-0">
                                <div className="grid formgrid">
                                    <div className="col-12 lg:col-12 container-input-search-all">
                                        <Input
                                            label="Pesquisar Razão Social/CNPJ"
                                            outlined={true}
                                            id="razao_social"
                                            useRightButton={true}
                                            iconRight={'pi pi-search'}
                                            onChange={handleSearchChange}
                                            value={searchTerm}
                                            loading={loading}
                                            onClickSearch={() => searchNow(searchTerm)}
                                            topLabel="Pesquisar:"
                                            showTopLabel
                                        />
                                    </div>
                                    <div className="Container-Btn-Filter-Desktop">
                                        <FilterOverlay onOpen={syncDraftFilters}
                                            onApply={handleApplyFilters}
                                            onClear={handleClearFilters}
                                            buttonClassName="Btn-Filter-Desktop">
                                            <div className="grid formgrid">
                                                <div className="col-12 lg:col-12 ">
                                                    <Dropdown
                                                        value={draftClienteFornecedor}
                                                        options={DropDownFilterClienteFornecedor}
                                                        onChange={handleClienteFornecedorChange}
                                                        placeholder="Selecione o tipo"
                                                        topLabel="Cliente ou Fornecedor:"
                                                        showTopLabel
                                                        label={''}
                                                    />
                                                    <CheckBoxField
                                                        inputId="listarInativos"
                                                        label="Listar Desativadas"
                                                        checked={listarInativos}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                </div>
                                            </div>
                                        </FilterOverlay>
                                    </div>
                                    {permissaoPessoa.create && (
                                        <div className="container-button-primary-novo">
                                            <Button icon="pi pi-plus" label="Novo" onClick={handleNavigate} className="p-button-primary-novo" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <ListarPessoa
                                        loading={loading}
                                        listPaginationClientesFornecedores={listPaginationClientesFornecedores}
                                        deletar={(id) => deletarPessoa(id, msgs, listPaginationClientesFornecedores, listarInativos, cliente, fornecedor, setLoading, searchTerm)}
                                        ativar={(id) => ativarPessoa(id, msgs, listPaginationClientesFornecedores, listarInativos, cliente, fornecedor, setLoading, searchTerm)}
                                        setLoading={setLoading}
                                        searchTerm={searchTerm}
                                        listarInativos={listarInativos}
                                        cliente={cliente}
                                        fornecedor={fornecedor}
                                        setListPaginationClientesFornecedores={function (value: any): void {
                                            throw new Error('Function not implemented.');
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-2" style={{ marginTop: 'auto' }}>
                            <CustomPaginator
                                first={listPaginationClientesFornecedores.pageable.pageNumber * listPaginationClientesFornecedores.pageable.pageSize}
                                rows={pageSize}
                                totalRecords={listPaginationClientesFornecedores.totalElements}
                                onPageChange={onPageChange}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
export default ClientesFornecedores;
