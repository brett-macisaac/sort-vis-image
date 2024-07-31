import React from "react";
import PropTypes from 'prop-types';

import LinkStd from "../link_std/LinkStd";

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
function NavBarButtonStd({ prIcon, prText, prPageName, prIconSize, prStyle, prTheme })
{
    let lIsActive = prPageName == window.location.pathname;//window.location.pathname.includes(prPageName.substring(prPageName.lastIndexOf('/') + 1));

    // console.log(`origin: ${window.location.pathname}`);
    console.log(`${prPageName}: ${lIsActive}`);

    return (
        <LinkStd 
            prIcon = { prIcon(prIconSize, lIsActive ? prTheme.iconActive : prTheme.iconInactive) } prText = { prText }
            prDestination = { prPageName }
            prStyle = {{ ...styles.button, ...prStyle }}
            prStyleText = {{ color: lIsActive ? prTheme.fontActive : prTheme.fontInactive }}
        />
    )
};

NavBarButtonStd.propTypes =
{
    prIcon: PropTypes.func.isRequired,
    prPageName: PropTypes.string.isRequired,
    prIconSize: PropTypes.number,
    prTheme: PropTypes.shape(
        {
            iconActive: PropTypes.string.isRequired,
            iconInactive: PropTypes.string.isRequired,
        }
    )
};

NavBarButtonStd.defaultProps = 
{
    prIconSize: 35,
    prTheme: 
    {
        iconActive: "#FAFAFA",
        iconInactive: "#C0C0C0",
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

export default NavBarButtonStd;