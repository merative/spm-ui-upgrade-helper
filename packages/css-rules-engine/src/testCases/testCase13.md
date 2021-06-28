## Description

Test that consecutive removals are applied correctly.

This covers a bug where the code was skipping every second item to be removed. It was removing all
the selectors from item 0, then removing the entire CSS rule due to no selectors. This would then
cause all the items in the CSS rules to shift left one position, meaning item 1 was now item 0. Then
the loop counter would increment `i` from 0 to 1, and this meant that the original item 1 (which was
left-shifted to become item 0) would be skipped. The fix was to decrement `i` any time we removed a
CSS rule in this way.

## Rules

    {
      "SelectorRemove": [
        { "value": "::-webkit-scrollbar" },
        { "value": "::-webkit-scrollbar-thumb" },
        { "value": "::-webkit-scrollbar-button" },
        { "value": "::-webkit-scrollbar-button:vertical:increment" },
        { "value": "::-webkit-scrollbar-button:vertical:decrement" },
        { "value": "::-webkit-scrollbar-button:horizontal:increment" },
        { "value": "::-webkit-scrollbar-button:horizontal:decrement" },
        { "value": "::-webkit-scrollbar-corner" }
      ]
    }

## Input

    ::-webkit-scrollbar-button {
      height: 24px;
    }

    ::-webkit-scrollbar-button:vertical:increment {
      background: url("../../themes/curam/images/Scroll_Arrow_Down_GreyBar_7x4px.png") no-repeat 5px 10px;
    }

    ::-webkit-scrollbar-button:vertical:decrement {
      background: url("../../themes/curam/images/Scroll_Arrow_Up_GreyBar_7x4px.png") no-repeat 5px 10px;
    }

    ::-webkit-scrollbar-button:horizontal:increment {
      background: url("./../themes/curam/images/Scroll_Arrow_Right_GreyBar_4x7px.png") no-repeat 10px 5px;
    }

    ::-webkit-scrollbar-button:horizontal:decrement {
      background: url("../../themes/curam/images/Scroll_Arrow_Left_GreyBar_4x7px.png") no-repeat 10px 5px;
    }

    ::-webkit-scrollbar-corner {
      background-color: transparent;
    }

## Expected
