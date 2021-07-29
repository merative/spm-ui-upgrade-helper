# window-size-tool test case 2

Tests the second rule we have encoded in `rules.json`.

    if ( width attribute > 768 AND (
      count LIST elements (columns?) < 5
      OR CLUSTER with == 2 cols
    )) {
      change the width attribute to 700/medium
    }

If width is >768 change to 700/medium if:
Rule: the page contains only 2 column clusters or lists <5 columns
