export const logoutUser = () => {
    console.warn('Sessão expirada. Deslogando usuário...');
    localStorage.clear();
    window.location.href = '/';
};
