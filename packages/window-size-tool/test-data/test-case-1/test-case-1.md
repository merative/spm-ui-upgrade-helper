# Window Size Tool Test Case 1

Tests the main set of rules we have encoded in `rules.json`.

    if ( width attribute < 950 AND (
      count LIST elements >= 6
      OR CLUSTER with >= 3 cols
      OR ( CLUSTER with >= 2 cols AND nested LIST )
    )) {
      increase the width attribute to 1000
    }
