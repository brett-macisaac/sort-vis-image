import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';

import TextStd from '../text_std/TextStd';
import ButtonStd from '../button_std/ButtonStd';
import CheckBoxStd from '../check_box_std/CheckBoxStd';
import utils from '../../utils';

/*
* The app's pop-up message component.

* Props:
    > prTitle: the pop-up's title.
    > prMessage: the pop-up's message.
    > prButtons: the pop-up's buttons. This should be an array of objects. Each object should have two properties: text
      (string) and onPress (function). The button's 'text' is required, but 'onPress' is not.
    > prRemovePopUp: the function that contains the logic to remove the pop-up.
    > prDismissable: a boolean that, when true, indicates that the pop-up can be dismissed by clicking off it. This should
      be false if you want the user to click one of the buttons.
    > prId: the ID of the pop-up. This is an optional prop. If the pop-up's ID is on the 'blacklist', the pop-up is not 
      displayed. An ID can be added to the blacklist by the user checking the 'never show again' checkbox, which can be 
      displayed by setting showNeverShowAgainCheckbox to true.
    > prShowNeverShowAgainCheckbox: whether to display the 'never show again' checkbox. The 'id' prop must also be set for
      the checkbox to display.

    TODO: add a prStyles prop, much like the CheckBox component. Include buttons, background, con, etc
*/
function PopUpStd({ prTitle, prMessage, prButtons, prRemovePopUp, prDismissable, prId, prShowNeverShowAgainCheckbox, 
                    prStylesCheckBox, prTheme })
{
    // An array of IDs that correspond to pop-ups that can no longer be displayed.
    const [ stBlackList, setBlackList ] = useState([]);

    // Whether the user pressed the checkbox to blacklist the pop-up message.
    const [ stBlackListedByCheckBox, setBlackListedByCheckBox ] = useState(false);

    /*
    * Set the blacklist to the one stored locally on the user's device.
    */
    useEffect(
        () =>
        {
            // A function that retrieves the stored theme and then updates themeName.
            const getAndSetBlackList = async function() 
            {
                const lBlackList = await utils.getFromLocalStorage(gLclStrgKeyPopUpBlackList, []);

                setBlackList(lBlackList);
            };

            getAndSetBlackList();
        },
        []
    );

    const handlePressNeverShowAgain = () =>
    {
        const lIsBlacklisted = stBlackList.includes(prId);

        let lBlackListNew;

        if (lIsBlacklisted)
        {
            lBlackListNew = stBlackList.filter((ID) => ID != prId);
        }
        else
        {
            lBlackListNew = [ ...stBlackList, prId ];

            lBlackListNew.push(prId);

            setBlackListedByCheckBox(true);
        }

        setBlackList(lBlackListNew);

        utils.setInLocalStorage(gLclStrgKeyPopUpBlackList, lBlackListNew);
    }

    if (!(prId ? (!stBlackList.includes(prId) || stBlackListedByCheckBox) : true))
    {
        return null;
    }

    return (
        <div
            onClick = { prDismissable ? prRemovePopUp : undefined }
            style = {{ 
                backgroundColor: prTheme.backgroundTransparent, // Add alpha channel to create transparency.
                ...styles.container,
            }}
        >
            <div
                onClick = { (e) => e.stopPropagation() }
                style = {{
                    backgroundColor: prTheme.background,
                    color: prTheme.font,
                    border: `1px solid ${prTheme.border}`,
                    ...styles.alertBox
                }}
            >
                {/* Title */}
                <TextStd prText = { prTitle } prIsBold />

                {/* Message */}
                <TextStd prText = { prMessage } />

                {/* Buttons */}
                {
                    prButtons.map(
                        (button, index) =>
                        {
                            return (
                                <ButtonStd 
                                    prText = { button.text } 
                                    prSizeText = { 1 }
                                    prIsBold
                                    prOnPress = { 
                                        () => 
                                        { 
                                            prRemovePopUp();

                                            if (button.onPress) 
                                                button.onPress(); 
                                        }
                                    }
                                    prStyle = {{ 
                                        ...styles.button,
                                        backgroundColor: prTheme.buttonBackgroundColor,
                                        border: `1px solid ${prTheme.buttonBorderColor}`,
                                        color: prTheme.buttonFontColor
                                    }}
                                    key = { index }
                                />
                            )
                        }
                    )
                }

                {
                    (prShowNeverShowAgainCheckbox && prId) && (
                        <CheckBoxStd 
                            prText = "Never Show Again"
                            prIsChecked = { stBlackList.includes(prId) }
                            prOnPress = { handlePressNeverShowAgain }
                            prStyles = { prStylesCheckBox }
                            prTheme = { prTheme.checkBox }
                        />
                    )
                }
            </div>

        </div>
    );
}

