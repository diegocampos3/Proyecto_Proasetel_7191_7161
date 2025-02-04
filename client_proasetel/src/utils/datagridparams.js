import { getGridStringOperators } from "@mui/x-data-grid";

export const filtrarOperador = (operadores) => {
    return getGridStringOperators().filter((operator) =>
        operadores.includes(operator.value)
    );
}

export const textoFiltrosDataGrid = 
{
    filterPanelInputLabel: 'Valor a Filtrar',
    filterPanelOperator:'Operación',
    filterPanelColumns: 'Columna',
    filterPanelInputPlaceholder: 'Valor',
    filterOperatorContains: 'Contiene',
    filterOperatorStartsWith: 'Comienza con',
    filterOperatorEndsWith: 'Termina en',
    filterOperatorEquals: 'Es Igual a',
    filterOperatorIsEmpty: 'Está Vacio',
    filterOperatorIsNotEmpty: 'No está Vacio',
    filterOperatorIsAnyOf: 'Es cualquiera de',
    columnMenuFilter: 'Filtrar',
    columnMenuSortAsc:'Ordenar Ascendente',
    columnMenuSortDesc:'Ordenar Descendente',
    columnMenuManageColumns:'Gestionar Columnas',
    columnMenuHideColumn: 'Ocultar Columna'
};





export const columnasDatagrid = (columnasDefinidas)  => {
return  columnasDefinidas.map((columna) => ({
   
    width: 70,
    flex: columna?.flex ?? 1, // Flex puede ser personalizado por columna
    align: 'center', // Centrar contenido de la celda
    headerAlign: 'center', // Centrar texto del header,
    field: columna?.field ?? '', // Ensure field is always assigned a string value
    ...columna,
    }));
}