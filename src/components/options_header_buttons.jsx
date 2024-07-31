import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import Settings from '@mui/icons-material/Settings';

/*
* These are the objects which define props for the HeaderButton component.
*/
const optionsHeaderButtons = 
{
    
    back:
    {
        icon: (size, colour) =>
        {
            return (
                <ArrowBackIosNew 
                    sx = { { color: colour, fontSize: size } }
                />
            )
        },
        onPress: (navigate) =>
        {
            navigate(-1);
        }
    },

    settings:
    {
        icon: (size, colour) =>
        {
            return (
                <Settings 
                    sx = { { color: colour, fontSize: size } }
                />
            )
        },
        onPress: (navigate) =>
        {
            navigate("/settings");
        }
    },

    settingsThemes:
    {
        icon: (size, colour) =>
        {
            return (
                <Settings 
                    sx = { { color: colour, fontSize: size } }
                />
            )
        },
        onPress: (navigate) =>
        {
            navigate("./settingsThemes");
        }
    },

};

export default optionsHeaderButtons;