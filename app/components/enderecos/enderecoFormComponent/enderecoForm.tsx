import '@/app/styles/styledGlobal.css';
import { Divider } from 'primereact/divider';
import { statesMaps } from '@/app/entity/maps';
import Input from '@/app/shared/include/input/input-all';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { InputMaskDrop } from '@/app/shared/include/inputMask/input';
type Props = {
    endereco: any;
    telefone?: string;
    errors?: Record<string, string>;
    onChange: (e: any) => void;
    onCepSearch: () => void;
    onDropdownChange: (e: any) => void;
    onDropdownChangeEndereco: (e: any) => void;
    getCitiesFromState: (uf: string) => any[];
    loadingCep?: boolean;
    readOnly?: boolean;
    exibirTelefone?: boolean;
    nomePaisObrigatorio?: boolean;
};
export default function EnderecoForm({
    endereco,
    telefone,
    errors = {},
    onChange,
    onCepSearch,
    onDropdownChange,
    onDropdownChangeEndereco,
    getCitiesFromState,
    loadingCep = false,
    readOnly,
    exibirTelefone = true,
    nomePaisObrigatorio = false
}: Props) {
    const enderecoSafe = endereco || {};
    return (
        <>
            <Divider align="center" className="form-divider">
                <span>Endereço</span>
            </Divider>
            <div className="grid formgrid mt-3">
                <div className="col-12 mt-1 lg:col-3 ">
                    <InputMaskDrop
                        id="cep"
                        value={enderecoSafe.cep}
                        onChange={onChange}
                        onClickSearch={onCepSearch}
                        placeholder="Digite o CEP"
                        mask="99999-999"
                        iconRight="pi pi-search"
                        outlined={true}
                        readOnly={readOnly}
                        useRightButton={true}
                        hasError={!!errors.cep}
                        errorMessage={errors.cep}
                        disabledRightButton={!endereco?.cep || endereco.cep.replace(/\D/g, '').length !== 8}
                        loading={loadingCep}
                        topLabel="CEP:"
                        showTopLabel
                        required
                    />
                </div>
                <div className="col-12 mt-1 lg:col-3 ">
                    <Input readOnly={readOnly} id="logradouro" label="Logradouro" value={endereco?.logradouro || ''} onChange={onChange} hasError={!!errors.logradouro} errorMessage={errors.logradouro} topLabel="Logradouro:" showTopLabel required />
                </div>
                <div className="col-12 mt-1 lg:col-3 ">
                    <Input id="complemento" label="Complemento" value={endereco?.complemento || ''} onChange={onChange} readOnly={readOnly} topLabel="Complemento:" showTopLabel />
                </div>
                <div className="col-12 mt-1 lg:col-3 ">
                    <Input id="numero" label="Número" value={endereco?.numero || ''} onChange={onChange} hasError={!!errors.numero} errorMessage={errors.numero} readOnly={readOnly} topLabel="Número:" showTopLabel required />
                </div>
                <div className="col-12 mt-1 lg:col-3 ">
                    <Input id="bairro" label="Bairro" value={endereco?.bairro || ''} onChange={onChange} hasError={!!errors.bairro} errorMessage={errors.bairro} readOnly={readOnly} topLabel="Bairro:" showTopLabel required />
                </div>
                <div className="col-12 mt-1 lg:col-3 ">
                    <Dropdown
                        id="uf"
                        value={endereco?.uf || ''}
                        options={statesMaps()}
                        onChange={onDropdownChangeEndereco}
                        placeholder="Selecione um estado"
                        label="Selecione um Estado"
                        hasError={!!errors.uf}
                        errorMessage={errors.uf}
                        readOnly={readOnly}
                        topLabel="Estado:"
                        showTopLabel
                        required
                    />
                </div>
                <div className="col-12 mt-1 lg:col-3 ">
                    <Dropdown
                        id="municipio"
                        value={endereco?.municipio || ''}
                        options={endereco?.uf ? getCitiesFromState(endereco.uf) : []}
                        onChange={onDropdownChangeEndereco}
                        placeholder="Selecione um Município"
                        label="Selecione um Município"
                        disabled={!endereco?.uf}
                        hasError={!!errors.municipio}
                        errorMessage={errors.municipio}
                        readOnly={readOnly}
                        topLabel=" Município:"
                        showTopLabel
                        required
                    />
                </div>
                <div className="col-12 mt-1 lg:col-3 ">
                    <Input
                        id="codigo_municipio"
                        label="Código do Município"
                        value={endereco?.codigo_municipio || ''}
                        onChange={onChange}
                        hasError={!!errors.codigo_municipio}
                        errorMessage={errors.codigo_municipio}
                        readOnly={readOnly}
                        topLabel="Código do Município:"
                        showTopLabel
                        required
                    />
                </div>
                <div className="col-12 mt-1 lg:col-3 ">
                    <Input
                        id="nome_pais"
                        label="Nome do país"
                        value={endereco?.nome_pais || ''}
                        onChange={onChange}
                        hasError={!!errors.nome_pais && nomePaisObrigatorio}
                        errorMessage={nomePaisObrigatorio ? errors.nome_pais : undefined}
                        readOnly={readOnly}
                        topLabel="Nome do país:"
                        showTopLabel
                        required
                    />
                </div>
                <div className="col-12 mt-1 lg:col-3 ">
                    <Input
                        id="codigo_pais"
                        label="Código do País"
                        value={endereco?.codigo_pais || ''}
                        onChange={onChange}
                        hasError={!!errors.codigo_pais}
                        errorMessage={errors.codigo_pais}
                        readOnly={readOnly}
                        topLabel="Código do País:"
                        showTopLabel
                        required
                    />
                </div>
                {exibirTelefone && (
                    <div className="col-12 mt-1 lg:col-3 ">
                        <InputMaskDrop
                            id="telefone"
                            mask="(99) 99999-9999"
                            value={telefone || ''}
                            onChange={onDropdownChange}
                            placeholder="(55) 99999-9999"
                            outlined={false}
                            iconRight=""
                            onClickSearch={() => {}}
                            readOnly={readOnly}
                            hasError={!!errors.telefone}
                            errorMessage={errors.telefone}
                            disabledRightButton={!endereco?.telefone || endereco.cep.replace(/\D/g, '').length !== 8}
                            topLabel="Telefone:"
                            showTopLabel
                        />
                    </div>
                )}
            </div>
        </>
    );
}
