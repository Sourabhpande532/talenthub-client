import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchJobs } from "../features/jobs/jobSlice";

// LOGIC PART
export function useFilterMechanism() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { jobsList, status } = useSelector((state) => state.jobs);

  // Initialize state from URL params
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    experience: searchParams.get("experience") || "",
    salary: searchParams.get("salary") || "",
    sort: searchParams.get("sort") || "latest",
  });
  // Debounce search function
  useEffect(() => {
    const timer = setTimeout(() => {
      updateURLParams(filters);
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // When URL changes, fetch data
  useEffect(() => {
    const queryString = `?${searchParams.toString()}`;
    dispatch(fetchJobs(queryString));
  }, [searchParams, dispatch]);

  const updateURLParams = useCallback(
    (newFilters) => {
      const params = new URLSearchParams();
      Object.keys(newFilters).forEach((key) => {
        if (newFilters[key]) {
          params.append(key, newFilters[key]);
        }
      });
      setSearchParams(params);
    },
    [setSearchParams],
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    const cleared = {
      search: "",
      location: "",
      experience: "",
      salary: "",
      sort: "latest",
    };
    setFilters(cleared);
    updateURLParams(cleared);
  };
  return { filters, handleFilterChange, handleClearFilters, jobsList, status };
}
