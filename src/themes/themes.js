/*
* Themes for the app's components.
*/

// Get default themes.
import themesDefault from "../standard_ui/themes_default.js";

const defaultTheme = "dark";

const themes =
{
    // Add default themes.
    // ...themesDefault,

    dark:
    {
        ...themesDefault.dark,

        pageContainer:
        {
            ...themesDefault.dark.pageContainer,
            background: "#363636",
        },

        // The theme used by the elements (i.e. the Element component).
        element:
        {
            // The standard background colour of an element.
            background: "#000000", 

            backgroundComp: "#FF5900",
            backgroundSwap: "#FF0000",
            backgroundSet: "#FF0000",
            border: "transparent"
        }
    }

    // Add any other themes you would like here.
};

export { themes as default, defaultTheme };