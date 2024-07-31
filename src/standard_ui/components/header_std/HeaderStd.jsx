import React from "react";
import PropTypes from 'prop-types';

import HeaderButtonStd from "../header_button_std/HeaderButtonStd.jsx";
import "./Header.css";

/*
* The custom header component that's used by the PageContainer component.

* Props:
    > navigate: the object that allows for navigate to pages in the app.
    > optionsLeftButtons: an array of options for each of the header buttons placed on the left. Each element is an 
      object that has three properties: icon, onPress, and left. The icon is a function that takes a parameter list of 
      (size, colour) and returns a vector icon (such as from Ionicons) that uses the size and colour arguments for its 
      corresponding props. The onPress prop is a function that's called when the icon is clicked.
    > optionsRightButtons: same as optionsLeftButtons but for the buttons on the right.
    > setOptionsPopUpMsg: a function that's used to have a pop-up message appear. This may be desirable to warn the user
      when they click a button in the header, such as an 'exit' button that might cause them to lose progress.
    > prStyle: a style object for the container.
    > prIconSize: the size of the icons.
    > prLogo: the app's logo (optional).
    > prTheme: An object with the following properties:
        * backgroundColor: the colour of the button's background.
        * borderColor: the colour of the button's borders.
        * button: an object for the prTheme prop of the HeaderButton component.
*/
function HeaderStd({ prNavigate, prOptionsLeftButtons, prOptionsRightButtons, prSetOptionsPopUpMsg, prStyle, prIconSize,
                     prLogo, prTheme })
{
    return (
        <div 
            style = {{ 
                ...styles.container, backgroundColor: prTheme.background, 
                borderBottom: `1px solid ${prTheme.border}`, ...prStyle
            }}
        >

            <div style = { { ...styles.sideContainer, ...styles.leftContainer } }>
                {
                    prOptionsLeftButtons && prOptionsLeftButtons.map(
                        (options, index) =>
                        {
                            return (
                                <HeaderButtonStd 
                                    key = { index }
                                    prIcon = { options.icon }
                                    prOnPress = { 
                                        () => { options.onPress(prNavigate, prSetOptionsPopUpMsg) } 
                                    }
                                    prIconSize = { prIconSize }
                                    prTheme = { prTheme.button }
                                />
                            )
                        }
                    )
                }
            </div>

            { prLogo && prLogo }

            <div style = { { ...styles.sideContainer, ...styles.rightContainer } }>
                {
                    prOptionsRightButtons && prOptionsRightButtons.map(
                        (options, index) =>
                        {
                            return (
                                <HeaderButtonStd 
                                    key = { index }
                                    prIcon = { options.icon }
                                    prOnPress = { 
                                        () => { options.onPress(prNavigate, prSetOptionsPopUpMsg) } 
                                    }
                                    prIconSize = { prIconSize }
                                    prTheme = { prTheme.button }
                                />
                            )
                        }
                    )
                }
            </div>

        </div>
    );
};

HeaderStd.propTypes =
{
    prNavigate: PropTypes.func.isRequired,
    prOptionsLeftButtons: PropTypes.arrayOf(
        PropTypes.shape(
            {
                icon: PropTypes.func.isRequired,
                onPress: PropTypes.func.isRequired
            }
        )
    ),
    prOptionsRightButtons: PropTypes.arrayOf(
        PropTypes.shape(
            {
                icon: PropTypes.func.isRequired,
                onPress: PropTypes.func.isRequired
            }
        )
    ),
    prSetOptionsPopUpMsg: PropTypes.func,
    prStyle: PropTypes.object,
    prIconSize: PropTypes.number,
    prLogo: PropTypes.node,
    prTheme: PropTypes.shape( 
        {
            background: PropTypes.string,
            border: PropTypes.string,
            button: PropTypes.shape(
                {
                    icon: PropTypes.string,
                }
            )
        }
    ),
};

HeaderStd.defaultProps =
{
    prTheme: 
    {
        backgroundColor: "#000000",
        borderColor: "#FAFAFA",
        button: 
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
        height: 60,
        width: "100%"
    },
    sideContainer: 
    {
        width: 1,
        flexGrow: 1,
        flexDirection: "row",
    },
    leftContainer:
    {
        justifyContent: "flex-start",
    },
    rightContainer:
    {
        justifyContent: "flex-end",
    },
    conLogo:
    {
        justifyContent: "center", 
        alignItems: "center", 
        padding: 5,
        width: 35, height: 35
    }
};

export default HeaderStd;