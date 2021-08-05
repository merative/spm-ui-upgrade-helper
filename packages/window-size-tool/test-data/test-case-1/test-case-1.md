# window-size-tool test case 1

Tests the first rule we have encoded in `rules.json`.

    if ( PAGE width attribute > 768 AND (
      CLUSTER = 2 cols
      OR  LIST < 5 cols
    )) {
      reduces the width attribute to 700
    }
