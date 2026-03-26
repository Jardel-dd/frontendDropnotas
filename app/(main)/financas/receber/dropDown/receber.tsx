// import { FormaPagamentoEntity } from "@/app/entity/FormaPagamento";
// import { FormaPagamentoDropdownFieldProps } from "../types/receber";
// import { DropdownSearch } from "@/app/shared/include/dropdown/searchDropdownAll";
// import { fetchFilteredFormaPagamento, listTheFormaPagamento } from "@/app/(main)/cadastro/formaPagamento/controller/controller";
// export default function FormaPagamentoDropdownField({
//     selectedFormaPagamento,
//     onFormaPagamentoChange,
//     reloadKey = 0,
//     hasError,
//     errorMessage,
//     showAddButton = false,
//     onAddClick,
//     autoSelectSingle = false
// }: FormaPagamentoDropdownFieldProps) {
//     return (
//         <DropdownSearch<FormaPagamentoEntity>
//             id="selectedFormadePagamento"
//             key={reloadKey}
//             selectedItem={selectedFormaPagamento}
//             onItemChange={onFormaPagamentoChange}
//             fetchAllItems={listTheFormaPagamento}
//             fetchFilteredItems={fetchFilteredFormaPagamento}
//             optionLabel="descricao"
//             optionValue="id"
//             placeholder="Selecione a Forma de Pagamento"
//             hasError={hasError}
//             errorMessage={errorMessage}
//             autoSelectSingle={autoSelectSingle}
//             showAddButton={showAddButton}
//             onAddClick={onAddClick}
//             topLabel="Forma de pagamento:"
//             showTopLabel
//             required
//         />
//     );
// }