PopUpStd.propTypes =
{
    prTitle: PropTypes.string,
    prMessage: PropTypes.string,
    prButtons: PropTypes.arrayOf(
        PropTypes.shape(
            {
                text: PropTypes.string.isRequired,
                onPress: PropTypes.func
            }
        )
    ),
    prRemovePopUp: PropTypes.func.isRequired,
    prDismissable: PropTypes.bool,
    prId: PropTypes.string,
    prShowNeverShowAgainCheckbox: PropTypes.bool,
    prTheme: PropTypes.shape(
        {
            backgroundTransparent: PropTypes.string.isRequired,
            background: PropTypes.string.isRequired,
            border: PropTypes.string.isRequired,
            font: PropTypes.string.isRequired,

            buttonBackgroundColor: PropTypes.string.isRequired,
            buttonBorderColor: PropTypes.string.isRequired,
            buttonFontColor: PropTypes.string.isRequired,

            checkBox: PropTypes.shape(
                {
                    background: PropTypes.string.isRequired,
                    border: PropTypes.string.isRequired,
                    font: PropTypes.string.isRequired,
                    fontCheck: PropTypes.string.isRequired,
                    backgroundBoxSel: PropTypes.string.isRequired,
                    backgroundBoxUnsel: PropTypes.string.isRequired,

                    backgroundInactive: PropTypes.string.isRequired,
                    borderInactive: PropTypes.string.isRequired,
                    fontInactive: PropTypes.string.isRequired,
                    fontCheckInactive: PropTypes.string.isRequired,
                    backgroundBoxSelInactive: PropTypes.string.isRequired,
                    backgroundBoxUnselInactive: PropTypes.string.isRequired,

                    overlayInactive: PropTypes.string.isRequired,
                }
            ).isRequired
        }
    )
};

PopUpStd.defaultProps =
{
    prTitle: "",
    prMessage: "",
    prDismissable: true,
    prShowNeverShowAgainCheckbox: false,
    prTheme: {
        backgroundTransparent: "#00000099",
        background: "#272727",
        border: "#FAFAFA",
        font: "#FFFFFF",

        buttonBackgroundColor: "#000000",
        buttonBorderColor: "#FAFAFA",
        buttonFontColor: "#FFFFFF",

        checkBox: {
            background: "#000000",
            border: "#FAFAFA",
            font: "#ffffff",
            fontCheck: "#000000",
            backgroundBoxSel: "#FFFFFF",
            backgroundBoxUnsel: "#000000",

            backgroundInactive: "#353535",
            borderInactive: "#8B8B8B",
            fontInactive: "#8B8B8B",
            fontCheckInactive: "#8B8B8B",
            backgroundBoxSelInactive: "#353535",
            backgroundBoxUnselInactive: "#353535",

            overlayInactive: "#35353567"
        }
    }
}

const styles =
{
    container:
    {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center", 
        flex: 1,
        width: "100%",
        height: "100%",
        paddingLeft: 10, paddingRight: 10
        // paddingLeft: utilsGlobalStyles.spacingN(-1),
        // paddingRight: utilsGlobalStyles.spacingN(-1),
    },
    alertBox: 
    {
        flexDirection: "column",
        maxWidth: 550,
        width: window.innerWidth * 0.8,
        rowGap: 10, padding: 15,
        // rowGap: utilsGlobalStyles.spacingN(-1),
        // padding: utilsGlobalStyles.fontSizeN(),
        borderRadius: 10
    },
    button:
    {
        paddingTop: "0.5em", paddingBottom: "0.5em",
        // paddingTop: utilsGlobalStyles.fontSizeN() / 2,
        // paddingBottom: utilsGlobalStyles.fontSizeN() / 2,
        borderRadius: 10
    }
};

function PopUpOk(title, message, onPress, dismissable)
{
    return {
        title: title,
        message: message,
        buttons: [
            { text: "OK", onPress: onPress }
        ],
        dismissable: dismissable
    }
}

/*
* A localStorage key whose value is an array of IDs (strings) which refer to the pop-up messages that can no longer
  be displayed. A pop-up usually makes it to this 'blacklist' when the user selects the 'Do Not Show Again' checkbox
  when the pop-up annoys them.
*/
const gLclStrgKeyPopUpBlackList = "PopUpBlackList";

export { PopUpStd as default, PopUpOk, gLclStrgKeyPopUpBlackList as lclStrgKeyPopUpBlackList };