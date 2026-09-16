import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchJobs } from "../features/jobs/jobSlice";

export function useFilterMechanism() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { jobsList, status } = useSelector((state) => state.jobs);

  // Initialize state from URL params
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    experience: searchParams.get("experience") || "",
    employmentType: searchParams.get("employmentType") || "",
    salary: searchParams.get("salary") || "",
    sort: searchParams.get("sort") || "latest",
  });

  const updateURLParams = useCallback(
    (newFilters) => {
      const params = new URLSearchParams();
      Object.keys(newFilters).forEach((key) => {
        if (newFilters[key]) {
          params.append(key, newFilters[key]);
        }
      });
      if (params.toString() !== searchParams.toString()) {
        setSearchParams(params);
      }
    },
    [searchParams, setSearchParams],
  );

  // Debounce state -> URL sync to avoid API calls on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      updateURLParams(filters);
    }, 350);
    return () => clearTimeout(timer);
  }, [filters, updateURLParams]);

  // Sync state ONLY if searchParams changes externally (navigating or back button)
  useEffect(() => {
    const sSearch = searchParams.get("search") || "";
    const sLocation = searchParams.get("location") || "";
    const sExperience = searchParams.get("experience") || "";
    const sEmploymentType = searchParams.get("employmentType") || "";
    const sSalary = searchParams.get("salary") || "";
    const sSort = searchParams.get("sort") || "latest";

    setFilters((prev) => {
      if (
        prev.search === sSearch &&
        prev.location === sLocation &&
        prev.experience === sExperience &&
        prev.employmentType === sEmploymentType &&
        prev.salary === sSalary &&
        prev.sort === sSort
      ) {
        return prev;
      }
      return {
        search: sSearch,
        location: sLocation,
        experience: sExperience,
        employmentType: sEmploymentType,
        salary: sSalary,
        sort: sSort,
      };
    });
  }, [searchParams]);

  // Fetch jobs when searchParams change
  useEffect(() => {
    const queryString = `?${searchParams.toString()}`;
    dispatch(fetchJobs(queryString));
  }, [searchParams, dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    const cleared = {
      search: "",
      location: "",
      experience: "",
      employmentType: "",
      salary: "",
      sort: "latest",
    };
    setFilters(cleared);
    updateURLParams(cleared);
  };

  return { filters, handleFilterChange, handleClearFilters, jobsList, status };
}
