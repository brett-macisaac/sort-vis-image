import React from "react";
import PropTypes from 'prop-types';

// import LinkStd from "../link_std/LinkStd.jsx";
import NavBarButtonStd from "../nav_bar_button_std/NavBarButtonStd.jsx";
// import "./Header.css";

/*
* The custom header component that's used by the PageContainer component.

* Props:
    > prNavigate: the object that allows for navigation to pages in the app.
    > prOptionsButtons: an array of options for each of the header buttons placed on the left. Each element is an 
      object that has three properties: icon, onPress, and left. The icon is a function that takes a parameter list of 
      (size, colour) and returns a vector icon (such as from Ionicons) that uses the size and colour arguments for its 
      corresponding props. The onPress prop is a function that's called when the icon is clicked.
    > prStyle: a style object for the container.
    > prIconSize: the size of the icons.
    > prTheme: An object with the following properties:
        * backgroundColor: the colour of the nav-bar's background.
        * borderColor: the colour of the nav-bar's borders.
        * button: an object for the prTheme prop of the .
*/
function NavBarStd({ prOptionsButtons, prStyles, prIconSize, prTheme })
{
    return (
        <div 
            style = {{ 
                ...styles.container, backgroundColor: prTheme.background, 
                borderTop: `1px solid ${prTheme.border}`, ...prStyles?.con
            }}
        >

                {
                    prOptionsButtons && prOptionsButtons.map(
                        (options, index) =>
                        {
                            return (
                                <NavBarButtonStd 
                                    key = { index }
                                    prPageName = { options.pageName }
                                    prText = { options.text }
                                    prIcon = { options.icon }
                                    prIconSize = { prIconSize }
                                    prTheme = { prTheme.button }
                                    prStyle = {{ ...styles.button, ...prStyles?.button }}
                                />
                            )
                        }
                    )
                }

        </div>
    );
};

NavBarStd.propTypes =
{
    prOptionsButtons: PropTypes.arrayOf(
        PropTypes.shape(
            {
                icon: PropTypes.func.isRequired,
                onPress: PropTypes.func.isRequired,
                text: PropTypes.string
            }
        )
    ),
    prStyle: PropTypes.object,
    prIconSize: PropTypes.number,
    prTheme: PropTypes.shape( 
        {
            background: PropTypes.string.isRequired,
            border: PropTypes.string.isRequired,
            headerButton: PropTypes.shape(
                {
                    fontActive: PropTypes.string.isRequired,
                    fontInactive: PropTypes.string.isRequired,
                    iconActive: PropTypes.string.isRequired,
                    iconInactive: PropTypes.string.isRequired,
                }
            )
        }
    ),
};

NavBarStd.defaultProps =
{
    prTheme: 
    {
        backgroundColor: "#000000",
        borderColor: "#FAFAFA",
        headerButton: 
        {
            icon: "#FAFAFA"
        }
    },
}

const styles =
{
    container: 
    {
        //flex: 1,
        //width: "100%",
        flexDirection: "row",
        alignItems: "center",
        // height: 60,
        width: "100%"
    },
    button:
    {
        flex: 1
    }
};

export default NavBarStd;