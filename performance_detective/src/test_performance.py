"""
Performance tests for data_processor module.
Uses pytest-benchmark to measure function execution time.
"""

import pytest
from src.data_processor import (
    find_duplicates,
    calculate_statistics,
    filter_and_transform,
    process_large_dataset,
)


# Test data fixtures
@pytest.fixture
def small_dataset():
    """Small dataset for quick testing (100 items)"""
    return list(range(50)) + list(range(50))  # 50 unique items, each duplicated


@pytest.fixture
def medium_dataset():
    """Medium dataset (1,000 items)"""
    return list(range(500)) + list(range(500))


@pytest.fixture
def large_dataset():
    """Large dataset (10,000 items)"""
    return list(range(5000)) + list(range(5000))


@pytest.fixture
def numeric_data():
    """Numeric data for statistics calculations"""
    return [1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10] * 100  # 1,100 items


# Benchmark tests for find_duplicates
def test_find_duplicates_small(benchmark, small_dataset):
    """Benchmark find_duplicates with small dataset"""
    result = benchmark(find_duplicates, small_dataset)
    assert len(result) == 50  # Should find all 50 unique items as duplicates


def test_find_duplicates_medium(benchmark, medium_dataset):
    """Benchmark find_duplicates with medium dataset"""
    result = benchmark(find_duplicates, medium_dataset)
    assert len(result) == 500


def test_find_duplicates_large(benchmark, large_dataset):
    """Benchmark find_duplicates with large dataset"""
    result = benchmark(find_duplicates, large_dataset)
    assert len(result) == 5000


# Benchmark tests for calculate_statistics
def test_calculate_statistics_small(benchmark, small_dataset):
    """Benchmark calculate_statistics with small dataset"""
    result = benchmark(calculate_statistics, small_dataset)
    assert "mean" in result
    assert "median" in result
    assert "mode" in result


def test_calculate_statistics_medium(benchmark, medium_dataset):
    """Benchmark calculate_statistics with medium dataset"""
    result = benchmark(calculate_statistics, medium_dataset)
    assert result["mean"] == pytest.approx(249.5)


def test_calculate_statistics_large(benchmark, large_dataset):
    """Benchmark calculate_statistics with large dataset"""
    result = benchmark(calculate_statistics, large_dataset)
    assert result["mean"] == pytest.approx(2499.5)


# Benchmark tests for filter_and_transform
def test_filter_and_transform_small(benchmark, small_dataset):
    """Benchmark filter_and_transform with small dataset"""
    result = benchmark(filter_and_transform, small_dataset, threshold=25)
    assert all(isinstance(item, str) for item in result)


def test_filter_and_transform_medium(benchmark, medium_dataset):
    """Benchmark filter_and_transform with medium dataset"""
    result = benchmark(filter_and_transform, medium_dataset, threshold=250)
    assert len(result) > 0


def test_filter_and_transform_large(benchmark, large_dataset):
    """Benchmark filter_and_transform with large dataset"""
    result = benchmark(filter_and_transform, large_dataset, threshold=2500)
    assert len(result) > 0


# Comprehensive benchmark
def test_process_large_dataset(benchmark, large_dataset):
    """Benchmark all operations together"""
    operations = ["duplicates", "statistics", "filter"]
    result = benchmark(process_large_dataset, large_dataset, operations)
    assert "duplicates" in result
    assert "statistics" in result
    assert "filtered" in result


# Correctness tests (not benchmarked)
class TestCorrectness:
    """Test that functions produce correct results"""

    def test_find_duplicates_correctness(self):
        """Verify find_duplicates finds all duplicates"""
        data = [1, 2, 3, 2, 4, 3, 5]
        result = find_duplicates(data)
        assert set(result) == {2, 3}

    def test_calculate_statistics_correctness(self):
        """Verify statistics calculations are accurate"""
        data = [1, 2, 3, 4, 5]
        result = calculate_statistics(data)
        assert result["mean"] == 3.0
        assert result["median"] == 3.0

    def test_filter_and_transform_correctness(self):
        """Verify filtering and transformation work correctly"""
        data = [1, 5, 10, 15, 20]
        result = filter_and_transform(data, threshold=10)
        assert result == ["15", "20"]
