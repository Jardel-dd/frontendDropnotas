'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { usePermissions } from '@/app/routes/permissoes';
import Input from '@/app/shared/include/input/input-all';
import { CheckboxChangeEvent } from 'primereact/checkbox';
import FormCategoriaContratoCreated from './form/controller';
import { PaginatorPageChangeEvent } from 'primereact/paginator';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { CategoriaContratoFormRef } from './types/categoriaContratos';
import { validateFieldsCategoriaContrato } from './controller/validate';
import ListarCategoriaContrato from './tabela/categoriaContratoListagem';
import CustomPaginator from '@/app/components/paginator/customPaginator';
import CheckBoxField from '@/app/components/CheckBoxField/checkBoxField';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { CategoryContratosEntity } from '@/app/entity/CategoryContratEntity';
import DialogFilter from '@/app/components/dialogs/dialogFilterComponents/dialogFilter';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { FilterOverlay } from '@/app/components/buttonsComponent/btn-FilterComponent/Btn-Filter';
import { ativarCategoriaContrato, deletarCategoriaContrato, listCategoriaContrato } from './controller/controller';

const CategoriaContrato: React.FC = () => {
    const pageSize = usePageSize();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { permissaoCategoriaContrato } = usePermissions();
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
                summary: 'Atenção:',
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
    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        setListarInativos(e.checked ?? false);
    };
    const handleEditCategoria = (categoria: CategoryContratosEntity) => {
        setSelectedCategoriaId(String(categoria.id));
        setCategoriaContrato(categoria);
        setShowModalCategoriaContrato(true);
    };
    const handleClearFilters = () => {
        setListarInativos(false);
        handleListCategoriaContrato(0,'' , false);
        setVisible(false);
    };
    const handleApplyFilters = () => {
        handleListCategoriaContrato(0, searchTerm, listarInativos);
        setVisible(false);
    };
    const handleSalvarFiltro = () => {
        handleListCategoriaContrato(0, searchTerm, listarInativos);
        setVisible(false);
    };
    useEffect(() => {
        handleListCategoriaContrato();
    }, []);
    useEffect(() => {
        if (Object.values(touchedFields).some((touched) => touched)) {
            validateFieldsCategoriaContrato(categoriaContrato, setErrors, msgs);
        }
    }, [categoriaContrato, touchedFields, msgs]);
    return (
        <div className="w-full">
            <Messages ref={msgs} className="custom-messages" />

            {isMobile && (
                <>
                    <div className="card styled-container-main-all-routes p-2">
                        <div className="grid formgrid p-2" >
                            <div className="col-8 mb-0 lg:col-6 lg:mb-0 p-0">
                                <Input
                                    label="Pesquisar Descrição "
                                    outlined={true}
                                    id="descricao"
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
                                <div className="container-BTN-Filter-Created ">
                                    <FilterOverlay
                                        onApply={handleApplyFilters}
                                        onClear={handleClearFilters}
                                        buttonClassName="height-2-8rem-ml-1rem-mobile">
                                        <CheckBoxField
                                            inputId="listarInativos"
                                            label="Listar Desativadas"
                                            checked={listarInativos}
                                            onChange={handleCheckboxChange}
                                        />

                                    </FilterOverlay>
                                    {permissaoCategoriaContrato.create && (
                                        <Button icon="pi pi-plus" className="ml-1rem" onClick={handleNavigate} />
                                    )}
                                </div>
                            </div>
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
                                <CustomPaginator
                                    first={listPaginationCategoriaContrato.pageable.pageNumber * listPaginationCategoriaContrato.pageable.pageSize}
                                    rows={pageSize}
                                    totalRecords={listPaginationCategoriaContrato.totalElements}
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
                                    <div className="col-12 lg:col-3 container-input-search-all" >
                                        <Input
                                            label="Pesquisar Descrição"
                                            outlined={true}
                                            id="descricao"
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
                                        <FilterOverlay
                                            onApply={handleSalvarFiltro}
                                            onClear={handleClearFilters}
                                            buttonClassName="Btn-Filter-Desktop">
                                            <CheckBoxField
                                                inputId="listarInativos"
                                                label="Listar Desativadas"
                                                checked={listarInativos}
                                                onChange={handleCheckboxChange}
                                            />
                                        </FilterOverlay>
                                    </div>
                                    <div className="container-button-primary-novo">
                                        {permissaoCategoriaContrato.create && (
                                            <Button icon="pi pi-plus" label="Novo" onClick={handleNavigate} className="p-button-primary-novo" />
                                        )}
                                    </div>
                                </div>
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
                        </div>
                        <div className="p-2" style={{ marginTop: 'auto' }}>
                            <CustomPaginator
                                first={listPaginationCategoriaContrato.pageable.pageNumber * listPaginationCategoriaContrato.pageable.pageSize}
                                rows={pageSize}
                                totalRecords={listPaginationCategoriaContrato.totalElements}
                                onPageChange={onPageChange}
                            />
                        </div>
                    </div>
                </>
            )}
            <DialogFilter
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
                <FormCategoriaContratoCreated
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
            </DialogFilter>
        </div>
    );
};
export default CategoriaContrato;



