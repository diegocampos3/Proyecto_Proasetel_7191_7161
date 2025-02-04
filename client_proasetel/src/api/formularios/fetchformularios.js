import { useQuery } from '@tanstack/react-query';
import axiosServices from '../../utils/axios';


export const fetchFormularios = async () =>
{
    try {
        const { data } = await axiosServices.get('/formulario');
        // Verifica si los datos esperados existen
        if (data ) {
          return data
        } else {
          // Si no existe, lanza un error
          throw new Error('Respuesta inesperada');
        }
      } catch (error) {
        // Esto permitirá que useQuery maneje el error
        throw error;
      }
}

export const useFetchFormularios = () =>
{
    return useQuery({
		queryKey: ['formularios_listado'],
		queryFn: () => fetchFormularios() ?? {},
		staleTime:1000 * 60 * 10 ,
		gcTime: 1000 * 60 * 10,
        refetchInterval:1000*60*30,
        refetchOnWindowFocus:true,
	});
}

// export const useFetchFormularios = () => {
//   return useQuery({
//     queryKey: ['formularios_listado'],
//     queryFn: () => fetchFormularios(),
//     cacheTime: 0, // No guarda datos en caché
//     staleTime: 0, // Siempre considera los datos obsoletos
//     refetchOnWindowFocus: true, // Realiza una consulta cuando la ventana vuelve a tener foco
//     refetchInterval: false, // Desactiva la consulta automática por intervalo
//   });
// };