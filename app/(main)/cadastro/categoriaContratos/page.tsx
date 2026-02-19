'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import Input from '@/app/shared/include/input/input-all';
import ListarCategoriaContrato from './listCategory/list';
import { useTheme } from '@/app/components/isDarkMode/isDarkMode';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { validateFieldsCategoriaContrato } from './controller/validate';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { CategoryContratosEntity } from '@/app/entity/CategoryContratEntity';
import { CreatedDialog } from '@/app/components/dialogs/dialogCreatedComponent/dialog';
import DialogFilter from '@/app/components/dialogs/dialogFilterComponents/dialogFilter';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { ativarCategoriaContrato, deletarCategoriaContrato, listCategoriaContrato } from './controller/controller';
import CategoriaContratoForm, { CategoriaContratoFormRef } from '@/app/components/pages/CategoriaContratos/categoriaContratosForm';

const CategoriaContrato: React.FC = () => {
    const pageSize = usePageSize();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const toast = useRef<Toast>(null);
    const { isDarkMode } = useTheme();
    const msgs = useRef<Messages | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const formRef = useRef<CategoriaContratoFormRef>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [listarInativos, setListarInativos] = useState<boolean>(false);
    const [reloadKeyCategoriaContrato, setReloadKeyCategoriaContrato] = useState(0);
    const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
    const [selectedCategoriaId, setSelectedCategoriaId] = useState<string | null>(null);
    const [showModalCategoriaContrato, setShowModalCategoriaContrato] = useState(false);
    const [selectedCategoriaContrato, setSelectedCategoriaContrato] = useState<CategoryContratosEntity | null>(null);
    const [categoriaContrato, setCategoriaContrato] = useState<CategoryContratosEntity>(
        new CategoryContratosEntity({
            id: 0,
            descricao: '',
            observacoes: '',
            ativo: true
        })
    );
    const [listPaginationCategoriaContrato, setListPaginationCategoriaContrato] = useState<Record<string, any>>({
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
    const handleCategoriaContratoSaved = async (created: CategoryContratosEntity) => {
        setShowModalCategoriaContrato(false);
        setSelectedCategoriaContrato(created);
        setReloadKeyCategoriaContrato((k) => k + 1);
        await handleListCategoriaContrato(0, searchTerm, listarInativos);
    };
    const handleCategoriaContrato = (updatedCategoriaContrato: CategoryContratosEntity) => {
        setCategoriaContrato(updatedCategoriaContrato);
    };
    const handleListCategoriaContrato = async (pageNumber?: number, _searchTerm?: string, listarInativos = false) => {
        setLoading(true);
        try {
            const categoriaContratos = await listCategoriaContrato(
                {
                    ...listPaginationCategoriaContrato,
                    pageable: {
                        ...listPaginationCategoriaContrato.pageable,
                        pageNumber: pageNumber ?? listPaginationCategoriaContrato.pageable.pageNumber,
                        pageSize: pageSize
                    }
                },
                listarInativos,
                setLoading,
                _searchTerm ?? searchTerm
            );
            setListPaginationCategoriaContrato(categoriaContratos);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao buscar Categoria Contrato ',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };
    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setCategoriaContrato,
        field: 'descricao',
        onSearch: (value) => handleListCategoriaContrato(0, value, listarInativos)
    });
    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        const newValue = e.checked ?? false;
        setListarInativos(newValue);
        handleListCategoriaContrato(0, searchTerm, newValue);
        setVisible(false);
    };
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        const selectedPage = event.page;
        setListPaginationCategoriaContrato((prev) => ({
            ...prev,
            pageable: {
                ...prev.pageable,
                pageNumber: selectedPage
            }
        }));
        handleListCategoriaContrato(selectedPage, searchTerm, listarInativos);
    };
    const handleErrorsChange = (updatedErrors: Record<string, string>) => {
        setErrors(updatedErrors);
    };
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };
    const handleNavigate = () => {
        setSelectedCategoriaId(null);
        setCategoriaContrato(
            new CategoryContratosEntity({
                id: 0,
                descricao: '',
                observacoes: '',
                ativo: true
            })
        );
        setShowModalCategoriaContrato(true);
    };
    const handleCheckboxChangeMobile = (e: CheckboxChangeEvent) => {
        setListarInativos(e.checked ?? false);
    };
    const handleEditCategoria = (categoria: CategoryContratosEntity) => {
        setSelectedCategoriaId(String(categoria.id));
        setCategoriaContrato(categoria);
        setShowModalCategoriaContrato(true);
    };
    const handleSalvarFiltro = () => {
        handleListCategoriaContrato(0, searchTerm, listarInativos);
        setVisible(false);
    };
    const handleCancelarFiltro = () => {
        setVisible(false);
    };
    useEffect(() => {
        handleListCategoriaContrato();
    }, []);
    useEffect(() => {
        if (Object.values(touchedFields).some((touched) => touched)) {
            validateFieldsCategoriaContrato(categoriaContrato, setErrors, msgs);
        }
    }, [categoriaContrato]);
    return (
        <div className="w-full">
                <Messages ref={msgs} className="custom-messages" />

            {isMobile && (
                <>
                    <div className="card styled-container-main-all-routes p-2">
                        <div className="scrollable-container">
                            <div className="grid formgrid p-0">
                                <div className="col-12 mb-0 lg:col-6 lg:mb-0 p-0 ">
                                    <Input
                                        label="Buscar "
                                        outlined={true}
                                        id="descricao"
                                        useRightButton={true}
                                        iconRight={'pi pi-search'}
                                        onChange={handleSearchChange}
                                        value={searchTerm}
                                        loading={loading}
                                        onClickSearch={() => searchNow(searchTerm)}
                                        topLabel="Categoria:"
                                        showTopLabel
                                    />
                                </div>
                                <div className="col-4 mb-0 lg:col-3 lg:mb-0 p-0 ">
                                    <div className="container-BTN-Filter-Created mt-2">
                                        <Button className="height-2-8rem-ml-1rem" icon="pi pi-filter" onClick={() => setVisible(true)} outlined />
                                        <Button icon="pi pi-plus" className="ml-1rem" onClick={handleNavigate} />
                                    </div>
                                </div>
                            </div>
                            <DialogFilter visible={visible} header="Filtro" onHide={() => setVisible(false)} onSave={handleSalvarFiltro} onCancel={handleCancelarFiltro}>
                                <div className="checkBox-width-max-10rem">
                                    <div className="checkbox-container">
                                        <Checkbox inputId="listarInativos" onChange={handleCheckboxChangeMobile} checked={listarInativos} />
                                        <label htmlFor="listarInativos" className="ml-2">
                                            Listar Desativadas
                                        </label>
                                    </div>
                                </div>
                            </DialogFilter>
                        </div>
                        <div>
                            <ListarCategoriaContrato
                                loading={loading}
                                listPaginationCategoriaContrato={listPaginationCategoriaContrato}
                                deletar={(id) => deletarCategoriaContrato(id, msgs, listPaginationCategoriaContrato, listarInativos, setLoading, searchTerm)}
                                ativar={(id) => ativarCategoriaContrato(id, msgs, listPaginationCategoriaContrato, listarInativos, setLoading, searchTerm)}
                                setLoading={setLoading}
                                searchTerm={searchTerm}
                                setListPaginationCategoriaContrato={setListPaginationCategoriaContrato}
                                listarInativos={listarInativos}
                                onCategoriaClick={handleEditCategoria}
                            />
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <div className="custom-paginator">
                                <Paginator
                                    first={listPaginationCategoriaContrato.pageable.pageNumber * listPaginationCategoriaContrato.pageable.pageSize}
                                    rows={pageSize}
                                    totalRecords={listPaginationCategoriaContrato.totalElements}
                                    onPageChange={onPageChange}
                                    template={{
                                        layout: 'PrevPageLink CurrentPageReport NextPageLink',
                                        CurrentPageReport: (options) => {
                                            const pageNumber = Math.floor(options.first / options.rows) + 1;
                                            return (
                                                <span>
                                                    Página {pageNumber} de {options.totalPages}
                                                </span>
                                            );
                                        }
                                    }}
                                    style={{ background: isDarkMode ? '#162A41' : '#EFF3F8' }}
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
                                    <div className="col-12 lg:col-3 container-input-search-all" >
                                        <Input
                                            label="Buscar"
                                            outlined={true}
                                            id="descricao"
                                            useRightButton={true}
                                            iconRight={'pi pi-search'}
                                            onChange={handleSearchChange}
                                            value={searchTerm}
                                            loading={loading}
                                            onClickSearch={() => searchNow(searchTerm)}
                                            topLabel="Categoria:"
                                            showTopLabel
                                        />
                                    </div>
                                    <div className="checkbox-container">
                                        <Checkbox inputId="listarInativos" onChange={handleCheckboxChange} checked={listarInativos} />
                                        <label htmlFor="listarInativos" className="ml-2">
                                            Listar Desativadas
                                        </label>
                                    </div>
                                    <div className="container-button-primary-novo">
                                        <Button icon="pi pi-plus" label="Novo" onClick={handleNavigate} className="p-button-primary-novo" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2">
                                <ListarCategoriaContrato
                                    loading={loading}
                                    listPaginationCategoriaContrato={listPaginationCategoriaContrato}
                                    deletar={(id) => deletarCategoriaContrato(id, msgs, listPaginationCategoriaContrato, listarInativos, setLoading, searchTerm)}
                                    ativar={(id) => ativarCategoriaContrato(id, msgs, listPaginationCategoriaContrato, listarInativos, setLoading, searchTerm)}
                                    setLoading={setLoading}
                                    searchTerm={searchTerm}
                                    setListPaginationCategoriaContrato={setListPaginationCategoriaContrato}
                                    listarInativos={listarInativos}
                                    onCategoriaClick={handleEditCategoria}
                                />
                            </div>
                        </div>
                        <div className="p-2" style={{ marginTop: 'auto' }}>
                            <Paginator
                                first={listPaginationCategoriaContrato.pageable.pageNumber * listPaginationCategoriaContrato.pageable.pageSize}
                                rows={pageSize}
                                totalRecords={listPaginationCategoriaContrato.totalElements}
                                onPageChange={onPageChange}
                            />
                        </div>
                    </div>
                </>
            )}
            <CreatedDialog
                header={selectedCategoriaId ? 'Editar Categoria de Contrato' : 'Adicionar Categoria de Contratos'}
                visible={showModalCategoriaContrato}
                onHide={() => {
                    setShowModalCategoriaContrato(false);
                    setSelectedCategoriaId(null);
                }}
                style={{ height: 'auto' }}
                breakpoints={{
                    '960px': '75vw',
                    '640px': '95vw'
                }}
            >
                <CategoriaContratoForm
                    ref={formRef}
                    msgs={msgs}
                    initialId={selectedCategoriaId}
                    setCategoriaContrato={setCategoriaContrato}
                    onCategoriaContratoChange={handleCategoriaContrato}
                    onErrorsChange={handleErrorsChange}
                    redirectAfterSave={false}
                    onSaved={handleCategoriaContratoSaved}
                    onClose={() => setShowModalCategoriaContrato(false)}
                    showBTNPGCreatedDialog
                    onBackClick={() => setShowModalCategoriaContrato(false)}
                    categoriaContrato={categoriaContrato}
                />
            </CreatedDialog>
        </div>
    );
};

export default CategoriaContrato;
