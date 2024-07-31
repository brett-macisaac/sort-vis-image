/*
*  Default themes for the app's components.
*/
const themesDefault =
{
    dark:
    {
        // The theme of the ButtonStandard component (also LinkStd).
        buttonStandard: 
        {
            background: "#000000",
            border: "#FAFAFA",
            font: "#FFFFFF",

            backgroundInactive: "#353535",
            borderInactive: "#8B8B8B",
            fontInactive: "#8B8B8B",

            overlayInactive: "#35353567"
        },

        // The theme of the ButtonNextPage component.
        buttonNextPage: 
        {
            background: "#000000",
            border: "#FAFAFA",
            font: "#FFFFFF",
            icon: "#FAFAFA",
            iconBackgroundColor: "transparent"
        },

        buttonTheme: 
        {
            content: "#272727",
            header: "#000000",
            navBar: "#000000",
            border: "#FAFAFA",
        },

        checkBox: 
        {
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
        },

        comboBox:
        {
            background: "#000000",
            backgroundItems: "#000000",
            border: "#FAFAFA",
            font: "#ffffff",
            fontPlaceholder: "#ffffff",
            iconArrow: "#ffffff",

            backgroundInactive: "#353535",
            borderInactive: "#8B8B8B",
            fontInactive: "#8B8B8B",
            fontPlaceholderInactive: "#8B8B8B",
            iconArrowInactive: "#8B8B8B",

            overlayInactive: "#35353567"
        },

        container:
        {
            background: "transparent",
            border: "#FAFAFA",
        },

        countLabel:
        {
            background: "#000000",
            border: "#FAFAFA",
            font: "#ffffff",
            fontValue: "#ffffff",
            backgroundValue: "#000000",
            borderLeftColorValue: "#FAFAFA",
        },

        // The theme of the TextStd component.
        textStd:
        {
            color: "#FFFFFF"
        },

        // The theme of the TextInputStd component.
        textInputStd:
        {
            background: "transparent",
            font: "#FFFFFF",
            border: "#FAFAFA",
            eyeIcon: "#FAFAFA",

            backgroundInactive: "#383737", 
            fontInactive: "#8B8B8B",
            borderInactive: "#8B8B8B",
            eyeIconInactive: "#8B8B8B",

            overlayInactive: "#15151567"
        },

        // The theme of the PageContainer component.
        // Maybe add this later using the other ones.
        pageContainer:
        {
            background: "#272727",

            header: 
            {
                background: "#000000",
                border: "#FAFAFA",
                button: 
                {
                    icon: "#FAFAFA"
                }
            },

            navBarSingle: 
            {
                background: "#000000",
                border: "#FAFAFA",
                font: "#FFFFFF",
                backgroundButton: "#272727",
            },
    
            navBar: 
            {
                background: "#000000",
                border: "#FAFAFA",
                button:
                {
                    fontActive: "#FFFFFF",
                    fontInactive: "#6B6B6B",
                    iconActive: "#FAFAFA",
                    iconInactive: "#6B6B6B",
                }
            },
        },

        popUp:
        {
            backgroundTransparent: "#00000099",
            background: "#272727",
            border: "#FAFAFA",
            font: "#FFFFFF",

            buttonBackgroundColor: "#000000",
            buttonBorderColor: "#FAFAFA",
            buttonFontColor: "#FFFFFF"
        },

        sliderStd:
        {
            borderCon: "#FAFAFA",
            backgroundProgress: "#000000",
            borderProgress: "#FAFAFA",
            font: "#ffffff",
            backgroundTrack: "transparent",

            borderConInactive: "#8B8B8B",
            backgroundProgressInactive: "#383737",
            borderProgressInactive: "#8B8B8B",
            fontInactive: "#8B8B8B",
            backgroundTrackInactive: "transparent",

            overlayInactive: "#15151567"
        },

        tableStd:
        {
            background: "transparent",
            backgroundHeaderCell: "#000000",
            backgroundContentCell: "transparent",
            border: "#FAFAFA",
        },

        loadArea:
        {
            background: "#272727",
            backgroundTranslucent: "#00000099",
            loadIcon: "#FAFAFA",
        },

        // The theme's name.
        name: "Dark"
    },
};

// Add nested themes.
for (const [key, value] of Object.entries(themesDefault))
{
    value.popUpStd = {
        ...value.popUpStd,
        checkBox: value.checkBox
    }

    value.pageContainer = {
        ...value.pageContainer,
        loadArea: value.loadArea,
        popUp: value.popUp,
    }
}

export default themesDefault;