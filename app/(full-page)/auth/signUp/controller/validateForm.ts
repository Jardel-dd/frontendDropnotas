import { CreatedAccountEntity } from "../../../../entity/CreatedAccountEntity";

export const validateFormCreatedAccount = (
  conta: CreatedAccountEntity,
  confirmPassword: string,
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
  msgs: any
): boolean => {
  let valid = true;
  const newErrors: { [key: string]: string } = {};
  msgs.current?.clear();
  console.log(' conta:', conta);
  console.log(' confirmPassword:', confirmPassword);
  if (!conta.cnpj || conta.cnpj.trim().replace(/\D/g, '').length < 14) {
    newErrors.cnpj = 'CNPJ deve ter 14 dígitos.';
    valid = false;
  } else if (!conta.razao_social || conta.razao_social.trim().length < 2) {
    newErrors.razao_social = 'Razão Social deve ter pelo menos 2 caracteres.';
    valid = false;
  } else if (!conta.nome || conta.nome.trim().length < 2) {
    newErrors.nome = 'Nome deve ter pelo menos 2 caracteres.';
    valid = false;
  } else if (
    !conta.email?.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(conta.email)
  ) {
    newErrors.email = 'Email inválido. Por favor, digite um email válido.';
    valid = false;
  } else if (!conta.senha || conta.senha.length < 6) {
    newErrors.senha = 'A senha deve ter pelo menos 6 caracteres.';
    valid = false;
  } else if (!confirmPassword) {
    newErrors.confirmPassword = 'A confirmação de senha deve ser preenchida.';
    valid = false;
  } else if (confirmPassword !== conta.senha) {
    newErrors.confirmPassword = 'A senha e a confirmação não coincidem.';
    valid = false;
  }

  setErrors(newErrors);
  return valid;
};
