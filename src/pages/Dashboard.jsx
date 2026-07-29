import { useFetch } from "../hooks/useFetch";
const url = process.env.REACT_APP_API_BASE_URL;

const Dashboard = () => {
  const { data, error, loading } = useFetch(`${url}/auth/user`);
  return (
    <div className='container mt-4'>
      <h2>Dashboard (Protected)</h2>
      {loading && <p>Loading...</p>}
      {error && <p className='text-danger'>{error}</p>}
      {data && <p>{data.message}</p>}
      {data && <p>{JSON.stringify(data)}</p>}
    </div>
  );
};

export default Dashboard;
