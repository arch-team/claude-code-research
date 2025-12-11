# Performance Detective Exercise

An interactive exercise for learning Claude Code's intelligent tool orchestration through performance optimization.

## Overview

This project contains intentionally inefficient Python functions that demonstrate common performance bottlenecks:
- O(n²) algorithms that can be optimized to O(n)
- Inefficient data structure usage
- Unnecessary repeated computations

You'll use Claude Code to identify, analyze, and optimize these issues while learning proper project initialization and context management.

## Repo Structure:

performance_detective/
├── src/
│   ├── __init__.py
│   ├── data_processor.py
│   └── test_performance.py
├── data/
│   └── sample_data.csv
├── requirements.txt
├── README.md
└── .gitignore

## Setup

1. Install dependencies:
```bash
   pip install -r requirements.txt