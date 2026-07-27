import { useFetch } from "../hooks/useFetch";

const Dashboard = () => {

  const { data, error,loading } = useFetch("http://127.0.0.1:5001/auth/user");
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
