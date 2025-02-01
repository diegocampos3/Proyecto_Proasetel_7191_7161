import { useContext } from 'react';
import JWTContext from 'contexts/JWTContext';

// Hook personalizado para obtener el rol del usuario
const useUserRole = () => {
    const { user } = useContext(JWTContext) || {}; // Previene errores si el contexto no está disponible
    console.log('Imprimiendo usuario:', user)
    return user?.rol || 'invitado';  // Retorna el rol o 'invitado' si no hay usuario autenticado
};

export default useUserRole;