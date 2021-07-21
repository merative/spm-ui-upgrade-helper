# Main Tool Test Case 1

Tests that `main-tool` only calls tools that are enabled.

There are 3 dummy tools: `fake-tool-1`, `fake-tool-2` and `fake-tool-3`. Each one creates a file of the same name when run. Tools 1 and 3 are enabled, tool 2 is not. We expect the output to be exactly two files: "fake-tool-1.txt" and "fake-tool-3.txt".
