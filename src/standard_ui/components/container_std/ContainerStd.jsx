import React from 'react';
import PropTypes from 'prop-types';

/* 
* A basic container component.

* Props:
    > children: any children components.
    > style: an optional styling object.
    > prTheme: An object with the following properties:
        * backgroundColor: the colour of the background.
        * borderColor: the colour of the borders.
*/
function ContainerStd({ children, prStyle, prTheme })
{
    return ( 
        <div 
            style = {{ 
                ...styles.container, backgroundColor: prTheme.background,
                borderColor: prTheme.border, ...prStyle,
            }}
        >

            { children }

        </div>
    );
}

ContainerStd.propTypes =
{
    children: PropTypes.node,
    prStyle: PropTypes.object,
    prTheme: PropTypes.shape(
        {
            background: PropTypes.string,
            border: PropTypes.string,
        }
    )
};

ContainerStd.defaultProps =
{
    prStyle: {},
    prTheme: 
    {
        backgroundColor: "transparent",
        borderColor: "#FAFAFA",
    },
}

const styles =
{
    container:
    {
        width: "100%",
        padding: 10,
        borderRadius: 10,
        border: "1px solid"
    }
};


export default ContainerStd;