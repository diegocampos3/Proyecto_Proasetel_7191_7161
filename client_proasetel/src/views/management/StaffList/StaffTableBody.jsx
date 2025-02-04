import PropTypes from 'prop-types';
import { useState } from 'react';

// mui
import { alpha, useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
  
// third-party
import { Chance } from 'chance';

// project imports
import AddStaffDialog from './AddStaffDialog';
import useConfig from 'hooks/useConfig';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';
import { ThemeMode } from 'config';

// assets
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined';
import EditTwoTone from '@mui/icons-material/EditTwoTone';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import FacebookIcon from '@mui/icons-material/Facebook';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const chance = new Chance();

// ==============================|| STAFF LIST - TABLE BODY ||============================== //

const StaffTableBody = ({ row, selected, handleClick }) => {
    const theme = useTheme();
    const { mode, borderRadius } = useConfig();

    const [open, setOpen] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [showEmail, setShowEmail] = useState(false);

    const isSelected = (nombres) => selected.indexOf(nombres) !== -1;
    const isItemSelected = isSelected(row.nombres);

    const handleToggleAddDialog = () => {
        setOpenAddDialog(!openAddDialog);
    };


    const handleEmailClick = () => {
        setShowEmail(!showEmail);
    };

   
    let label;
    let color;
    let chipcolor;


    if (row.isActive){
        label = 'Activo';
        color = 'success.dark';
        chipcolor = alpha(theme.palette.success.light, 0.6);
    }else{
        label = 'Inactivo';
        color = 'error.dark';
        chipcolor = alpha(theme.palette.error.light, 0.6);
    }


    const capitalizeFirstLetters = (str) => {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    };

    return (
        <>
            <TableRow hover role="checkbox" aria-checked={isItemSelected} tabIndex={-1} selected={isItemSelected}>

                <TableCell>
                    {capitalizeFirstLetters(row.nombres)}
                </TableCell>
                <TableCell>
                    {capitalizeFirstLetters(row.apellidos)}
                </TableCell>
                <TableCell>
                <Stack direction="row" justifyContent="center" alignItems="center">
                        <IconButton onClick={handleEmailClick}>
                            <EmailOutlinedIcon />
                        </IconButton>
                        {showEmail ? (
                            <span>{row.email}</span>
                        ) : (
                            <span></span>
                        )}
                    </Stack>
                </TableCell>
                <TableCell>
                    <Chip
                        label={label}
                        size="small"
                        sx={{
                            bgcolor: mode === ThemeMode.DARK ? 'dark.main' : chipcolor,
                            color: color,
                        }}
                    />
                </TableCell>
                <TableCell>
                    {capitalizeFirstLetters(row.departamento ? row.departamento : 'Ninguno')}
                </TableCell>
                <TableCell>
                    {capitalizeFirstLetters(row.rol )}
                </TableCell>
                
                <TableCell sx={{ pr: 3 }}>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow sx={{ bgcolor: mode === ThemeMode.DARK ? 'background.default' : 'grey.50' }}>
                <TableCell sx={{ py: 0 }} colSpan={13}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        {open && (
                            <Box sx={{ p: 2 }}>
                                <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between">
                                    <Stack alignItems="center" direction="row" spacing={1}>
                                        
                                        <Stack>
                                            <Typography variant="subtitle2"></Typography>
                                            <Typography variant="h5"></Typography>
                                        </Stack>
                                    </Stack>

                                    <Stack justifyContent="center">
                                        <Typography variant="subtitle2">Departamento</Typography>
                                        <Typography variant="h5">{capitalizeFirstLetters(row.departamento ? row.departamento : 'Ninguno')}
                                        </Typography>
                                    </Stack>
                                    <Stack justifyContent="center">
                                        <Typography variant="subtitle2">Rol</Typography>
                                        <Typography variant="h5">{capitalizeFirstLetters(row.rol)}</Typography>
                                    </Stack>
                                    <TableCell>
                                        <Chip
                                            label={label}
                                            size="small"
                                            sx={{
                                                bgcolor: mode === ThemeMode.DARK ? 'dark.main' : chipcolor,
                                                color: color,
                                            }}
                                        />
                                    </TableCell>
                                    
                                    <Stack direction="row" spacing={1.25} justifyContent="center">
                                        <IconButton
                                            color="primary"
                                            size="small"
                                            onClick={handleToggleAddDialog}
                                            sx={{
                                                borderRadius: `${borderRadius}px`,
                                                p: 1.25,
                                                border: '1px solid',
                                                borderColor: 'divider'
                                            }}
                                        >
                                            <EditTwoTone />
                                        </IconButton>
                                    </Stack>
                                </Stack>
                            </Box>
                        )}
                    </Collapse>
                </TableCell>
            </TableRow>
            <AddStaffDialog {...{ open: openAddDialog, handleToggleAddDialog, row }} />
        </>
    );
};

StaffTableBody.propTypes = {
    row: PropTypes.object.isRequired,
    selected: PropTypes.array.isRequired,
    handleClick: PropTypes.func.isRequired
};

export default StaffTableBody;
