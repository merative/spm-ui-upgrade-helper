# window-size-tool test case 2

Tests the second rule we have encoded in `rules.json`.

    if ( width attribute > 576 AND width attribute <= 768> (
      count LIST elements (columns?) <= 2
      OR CLUSTER with == 1 cols
    )) {
      change the width attribute to 500/small
    }

If width is >576 && <=768 change to 500/small if:
Rule: the page contains only 1 column clusters or lists <=2 columns
