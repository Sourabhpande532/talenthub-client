import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchJobs } from "../features/jobs/jobSlice";

export function useFilterMechanism(options = {}) {
  const { autoFetch = true } = options;
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { jobsList, status } = useSelector((state) => state.jobs);

  const getFiltersFromParams = useCallback(
    (params) => ({
      search: params.get("search") || "",
      location: params.get("location") || "",
      experience: params.get("experience") || "",
      employmentType: params.get("employmentType") || "",
      salary: params.get("salary") || "",
      remote: params.get("remote") || "",
      sort: params.get("sort") || "latest",
    }),
    [],
  );

  const [filters, setFilters] = useState(() =>
    getFiltersFromParams(searchParams),
  );

  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  const updateURLParams = useCallback(
    (nextFilters) => {
      const currentParams = searchParamsRef.current;
      const params = new URLSearchParams();

      ["search", "location", "experience", "employmentType", "salary", "remote"].forEach(
        (key) => {
          const val = nextFilters[key];
          if (val !== undefined && val !== null && String(val).trim() !== "") {
            params.set(key, String(val).trim());
          }
        },
      );

      if (
        nextFilters.sort &&
        (nextFilters.sort !== "latest" || currentParams.has("sort"))
      ) {
        params.set("sort", nextFilters.sort);
      }

      if (params.toString() !== currentParams.toString()) {
        setSearchParams(params, { replace: true });
      }
    },
    [setSearchParams],
  );

  // Debounce search text -> URL sync (300ms) to avoid API calls on every keystroke
  useEffect(() => {
    const currentSearch = searchParamsRef.current.get("search") || "";
    if (filters.search === currentSearch) return;

    const timer = setTimeout(() => {
      updateURLParams(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, updateURLParams]);

  // Sync local state if URL searchParams change externally (e.g. browser back/forward or company link)
  useEffect(() => {
    const nextFromUrl = getFiltersFromParams(searchParams);
    setFilters((prev) => {
      if (
        prev.search === nextFromUrl.search &&
        prev.location === nextFromUrl.location &&
        prev.experience === nextFromUrl.experience &&
        prev.employmentType === nextFromUrl.employmentType &&
        prev.salary === nextFromUrl.salary &&
        prev.remote === nextFromUrl.remote &&
        prev.sort === nextFromUrl.sort
      ) {
        return prev;
      }
      return nextFromUrl;
    });
  }, [searchParams, getFiltersFromParams]);

  // Fetch jobs when URL searchParams change (only in the primary page hook instance)
  const queryStr = searchParams.toString();
  useEffect(() => {
    if (!autoFetch) return;
    const queryString = queryStr ? `?${queryStr}` : "";
    dispatch(fetchJobs(queryString));
  }, [queryStr, autoFetch, dispatch]);

  const handleFilterChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFilters((prev) => {
        const updated = { ...prev, [name]: value };
        // Non-search controls update the URL immediately for instant feedback
        if (name !== "search") {
          updateURLParams(updated);
        }
        return updated;
      });
    },
    [updateURLParams],
  );

  const handleClearFilters = useCallback(() => {
    const cleared = {
      search: "",
      location: "",
      experience: "",
      employmentType: "",
      salary: "",
      remote: "",
      sort: "latest",
    };
    setFilters(cleared);
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return { filters, handleFilterChange, handleClearFilters, jobsList, status };
}
