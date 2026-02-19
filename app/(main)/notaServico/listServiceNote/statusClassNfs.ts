export const StatusNota = (status: string) => {
  switch (status) {
    case "ABERTA":
      return "bg-blue-100 text-blue-700 border border-blue-300";
    case "PENDENTE":
      return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    case "PROCESSANDO":
      return "bg-purple-100 text-purple-700 border border-purple-300";
    case "AUTORIZADA":
      return "bg-green-100 text-green-700 border border-green-300";
    case "REJEITADA":
      return "bg-red-100 text-red-700 border border-red-300";
    case "CANCELADA":
      return "bg-red-300 text-gray-700 border border-gray-300";
    default:
      return "bg-gray-100 text-gray-600 border border-gray-200";
  }
};
