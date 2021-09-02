# Window Size Tool

## MVP goals

- detect `<PAGE>` element's with `WINDOW_OPTIONS` attribute set to *less than* `width=950`.

- update the `WINDOW_OPTIONS` attribute if certain criteria are met:

    - contains a `<LIST>` element with *greater than or equal to* `6 child elements`.

    - contains a `<CLUSTER>` element with `NUM_COLS` attribute set to *greater than* `2`.

    - contains a `<CLUSTER>` element with `NUM_COLS` attribute set to *greater than* `1`, with a child `<LIST>` element.

- update to `lg`.
