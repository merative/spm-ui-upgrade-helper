## Description

Test that longer selectors are applied before shorter selectors.

This test covers an issue we had where a shorter replace rule (`.foo`) was being applied before a
longer replace rule (`.foo.remove-two-longer`) due to the code saying _"for each selector, check
each rule"_. This resulted in `.foo` being applied to `.foo.remove-two-longer` and output contained
`.remove-two-longer`, which was obviously incorrect as looking at the rules we want to entirely
remove `.foo.remove-two-longer`.

The code now says _"for each rule, check each selector"_. The rules are already sorted longest-first,
so the longest rules will be applied to all selectors, then the next-longest rules, and so on.

## Rules

    {
      "SelectorRemove": [
        { "value": ".foo" },
        { "value": ".foo.remove-one" },
        { "value": ".foo.remove-two-longer" }
      ]
    }

## Input

    .foo.remove-one,
    .foo.remove-two-longer,
    .foo.bar-one,
    .foo.bar-two {
        margin-top: 0;
    }

## Expected

    .bar-one,
    .bar-two {
      margin-top: 0;
    }
