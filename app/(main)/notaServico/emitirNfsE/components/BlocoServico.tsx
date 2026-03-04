import { useState } from 'react';
import { IconPorcentagem, IconReal } from '@/app/utils/icons/icons';
import Input from '@/app/shared/include/input/input-all';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import CustomInputNumber from '@/app/shared/include/inputReal/inputReal';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import { searchServiceTable } from '@/app/components/fetchAll/listAllTableService/controller';
import { exigibilidadeISSServico, issRetido, responsavelRetencao, tributacaoISSQN } from '@/app/shared/optionsDropDown/options';
type Props = {
    nfseGerada: any;
    errors: Record<string, string>;
    handleAllChanges: (e: any, bloco?: 'prestador' | 'tomador' | 'servico') => void;
    handleNumberChange: (e: any, bloco?: 'prestador' | 'tomador' | 'servico', index?: number) => void;
    handleDropdownChange: (e: any, bloco?: 'prestador' | 'tomador' | 'servico', index?: number) => void;

};
export default function BlocoServico({ nfseGerada, handleNumberChange, handleDropdownChange, handleAllChanges, errors }: Props) {
    const [selectedService, setSelectedService] = useState<ServiceEntity | null>(null);
    const [selectedCodigoNBS, setSelectedCodigoNBS] = useState<ServiceEntity | null>(null);
    return (
        <div className="grid formgrid ">
            <div className="col-12 mt-1 lg:col-9">
                <Input
                    id="descricao"
                    value={nfseGerada.servico?.descricao || ''}
                    label="Descrição"
                    onChange={(e) => handleAllChanges(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="Descricao"
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
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
            <div className="col-12 mt-1 lg:col-3">
                <Dropdown
                    id="exigibilidade_iss"
                    value={nfseGerada.servico?.exigibilidade_iss ?? ''}
                    options={exigibilidadeISSServico}
                    onChange={(e) => handleDropdownChange(e, 'servico')}     
                    label="Selecione a Exigibilidade ISS:"
                    hasError={!!errors.exigibilidade_iss}
                    errorMessage={errors.exigibilidade_iss}
                    showTopLabel
                    required
                    topLabel="Exigibilidade ISS:"
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Dropdown
                    value={nfseGerada.servico?.iss_retido ?? ''}
                    onChange={(e) => handleDropdownChange(e, 'servico')} 
                    label="Iss Retido"
                    options={issRetido}
                    id="iss_retido"
                    hasError={!!errors.iss_retido}
                    errorMessage={errors.iss_retido}
                    topLabel="Iss Retido:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Dropdown
                    id="tributacao_issqn"
                    value={nfseGerada.servico.tributacao_issqn ?? 0}
                    options={tributacaoISSQN}
                    onChange={(e) => handleDropdownChange(e, 'servico')} 
                    label="Selecione a Tributação ISSQN "
                    hasError={!!errors.tributacao_issqn}
                    errorMessage={errors.tributacao_issqn}
                    showTopLabel
                    required
                    topLabel="Tributação ISSQN:"
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <DropdownSearch<ServiceEntity>
                    id="codigo_nbs"
                    selectedItem={selectedCodigoNBS}
                    onItemChange={(e) => handleAllChanges(e, 'servico')}
                    fetchAllItems={searchServiceTable}
                    fetchFilteredItems={searchServiceTable}
                    optionLabel={'descricao' as keyof ServiceEntity}
                    placeholder="Selecione Código NBS"
                    hasError={!!errors.codigo_nbs}
                    errorMessage={errors.codigo_nbs}
                    topLabel="Código NBS:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <DropdownSearch<ServiceEntity>
                    id="item_lista_servico"
                    selectedItem={selectedService}
                    onItemChange={(e) => handleAllChanges(e, 'servico')}
                    fetchAllItems={searchServiceTable}
                    fetchFilteredItems={searchServiceTable}
                    optionLabel={'descricao' as keyof ServiceEntity}
                    placeholder="Selecione um serviço"
                    hasError={!!errors.item_lista_servico}
                    errorMessage={errors.item_lista_servico}
                    topLabel="Descrição da Atividade do Serviço:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Dropdown
                    id="responsavel_retencao"
                    value={nfseGerada.servico.responsavel_retencao ?? ''}
                    options={responsavelRetencao}
                    onChange={(e) => handleDropdownChange(e, 'servico')} 
                    label="Selecione o Responsavel Retenção:"
                    hasError={!!errors.responsavel_retencao}
                    errorMessage={errors.responsavel_retencao}
                    showTopLabel
                    required
                    topLabel="Responsavel Retenção:"
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="codigo_municipio"
                    label="Código do Município"
                    value={nfseGerada.servico.codigo_municipio || ''}
                    onChange={handleDropdownChange}
                    hasError={!!errors.codigo_municipio}
                    errorMessage={errors.codigo_municipio}
                    topLabel="Código do Município:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="municipio_incidencia"
                    value={nfseGerada.servico?.municipio_incidencia || ''}
                    label="Município Incidência"
                    onChange={(e) => handleAllChanges(e, 'servico')} showTopLabel
                    required
                    topLabel="Código Município Incidência:"
                    hasError={!!errors.municipio_incidencia}
                    errorMessage={errors.municipio_incidencia}
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="codigo_tributacao_municipio"
                    label="Código do Tributação Municipal"
                    value={nfseGerada.servico.codigo_tributacao_municipio || ''}
                    onChange={handleDropdownChange}
                    hasError={!!errors.codigo_tributacao_municipio}
                    errorMessage={errors.codigo_tributacao_municipio}
                    topLabel="Código do Tributação Municipal:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="base_calculo"
                    value={nfseGerada.servico?.valores?.base_calculo ?? 0}
                    label="Base de Calculo"
                    onChange={(e) => handleNumberChange(e, 'servico')}
                     showTopLabel
                    required
                    topLabel="Base de Calculo:"
                    type='number'
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="aliquota_iss"
                    value={nfseGerada.servico?.valores.aliquota_iss ?? 0}
                    label="Alíquota ISS"
                    onChange={(e) => handleNumberChange(e, 'servico')} showTopLabel
                    required
                    topLabel="Alíquota ISS:"
                    type='number'
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="aliquota_deducoes"
                    value={nfseGerada.servico?.valores.aliquota_deducoes ?? 0}
                    label="Alíquota Deduções"
                    onChange={(e) => handleNumberChange(e, 'servico')} showTopLabel
                    required
                    topLabel="Alíquota Deduções:"
                    type='number'
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="aliquota_pis"
                    value={nfseGerada.servico?.valores.aliquota_pis ?? 0}
                    label="Alíquota PIS"
                    onChange={(e) => handleNumberChange(e, 'servico')} showTopLabel
                    required
                    topLabel="Alíquota PIS:"
                    type='number'
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="aliquota_cofins"
                    value={nfseGerada.servico?.valores.aliquota_cofins ?? 0}
                    label="Alíquota COFINS"
                    onChange={(e) => handleNumberChange(e, 'servico')} showTopLabel
                    required
                    topLabel="Alíquota COFINS:"
                    type='number'
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="aliquota_inss"
                    value={nfseGerada.servico?.valores.aliquota_inss ?? 0}
                    label="Alíquota INSS"
                    onChange={(e) => handleNumberChange(e, 'servico')} showTopLabel
                    required
                    topLabel="Alíquota INSS:"
                    type='number'
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="aliquota_ir"
                    value={nfseGerada.servico?.valores.aliquota_ir ?? 0}
                    label="Alíquota IR"
                    onChange={(e) => handleNumberChange(e, 'servico')} showTopLabel
                    required
                    topLabel="Alíquota IR:"
                    type='number'
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="aliquota_csll"
                    value={nfseGerada.servico?.valores.aliquota_csll ?? 0}
                    label="Alíquota CSLL"
                    onChange={(e) => handleNumberChange(e, 'servico')} showTopLabel
                    required
                    topLabel="Alíquota CSLL:"
                    type='number'
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="aliquota_outras_retencoes"
                    value={nfseGerada.servico?.valores.aliquota_outras_retencoes ?? 0}
                    label="Alíquota outras Retenções"
                    onChange={(e) => handleNumberChange(e, 'servico')} showTopLabel
                    required
                    topLabel="Alíquota outras Retenções:"
                    type='number'
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="percentual_desconto_incondicionado"
                    value={nfseGerada.servico?.valores.percentual_desconto_incondicionado ?? 0}
                    label="Percentual desconto Incondicionado"
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="Percentual desconto Incondicionado:"
                    type='number'
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="percentual_desconto_condicionado"
                    value={nfseGerada.servico?.valores.percentual_desconto_condicionado ?? 0}
                    label="Percentual desconto Condicionado"
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="Percentual desconto Condicionado:"
                    type='number'
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
        </div> 
    );
};
