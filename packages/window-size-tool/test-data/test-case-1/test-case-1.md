# window-size-tool test case 1

Tests the first rule we have encoded in `rules.json`.

    if ( width attribute < 950 AND (
      count LIST elements >= 6
      OR CLUSTER with >= 3 cols
      OR ( CLUSTER with >= 2 cols AND nested LIST )
    )) {
      increase the width attribute to 1000
    }
