'use client';
import './style.css';
import '@/app/styles/styledGlobal.css';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { FileUpload } from 'primereact/fileupload';
import IconVisible from '@/app/shared/IconVisible';
import { getCitiesFromState } from '@/app/entity/maps';
import Input from '@/app/shared/include/input/input-all';
import { IconPorcentagem } from '@/app/utils/icons/icons';
import type { EmpresaFieldsProps } from '../types/empresa';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { TableCNAEEntity } from '@/app/entity/TableCNAEEntity';
import { Mandatory } from '@/app/shared/mandatory/InputMandatory';
import { InputMaskDrop } from '@/app/shared/include/inputMask/input';
import CustomMultiSelect from '@/app/shared/include/multSelect/Input';
import { CustomInputNumber } from '@/app/shared/include/inputReal/inputReal';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import EnderecoForm from '@/app/components/enderecos/enderecoFormComponent/enderecoForm';
import { fetchAllCnae, fetchFilteredCnae } from '@/app/components/fetchAll/listAllCnae/controller';
import { incentivoFiscal, prestacaoSus, regimeEspecialTributarioOptionsCompany, regimeTributarioOptions, tipo_rps } from '@/app/shared/optionsDropDown/options';
import { fetchFilteredUserConta, fetchUserConta } from '@/app/(main)/cadastro/usuarios/controller/controller';
import { TabPanel, TabView } from 'primereact/tabview';

export type { EmpresaFieldsProps, EmpresaFormProps, EmpresaFormRef } from '../types/empresa';

