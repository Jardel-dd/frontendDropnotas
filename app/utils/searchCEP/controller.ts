import api from "@/app/services/api";
import { Messages } from "primereact/messages";

export const searchByCep = async (_cep: string, msgs: React.RefObject<Messages>) => {
    try {
        const cep = _cep.replace(/\D/g, '');
        const token = localStorage.getItem('token');
        const response = await api.get(`endereco/cep/${cep}`,
            { headers: { Authorization: `Bearer ${token}` } });
        console.log(response); return response.data;
    } catch (error) {
        if (msgs.current) { msgs.current.show({ severity: 'error', summary: 'Erro', detail: 'Cep não encontrado, verifique ou inclua o endereço manualmente!' }); }
    }
}
