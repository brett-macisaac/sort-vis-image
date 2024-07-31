import React from 'react';
import PropTypes from 'prop-types';

/*
* A customisable button component which by default implements the app's global theme.

* Props:
    > prOnPress: the function that is called when the button is pressed.
    > prHeight: the component's height
    > prWidth: the component's width.
    > prIsSelected: whether the component is selected (this should be done using the onPress prop).
    > prStyle: the container's style.
    > prTheme: An object with the following properties:
        * content: the colour of the 'page'.
        * header: the colour of the 'header'.
        * navBar: the colour of the 'navbar'.
        * borders: the colour of the 'borders'.
*/
function ButtonThemeStd({ prOnPress, prHeight, prWidth, prIsSelected, prStyle, prTheme })
{
    return (
        <div
            onClick = { prOnPress }
            style = {{ 
                // backgroundColor: lTheme.buttonContent,
                borderColor: prTheme.border,
                height: prHeight,
                width: prWidth,
                borderWidth: prIsSelected ? 3 : 0,
                borderStyle: "solid",
                ...styles.container,
                ...prStyle
            }}
        >

            <div 
                style = {{ 
                    ...styles.headerOrNavBar, ...styles.header, backgroundColor: prTheme.header, 
                    borderColor: prTheme.border  
                }}
            >
            </div>

            <div style = {{ ...styles.content, backgroundColor: prTheme.content }}>
            </div>

            <div 
                style = {{ 
                    ...styles.headerOrNavBar, ...styles.navBar, backgroundColor: prTheme.navBar, 
                    borderColor: prTheme.border
                }}
            >
            </div>

        </div>
    );
}

ButtonThemeStd.propTypes =
{
    prOnPress: PropTypes.func.isRequired,
    prHeight: PropTypes.number,
    prWidth: PropTypes.number,
    prIsSelected: PropTypes.bool,
    prTheme: PropTypes.shape(
        {
            content: PropTypes.string,
            header: PropTypes.string,
            navBar: PropTypes.string,
            border: PropTypes.string,
        }
    )
};

ButtonThemeStd.defaultProps =
{
    prHeight: 100,
    prWidth: 45,
    prIsSelected: false,
    prTheme: 
    {
        content: "#272727",
        header: "#000000",
        navBar: "#000000",
        borderColor: "#FAFAFA",
    },
}

const styles = 
{
    container:
    {
        flexDirection: "column",
        borderRadius: 10,
        overflow: "hidden",
        // alignItems: "center",
        // justifyContent: "center"
    },
    content: 
    {
        flexGrow: 70
    },
    headerOrNavBar:
    {
        flexGrow: 15
    },
    header:
    {
        borderBottom: "1px solid"
    },
    navBar:
    {
        borderTop: "1px solid"
    }   
};

export default ButtonThemeStd;