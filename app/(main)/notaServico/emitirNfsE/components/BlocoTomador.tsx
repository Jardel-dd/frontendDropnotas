import Input from '@/app/shared/include/input/input-all';
import { getCitiesFromState } from '@/app/entity/maps';
import { Mandatory } from '@/app/shared/mandatory/InputMandatory';
import { InputMaskDrop } from '@/app/shared/include/inputMask/input';
import EnderecoForm from '@/app/components/enderecos/enderecoFormComponent/enderecoForm';

type Props = {
    nfseGerada: any;
    handleAllChanges: (e: any, bloco?: 'prestador' | 'tomador' | 'servico', index?: number) => void;
    handleDropdownChange: (e: any) => void;
    handleSearchCep: Function;
    setLoadingCep: Function;
    setNfs: Function;
    setError: Function;
    msgs: any;
    errors: Record<string, string>;
    handleDropdownChangeEnderecoTomador: (e: any) => void;

    loadingCep: boolean;
};

export default function BlocoTomador({ nfseGerada, handleAllChanges, handleDropdownChange, handleSearchCep, setLoadingCep, setNfs, setError, msgs, errors, handleDropdownChangeEnderecoTomador, loadingCep }: Props) {
    return (
        <div >
            <div className="grid formgrid mt-3">
                <div className="col-12 mb-0 lg:col-3 lg:mb-0">
                    <InputMaskDrop
                        id="cpf_cnpj"
                        value={nfseGerada.tomador?.cpf_cnpj || ''}
                        onChange={(e) =>
                            handleAllChanges(
                                {
                                    target: {
                                        id: e.target.id,
                                        value: e.value,
                                        type: 'text'
                                    }
                                },
                                'tomador',
                                0
                            )
                        }
                        placeholder="99.999.999/9999-99"
                        mask="99.999.999/9999-99"
                        iconRight="pi pi-search"
                        errorMessage={errors.cnpj}
                        onClickSearch={() => {}}
                        outlined={false}
                        showTopLabel
                        required
                        topLabel="CNPJ:"
                    />
                </div>
                <div className="col-12 mb-1 lg:col-9">
                    <Input 
                    id="razao_social" 
                    value={nfseGerada.tomador?.razao_social || ''} 
                    label="Razão Social" 
                    onChange={(e) => handleAllChanges(e, 'tomador')} 
                    showTopLabel 
                    required 
                    topLabel="Razão Social:"
                     />
                </div>
                 <div className="col-12 mb-1 lg:col-12 lg:mb-0">
                    <Input 
                    value={nfseGerada.tomador?.contato.email || ''} 
                    onChange={(e) => handleAllChanges(e, 'prestador')} 
                    label="E-mail" 
                    id="email" 
                    type="email" 
                    showTopLabel 
                    topLabel="E-mail:" 
                    />
                </div>
                <div className="col-12 mb-1 lg:col-12">
                    <EnderecoForm
                        endereco={nfseGerada.tomador?.endereco}
                        telefone={nfseGerada.tomador?.telefone}
                        errors={errors}
                        onChange={handleDropdownChangeEnderecoTomador}
                        onCepSearch={() => handleSearchCep(nfseGerada.tomador?.endereco?.cep || '', setLoadingCep, setNfs, setError, msgs)}
                        onDropdownChange={handleDropdownChange}
                        onDropdownChangeEndereco={handleDropdownChangeEnderecoTomador}
                        getCitiesFromState={getCitiesFromState}
                        loadingCep={loadingCep}
                    />
                </div>
            </div>
            <div className="grid formgrid mt-3">
                <div className="col-12 mb-1 lg:col-12 lg:mb-0">
                    <Input value={nfseGerada.tomador?.contato?.email || ''} onChange={(e) => handleAllChanges(e, 'tomador')} label="E-mail" id="email" type="email" showTopLabel topLabel="E-mail:" />
                </div>
            </div>
        </div>
    );
}
