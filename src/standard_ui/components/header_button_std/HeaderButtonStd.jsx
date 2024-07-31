import React from "react";
import PropTypes from 'prop-types';

import ButtonStd from '../button_std/ButtonStd';

/*
* A button that is designed to be displayed in the Header component.

* Props:
    > prIcon: a function that takes a parameter list of (size, colour) and returns a vector icon (such as from 
      @mui/icons-material) that uses the size and colour arguments for its corresponding props.
    > prOnPress: onPress prop is a function that's called when the icon is clicked.
    > prIconSize: the size of the icons (i.e. both the left and right icon).
    > prTheme: An object with the following properties:
        * icon: the colour of the icon.
*/
function HeaderButtonStd({ prOnPress, prIcon, prIconSize, prTheme })
{
    return (
        <ButtonStd 
            prOnPress = { prOnPress }
            prIcon = { prIcon(prIconSize, prTheme.icon) }
            prStyle = { styles.button }
        />
    )
};

HeaderButtonStd.propTypes =
{
    prIcon: PropTypes.func.isRequired,
    prOnPress: PropTypes.func.isRequired,
    prIconSize: PropTypes.number,
    prTheme: PropTypes.shape(
        {
            icon: PropTypes.string,
        }
    )
};

HeaderButtonStd.defaultProps = 
{
    prIconSize: 35,
    prTheme: 
    {
        icon: "#FAFAFA"
    },
};

const styles = 
{
    button:
    {
        backgroundColor: 'transparent',
        padding: 10,
    }
}

export default HeaderButtonStd;