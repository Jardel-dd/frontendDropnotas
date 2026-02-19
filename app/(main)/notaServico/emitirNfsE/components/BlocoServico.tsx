import { IconReal } from '@/app/utils/icons/icons';
import Input from '@/app/shared/include/input/input-all';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import CustomInputNumber from '@/app/shared/include/inputReal/inputReal';
import { exigibilidadeISSServico } from '@/app/shared/optionsDropDown/options';

type Props = {
    nfseGerada: any;
    errors: Record<string, string>;
    handleAllChanges: (e: any, bloco?: 'prestador' | 'tomador' | 'servico') => void;
    handleNumberChange: (e: any, bloco?: 'prestador' | 'tomador' | 'servico', index?: number) => void;
    handleDropdownChange: (e: any, bloco?: 'prestador' | 'tomador' | 'servico', index?: number) => void;
};
export default function BlocoServico({ nfseGerada, handleNumberChange, handleDropdownChange, handleAllChanges, errors }: Props) {
    return (
        <div className="grid formgrid mt-3">
            <div className="col-12 mb-1 lg:col-8">
                <Input id="descricao" value={nfseGerada.servico?.descricao || ''} label="Descrição" onChange={(e) => handleAllChanges(e, 'servico')} showTopLabel required topLabel="Descricao" />
            </div>
            <div className="col-12 mb-1 lg:col-4 lg:mb-0">
                <CustomInputNumber
                    id="valor_servico"
                    value={nfseGerada.servico.valores?.valor_servico ?? 0}
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    label="Valor Serviço:"
                    useRightButton
                    outlined
                    iconLeft={<IconReal isDarkMode={false} />}
                    showTopLabel
                    required
                    topLabel="Valor Serviço"
                />
            </div>
            <div className="col-12 mb-1 lg:col-4 lg:mb-0">
                <Dropdown
                    id="exigibilidade_iss"
                    value={nfseGerada.servico.exigibilidade_iss ?? ''}
                    options={exigibilidadeISSServico}
                    onChange={handleDropdownChange}
                    label="Selecione a Exigibilidade ISS:"
                    hasError={!!errors.exigibilidade_iss}
                    errorMessage={errors.exigibilidade_iss}
                    showTopLabel
                    required
                    topLabel="Exigibilidade ISS:"
                />
            </div>
        </div>
    );
}