export function EmpresaFields({
    empresa,
    empresaId,
    errors,
    loadingCnpj,
    loadingCep,
    loadingFileUpload,
    isMobile,
    isDesktop,
    isDarkMode,
    isPasswordVisible,
    isCertificatePasswordRequired,
    selectedCNAE,
    userConta,
    selectedUserConta,
    toastRef,
    fileUploadRef,
    fileInputRef,
    onChange,
    onDropdownChange,
    onDropdownChangeEndereco,
    onNumberChange,
    onUserChange,
    onOpenUserContaModal,
    onEditUserConta,
    onCNAEChange,
    onSearchCnpj,
    onValidateCnpj,
    onLogoChange,
    onDeleteLogo,
    onRemoveFile,
    onFileChangeCertificado,
    onClearCertificado,
    onTogglePasswordVisibility,
    onCepSearch
}: EmpresaFieldsProps) {
    const invalidTabMessage = 'Verifique este menu, possui campos obrigatorios nao preenchidos';
    const currentErrors = errors ?? {};
    const hasAnyTabError = (keys: string[]) => keys.some((key) => Boolean(currentErrors[key]));
    const hasEmpresaErrors = hasAnyTabError([
        'cnpj',
        'razao_social',
        'nome_fantasia',
        'atividade_principal',
        'inscricao_estadual',
        'inscricao_municipal',
        'selectedRegime',
        'cep',
        'logradouro',
        'numero',
        'bairro',
        'uf',
        'municipio',
        'codigo_municipio',
        'codigo_pais',
        'telefone'
    ]);
    const hasNotaFiscalErrors = hasAnyTabError([
        'serie_emissao_nfse',
        'proximo_numero_rps',
        'proximo_numero_lote',
        'tipo_rps',
        'aliquota_iss',
        'aliquota_pis',
        'aliquota_cofins',
        'aliquota_inss',
        'aliquota_ir',
        'aliquota_csll',
        'aliquota_outras_retencoes',
        'aliquota_deducoes',
        'percentual_desconto_incondicionado',
        'percentual_desconto_condicionado',
        'cnae_fiscal',
        'prestacao_sus',
        'regime_especial_tributacao',
        'incentivo_fiscal'
    ]);
    const hasAcessoErrors = hasAnyTabError(['selectedUserConta']);
    const hasWebServiceErrors = hasAnyTabError([
        'webservice_usuario',
        'webservice_senha',
        'webservice_chaveacesso'
    ]);
    const hasUploadedCertificate = Boolean(empresa.certificado_digital || empresa.nome_certificado_digital);
    const hasCertDigitalErrors = hasAnyTabError([
        'certificado_digital',
        'senha_certificado_digital'
    ]);
    return (
        <div className="scrollable-container shared-form-content">
            <TabView className={`shared-form-tabs ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                <TabPanel
                    header={
                        <span className="shared-form-tab-label">
                            Empresa
                            {hasEmpresaErrors && <i className="pi pi-exclamation-circle shared-form-tab-alert" title={invalidTabMessage} aria-label={invalidTabMessage} />}
                        </span>
                    }
                >
                    <div className="custom-flex-row">
                        <div className="w-full">
                            {isMobile && (
                                <div style={{ display: 'flex', alignContent: 'center', alignItems: 'center', padding: '1rem' }}>
                                    <div className="image-upload-containerMobile">
                                        {empresa.logo_empresa ? (
                                            <>
                                                <img src={empresa.logo_empresa} alt="Uploaded" className="img-cover" />
                                                <Button icon="pi pi-trash" rounded text severity="danger" aria-label="Delete" onClick={onDeleteLogo} className="button-Imagem-Logo-top-right" />
                                            </>
                                        ) : (
                                            <>
                                                <Button icon="pi pi-upload" rounded text severity="success" aria-label="Search" onClick={() => fileInputRef.current?.click()} className="button-Imagem-Logo-top-right" />
                                                <div className="flex-Img-Logo-center">
                                                    <i className="pi pi-images image-icon"></i>
                                                </div>
                                            </>
                                        )}
                                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onLogoChange} />
                                    </div>
                                </div>
                            )}
                            <div className="grid formgrid">
                                <div className="col-12 lg:col-4 ">
                                    <InputMaskDrop
                                        id="cnpj"
                                        value={empresa.cnpj || ''}
                                        onChange={(e) => {
                                            onChange({
                                                target: {
                                                    id: e.target.id!,
                                                    value: e.value,
                                                    type: 'text'
                                                }
                                            });
                                        }}
                                        onClickSearch={onSearchCnpj}
                                        placeholder="99.999.999/9999-99"
                                        mask="99.999.999/9999-99"
                                        iconRight="pi pi-search"
                                        outlined={false}
                                        useRightButton
                                        hasError={!!errors.cnpj}
                                        errorMessage={errors.cnpj}
                                        disabledRightButton={(empresa.cnpj || '').replace(/\D/g, '').length !== 14}
                                        loading={loadingCnpj}
                                        onBlur={onValidateCnpj}
                                        autoFocus
                                        topLabel="CNPJ:"
                                        showTopLabel
                                        required
                                    />
                                </div>
                                <div className="col-12  lg:col-8  ">
                                    <Input value={empresa.razao_social || ''} onChange={onChange} label="Razão Social" id="razao_social" hasError={!!errors.razao_social} errorMessage={errors.razao_social} topLabel="Razão Social:" showTopLabel required />
                                </div>
                                <div className="col-12  lg:col-6  ">
                                    <Input value={empresa.nome_fantasia || ''} onChange={onChange} label="Nome Fantasia" id="nome_fantasia" hasError={!!errors.nome_fantasia} errorMessage={errors.nome_fantasia} topLabel="Nome Fantasia:" showTopLabel required />
                                </div>
                                <div className="col-12  lg:col-6 ">
                                    <Input value={empresa.atividade_principal || ''} onChange={onChange} label="Atividade Principal" id="atividade_principal" hasError={!!errors.atividade_principal} errorMessage={errors.atividade_principal} topLabel="Atividade Principal:" showTopLabel required />
                                </div>
                                <div className="col-12  lg:col-4 ">
                                    <div className="p-field">
                                        <Input value={empresa.inscricao_estadual || ''} onChange={onChange} label="Inscrição Estadual" id="inscricao_estadual" type="number" hasError={!!errors.inscricao_estadual} errorMessage={errors.inscricao_estadual} topLabel="Inscrição Estadual:" showTopLabel />
                                    </div>
                                </div>
                                <div className="col-12 lg:col-4">
                                    <Input value={empresa.inscricao_municipal || ''} onChange={onChange} label="Inscrição Municipal" id="inscricao_municipal" type="number" hasError={!!errors.inscricao_municipal} errorMessage={errors.inscricao_municipal} topLabel="Inscrição Municipal:" showTopLabel required />
                                </div>
                                <div className="col-12  lg:col-4">
                                    <div className="p-field">
                                        <Dropdown id="codigo_regime_tributario" value={empresa.codigo_regime_tributario ?? ''} options={regimeTributarioOptions} onChange={onDropdownChange} label="Selecione um Regime Tributário" hasError={!!errors.selectedRegime} errorMessage={errors.selectedRegime} topLabel="Código Regime Tributário:" showTopLabel required />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isDesktop && (
                            <div className="image-upload-containerDeskTop">
                                {empresa.logo_empresa ? (
                                    <>
                                        <img src={empresa.logo_empresa} alt="Logo da Empresa" className="img-cover" style={{ borderRadius: '7px' }} />
                                        <Button icon="pi pi-trash" rounded text severity="danger" aria-label="Delete" onClick={onDeleteLogo} className="button-Imagem-Logo-top-right" />
                                    </>
                                ) : (
                                    <>
                                        <Button icon="pi pi-upload" rounded text severity="success" aria-label="Search" onClick={() => fileInputRef.current?.click()} className="button-Imagem-Logo-top-right" />
                                        <div className="flex-Img-Logo-center">
                                            <i className="pi pi-images image-icon"></i>
                                        </div>
                                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onLogoChange} />
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <EnderecoForm
                        endereco={empresa.endereco}
                        telefone={empresa.telefone}
                        telefoneObrigatorio
                        errors={errors}
                        onChange={onChange}
                        onCepSearch={onCepSearch}
                        onDropdownChange={onDropdownChange}
                        onDropdownChangeEndereco={onDropdownChangeEndereco}
                        getCitiesFromState={getCitiesFromState}
                        loadingCep={loadingCep} />

                </TabPanel>
                <TabPanel
                    header={
                        <span className="shared-form-tab-label">
                            Acesso a Empresa
                            {hasAcessoErrors && <i className="pi pi-exclamation-circle shared-form-tab-alert" title={invalidTabMessage} aria-label={invalidTabMessage} />}
                        </span>
                    }
                >
                    <div className="grid formgrid">
                        <div className="col-12 mb-1 lg:col-5 lg:mb-0">
                            <div className="p-field">
                                <CustomMultiSelect
                                    id=""
                                    selectedItems={selectedUserConta}
                                    onChange={onUserChange}
                                    fetchAllItems={fetchUserConta}
                                    fetchFilteredItems={fetchFilteredUserConta}
                                    options={userConta}
                                    hasError={!!errors.selectedUserConta}
                                    errorMessage={errors.selectedUserConta}
                                    optionLabel="nome"
                                    dataKey="id"
                                    showAddButton
                                    onAddClick={onOpenUserContaModal}
                                    onEditClick={onEditUserConta}
                                    initialSelectedValues={empresa.id_usuarios_acesso ?? []}
                                    placeholder="Selecione os Usuários" showChips
                                    topLabel="Usuários:"
                                    showTopLabel
                                    required
                                    autoLoadAndSelectSingle

                                />
                            </div>
                        </div>
                    </div>

                </TabPanel>
                <TabPanel
                    header={
                        <span className="shared-form-tab-label">
                            Configuração Nota Fiscal
                            {hasNotaFiscalErrors && <i className="pi pi-exclamation-circle shared-form-tab-alert" title={invalidTabMessage} aria-label={invalidTabMessage} />}
                        </span>
                    }
                >
                    <div className="grid formgrid">
                        <div className="col-12 lg:col-3 ">
                            <Input value={empresa.serie_emissao_nfse ?? ''} onChange={onChange} label="Série" id="serie_emissao_nfse" hasError={!!errors.serie_emissao_nfse} errorMessage={errors.serie_emissao_nfse} topLabel="Série:" showTopLabel required />
                        </div>
                        <div className="col-12  lg:col-3 ">
                            <Input value={String(empresa.proximo_numero_rps ?? '')} onChange={onChange} label="Número RPS" id="proximo_numero_rps" hasError={!!errors.proximo_numero_rps} errorMessage={errors.proximo_numero_rps} topLabel="Próximo número RPS:" showTopLabel required />
                        </div>
                        <div className="col-12  lg:col-3 ">
                            <Input value={String(empresa.proximo_numero_lote ?? '')} onChange={onChange} label="Próximo número do lote na NFSe" id="proximo_numero_lote" hasError={!!errors.proximo_numero_lote} errorMessage={errors.proximo_numero_lote} topLabel="Próximo número lote NFSe:" showTopLabel required />
                        </div>
                        <div className="col-12  lg:col-3 ">
                            <Dropdown id="tipo_rps" value={empresa.tipo_rps ?? ''} options={tipo_rps} onChange={onDropdownChange} label="Selecione o Tipo de RPS" hasError={!!errors.tipo_rps} errorMessage={errors.tipo_rps} topLabel="Tipo de RPS:" showTopLabel required />
                        </div>
                        <div className="col-12  lg:col-3 ">
                            <Input value={empresa.aliquota_iss?.toString() ?? 0} onChange={onChange} label="Alíquota ISS" id="aliquota_iss" type="number" hasError={!!errors.aliquota_iss} errorMessage={errors.aliquota_iss} topLabel="Alíquota ISS:" showTopLabel required iconLeft={<IconPorcentagem isDarkMode={false} />} />
                        </div>
                        <div className="col-12  lg:col-3 ">
                            <CustomInputNumber id="aliquota_pis" value={empresa.aliquota_pis || 0} onChange={onNumberChange} label="Alíquota PIS" useRightButton outlined hasError={!!errors.aliquota_pis} errorMessage={errors.aliquota_pis} topLabel="Alíquota PIS:" showTopLabel required iconLeft={<IconPorcentagem isDarkMode={false} />} />
                        </div>
                        <div className="col-12  lg:col-3 ">
                            <CustomInputNumber id="aliquota_cofins" value={empresa.aliquota_cofins || 0} onChange={onNumberChange} label="Alíquota COFINS" useRightButton outlined hasError={!!errors.aliquota_cofins} errorMessage={errors.aliquota_cofins} topLabel="Alíquota COFINS:" showTopLabel required iconLeft={<IconPorcentagem isDarkMode={false} />} />
                        </div>
                        <div className="col-12  lg:col-3 ">
                            <CustomInputNumber id="aliquota_inss" value={empresa.aliquota_inss || ''} onChange={onNumberChange} label="Alíquota INSS" useRightButton outlined hasError={!!errors.aliquota_inss} errorMessage={errors.aliquota_inss} topLabel="Alíquota INSS:" showTopLabel required iconLeft={<IconPorcentagem isDarkMode={false} />} />
                        </div>
                        <div className="col-12  lg:col-3 ">
                            <CustomInputNumber id="aliquota_ir" value={empresa.aliquota_ir || 0} onChange={onNumberChange} label="Alíquota IR" useRightButton outlined hasError={!!errors.aliquota_ir} errorMessage={errors.aliquota_ir} topLabel="Alíquota IR:" showTopLabel required iconLeft={<IconPorcentagem isDarkMode={false} />} />
                        </div>
                        <div className="col-12  lg:col-3 ">
                            <CustomInputNumber id="aliquota_csll" value={empresa.aliquota_csll || 0} onChange={onNumberChange} label="Alíquota CSLL" useRightButton outlined hasError={!!errors.aliquota_csll} errorMessage={errors.aliquota_csll} topLabel="Alíquota CSLL:" showTopLabel required iconLeft={<IconPorcentagem isDarkMode={false} />} />
                        </div>
                        <div className="col-12  lg:col-3 ">
                            <Input id="aliquota_outras_retencoes" type="number" value={empresa.aliquota_outras_retencoes ?? 0} onChange={onChange} label="Outras Retenções" hasError={!!errors.aliquota_outras_retencoes} errorMessage={errors.aliquota_outras_retencoes} topLabel="Outras Retenções:" showTopLabel required iconLeft={<IconPorcentagem isDarkMode={false} />} />
                        </div>
                        <div className="col-12  lg:col-3 ">
                            <Input id="aliquota_deducoes" type="number" value={empresa.aliquota_deducoes ?? 0} onChange={onChange} label="Alíquota Deduções" hasError={!!errors.aliquota_deducoes} errorMessage={errors.aliquota_deducoes} topLabel="Alíquota Deduções:" showTopLabel required iconLeft={<IconPorcentagem isDarkMode={false} />} />
                        </div>
                        <div className="col-12  lg:col-3 ">
                            <Input id="percentual_desconto_incondicionado" type="number" value={empresa.percentual_desconto_incondicionado ?? 0} onChange={onChange} label="Desconto Incondicionado" hasError={!!errors.percentual_desconto_incondicionado} errorMessage={errors.percentual_desconto_incondicionado} topLabel="Desconto Incondicionado:" showTopLabel required iconLeft={<IconPorcentagem isDarkMode={false} />} />
                        </div>
                        <div className="col-12  lg:col-3 ">
                            <Input id="percentual_desconto_condicionado" type="number" value={empresa.percentual_desconto_condicionado ?? 0} onChange={onChange} label="Desconto Incondicionado" hasError={!!errors.percentual_desconto_condicionado} errorMessage={errors.percentual_desconto_condicionado} topLabel="Desconto Condicionado:" showTopLabel required iconLeft={<IconPorcentagem isDarkMode={false} />} />
                        </div>
                        <div className="col-12  lg:col-3 ">
                            <DropdownSearch<TableCNAEEntity>
                                id="cnae_fiscal"
                                selectedItem={selectedCNAE}
                                onItemChange={onCNAEChange}
                                fetchAllItems={fetchAllCnae}
                                fetchFilteredItems={fetchFilteredCnae}
                                optionLabel="descricao"
                                optionValue="codigo"
                                initialOptionValue={empresa.cnae_fiscal || null}
                                placeholder="Selecione CNAE"
                                hasError={!!errors.cnae_fiscal}
                                errorMessage={errors.cnae_fiscal}
                                topLabel="CNAE Fiscal:"
                                showTopLabel
                                required
                            />
                        </div>
                        <div className="col-12  lg:col-3 ">
                            <Dropdown id="prestacao_sus" value={empresa.prestacao_sus ?? null} options={prestacaoSus} onChange={onDropdownChange} label="Selecione a Prestação SUS" hasError={!!errors.prestacao_sus} errorMessage={errors.prestacao_sus} topLabel="Prestação SUS:" showTopLabel required />
                        </div>
                        <div className="col-12  lg:col-3 ">
                            <Dropdown id="regime_especial_tributacao" value={empresa.regime_especial_tributacao ?? ''} options={regimeEspecialTributarioOptionsCompany} onChange={onDropdownChange} label="Selecione um Regime Especial Tributário" hasError={!!errors.regime_especial_tributacao} errorMessage={errors.regime_especial_tributacao} topLabel="Regime Especial Tributário:" showTopLabel required />
                        </div>
                        <div className="col-12  lg:col-3 ">
                            <Dropdown id="incentivo_fiscal" value={empresa.incentivo_fiscal ?? null} options={incentivoFiscal} onChange={onDropdownChange} label="Selecione o incentivo fiscal" hasError={!!errors.incentivo_fiscal} errorMessage={errors.incentivo_fiscal} topLabel="Incentivo Fiscal:" showTopLabel required />
                        </div>
                    </div>
                </TabPanel>
                <TabPanel
                    header={
                        <span className="shared-form-tab-label">
                            Certificado Digital
                            {hasCertDigitalErrors && <i className="pi pi-exclamation-circle shared-form-tab-alert" title={invalidTabMessage} aria-label={invalidTabMessage} />}
                        </span>
                    }
                >
                    <div className="grid formgrid">
                        <div className="col-12 lg:col-4  mt-2">
                            <label className="filter-label">
                                Certificado Digital:
                                <Mandatory />
                            </label>
                            <Toast ref={toastRef}></Toast>
                            <div className="file-upload-container mt-1"
                                style={{ display: 'flex', alignItems: 'center' }}>
                                <FileUpload ref={fileUploadRef} name="file" url="./upload" id="certificado_digital" customUpload chooseLabel={empresa.nome_certificado_digital || 'Upload Certificado A1'} mode="basic" disabled={loadingFileUpload} accept=".pfx,.p12,.cer,.crt,.cert" onSelect={onFileChangeCertificado} onClear={onClearCertificado} className={`p-fileupload-basic w-full ${isDarkMode ? 'dark-mode' : 'light-mode'} ${errors.certificado_digital ? 'p-invalid' : ''}`} withCredentials={false} />
                                {hasUploadedCertificate && <Button icon="pi pi-trash" outlined severity="danger" aria-label="Cancel" onClick={onRemoveFile} style={{ width: '10%', marginLeft: '1rem' }} />}
                            </div>
                            {errors.certificado_digital && <small className="p-error">{errors.certificado_digital}</small>}
                        </div>
                        {hasUploadedCertificate && (
                            <>
                                <div className="col-12 lg:col-4 " style={{ marginTop: "2px" }}>
                                    <Input value={empresa.senha_certificado_digital || ''}
                                        onChange={onChange} label="Senha" id="senha_certificado_digital"
                                        type={isPasswordVisible ? 'text' : 'password'} useRightButton
                                        outlined iconLeft="pi pi-key" iconRight={<IconVisible isPasswordVisible={isPasswordVisible} />}
                                        onClick={onTogglePasswordVisibility} hasError={!!errors.senha_certificado_digital}
                                        errorMessage={errors.senha_certificado_digital}
                                        topLabel="Senha:"
                                        showTopLabel required={isCertificatePasswordRequired}
                                    />
                                </div>
                                {empresaId && (
                                    <>
                                <div className="col-12  lg:col-2 lg:mb-0">
                                    <Input value={empresa.data_vencimento_certificado_digital || ''} onChange={onChange} label="" id="data_vencimento_certificado_digital" useRightButton outlined readOnly topLabel="Data vencimento Certificado:" showTopLabel />
                                </div>
                                <div className="col-12 lg:col-2"style={{marginTop:25.5}}>
                                    <div className="flex align-items-center justify-content-between p-2 border-round-lg"
                                        style={{
                                            background: empresa.status_certificado_digital?.toUpperCase() === 'EXPIRADO'
                                                ? '#fff5f5'
                                                : '#f4fff6',
                                            border: `1px solid ${empresa.status_certificado_digital?.toUpperCase() === 'EXPIRADO'
                                                    ? '#f5c2c7'
                                                    : '#b7ebc6'
                                                }`,
                                            minHeight: '40px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                        }}
                                    >
                                        
                                        <div className="flex flex-column">
                                            <span
                                                style={{
                                                    fontSize: '0.85rem',
                                                    color: '#6b7280',
                                                    marginBottom: '0.25rem'
                                                }}
                                            >
                                                STATUS CERTIFICADO DIGITAL
                                            </span>
                                        </div>

                                        <Tag
                                            severity={
                                                empresa.status_certificado_digital?.toUpperCase() === 'EXPIRADO'
                                                    ? 'danger'
                                                    : 'success'
                                            }
                                            value={
                                                empresa.status_certificado_digital?.toUpperCase() === 'EXPIRADO'
                                                    ? 'Expirado'
                                                    : 'Ativo'
                                            }
                                            rounded
                                        />
                                    </div>
                                </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </TabPanel>
                <TabPanel
                    header={
                        <span className="shared-form-tab-label">
                            Login WebService
                            {hasWebServiceErrors && <i className="pi pi-exclamation-circle shared-form-tab-alert" title={invalidTabMessage} aria-label={invalidTabMessage} />}
                        </span>
                    }
                >
                    <div className="grid formgrid">
                        <div className="col-12 lg:col-4 ">
                            <InputMaskDrop
                                id="webservice_usuario"
                                value={empresa.webservice_usuario || ''}
                                onChange={(e) => {
                                    onChange({
                                        target: {
                                            id: e.target.id!,
                                            value: e.value,
                                            type: 'text'
                                        }
                                    });
                                }}
                                onClickSearch={async () => { }}
                                placeholder="99.999.999/9999-99"
                                mask="99.999.999/9999-99"
                                outlined={false}
                                topLabel="Usuário WebService:"
                                showTopLabel
                            />
                        </div>
                        <div className="col-12 lg:col-4   ">
                            <Input value={empresa.webservice_senha || ''} onChange={onChange} label="Senha" id="webservice_senha" type={isPasswordVisible ? 'text' : 'password'} useRightButton outlined iconLeft="pi pi-key" iconRight={<IconVisible isPasswordVisible={isPasswordVisible} />} onClick={onTogglePasswordVisibility} topLabel="Senha WebService:" showTopLabel />
                        </div>
                        <div className="col-12 lg:col-4  ">
                            <Input value={empresa.webservice_chaveacesso || ''} onChange={onChange} label="Digite a chave de acesso" id="webservice_chaveacesso" topLabel="Chave de acesso WebService :" showTopLabel />
                        </div>
                    </div>
                </TabPanel>
                <div className="mb-4 lg:mb-0 custom-container">
                    <Divider align="center" className="form-divider">
                        <span> Certificado Digital</span>
                    </Divider>
                    <Divider align="center" className="form-divider">
                        <span> Credenciais WebService </span>
                    </Divider>

                </div>
            </TabView>
        </div>
    );
}
