import { useState } from 'react';
import useAuth from 'hooks/useAuth';
import menuItems from 'menu-items';  

const useMenuItems = () => {
    const { user } = useAuth(); 
    console.log('Imprimiendo user desde hook:', user?.rol);

    // Realiza la comparación directamente al inicializar el estado
    const filteredMenuItems = user?.rol
        ? { items: menuItems.items.filter(item => item.id === user?.rol) }  // Filtra según el rol del usuario
        : { items: menuItems.items };  // Si no hay rol, devuelve todos los elementos

    console.log('Imprimiendo filtered items:', filteredMenuItems);

    return filteredMenuItems;
};

export default useMenuItems;

