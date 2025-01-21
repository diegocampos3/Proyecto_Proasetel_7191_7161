import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

// project imports
import { gridSpacing } from 'store/constant';
import { getImageUrl, ImagePath } from 'utils/getImageUrl';
import { ThemeMode } from 'config';

// assets
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import NotInterestedTwoToneIcon from '@mui/icons-material/NotInterestedTwoTone';
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';

// ==============================|| USER DETAILS CARD ||============================== //

const BusinnesObjDetailsCard = ({ id, titulo, descripcion}) => {
    
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event?.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const capitalizeFirstLetters = (str) => {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    };

    return (
        <Card
            sx={{
                p: 2,
                bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'grey.50',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                    borderColor: 'primary.main'
                }
            }}
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container spacing={gridSpacing}>
                        
                        
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption">Objetivo Empresarial_{id.slice(0,6)}</Typography>
                    <Typography variant="h3">{capitalizeFirstLetters(titulo)}</Typography>
                    <Typography variant="caption">Titulo</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" sx={{ color: 'grey.700' }}>
                        {descripcion}
                    </Typography>
                    <Typography variant="caption">Descripción<noscript></noscript></Typography>
                </Grid>  
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Button variant="outlined" fullWidth startIcon={<ChatBubbleTwoToneIcon />}>
                                Message
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant="outlined" color="error" fullWidth startIcon={<NotInterestedTwoToneIcon />}>
                                Block
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );
};

BusinnesObjDetailsCard.propTypes = {
    id: PropTypes.string,
    titulo: PropTypes.string,
    descripcion: PropTypes.string,
};

export default BusinnesObjDetailsCard;
